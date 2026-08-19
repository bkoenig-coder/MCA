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
  '/': { titleKey: 'nav.home', defaultTitle: 'Вена дахь Монгол Төв | Mongolian Center Austria' },
  '/about': { titleKey: 'nav.about', defaultTitle: 'Бидний тухай | About Us - Mongolian Center Austria' },
  '/events': { titleKey: 'nav.events', defaultTitle: 'Арга хэмжээ | Events - Mongolian Center Austria' },
  '/news': { titleKey: 'nav.news', defaultTitle: 'Мэдээ мэдээлэл | News - Mongolian Center Austria' },
  '/gallery': { titleKey: 'nav.gallery', defaultTitle: 'Зургийн цомог | Gallery - Mongolian Center Austria' },
  '/impact': { titleKey: 'nav.impact', defaultTitle: 'Бидний нөлөө | Impact - Mongolian Center Austria' },
  '/donate': { titleKey: 'nav.impact', defaultTitle: 'Хандив өгөх | Donate - Mongolian Center Austria' },
  '/contact': { titleKey: 'nav.contact', defaultTitle: 'Холбоо барих | Contact Us - Mongolian Center Austria' },
  '/membership': { titleKey: 'nav.membership', defaultTitle: 'Гишүүнчлэл | Membership - Mongolian Center Austria' },
  '/members': { titleKey: 'nav.members', defaultTitle: 'Гишүүдийн лавлах | Members Directory - Mongolian Center Austria' },
  '/heritage': { titleKey: 'nav.heritage', defaultTitle: 'Өв соёл | Cultural Heritage - Mongolian Center Austria' },
  '/diorama': { titleKey: 'nav.diorama', defaultTitle: '3D Виртуал Орчин | 3D Interactive Diorama - Mongolian Center Austria' },
  '/privacy': { titleKey: 'footer.privacy', defaultTitle: 'Нууцлалын бодлого | Privacy Policy - Mongolian Center Austria' },
  '/terms': { titleKey: 'footer.terms', defaultTitle: 'Үйлчилгээний нөхцөл | Terms of Service - Mongolian Center Austria' },
  '/imprint': { titleKey: 'footer.imprint', defaultTitle: 'Импринт | Imprint - Mongolian Center Austria' },
  '/governance': { titleKey: 'footer.governance', defaultTitle: 'Засаглал | Governance - Mongolian Center Austria' },
  '/admin': { titleKey: 'nav.admin', defaultTitle: 'Удирдлагын самбар | Admin Dashboard - Mongolian Center Austria' },
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
        pageTitle = 'Монгол Төв Австри | Mongolian Center Austria';
      }
    }
    document.title = pageTitle;

    // Determine description
    const metaDesc = description || t('meta.description', {
      defaultValue: 'Австри улс дахь монгол иргэдийн хамтын ажиллагааны төв. Манай төвөөр дамжуулан соёлын арга хэмжээ, хэлний сургалт, уламжлалт урлаг болон Австри, Монголын соёлын солилцоонд нэгдээрэй.'
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
