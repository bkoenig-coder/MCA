// A little fabric or paper speckle, drawn once into a 64px tile and repeated.
//
// This replaces full-size SVG "feTurbulence" noise overlays, which look the same but make a phone redraw a
// large filtered image (very slow on old phones). Light and dark specks cancel out, so the tile adds texture
// without changing the colour underneath. Use it as a repeating background: `backgroundSize: '64px 64px'`.

let tile: string | null | undefined;

export function getNoiseTile(): string | null {
  if (tile !== undefined) return tile;
  try {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no canvas');
    const img = ctx.createImageData(size, size);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() > 0.5 ? 255 : 0;
      img.data[i] = v;
      img.data[i + 1] = v;
      img.data[i + 2] = v;
      img.data[i + 3] = Math.round(Math.random() * 26); // up to about 10% opaque
    }
    ctx.putImageData(img, 0, 0);
    tile = `url("${canvas.toDataURL('image/png')}")`;
  } catch {
    tile = null;
  }
  return tile;
}
