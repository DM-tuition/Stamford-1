# Stamford House — Website

Public/internal website for **Stamford House**, Altrincham Grammar School for Boys (AGSB).

> *Labor Omnia Vincit* — Work Conquers All.

A static, dark-first, mobile-friendly site with a futuristic visual language — animated
aurora backdrop, particle starfield, glassmorphism, scroll reveals, count-ups, magnetic
buttons, 3D crest tilt, page transitions, light/dark toggle — and a **live, filterable
events calendar** driven by the real 2025/26 house calendar.

## Pages

| Page | File | Content |
|------|------|---------|
| Home | `index.html` | Animated hero, marquee, stats, house scoreboard, ethos, captains, CTA |
| About | `about.html` | History, ethos, legacy timeline, colours |
| Leadership | `leadership.html` | Captains + spotlight, house structure, Senior Prefect Team |
| Events | `events.html` | **Live calendar** — filter by type & year, countdown to next event |
| Gallery | `gallery.html` | "A season in blue" photo grid (placeholders) |
| Get Involved | `get-involved.html` | Ways to join + contact form + sponsor |

```
assets/crest.svg     Recreated Stamford crest (SVG)
assets/photos/       Drop daniel.jpg / ayaan.jpg + gallery shots here (see its README)
css/style.css        Design system (dark-first + light theme)
js/main.js           Cursor, particles, reveal, counters, tilt, theme, transitions
js/events.js         Loads data/events.json → renders calendar, filters, countdown
data/events.json     88 house events (Sept 2025 → Jul 2026), transcribed from the PDF
```

## Running it

The events calendar fetches `data/events.json`, so use a local server (not file://):

```bash
python3 -m http.server 8000
# visit http://localhost:8000
```

## Design notes

- **Palette:** Royal `#2a4bff`, Steel `#2f8fd0`, Cyan `#6fd6ff`, white. No rival-house colours.
- **Fonts:** Space Grotesk (display) + Inter (body).
- Honours `prefers-reduced-motion`; everything degrades gracefully.

## Going live (2 things to flip on)

All the plumbing is built — just paste two links into **`js/config.js`**:

1. **Live house points** — make a Google Sheet with columns `House | Points`
   (rows: Stamford, Bradbury, Massey, Tatton). File → Share → **Publish to web → CSV**,
   then paste that link as `scoresCsvUrl`. The home scoreboard becomes live (sorted, animated).
2. **Working contact/sign-up form** — create a free form at **formspree.io**, paste its
   endpoint as `formEndpoint`. Submissions then email the house for real (with a success toast).

### Publish the site (GitHub Pages)
A deploy workflow is included at `.github/workflows/deploy-pages.yml`. To switch it on:
**GitHub repo → Settings → Pages → Build and deployment → Source: GitHub Actions.**
Every push to `main` then auto-deploys to a public URL.

## Other features now built-in
- **"Next event" hype bar** sitewide (auto-reads the calendar; dismissible).
- **Image perf:** crest optimised 1.6 MB → ~108 KB; images lazy-load + async-decode.
  (Full-res crest kept at `assets/crest-full.png`.)

## Remaining TODO
- [ ] Add real photos to `assets/photos/` (Daniel, Ayaan, gallery) — placeholders auto-swap.
- [ ] Confirm leadership names, event dates and "Year group/Number" cells with the school.
- [ ] Replace the placeholder house email (`stamford.house@agsb.co.uk`).

*Last updated June 2026.*
