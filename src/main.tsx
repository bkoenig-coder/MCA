import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import '@fontsource-variable/source-serif-4/opsz.css';
import '@fontsource-variable/source-serif-4/opsz-italic.css'; // only for pages that still set italics
import '@fontsource-variable/plus-jakarta-sans/wght.css';
import '@fontsource-variable/inter/wght.css'; // Cyrillic fallback, as before
import '@fontsource/noto-sans-mongolian/mongolian-400.css';
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
import flagsFontUrl from './assets/fonts/TwemojiCountryFlags.woff2?url';
import './index.css';
import './i18n';

// Windows has no flag emoji: load a small flags-only font (self-hosted) when the browser needs it.
polyfillCountryFlagEmojis('Twemoji Country Flags', flagsFontUrl);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
