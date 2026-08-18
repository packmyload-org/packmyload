# Packmyload — Full Site Revamp

Rebuild packmyload.com in this project: same content, same images, same brand blue — a much more modern, premium presentation.

## What stays the same
- All copy from the live site (headlines, service descriptions, protection/coverage/Pack-Now-Pay-Later sections, FAQ, footer text).
- All existing imagery, referenced directly from the current site's URLs (hero illustrations, service banners, feature icons, Hub video thumbnail, gallery photos).
- Brand identity: Packmyload blue with the light-blue accent, wordmark logo.

## What gets revamped
- Typography and spacing system: a confident display face for headlines, clean sans for body, generous vertical rhythm.
- Header: sticky, slimmer nav with dropdowns for Services and Partner, prominent "Book now" and click-to-call, full mobile drawer.
- Hero: refined quote bar (Moving from / Moving to / Date / Get quote) with better field styling and the illustration strip turned into a balanced, animated row.
- Sections rebuilt as modern cards, numbered step flow, benefit chips grid, and a feature grid with icons — softer shadows, rounded corners, subtle hover and scroll-in motion.
- Services catalog as an image-led card grid with hover lift.
- Consistent CTA band and a richer footer with grouped links, contact details and socials.
- Fully responsive at mobile, tablet, desktop.

## Pages
- `/` Home — hero + quote bar, Packmyload Hub, how-to-book steps, marketplace benefits, services catalog, one-seamless-experience features, Pack Now Pay Later, coverage, testimonials/CTA.
- `/services` — full catalog.
- Service detail pages: `/home-moves`, `/office-moves`, `/store-delivery`, `/interstate-car-transport`, `/junk-moves`, `/wedding-handling` — hero, what's included, how it works, FAQ, CTA (shared template).
- `/gallery` — photo grid with lightbox.
- `/about` — story, values, coverage areas.
- `/partners` — partner/vendor value props + apply form (visual).
- `/contact` — contact details, form, service-area info.
- `/hub` — utilities & home services concierge page.
- 404 stays as the existing themed not-found page.

Any current URL I rebuild at a different path gets a redirect from the old path so existing links keep working.

## Quote & forms
Quote bar, partner form and contact form are visual only: client-side validation plus a success toast. No backend, nothing stored. Easy to wire to Lovable Cloud later.

## Technical notes
- Design tokens (blue scale, accent, surfaces, radii, shadows, gradients) defined in `src/styles.css` as semantic oklch tokens; no hardcoded colors in components.
- Fonts loaded via `<link>` in `src/routes__root.tsx` head, family registered in `@theme`.
- Shared `Header`/`Footer` chrome rendered in `__root.tsx` around `<Outlet />`; reusable section components under `src/components/`.
- One route file per page under `src/routes/`, each with its own `head()` (unique title, description, og/twitter tags) plus JSON-LD `MovingCompany`/`LocalBusiness` on home and contact.
- Remote images used via `<img>` with descriptive alt text, width/height and lazy loading below the fold.
- `public/sitemap.xml` and `robots.txt` updated for the new route set.
