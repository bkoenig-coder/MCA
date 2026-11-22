// "Add to calendar": builds a small .ics file in the browser and downloads it.
// Works with Apple Calendar, Google Calendar, Outlook and the calendar apps on phones.

export type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  location?: string;
  /** Day of the event, "YYYY-MM-DD" */
  date: string;
  /** Free text such as "18:00" or "18:00 - 20:00". Without a time the event is saved as an all-day event. */
  time?: string;
};

const pad = (n: number) => String(n).padStart(2, '0');

/** Escapes text for an .ics field. */
const esc = (s: string) =>
  s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');

/** Lines in an .ics file may not be longer than 75 bytes; longer ones continue on the next line after a space. */
function fold(line: string) {
  const enc = new TextEncoder();
  if (enc.encode(line).length <= 75) return line;
  const out: string[] = [];
  let cur = '';
  let size = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (size + n > (out.length ? 74 : 75)) {
      out.push(cur);
      cur = '';
      size = 0;
    }
    cur += ch;
    size += n;
  }
  out.push(cur);
  return out.join('\r\n ');
}

/** The moment a Vienna wall-clock time happens, as a UTC Date (handles summer and winter time). */
function viennaToUtc(y: number, mo: number, d: number, h: number, mi: number) {
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Vienna',
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(new Date(guess));
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asVienna = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'));
  return new Date(guess - (asVienna - guess));
}

const utcStamp = (dt: Date) =>
  `${dt.getUTCFullYear()}${pad(dt.getUTCMonth() + 1)}${pad(dt.getUTCDate())}T${pad(dt.getUTCHours())}${pad(dt.getUTCMinutes())}${pad(dt.getUTCSeconds())}Z`;

const dayStamp = (y: number, mo: number, d: number) => `${y}${pad(mo)}${pad(d)}`;

/** Returns the .ics text for one event, or null if its date cannot be read. */
export function buildIcs(ev: CalendarEvent, pageUrl?: string): string | null {
  const [y, mo, d] = (ev.date || '').slice(0, 10).split('-').map(Number);
  if (!y || !mo || !d) return null;

  const times = [...(ev.time || '').matchAll(/(\d{1,2})[:.](\d{2})/g)];
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Mongolian Center in Austria//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${ev.id}@mongoliancenter.org`,
    `DTSTAMP:${utcStamp(new Date())}`,
  ];

  if (times.length) {
    const start = viennaToUtc(y, mo, d, Number(times[0][1]), Number(times[0][2]));
    let end = times[1]
      ? viennaToUtc(y, mo, d, Number(times[1][1]), Number(times[1][2]))
      : new Date(start.getTime() + 2 * 60 * 60 * 1000);
    if (end <= start) end = new Date(end.getTime() + 24 * 60 * 60 * 1000); // runs past midnight
    lines.push(`DTSTART:${utcStamp(start)}`, `DTEND:${utcStamp(end)}`);
  } else {
    const next = new Date(Date.UTC(y, mo - 1, d + 1));
    lines.push(
      `DTSTART;VALUE=DATE:${dayStamp(y, mo, d)}`,
      `DTEND;VALUE=DATE:${dayStamp(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate())}`
    );
  }

  const description = [ev.description?.trim(), pageUrl].filter(Boolean).join('\n\n');
  lines.push(`SUMMARY:${esc(ev.title)}`);
  if (description) lines.push(`DESCRIPTION:${esc(description)}`);
  if (ev.location) lines.push(`LOCATION:${esc(ev.location)}`);
  if (pageUrl) lines.push(`URL:${pageUrl}`);
  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.map(fold).join('\r\n') + '\r\n';
}

/** Builds the .ics file and starts its download. Returns false if the event has no usable date. */
export function downloadEventIcs(ev: CalendarEvent): boolean {
  const ics = buildIcs(ev, `${window.location.origin}/events/${ev.id}`);
  if (!ics) return false;
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const slug = ev.title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'event';
  a.href = url;
  a.download = `${slug}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return true;
}
