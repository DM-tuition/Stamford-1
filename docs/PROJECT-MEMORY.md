# STAMFORD HOUSE WEBSITE — COMPLETE PROJECT MEMORY

*Portable context dump for a second-brain / Claude Code. Everything the user
provided plus everything built and decided across the project. June–July 2026.*

---

## 0. Identity & access
- **What it is:** A static, dark-themed, animation-rich, installable PWA website for **Stamford House** at Altrincham Grammar School for Boys (AGSB), with a live filterable house-events calendar.
- **GitHub repo:** `dm-tuition/stamford-1`
- **Primary branch:** `main` (all real work lives here). An earlier dev branch `claude/website-first-draft-87H4Y` holds only the original light-theme first draft — do **not** confuse it with `main` (this caused a scare once: the working tree got checked out to that old branch and looked reverted; it wasn't — `main` was always intact).
- **Live URL (GitHub Pages):** https://dm-tuition.github.io/Stamford-1/
- **Owner email:** dmtuition2026@gmail.com
- **Built during:** June–July 2026.

## 1. School & trust context
- **School:** Altrincham Grammar School for Boys (AGSB). Boys' grammar, Altrincham, Greater Manchester. Website agsb.co.uk.
- **Trust:** Hamblin Education Trust.
- **Motto:** *Labor Omnia Vincit* ("Work Conquers All").
- **House system:** Reintroduced Summer Term 2019. Four houses: **Bradbury, Massey, Stamford, Tatton**. Everyone (pupils + staff) is in a house; siblings share a house. Each house run by a staff House Manager; elected year-group House Leaders + Deputies; a Year 13 House Captain + Deputy per house. Students earn points across the year; scores shown on the AGSB home page and House Twitter.
- **Purpose of houses:** community across year groups, leadership, teamwork, resilience, belonging, celebrate success, reward participation.
- **Sponsors:** Stamford = **ABC+ Warranty** (architectscertificate.co.uk, local Altrincham structural-warranty company). Tatton = Independents by Sodexo (catering). Bradbury & Massey also sponsored.

## 2. Stamford identity & legacy
- **Status:** The dominant house. "Two thirds of the school's major trophy cabinet is blue."
- **Key achievement:** **House Shout** champions ~5–6 consecutive years (the flagship performing-arts/singing event).
- **Reputation/ethos:** Collaborative, high-achieving, inclusive. **Mass participation is how Stamford wins.** Every student has a role; everyone feels valued; unstoppable together.
- **Legacy quotes (used on site):**
  - Leo Beesley (2024/25 Vice Captain): *"Two thirds of the schoolhouse major trophy cabinet is adorned with blue for good reason."* / *"Five years of house shout dominance doesn't come without people stepping up."*
  - Bhuvan Vaddhireddy (2024/25 Captain): *"Stamford is more than just a name — it is a legacy, a tradition woven into the very fabric of our identity."* / *"Us Stamfordians can be symbolic of the unstoppable force — a powerhouse of unity, perseverance and determination…"*

## 3. People
**Stamford leadership 2026/27 (current):**
- **House Captain: Daniel Stevenson** — Year 13 (entering). A-Levels: Further Maths, Maths, Physics, Economics. Aiming for **Finance at Oxbridge**. Founded the school **volleyball club**; plays school **football** and **hockey**; co-directs the **Finance Society**; active on Instagram; part of **AyaanDanShenanigins** (charity endurance brand — marathons, 100km runs, push-up challenges). Personality: confident, direct, driven, competitive, charismatic, strong public speaker, thinks in systems/numbers.
- **Vice Captain: Ayaan Siddiqui** — Year 13. Co-founder of **AyaanDanShenanigins**.
- Appointed by **Daniel Birchall** (Head of Senior Prefect Team), works with the staff House Manager.

**Wider Senior Prefect Team 2026/27:**
- Head Prefect: **Julian Bendon**
- Bradbury: Captain **Aadith Menon** / Vice **Panchu Nucherla**
- Massey: Captain **Soorian Jegatheeswaran** / Vice **Gregory Singh**
- Tatton: Captain **Edward Aloul** / Vice **Anthony Ononye**

**Predecessors 2024/25:** Stamford Captain **Bhuvan Vaddhireddy**, Vice **Leo Beesley** (A-levels Maths, Chemistry, Physics, Economics).
**2025/26 captains (reference):** Bradbury Oliver Fryar; Massey Kavi Gupta / Marley Inegbu; Stamford Bhuvan Vaddhireddy / Leo Beesley; Tatton Leo Wei / Steven Ononye.

## 4. Brand / visual identity
- **Palette (CSS `:root`):** Royal `#2a4bff`, Royal-bright `#4d6bff`, Steel `#2f8fd0`, Cyan `#6fd6ff`, Light `#d8e9f5`. Dark surfaces: bg `#04081e`, bg-2 `#070d2a`; text `#eaf0ff`, muted `#93a4cf`. (Original draft used royal `#1a1aff`.)
- **No rival-house colours in the brand:** red=Bradbury, green=Massey, yellow=Tatton (they appear only in the flag strip + Senior Prefect Team cards).
- **Fonts:** Space Grotesk (display/headings) + Inter (body), via Google Fonts.
- **Crest design:** Heraldic shield — horizontal blue/white stripes, royal-blue chevrons, white/gold crown at top, blue diamond at foot, gold metal frame, "STAMFORD" banner beneath.
- **Voice/tone:** Confident (not arrogant), direct, inclusive, legacy-aware, warm from leadership ("our door is always open"), competitive edge ("Stamford wins — that's the standard"). Avoid corporate filler ("synergy", "leverage"), stiffness, committee-speak.

## 5. The crest journey (several iterations)
1. Started as a hand-built flat **SVG** shield (`assets/crest.svg`) — user called it "trash/outdated."
2. User uploaded the **real enamel-pin photo** with a rocky stone background → saved as `assets/crest-photo.jpeg`.
3. Rebuilt `crest.svg` as a **vivid vector recreation** (gold frame, gradients, banner) as a fallback.
4. User did an **iPad "lift subject"** background removal and uploaded a transparent cutout (`IMG_1397.png`) → became `assets/crest.png`.
5. User uploaded a **refined gold-framed marbled-blue enamel** transparent PNG (`IMG_1398.png`) → this is the **final `assets/crest.png`**.
6. **Optimised** it with Pillow: resized to 820×1230 + 256-colour quantize → **1.6 MB → 108 KB** (kept full-res backup at `assets/crest-full.png`).
- **Fallback chain everywhere:** every `<img src="assets/crest.png" onerror="…src='assets/crest-photo.jpeg'">`. Favicon = crest.png.

## 6. Website architecture
- **Pure static site — no framework, no build step, no external JS libraries.** Plain HTML/CSS/vanilla JS. All animation hand-written so it works offline.
- **Pages (7):** `index.html` (Home), `about.html`, `leadership.html`, `events.html`, `gallery.html`, `get-involved.html`, `404.html`.
- **Assets/code:**
  - `css/style.css` — entire design system + components + flair + responsive + reduced-motion.
  - `js/main.js` — all global behaviours (loaded on every page).
  - `js/events.js` — the calendar engine (events.html only).
  - `js/config.js` — **the one file to edit to go live** (two settings).
  - `data/events.json` — 88 house events (the calendar data).
  - `sw.js` — service worker (offline/PWA), cache name currently `stamford-v3`.
  - `manifest.webmanifest` — PWA manifest.
  - `.nojekyll`, `.github/workflows/deploy-pages.yml` — GitHub Pages deploy.
  - `assets/` — `crest.png`, `crest-full.png`, `crest-photo.jpeg`, `crest.svg`, `README.md`, `icons/icon-32|180|192|512.png`, `photos/` (empty + README).
  - `docs/` — `master-prompt.html` + `StamfordHouse-Master-Prompt.pdf` (a portable context brief).
  - `README.md`, `CLAUDE.md` (the master brand/context prompt).

## 7. Features built (full list)
**Home:** animated hero (floating per-letter "Stamford." wordmark, 3D tilting crest), marquee ribbon, count-up stats (5+, ⅔, 70+, 4), house **leaderboard/scoreboard**, rotating **quote carousel**, "what we stand for" pillars, season preview, **captain spotlight** (DS/AS placeholder initials), CTA. Scroll-spy dots down the side.

**Events (`events.html`):** live calendar from `events.json` — **countdown** to next event, **"season in numbers"** stats, **text search**, **type filters** (Sport/Academic/Arts/Performance/Social) with live counts, **year-group filters**, **grid/list view toggle**, **jump-to-month** nav, **"Add to calendar" (.ics)** per event, House Shout flagged flagship ★.

**Get Involved:** floating-label **contact/sign-up form** (AJAX → Formspree when configured, demo toast otherwise), **copy-email chip**, **FAQ accordion**, sponsor section.

**Global (main.js):** preloader, film-grain overlay, skip-to-content + focus-visible, light/dark **theme toggle** (localStorage `stamford-theme`), mobile nav, scroll-progress bar, header hide-on-scroll, custom glowing cursor, magnetic buttons, card tilt, particle **starfield** canvas, drifting **orbs**, scroll-reveal, count-ups, **letter-by-letter heading reveals**, flowing gradient text, **glare sweep** on cards/buttons, **blue sparkle burst** on primary buttons/theme toggle/flagship cards, quote carousel, page-transition curtain, **"next event" hype bar** (sitewide, reads events.json, dismissible), **live leaderboard** (Google Sheet CSV), **form AJAX**, image lazy-load + async-decode. Global helpers: `window.stamfordToast`, `stamfordSparkle`, `stamfordCountUp`. Everything honours `prefers-reduced-motion`.

**PWA:** manifest (name "Stamford", standalone, theme `#04081e`), apple-touch-icon + iOS web-app meta on every page, service worker (network-first, offline fallback), app icons generated from the crest on a brand-blue gradient. Icon evolved: padded → bigger → **full-bleed** (crest fills whole tile, bottom point trimmed — the deliberate trade because a tall shield can't fill a square without cropping).

## 8. Events data (`data/events.json`)
- **88 events**, Annual House Events Calendar 2025/26, transcribed from the school's "25-26 Events" PDF.
- Fields per event: `title, staff, date (ISO or null), dateLabel, month, yearGroup, number, ethos[], notes, category (+ flagship)`.
- Categories: Sport, Academic, Arts, Performance, Social.
- Timeline highlights: Sept (Cross Country, Public Speaking), Oct (**House Shout 16 Oct**, Photography, Future Chefs), Nov (Winter Sport Festival, University Challenge), Dec (Football comps, Christmas Fair, Bake-Off), Jan–Mar (Chess, Debating, Mastermind, House Drama, eSports, Pi Recital, AGSB's Got Talent), Apr–May (Debating, Indoor Cricket), Jun (Tug o' War, Summer Sports Festival, Solo Music), **Sports Day 1 Field 30 Jun / Sports Day 2 Track 1 Jul / Reserve 3 Jul**.
- **Data caveats to verify with school:** source "December 2024" header treated as **Dec 2025** (typo); a few cricket rows' "Year group/Number" cells looked column-shifted (transcribed as-shown, not guessed).

## 9. Config & "go-live" switches (`js/config.js`)
Two blank-by-default settings that make features real:
- `scoresCsvUrl` — a Google Sheet (columns `House | Points`) → File → Share → **Publish to web → CSV**. Fills the home leaderboard live. Blank = placeholder standings (Stamford 1st).
- `formEndpoint` — a **Formspree** endpoint. Makes the contact/sign-up form actually send. Blank = demo mode.
- **GitHub Pages** is enabled (Settings → Pages → Source: GitHub Actions); the workflow auto-deploys `main`.

## 10. Known placeholders / outstanding TODO
- Captain photos: add `assets/photos/daniel.jpg` + `ayaan.jpg` (auto-replace initials).
- Gallery: replace 9 placeholder tiles with real event photos.
- Real house **email** (placeholder `stamford.house@agsb.co.uk`) + wire the **form endpoint**.
- **Live scores** Google Sheet for the leaderboard.
- Verify event data (the column-shift + Dec 2025 caveats), confirm exact House Shout win count and current standings.
- Optional: custom domain (e.g. stamford.house).

## 11. Future ideas discussed (not yet built)
Live points + **"Road to the Cup"** tracker; **results & recaps** feed after each event; **event sign-up / "I'm in"** with live participation tally; **captains' notices/blog**; **per-event detail pages**; **home-page countdown**; **share-to-Instagram** event cards; **embed House Instagram/Twitter** feed; privacy-friendly **analytics** (Plausible); accessibility pass; SEO sitemap/social preview image. The **"Road to the Cup" tracker + home countdown** need no external accounts.

## 12. Environment gotchas (for whoever works on it next)
- The **calendar uses `fetch()`** → must be served over **http** (`python3 -m http.server 8000`), not `file://`.
- **iOS caches the PWA icon hard** — to see icon changes you must delete the home-screen shortcut and re-add after Pages redeploys.
- In this build sandbox: **LibreOffice can't convert files** (broken) — the context PDF was generated with a hand-rolled Python PDF writer. **Pillow is available** (used for crest/icon optimisation); **no ImageMagick/rembg**, and **pip has no network**. **Playwright is global** at `/opt/node22/lib/node_modules` with Chromium at `/opt/pw-browsers` (used to screenshot the running app).
- Git workflow: commit + push to `main`; occasionally rebase before push (remote gets "Add files via upload" commits when the user uploads images through GitHub's web UI).

---

*End of project memory.*
