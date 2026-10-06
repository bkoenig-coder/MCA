import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

// Route -> translation key for the page name. The site name is appended and follows the current language.
const ROUTE_TITLES: Record<string, string> = {
  '/': 'siteUi.seo.home',
  '/about': 'nav.about',
  '/events': 'nav.events',
  '/news': 'nav.news',
  '/gallery': 'nav.gallery',
  '/impact': 'nav.impact',
  '/donate': 'nav.impact',
  '/contact': 'nav.contact',
  '/membership': 'nav.membership',
  '/members': 'siteUi.seo.members',
  '/careers': 'nav.careers',
  '/heritage': 'nav.heritage',
  '/diorama': 'siteUi.seo.diorama',
  '/privacy': 'footer.privacy',
  '/terms': 'footer.terms',
  '/imprint': 'footer.imprint',
  '/governance': 'footer.governance',
  '/admin': 'nav.admin',
};

export default function SEO({ title, description, image, type = 'website' }: SEOProps) {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Determine title
    const siteName = t('siteUi.org.name');
    let pageTitle = title;
    if (!pageTitle) {
      const key = ROUTE_TITLES[pathname];
      pageTitle = key ? `${t(key)} | ${siteName}` : siteName;
    }
    document.title = pageTitle;

    // Determine description
    const metaDesc = description || t('siteUi.seo.description');

    const setMeta = (selector: string, attr: string, value: string) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement('meta');
        const [attrName, attrVal] = selector.replace(/[\[\]']/g, '').split('=');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', metaDesc);
    setMeta('meta[property="og:title"]', 'content', pageTitle);
    setMeta('meta[property="og:description"]', 'content', metaDesc);
    setMeta('meta[property="og:type"]', 'content', type);
    setMeta('meta[property="og:url"]', 'content', window.location.href);
    if (image) {
      setMeta('meta[property="og:image"]', 'content', image);
      setMeta('meta[name="twitter:image"]', 'content', image);
    }
    setMeta('meta[name="twitter:title"]', 'content', pageTitle);
    setMeta('meta[name="twitter:description"]', 'content', metaDesc);

    // Update html lang attribute
    document.documentElement.lang = i18n.language || 'mn';
  }, [pathname, title, description, image, type, t, i18n.language]);

  return null;
}
