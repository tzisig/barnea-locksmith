// Site-wide behavior: mobile menu, scroll reveals, consent and analytics events.
// Every page works without JavaScript; this only enhances.

declare global {
  interface Window { dataLayer: unknown[]; gtag?: (...args: unknown[]) => void }
}

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- Mobile menu ----------
const toggle = document.querySelector<HTMLButtonElement>('[data-menu-toggle]');
const panel = document.querySelector<HTMLElement>('[data-mobile-nav]');
if (toggle && panel) {
  const label = toggle.querySelector<HTMLElement>('[data-menu-label]');
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    panel.hidden = !open;
    if (label) label.textContent = open ? 'סגירת תפריט' : 'פתיחת תפריט';
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setOpen(false); toggle.focus(); }
  });
}

// ---------- Scroll reveal ----------
const els = document.querySelectorAll<HTMLElement>('.reveal');
if (reduced || !('IntersectionObserver' in window)) {
  els.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => io.observe(el));
}

// ---------- Consent and analytics (GA4 loads only after consent) ----------
const CONSENT_KEY = 'consent.v1';
const box = document.querySelector<HTMLElement>('[data-consent]');
const ga4 = box?.dataset.ga4 || '';
const readConsent = () => { try { return localStorage.getItem(CONSENT_KEY); } catch { return null; } };
const writeConsent = (v: string) => { try { localStorage.setItem(CONSENT_KEY, v); } catch { /* storage blocked */ } };
const loadAnalytics = () => {
  if (!ga4 || window.gtag) return;
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${ga4}`;
  document.head.appendChild(s);
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', ga4);
};
if (box) {
  const c = readConsent();
  if (c === 'all') loadAnalytics();
  else if (!c) box.hidden = false;
  box.querySelector('[data-consent-accept]')?.addEventListener('click', () => { writeConsent('all'); box.hidden = true; loadAnalytics(); });
  box.querySelector('[data-consent-reject]')?.addEventListener('click', () => { writeConsent('essential'); box.hidden = true; });
  document.querySelector('[data-consent-open]')?.addEventListener('click', () => { box.hidden = false; box.querySelector<HTMLElement>('button')?.focus(); });
}

export const track = (name: string, params: Record<string, unknown> = {}) => { window.gtag?.('event', name, params); };

// Key events: phone and WhatsApp taps anywhere on the site
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest('a');
  if (!a) return;
  if (a.href.startsWith('tel:')) track('phone_click', { page: location.pathname });
  else if (a.href.includes('wa.me/')) track('whatsapp_click', { page: location.pathname });
});
