import { useRef } from 'react';
import { Bold, Heading2, Italic, Link2, List, Quote } from 'lucide-react';

/**
 * Article text box with a real formatting toolbar. Formatting is inserted where the cursor is
 * (or around the selected text). The public article page understands:
 *   **bold**, *italic*, [text](https://link), "## Heading", "> Quote" and "- list item".
 */
export default function RichTextArea({
  value,
  onChange,
  placeholder,
  rows = 12,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const apply = (fn: (sel: string, before: string, after: string) => { text: string; select?: [number, number] }) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const sel = value.slice(start, end);
    const before = value.slice(0, start);
    const after = value.slice(end);
    const out = fn(sel, before, after);
    onChange(before + out.text + after);
    requestAnimationFrame(() => {
      el.focus();
      const [a, b] = out.select ?? [start + out.text.length, start + out.text.length];
      el.setSelectionRange(start + a, start + b);
    });
  };

  const wrap = (mark: string, placeholderText: string) =>
    apply((sel) => {
      const inner = sel || placeholderText;
      return { text: mark + inner + mark, select: [mark.length, mark.length + inner.length] };
    });

  // Line-level formats start on a new line, with a blank line before so they become their own block.
  const block = (prefix: string, placeholderText: string) =>
    apply((sel, before) => {
      const lead = before.length === 0 || before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n';
      const inner = sel || placeholderText;
      return { text: `${lead}${prefix}${inner}\n\n`, select: [lead.length + prefix.length, lead.length + prefix.length + inner.length] };
    });

  const link = () =>
    apply((sel) => {
      const label = sel || 'link text';
      const text = `[${label}](https://)`;
      const urlStart = label.length + 3;
      return { text, select: [urlStart, urlStart + 8] };
    });

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    const k = e.key.toLowerCase();
    if (k === 'b') {
      e.preventDefault();
      wrap('**', 'bold text');
    } else if (k === 'i') {
      e.preventDefault();
      wrap('*', 'italic text');
    } else if (k === 'k') {
      e.preventDefault();
      link();
    }
  };

  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const btn = 'w-8 h-8 inline-flex items-center justify-center rounded-lg bg-white hover:bg-slate-200 text-slate-800 border border-slate-200 cursor-pointer';

  return (
    <div className="rounded-xl border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-brand-gold/25 overflow-hidden">
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 bg-slate-100 border-b border-slate-200">
        <button type="button" title="Bold (Ctrl+B)" onClick={() => wrap('**', 'bold text')} className={btn}><Bold size={15} /></button>
        <button type="button" title="Italic (Ctrl+I)" onClick={() => wrap('*', 'italic text')} className={btn}><Italic size={15} /></button>
        <span className="w-px h-5 bg-slate-300 mx-1" />
        <button type="button" title="Section heading" onClick={() => block('## ', 'Section heading')} className={btn}><Heading2 size={15} /></button>
        <button type="button" title="Pull quote" onClick={() => block('> ', 'A memorable quote')} className={btn}><Quote size={15} /></button>
        <button type="button" title="Bullet point" onClick={() => block('- ', 'List item')} className={btn}><List size={15} /></button>
        <button type="button" title="Link (Ctrl+K)" onClick={link} className={btn}><Link2 size={15} /></button>
        <span className="ml-auto text-[11px] text-slate-500 font-medium">{words} {words === 1 ? 'word' : 'words'}</span>
      </div>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        rows={rows}
        placeholder={placeholder}
        className="block w-full p-4 text-[15px] font-serif text-slate-900 leading-relaxed resize-y outline-none"
      />
      <p className="px-4 py-2 text-[11px] text-slate-500 bg-slate-50 border-t border-slate-100">
        Leave an empty line between paragraphs. Select text and use the buttons above, or press Ctrl+B for bold and Ctrl+I for italic.
      </p>
    </div>
  );
}
