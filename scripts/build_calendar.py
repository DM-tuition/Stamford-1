#!/usr/bin/env python3
"""Build data/calendar.json from the official AGSB calendar feed.

The school site (agsb.co.uk, a Juniper/FullCalendar site) serves its events as
JSON at calendar/api.asp. We keep only the categories that belong on a house
portal: House Events and Term Dates. Everything else (governors, PFA, trips,
parents' evenings) stays on the official calendar, which the site links to.

Usage:
  python3 scripts/build_calendar.py FEED.json [OUT.json]   # from a saved feed
  python3 scripts/build_calendar.py --fetch [OUT.json]     # download it first

Run by .github/workflows/deploy-pages.yml before every deploy (and daily).
"""
import datetime as dt
import html
import json
import re
import sys
import urllib.request

FEED = ("https://www.agsb.co.uk/calendar/api.asp?pid=128&viewid=19"
        "&calid=2,3,4,5,6,7,8,10,14&bgedit=false&start={start}&end={end}")
OFFICIAL = "https://www.agsb.co.uk/calendar/?calid=2,3,4,5,6,7,8,10,14&pid=128&viewid=19"
KEEP = {4: "House", 2: "Term dates"}  # feed category id -> label on our site


def academic_year(today):
    """1 Aug to 31 Aug the following year, covering the current school year."""
    y = today.year if today.month >= 8 else today.year - 1
    return dt.date(y, 8, 1), dt.date(y + 1, 8, 31)


def fetch(start, end):
    url = FEED.format(start=start.isoformat(), end=end.isoformat())
    req = urllib.request.Request(url, headers={"User-Agent": "AGSB-Houses-site (student project)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.load(r)


def clean(s):
    s = html.unescape(re.sub(r"<[^>]+>", " ", s or ""))
    return re.sub(r"\s+", " ", s).strip()


def year_group(title):
    m = re.search(r"\bY(?:ear)?\s?(\d{1,2})(?:\s?[/&]\s?Y?(\d{1,2}))?\b", title, re.I)
    if not m:
        return ""
    return "Year " + m.group(1) + (" & " + m.group(2) if m.group(2) else "")


def convert(feed):
    out = []
    for e in feed:
        cats = [c.get("id") for c in e.get("cals") or []]
        cat = next((KEEP[c] for c in cats if c in KEEP), None)
        if not cat:
            continue
        all_day = bool(e.get("allDay")) or "T" not in (e.get("start") or "")
        start = e["start"][:10]
        end = (e.get("end") or e["start"])[:10]
        if all_day and e.get("end"):  # FullCalendar all-day ends are exclusive
            end = (dt.date.fromisoformat(end) - dt.timedelta(days=1)).isoformat()
        loc = clean(e.get("desc"))
        loc = re.sub(r"^Location:\s*", "", loc, flags=re.I) if loc.lower().startswith("location") else ""
        title = clean(e.get("title"))
        out.append({
            "id": e.get("id"),
            "title": title,
            "category": cat,
            "start": start,
            "end": end if end != start else "",
            "time": "" if all_day else e["start"][11:16] + "–" + (e.get("end") or "")[11:16],
            "allDay": all_day,
            "location": loc,
            "yearGroup": year_group(title),
            "url": OFFICIAL + "&event=" + str(e.get("id")),
        })
    out.sort(key=lambda x: (x["start"], x["time"]))
    return out


def main(argv):
    today = dt.date.today()
    start, end = academic_year(today)
    if argv and argv[0] == "--fetch":
        feed, rest = fetch(start, end), argv[1:]
    elif argv:
        feed, rest = json.load(open(argv[0])), argv[1:]
    else:
        sys.exit(__doc__)
    events = convert(feed)
    if not events:
        sys.exit("No house/term events found in feed; keeping the existing file.")
    data = {
        "updated": today.isoformat(),
        "source": OFFICIAL,
        "note": "Generated from the official AGSB calendar by scripts/build_calendar.py. Do not edit by hand.",
        "season": f"{start.year}/{str(start.year + 1)[2:]}",
        "events": events,
    }
    path = rest[0] if rest else "data/calendar.json"
    with open(path, "w") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)
        f.write("\n")
    print(f"{len(events)} events ({sum(e['category'] == 'House' for e in events)} house) -> {path}")


if __name__ == "__main__":
    main(sys.argv[1:])
