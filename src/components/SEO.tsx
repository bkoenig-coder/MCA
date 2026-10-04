import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}

const ROUTE_TITLES: Record<string, { titleKey: string; defaultTitle: string; descKey?: string }> = {
  '/': { titleKey: 'nav.home', defaultTitle: 'Mongolian Center Austria | Cultural & Business Center in Vienna' },
  '/about': { titleKey: 'nav.about', defaultTitle: 'About Us | Mongolian Center Austria' },
  '/events': { titleKey: 'nav.events', defaultTitle: 'Events | Mongolian Center Austria' },
  '/news': { titleKey: 'nav.news', defaultTitle: 'News | Mongolian Center Austria' },
  '/gallery': { titleKey: 'nav.gallery', defaultTitle: 'Gallery | Mongolian Center Austria' },
  '/impact': { titleKey: 'nav.impact', defaultTitle: 'Impact | Mongolian Center Austria' },
  '/donate': { titleKey: 'nav.impact', defaultTitle: 'Donate | Mongolian Center Austria' },
  '/contact': { titleKey: 'nav.contact', defaultTitle: 'Contact Us | Mongolian Center Austria' },
  '/membership': { titleKey: 'nav.membership', defaultTitle: 'Membership | Mongolian Center Austria' },
  '/members': { titleKey: 'nav.members', defaultTitle: 'Members Directory | Mongolian Center Austria' },
  '/careers': { titleKey: 'nav.careers', defaultTitle: 'Careers | Mongolian Center Austria' },
  '/heritage': { titleKey: 'nav.heritage', defaultTitle: 'Cultural Heritage | Mongolian Center Austria' },
  '/diorama': { titleKey: 'nav.diorama', defaultTitle: '3D Interactive Diorama | Mongolian Center Austria' },
  '/privacy': { titleKey: 'footer.privacy', defaultTitle: 'Privacy Policy | Mongolian Center Austria' },
  '/terms': { titleKey: 'footer.terms', defaultTitle: 'Terms of Service | Mongolian Center Austria' },
  '/imprint': { titleKey: 'footer.imprint', defaultTitle: 'Imprint | Mongolian Center Austria' },
  '/governance': { titleKey: 'footer.governance', defaultTitle: 'Governance | Mongolian Center Austria' },
  '/admin': { titleKey: 'nav.admin', defaultTitle: 'Admin Dashboard | Mongolian Center Austria' },
};

export default function SEO({ title, description, image, type = 'website' }: SEOProps) {
  const { pathname } = useLocation();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Determine title
    let pageTitle = title;
    if (!pageTitle) {
      const match = ROUTE_TITLES[pathname];
      if (match) {
        const translated = t(match.titleKey, { defaultValue: '' });
        pageTitle = translated 
          ? `${translated} | Mongolian Center Austria` 
          : match.defaultTitle;
      } else {
        pageTitle = 'Mongolian Center Austria';
      }
    }
    document.title = pageTitle;

    // Determine description
    const metaDesc = description || t('meta.description', {
      defaultValue: 'The cooperation center of Mongolian citizens in Austria. Join cultural events, language courses, traditional arts and Austrian–Mongolian cultural exchange through our center.'
    });

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
