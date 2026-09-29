# Design decisions and deviations

`MASTER.md` is the ui-ux-pro-max `--design-system` output for "locksmith emergency 24/7 security trust local service" (variance 6, motion 4, density 4). This file records which pro-max result each choice came from, and every place the build deviates.

## Sources

| Area | ui-ux-pro-max source | Used as |
| --- | --- | --- |
| Product type | `--domain product "locksmith emergency security"`, result 1: Emergency SOS & Safety; result 2: Home Services | Emergency-first home page, trust signals up front |
| Pattern | Trust & Authority + Conversion (design-system) | Hero with credibility, proof row, services, clear call path, sticky mobile call bar |
| Style | Trust & Authority (design-system) + Dark Mode (OLED), the secondary style of Emergency SOS & Safety | Night sections (hero, process, arrival times, footer) around light reading sections |
| Colors | Emergency SOS & Safety palette: alert red `#DC2626`, safety blue `#2563EB`, foreground `#0F172A`. Dark Mode style: midnight blue `#0A0E27` | `theme.colors` in `src/config/site.config.ts` |
| Fonts | Hebrew-capable families from `--domain google-fonts "hebrew"`: Noto Sans Hebrew (variable weight and width axes) | One family, two widths (see deviations) |
| Motion | Stagger List (standard) | `.reveal` with a 60ms stagger per item |
| Anti-patterns to avoid | Hidden contact info, no certifications | Phone in the header, sticky call bar, technician ID card, certifications on About |

## Deviations

| What | Why |
| --- | --- |
| Lexend + Source Sans 3 (the design-system typography) replaced by Noto Sans Hebrew | Neither has Hebrew glyphs. Noto Sans Hebrew is in the pro-max Google Fonts catalog with a width axis, so headings use it condensed and heavy (a key-stamp feel) and body text at normal width. Fonts used on the owner's other sites were avoided on purpose. |
| Orange/cream palette from the design-system output replaced by the Emergency SOS palette on a dark base | Orange on cream is one of the looks frontend-design flags as generic, and the Emergency SOS palette came from the product search for this exact trade. |
| Derived colors: `night2`, `nightLine`, `alertOnNight` (#FF8A8A), `signalOnNight` (#8FB0FF), `open` (#34D399) | Needed for text and marks on the midnight background. All checked for WCAG AA: 8.4, 8.9 and 9.9 to 1 on `#0A0E27`. |
| Stagger List without the `back.out` overshoot and without GSAP | Pro-max itself warns against overshoot on informational UI; a plain ease keeps the same timing without a library. |
| Signature element: a pin-tumbler cylinder that "unlocks" once on load | frontend-design: spend boldness in one place, one orchestrated moment. It explains the trade, turns the headline's promise into a picture, and renders in its final state with reduced motion or no JavaScript. |
| Services as an index list, not cards | frontend-design warns against identical rounded cards; a ruled list with icon, one line and a "from" price scans faster. |
| Middle dots removed from review metadata | frontend-design flags "A · B · C" meta strings as template chrome. |
| Striped yellow demo banner on every page | Owner's rule for portfolio demos: it must be obvious that everything is fictional. It renders only while `site.isDemo` is true, and its yellow/black stripes sit outside the site palette on purpose, so it never reads as part of the design. |
| Area photos show the region, not always the exact town | Portfolio demo: stock photos of the Jerusalem hills stand in until a client supplies real ones. |
