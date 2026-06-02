# Stamford House — Website (First Draft)

Public/internal website for **Stamford House**, Altrincham Grammar School for Boys (AGSB).

> *Labor Omnia Vincit* — Work Conquers All.

## What's here

A static, mobile-friendly multi-page site built with plain HTML/CSS/JS — no build step required.

| Page | File | Content |
|------|------|---------|
| Home | `index.html` | Hero, stats, ethos, leadership preview |
| About | `about.html` | History, ethos, legacy timeline, colours |
| Leadership | `leadership.html` | Captains, house structure, Senior Prefect Team |
| Events | `events.html` | House Shout, Sports Day, debating, points |
| Get Involved | `get-involved.html` | Ways to join + contact form |

```
assets/crest.svg   Recreated Stamford crest (blue/white shield, crown)
css/style.css      Design system (blue & white palette)
js/main.js         Mobile nav + footer year
```

## Running it

It's static — just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Design notes

- **Palette:** Royal `#1a1aff`, Steel `#2f8fd0`, Light `#d8e9f5`, Navy `#0a1f6b`, White. No rival-house colours in the brand.
- **Fonts:** Montserrat (headings) + Inter (body) via Google Fonts.
- The crest is an SVG recreation of the official Stamford shield. Swap in the official crest artwork when available.

## Before go-live — TODO

- [ ] Replace the SVG crest with official artwork if higher fidelity is needed.
- [ ] Add real photos (Daniel & Ayaan headshots, house events) — currently initials/placeholders.
- [ ] Wire the **Get Involved** form to the house email or a form service (e.g. Formspree).
- [ ] Confirm leadership names/roles and event details with the school.
- [ ] Add live house-score feed / link if desired.

*First draft — June 2026.*
