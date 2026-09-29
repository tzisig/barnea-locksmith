import { site } from '../config/site.config';

export type Crumb = { label: string; href?: string };

export const abs = (path: string) => new URL(path, site.url).href;

export const breadcrumbSchema = (crumbs: Crumb[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: c.label,
    ...(c.href ? { item: abs(c.href) } : {}),
  })),
});

export const faqSchema = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
});

export const businessRef = { '@id': `${site.url}/#business` };

export const home: Crumb = { label: 'דף הבית', href: '/' };
