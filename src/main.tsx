import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import '@fontsource/cormorant-garamond/300.css';
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/500.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/cormorant-garamond/300-italic.css';
import '@fontsource/cormorant-garamond/400-italic.css';
import '@fontsource/cormorant-garamond/500-italic.css';
import '@fontsource/cormorant-garamond/600-italic.css';
import '@fontsource/cormorant-garamond/700-italic.css';
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
