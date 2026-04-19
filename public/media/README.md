# Media Assets Folder

This folder (`public/media`) is a dedicated space for you to place your raw photos and graphic assets.

Unlike the `src` assets folder, anything placed in the `public` folder bypasses Vite's aggressive module bundling and is safely served right at the root path of your Vercel deployment. This prevents aggressive ad-blockers and Linux case-sensitivity algorithms from breaking your dynamic lists and grids.

## How to use these files in your code:

When mapping photos in your React components or admin dashboard, simply reference them starting with `/media/...`

```tsx
// Correct
<img src="/media/berni-pic.jpeg" alt="..." />

// ❌ Never do this in Vite
import berniPic from '../assets/media/berni-pic.jpeg';
<img src={berniPic} alt="..." />
```
