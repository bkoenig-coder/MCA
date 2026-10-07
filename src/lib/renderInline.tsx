import { Fragment, ReactNode } from 'react';

const SAFE_LINK = /^(https?:\/\/|mailto:)/i;

/**
 * Renders the small inline formatting authors can use in articles:
 * **bold**, *italic* and [text](https://link). Everything else stays plain text.
 */
export function renderInline(text: string): ReactNode {
  const pattern = /(\*\*([^*]+)\*\*|\*([^*\n]+)\*|\[([^\]]+)\]\(([^)\s]+)\))/g;
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = pattern.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[2] !== undefined) {
      out.push(<strong key={i++} className="font-bold">{m[2]}</strong>);
    } else if (m[3] !== undefined) {
      out.push(<em key={i++}>{m[3]}</em>);
    } else if (m[4] !== undefined && SAFE_LINK.test(m[5])) {
      out.push(
        <a key={i++} href={m[5]} target="_blank" rel="noopener noreferrer" className="underline decoration-brand-gold underline-offset-4 hover:text-brand-blue">
          {m[4]}
        </a>
      );
    } else {
      out.push(m[0]);
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out.map((n, k) => <Fragment key={k}>{n}</Fragment>);
}
