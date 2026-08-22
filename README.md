# AdverX Marketing Solutions — website

Static marketing site for a specialist Google Ads / Meta Ads agency. No build step, no
dependencies — plain HTML, CSS and vanilla JS.

## Preview

Open `index.html` directly in a browser, or serve the folder:

```bash
npx --yes serve .
# or
python -m http.server 8080
```

## Structure

```
index.html                      home — hero, specialise, convergence, reporting,
                                brand story, contact, final CTA
services.html                   process (5 steps) → Google Ads → Meta Ads →
                                Google + Meta Ads → CTA
about.html                      about → experience → why a specialist → CTA
assets/css/styles.css           all styling, custom properties at the top
assets/js/main.js               menu, scroll reveal, smooth anchors, form validation
assets/favicon.svg              X mark
legal/privacy-policy.html
legal/terms-and-conditions.html
legal/cookie-policy.html
```

The header is identical on every page: Home / Google Ads / Meta Ads / Contact in the bar,
About and Services groups inside the hamburger panel (which also carries the top-level links
below 900px). The contact form lives on the home page only; every other page links to it.

## Design

Light theme (white / `#f5f7fa` alternating bands, pale-blue closing CTA band), deep-navy ink
`#0d1b2a`, blue accent `#1a5fd0`. Poppins for headings and UI, DM Serif Display for the
Google Ads / Meta Ads taglines and brand statements, system stack for body copy.

The X mark is two crossing strokes: a muted navy descending stroke and an accent-blue
ascending stroke that ends in an arrowhead (growth). It is one SVG shape used at three
sizes — 28px in the header and footer, 100px in the closing CTA, 180px in the brand story —
with colours driven by the `.x-a` / `.x-b` classes. Every colour, radius, shadow and
the header height are custom properties in `:root` — change the palette there and the whole
site follows.

Breakpoints: 1024px (hero stacks), 900px (nav collapses into the hamburger panel), 820px
(services and contact stack), 768px, 640px, 480px.

## Before it goes live

- **Contact form has no backend.** `assets/js/main.js` validates and shows a confirmation;
  the marked block at the bottom of that file is where a `fetch()` to your endpoint or form
  service goes.
- **Legal pages are drafts.** Each carries a placeholder notice — add the registered company
  details and have the wording reviewed.
- **Analytics / ad tags are not installed.** If Google Analytics, the Google Ads tag or the
  Meta pixel are added, load them behind a consent banner and update the cookie policy.
- Replace the `og:` metadata with a real share image and canonical URL.
