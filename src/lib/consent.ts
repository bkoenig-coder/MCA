// Cookie consent: one place that reads and saves the visitor's choice, and starts Google Analytics
// only after analytics has been accepted.

const KEY = 'cookie-consent';
const GA_ID = 'G-D264BN5C9S';

export const CONSENT_EVENT = 'mca-consent-change';
export const OPEN_SETTINGS_EVENT = 'mca-open-cookie-settings';

export type ConsentChoice = { essential: boolean; analytics: boolean; marketing: boolean };

export function readConsent(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ConsentChoice) : null;
  } catch {
    return null;
  }
}

export function hasAnalyticsConsent(): boolean {
  return readConsent()?.analytics === true;
}

let gaStarted = false;

/** Loads Google Analytics. Does nothing until it is called, and only runs once. */
export function loadGoogleAnalytics() {
  if (gaStarted || typeof document === 'undefined') return;
  gaStarted = true;
  const w = window as any;
  w[`ga-disable-${GA_ID}`] = false;
  w.dataLayer = w.dataLayer || [];
  w.gtag = function () {
    // gtag.js reads the `arguments` object, so a rest parameter will not do here
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments);
  };
  w.gtag('js', new Date());
  w.gtag('config', GA_ID);
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);
}

/** Saves the choice and tells the rest of the page. Declining switches Google Analytics off, even mid-visit. */
export function saveConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(KEY, JSON.stringify(choice));
  } catch {
    /* storage blocked: the choice only lasts for this visit */
  }
  if (choice.analytics) {
    loadGoogleAnalytics();
  } else {
    (window as any)[`ga-disable-${GA_ID}`] = true;
  }
  window.dispatchEvent(new Event(CONSENT_EVENT));
}
