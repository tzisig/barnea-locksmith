// Builds a progress file for the Master Website Build Checklist (websitBuildChecklist/website-build-checklist.html).
// The checklist keys each item by stage id + a djb2 hash of its text, so this script reads the
// stage definitions straight from the checklist HTML and computes the same keys.
//
// Run: node scripts/checklist-export.mjs  ->  writes websitBuildChecklist/locksmith-barnea-checklist.json
// Import it in the checklist page. The project id stays the same, so a new import updates the project.
//
// Status per item: 'done' (verified), 'na' (not relevant to this demo), or left out (open).
// Items are matched by a unique substring of their text; the script fails if a match is missing or ambiguous.
// The checklist UI is Hebrew, so the item matchers and notes below are Hebrew by necessity.

import { readFileSync, writeFileSync } from 'node:fs';

const CHECKLIST = new URL('../../../websitBuildChecklist/website-build-checklist.html', import.meta.url);
const OUT_FILE = new URL('../../../websitBuildChecklist/locksmith-barnea-checklist.json', import.meta.url);

const html = readFileSync(CHECKLIST, 'utf8');
const start = html.indexOf('var STAGES = [');
const end = html.indexOf('];', html.indexOf('id: "post30"'));
const STAGES = new Function(`return ${html.slice(start + 'var STAGES = '.length, end + 1)};`)();

const hash = (str) => {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) >>> 0;
  return h.toString(36);
};

const DONE = 'done';
const NA = 'na';

const statuses = {
  scope: [
    ['היקף העבודה (Scope) הוגדר', DONE],
    ["רשימת עמודים ופיצ'רים ראשונית אושרה", DONE],
    ['תקציב ואבני דרך', NA],
    ['תהליך בקשות שינוי', NA],
    ['איש קשר מקבל החלטות', DONE],
    ['רשימת חומרים נדרשים נמסרה', NA],
    ['תאריך יעד למסירת חומרים', NA],
    ['סוכם עם הלקוח שעיכוב', NA],
    ['זכויות שימוש בתמונות', DONE],
    ['סוכם שחשבונות הדומיין', NA],
  ],
  client: [
    ['שם העסק והתחום הוגדרו', DONE],
    ['קהל יעד הוגדר', DONE],
    ['שירותים/מוצרים מרכזיים הוגדרו', DONE],
    ['מטרת האתר הוגדרה', DONE],
    ['אזורי פעילות הוגדרו', DONE],
    ['שפות האתר הוגדרו', DONE],
    ['דומיין ואתר קיים נבדקו', DONE],
    ['הוגדר אם זה אתר חדש', DONE],
    ['חובות רגולטוריות זוהו', DONE],
    ['Google Business Profile נבדק', NA],
  ],
  research: [
    ['שירותים/מוצרים מרכזיים מופו', DONE],
    ['שאלות נפוצות והתנגדויות', DONE],
  ],
  arch: [
    ['Homepage מוגדרת', DONE],
    ['עמוד לכל שירות/מוצר משמעותי', DONE],
    ['About ו-Contact הוגדרו', DONE],
    ['Blog/Knowledge Center', DONE],
    ['Landing pages מוצדקות', NA],
    ['עמודי פרטיות, תנאי שימוש, נגישות', DONE],
    ['הוחלט על מבנה URL עקבי', DONE],
    ['URL לכל עמוד הוגדר', DONE],
    ['Primary topic ו-Intent לכל עמוד', DONE],
    ['מבנה שפות ו-hreflang', NA],
    ['Internal linking ראשוני תוכנן', DONE],
    ['CTA לכל עמוד מרכזי הוגדר', DONE],
    ['רשימת העמודים הוזנה לטבלת', DONE],
    ['פרטי העסק (שם, טלפון, מייל, כתובת, שעות) מרוכזים', DONE],
  ],
  build: [
    ['Wireframes לעמודים המרכזיים הוכנו', DONE],
    ['העיצוב כולל נגישות מובנית', DONE],
    ['CMS, תבנית ותוספים הותקנו', DONE],
    ['הותקנו רק תוספים הכרחיים', DONE],
    ['שפת הדף (lang)', DONE],
    ['טקסט מעורב עברית/אנגלית', DONE],
    ['פונטים עבריים נבחרו', DONE],
    ['פריסה רספונסיבית נבנתה', DONE],
    ['הקוד מנוהל בגרסאות (Git)', DONE],
  ],
  content: [
    ['המידע החשוב מופיע מוקדם', DONE],
    ['FAQ נוסף רק כשיש ערך', DONE],
    ['כל עמוד שירות/מוצר מציין במפורש', DONE],
    ['לכל התמונות והתכנים יש זכויות שימוש', DONE],
    ['תאריך פרסום/עדכון מוצג', DONE],
    ['עמודי ערים או אזורים', DONE],
  ],
  onpage: [
    ['Title ייחודי', DONE],
    ['Meta description ייחודי', DONE],
    ['H1 ברור', DONE],
    ['H2/H3 בהיררכיה', DONE],
    ['URL נקי', DONE],
    ['Alt מתאים לתמונות', DONE],
    ['Internal links קיימים', DONE],
    ['Anchor text ברור', DONE],
    ['Canonical מוגדר', DONE],
    ['Open Graph ותמונת שיתוף', DONE],
    ['Schema מתאים נבחר', DONE],
    ['Organization/LocalBusiness', DONE],
    ['Schema תואם למידע', DONE],
  ],
  tech: [
    ['robots.txt הוגדר', DONE],
    ['XML sitemap נוצר', DONE],
    ['אין Broken links', DONE],
    ['אין עמודים לא רצויים לאינדוקס', DONE],
    ['hreflang הוגדר', NA],
    ['תמונות בפורמט WebP/AVIF', DONE],
    ['פונטים: נטענים רק המשקלים', DONE],
    ['CSS/JS נבדקו', DONE],
    ['Lazy loading לתמונות', DONE],
    ['Favicon קיים', DONE],
    ['אין עמודים יתומים', DONE],
    ['סט אייקונים מלא', DONE],
    ['פונטים מתארחים מקומית', DONE],
  ],
  a11y: [
    ['מצב Focus נראה בבירור', DONE],
    ['ניגודיות צבעים לפי WCAG AA', DONE],
    ['תמונות דקורטיביות מוגדרות עם Alt ריק', DONE],
    ['לכל שדה בטופס יש תווית', DONE],
    ['לקישורים ולכפתורים יש טקסט מובן', DONE],
    ['בדיקה אוטומטית (Lighthouse / axe)', DONE],
    ['הצהרת נגישות פורסמה', DONE],
    ['הנגישות לא נשענת על תוסף', DONE],
  ],
  security: [
    ['CMS, תבנית ותוספים מעודכנים', NA],
    ['תוספים ותבניות שלא בשימוש הוסרו', NA],
    ['אימות דו-שלבי (2FA)', NA],
    ['סיסמאות חזקות וייחודיות', NA],
    ['ניסיונות התחברות מוגבלים', NA],
    ['הגנה מספאם בטפסים', DONE],
  ],
  legal: [
    ['מדיניות הפרטיות תואמת את המידע שהאתר אוסף', DONE],
    ['הטפסים אוספים רק מידע נחוץ', DONE],
    ['הסכמה לדיוור בתיבה נפרדת', NA],
    ['באנר עוגיות ו-Consent Mode', DONE],
    ['מחיר המוצג לצרכן הוא המחיר הכולל', DONE],
  ],
  conversion: [
    ['מטרת האתר ברורה מיד', DONE],
    ['CTA ברור', DONE],
    ['WhatsApp נבדק אם רלוונטי', DONE],
    ['הודעת הצלחה נבדקה', DONE],
    ['פרמטרי UTM ומקור הפנייה', DONE],
    ['כשל בשליחת טופס מוצג למשתמש', DONE],
    ['דף תודה בכתובת נפרדת', DONE],
    ['סקריפטים של מדידה ופרסום נטענים רק אחרי הסכמת', DONE],
  ],
  google: [
    ['Sitemap מוכן לשליחה', DONE],
    ['Google Business Profile מעודכן', NA],
    ['מידע העסק עקבי וברור', DONE],
    ['שירותים/מוצרים מוגדרים מפורשות', DONE],
    ['אין מידע סותר בין עמודים', DONE],
    ['הוחלט אילו סורקי AI לאפשר', DONE],
  ],
};

// ---------------------------------------------------------------------------
// Stage tracking and notes
// ---------------------------------------------------------------------------

const track = {
  scope: 'in-progress', client: 'in-progress', research: 'in-progress', arch: 'in-progress',
  build: 'in-progress', content: 'in-progress', onpage: 'in-progress', tech: 'in-progress',
  a11y: 'in-progress', security: 'in-progress', legal: 'in-progress', conversion: 'in-progress',
  google: 'in-progress', gate: 'not-started', automation: 'not-started', handover: 'not-started',
  post72: 'not-started', post14: 'not-started', post30: 'not-started',
};

const notes = {
  scope: 'אתר דמו לתיק עבודות (אצוות site-portfolio), חבילת "אתר מורחב": עמוד לכל שירות ולכל אזור. עסק ובעלים בדויים. תקציב, חוזה, חומרים ובעלות לקוח סומנו לא רלוונטי.',
  client: 'מנעולן בירושלים והסביבה (ירושלים, מבשרת ציון, צור הדסה, בית שמש, מודיעין), 24/7. עברית בלבד. כל הפרטים בדויים: טלפון 050-000-0000, מספר עוסק 000000000. אין Google Business Profile (דמו).',
  research: 'שירותים, שאלות לקוח והתנגדויות מופו לפי התחום (כולל עוקץ מנעולנים, נושא מרכזי בתחום). לא בוצע מחקר מילות מפתח עם נפחים: מילת מפתח לכל עמוד נקבעה לפי שירות + עיר ורשומה בשדה keyword בקונפיג.',
  arch: '27 עמודים: בית, מרכז שירותים + 8 עמודי שירות, מרכז אזורים + 5 עמודי אזור, מחירים, נעולים בחוץ, מדריך נגד עוקץ, אודות, ביקורות, FAQ, צור קשר, תודה, פרטיות, נגישות, 404. כל פרטי הלקוח ב-src/config/site.config.ts, כולל טבלת זמני הגעה אחת שממנה נגזרים כל הזמנים באתר.',
  build: 'Astro 7 סטטי. עיצוב: ui-ux-pro-max מוביל (Trust & Authority + Conversion, פלטת Emergency SOS על בסיס Dark Mode), frontend-design כביקורת. פונט אחד (Noto Sans Hebrew) בשני רוחבים. אלמנט חתימה: צילינדר שנפתח בטעינה. פיצ\'רים: מחשבון מחיר שקוף (שירות x שעה x אזור), תעודת טכנאי, מדריך נגד עוקץ, דף נעולים בחוץ, גרף זמני הגעה. מקורות וחריגות ב-design-system/barnea-locksmith/DECISIONS.md. ריפו ציבורי ב-GitHub. פתוח: אישור עיצוב, Staging, SMTP.',
  content: 'כל התוכן דמו ומסומן בפוטר. תוכן ייחודי לכל אזור (דלתות עץ ישנות ברחביה, בתים פרטיים במבשרת, שערים ומחסנים בצור הדסה, מוצאי שבת בבית שמש, מנעולים חכמים במודיעין). נכתב בעזרת AI. פתוח: מעבר אנושי והגהה, אישור לקוח.',
  onpage: 'נבדק אוטומטית (npm run audit): title ו-description ייחודיים, H1 אחד, canonical, alt לכל תמונה, JSON-LD תקין (Locksmith, Service, FAQPage, BreadcrumbList, Article, Person, ContactPage, ItemList). פתוח: Rich Results Test על אתר חי.',
  tech: 'Lighthouse נייד: נגישות 100, Best Practices 100 בעמודים שנבדקו (בית, שירות, מחירים, צור קשר). SEO 66-69 בגלל noindex מכוון. LCP 0.92 שניות ו-CLS 0 במעבדה (4G מהיר, CPU x4). ללא גלילה אופקית ב-360px ב-16 עמודים. פתוח: HTTPS, 404 אמיתי ב-Cloudflare, Safari/Android, נתוני שטח.',
  a11y: 'Lighthouse נגישות 100 אחרי תיקון (role לדירוג כוכבים, שם נגיש לכפתור החיוג, לוגו). Skip link, Focus, reduced-motion (האנימציה מוצגת במצב הסופי), מחשבון נגיש במקלדת, זמני הגעה גם כטקסט. פתוח: קורא מסך, זום 200%.',
  security: 'אתר סטטי ללא ממשק ניהול. Honeypot בטופס, public/_headers עם HSTS, nosniff, Referrer-Policy ו-X-Robots-Tag noindex (דמו). פתוח: אימות כותרות, גיבוי ו-SSL אחרי העלאה.',
  legal: 'פרטיות (כולל תיקון 13) ונגישות (ת"י 5568) מבוססים על הקונפיג. באנר עוגיות מופיע רק כש-GA4 מוגדר. כל המחירים כוללים מע"מ, ותוספות לילה ושבת מוצגות מראש. פתוח: בדיקה משפטית.',
  conversion: 'טופס במצב דמו (form.destinations ריק): ולידציה לטלפון ישראלי, UTM, הודעת כשל ודף תודה. וואטסאפ עם הודעה מוכנה, כולל סיכום מהמחשבון. אירועים: generate_lead, phone_click, whatsapp_click. פתוח: יעדים אמיתיים, GA4.',
  google: 'robots.txt מאפשר GPTBot, PerplexityBot ו-Google-Extended. sitemap-index.xml נוצר אוטומטית. במצב דמו כל העמודים noindex.',
};


const pages = [
  ['דף הבית', '/'],
  ['שירותים (ריכוז)', '/services/'],
  ['פתיחת דלתות', '/services/door-opening/'],
  ['החלפת צילינדר', '/services/cylinder-replacement/'],
  ['דלתות ביטחון', '/services/security-doors/'],
  ['מנעולן רכב', '/services/car-locksmith/'],
  ['כספות', '/services/safes/'],
  ['מנעולים חכמים', '/services/smart-locks/'],
  ['מפתחות ומאסטר', '/services/keys-and-master/'],
  ['אחרי פריצה', '/services/post-burglary/'],
  ['אזורי שירות (ריכוז)', '/areas/'],
  ['מנעולן בירושלים', '/areas/jerusalem/'],
  ['מנעולן במבשרת ציון', '/areas/mevaseret-zion/'],
  ['מנעולן בצור הדסה', '/areas/tzur-hadassah/'],
  ['מנעולן בבית שמש', '/areas/beit-shemesh/'],
  ['מנעולן במודיעין', '/areas/modiin/'],
  ['מחירים ומחשבון', '/prices/'],
  ['נעולים בחוץ', '/emergency/'],
  ['מדריך נגד עוקץ', '/guide/'],
  ['אודות', '/about/'],
  ['ביקורות', '/reviews/'],
  ['שאלות נפוצות', '/faq/'],
  ['צור קשר', '/contact/'],
  ['דף תודה', '/thank-you/'],
  ['מדיניות פרטיות', '/privacy/'],
  ['הצהרת נגישות', '/accessibility/'],
  ['עמוד 404', '/404'],
].map(([name, url]) => ({ name, url, content: true, design: true, seo: true, approval: false }));

// ---------------------------------------------------------------------------
// Build the file
// ---------------------------------------------------------------------------

const items = {};
const errors = [];
for (const [stageId, list] of Object.entries(statuses)) {
  const stage = STAGES.find((s) => s.id === stageId);
  if (!stage) { errors.push(`unknown stage ${stageId}`); continue; }
  const texts = stage.items.map((it) => (typeof it === 'string' ? it : it.t));
  for (const [needle, status] of list) {
    const hits = texts.filter((t) => t.includes(needle));
    if (hits.length !== 1) { errors.push(`${stageId}: "${needle}" matched ${hits.length} items`); continue; }
    items[`${stageId}.${hash(hits[0])}`] = status;
  }
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const data = {
  client: 'דמו לתיק עבודות: ברנע מנעולים, מנעולן בירושלים והסביבה',
  siteName: 'ברנע מנעולים - מנעולן בירושלים',
  domain: 'אין דומיין (דמו). יעד: Cloudflare Pages',
  owner: 'ציון',
  profile: 'corporate',
  projectKind: 'new',
  env: 'פיתוח מקומי. קוד: https://github.com/tzisig/barnea-locksmith',
  platform: 'Astro 7, אתר סטטי, ללא CMS. כל פרטי הלקוח ב-src/config/site.config.ts',
  languages: 'עברית (RTL)',
  projectStatus: 'in-progress',
  docVersion: '3.0',
  startDate: '2026-09-28',
  updatedDate: today,
  // Demo project: no client deadline
  dueDate: '',
  materialsDate: '',
};
for (const [stage, status] of Object.entries(track)) data[`track.${stage}.status`] = status;
for (const [stage, note] of Object.entries(notes)) data[`stageNotes.${stage}`] = note;

const out = {
  format: 'websiteBuildChecklist',
  version: 3,
  projects: [{
    id: 'p-locksmith-barnea',
    name: data.siteName,
    state: { version: 3, savedAt: new Date().toISOString(), data, items, waiting: {}, pages },
  }],
};
writeFileSync(OUT_FILE, JSON.stringify(out, null, 2));

const counts = Object.values(items).reduce((a, s) => ((a[s] = (a[s] || 0) + 1), a), {});
console.log(`checklist written: ${counts.done || 0} done, ${counts.na || 0} n/a, ${pages.length} pages`);
