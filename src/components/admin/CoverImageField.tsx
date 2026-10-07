import { useRef, useState } from 'react';
import { ImageIcon, Link2, Loader2, Trash2, UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { compressImage } from '../../lib/imageTools';

/**
 * Cover photo picker: drop or choose a file, paste a link, or pick from the media library.
 * Shows a live preview and lets the admin remove the photo again.
 */
export default function CoverImageField({
  label,
  value,
  onChange,
  onOpenLibrary,
  hint,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  onOpenLibrary?: () => void;
  hint?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [over, setOver] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file (JPG, PNG or WebP).');
      return;
    }
    setBusy(true);
    try {
      onChange(await compressImage(file));
    } catch {
      toast.error('Could not read that image. Try another file.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-600">{label}</label>
        <div className="flex items-center gap-3">
          {onOpenLibrary && (
            <button type="button" onClick={onOpenLibrary} className="text-[10px] text-amber-800 hover:text-brand-gold font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer">
              <ImageIcon size={12} /> Media library
            </button>
          )}
          <button type="button" onClick={() => setShowUrl((v) => !v)} className="text-[10px] text-slate-600 hover:text-brand-blue font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer">
            <Link2 size={12} /> Paste link
          </button>
        </div>
      </div>

      {value ? (
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-slate-300 bg-slate-200 group">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button type="button" onClick={() => fileRef.current?.click()} className="px-3 py-2 rounded-lg bg-white text-slate-900 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <UploadCloud size={14} /> Replace
            </button>
            <button type="button" onClick={() => onChange('')} className="px-3 py-2 rounded-lg bg-white text-red-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer">
              <Trash2 size={14} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`w-full aspect-[16/9] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-2 text-slate-500 transition-colors cursor-pointer ${
            over ? 'border-brand-blue bg-brand-blue/5 text-brand-blue' : 'border-slate-300 bg-white hover:border-brand-gold hover:text-slate-800'
          }`}
        >
          {busy ? <Loader2 className="animate-spin" size={28} /> : <UploadCloud size={28} />}
          <span className="text-sm font-semibold">{busy ? 'Preparing photo…' : 'Drop a photo here or click to upload'}</span>
          <span className="text-xs">{hint || 'JPG, PNG or WebP. It is resized automatically.'}</span>
        </button>
      )}

      {showUrl && (
        <input
          autoFocus
          placeholder="https://… (press Enter)"
          className="mt-2 w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-brand-gold/20"
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            const v = (e.currentTarget.value || '').trim().replace(/^["']|["']$/g, '');
            if (!/^(https?:\/\/|\/|data:image\/)/.test(v)) {
              toast.error('The link must start with https://');
              return;
            }
            onChange(v);
            e.currentTarget.value = '';
            setShowUrl(false);
          }}
        />
      )}

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }} />
    </div>
  );
}
