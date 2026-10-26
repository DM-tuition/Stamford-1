/* Stamford House — interactions (clean edition) */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Config (paste links in js/config.js to go live) ---- */
  var CFG = window.STAMFORD_CONFIG || {};
  CFG.scoresCsvUrl = CFG.scoresCsvUrl || "";
  CFG.formEndpoint = CFG.formEndpoint || "";

  /* ---- Shared chrome: skip link, toasts, back-to-top, social meta ---- */
  (function inject() {
    var body = document.body;
    var skip = document.createElement("a");
    skip.className = "skip-link"; skip.href = "#main"; skip.textContent = "Skip to content";
    body.insertBefore(skip, body.firstChild);
    var main = document.querySelector("main") || document.querySelector(".hero, .page-hero");
    if (main && !main.id) main.id = "main";

    var toasts = document.createElement("div"); toasts.className = "toasts"; toasts.id = "toasts"; body.appendChild(toasts);

    var top = document.createElement("button"); top.className = "to-top"; top.setAttribute("aria-label", "Back to top"); top.innerHTML = "↑"; body.appendChild(top);
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); });
    window.addEventListener("scroll", function () { top.classList.toggle("show", window.scrollY > 600); }, { passive: true });

    var head = document.head;
    function meta(a, v, c) { var m = document.createElement("meta"); m.setAttribute(a, v); m.content = c; head.appendChild(m); }
    var desc = (document.querySelector('meta[name="description"]') || {}).content || "Stamford House, AGSB.";
    meta("name", "theme-color", "#ffffff");
    meta("property", "og:title", document.title);
    meta("property", "og:type", "website");
    meta("property", "og:description", desc);
    meta("name", "twitter:card", "summary_large_image");
  })();

  /* ---- Service worker ---- */
  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }

  /* ---- Toast helper (used here + by events.js) ---- */
  window.stamfordToast = function (msg, icon) {
    var box = document.getElementById("toasts"); if (!box) return;
    var t = document.createElement("div"); t.className = "toast";
    t.innerHTML = '<span class="ic">' + (icon || "✓") + '</span><span>' + msg + '</span>';
    box.appendChild(t);
    setTimeout(function () { t.classList.add("out"); setTimeout(function () { t.remove(); }, 260); }, 3200);
  };

  /* ---- Copy to clipboard ---- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-copy]"); if (!el) return;
    var val = el.getAttribute("data-copy");
    if (navigator.clipboard) navigator.clipboard.writeText(val).then(function () { window.stamfordToast("Copied: " + val, "📋"); });
    else window.stamfordToast(val, "📋");
  });

  /* ---- Mobile nav ---- */
  document.addEventListener("click", function (e) {
    var toggle = e.target.closest(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (toggle && links) { var open = links.classList.toggle("open"); toggle.setAttribute("aria-expanded", open ? "true" : "false"); }
    else if (e.target.tagName === "A" && links) { links.classList.remove("open"); }
  });

  /* ---- Footer year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- Performance: lazy-load + async-decode images ---- */
  document.querySelectorAll("img").forEach(function (img) {
    img.decoding = "async";
    if (!img.closest(".site-header, .hero, .page-hero")) img.loading = "lazy";
  });

  /* ---- Scroll reveal (subtle) ---- */
  var revs = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revs.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    revs.forEach(function (el) { io.observe(el); });
  } else { revs.forEach(function (el) { el.classList.add("in"); }); }

  /* ---- Count up ---- */
  window.stamfordCountUp = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var raw = el.getAttribute("data-raw");
    if (reduced || isNaN(target)) { el.textContent = (raw || target) + suffix; return; }
    var dur = 1200, t0 = performance.now();
    (function step(now) {
      var p = Math.min((now - t0) / dur, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step); else el.textContent = (raw || target) + suffix;
    })(t0);
  };
  var nums = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && nums.length) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { window.stamfordCountUp(en.target); io2.unobserve(en.target); } });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io2.observe(el); });
  }

  /* ---- Scoreboard bars ---- */
  var sbars = document.querySelectorAll(".score-bar > i");
  if ("IntersectionObserver" in window && sbars.length) {
    var io3 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.style.width = en.target.getAttribute("data-w") + "%"; io3.unobserve(en.target); } });
    }, { threshold: 0.4 });
    sbars.forEach(function (el) { io3.observe(el); });
  }

  /* ---- Quote carousel ---- */
  document.querySelectorAll(".carousel").forEach(function (car) {
    var slides = car.querySelectorAll(".slide"); if (slides.length < 2) return;
    var dots = car.querySelector(".dots"), i = 0, timer;
    slides.forEach(function (_, k) {
      var b = document.createElement("button"); b.setAttribute("aria-label", "Slide " + (k + 1));
      if (k === 0) b.classList.add("active");
      b.addEventListener("click", function () { go(k); restart(); }); dots.appendChild(b);
    });
    function go(n) { slides[i].classList.remove("active"); dots.children[i].classList.remove("active"); i = (n + slides.length) % slides.length; slides[i].classList.add("active"); dots.children[i].classList.add("active"); }
    function restart() { if (reduced) return; clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 6000); }
    slides[0].classList.add("active"); restart();
    car.addEventListener("mouseenter", function () { clearInterval(timer); });
    car.addEventListener("mouseleave", restart);
  });

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function yearLabel(y) { if (!y) return ""; if (/^all/i.test(y)) return "All years"; return /^\d/.test(y) ? "Year " + y : y; }

  /* ---- Shared date loader: official AGSB calendar + house diary + Parliament ---- */
  var TAG = { "House": "var(--accent)", "Term dates": "#6b7280", "Parliament": "#b7791f" };
  var dates = null;
  function iso(d) { return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function loadDates() {
    if (dates) return dates;
    function get(u) { return fetch(u).then(function (r) { return r.ok ? r.json() : null; }).catch(function () { return null; }); }
    dates = Promise.all([get("data/calendar.json"), get("data/events.json"), get("data/parliament.json")]).then(function (res) {
      var items = [];
      ((res[0] && res[0].events) || []).forEach(function (e) {
        items.push({ id: "ev-" + e.id, title: e.title, category: e.category, start: e.start, end: e.end, time: e.time, location: e.location, yearGroup: e.yearGroup, url: e.url });
      });
      ((res[1] && res[1].events) || []).forEach(function (e, i) {
        if (e.date) items.push({ id: "hd-" + i, title: e.title, category: "House", start: e.date, end: "", time: "", location: "", yearGroup: yearLabel(e.yearGroup), staff: e.staff, diary: true });
      });
      ((res[2] && res[2].departments) || []).forEach(function (d, i) {
        if (d.next) items.push({ id: "pm-" + i, title: "Parliament: " + d.name, category: "Parliament", start: d.next, end: "", time: d.time || "", location: d.room || "", yearGroup: "", href: "parliament.html#meetings" });
      });
      items.sort(function (a, b) { return (a.start + a.time).localeCompare(b.start + b.time); });
      return items;
    });
    return dates;
  }
  function isUpcoming(e) { return (e.end || e.start) >= iso(new Date()); }
  function fmt(d, opts) { return new Date(d + "T12:00:00").toLocaleDateString("en-GB", opts); }
  function when(e) {
    var day = { day: "2-digit", month: "short" }, full = { day: "2-digit", month: "short", year: "numeric" };
    var d = e.end ? fmt(e.start, day) + " – " + fmt(e.end, full) : fmt(e.start, full);
    return d + ", " + (e.time ? e.time.replace("–", " – ") : "All day");
  }
  function soon(e) {
    var today = iso(new Date()), t = new Date(); t.setDate(t.getDate() + 1);
    if (e.start <= today && (e.end || e.start) >= today) return "Today";
    if (e.start === iso(t)) return "Tomorrow";
    return "";
  }

  /* ---- Upcoming events scroller: <div data-scroller="12"> ---- */
  document.querySelectorAll("[data-scroller]").forEach(function (el) {
    var max = parseInt(el.getAttribute("data-scroller"), 10) || 12;
    loadDates().then(function (all) {
      var up = all.filter(isUpcoming);
      if (!up.length) { el.innerHTML = '<p class="empty-note">No upcoming events yet. New dates appear here as soon as they\'re published.</p>'; return; }
      var cats = ["All"].concat(Object.keys(TAG).filter(function (c) { return up.some(function (e) { return e.category === c; }); }));
      el.innerHTML = '<div class="sc-bar"><label class="sc-filter">Filter by <select>' + cats.map(function (c) { return "<option>" + c + "</option>"; }).join("") + "</select></label>" +
        '<div class="sc-arrows"><button class="sc-btn" data-dir="-1" aria-label="Previous events">←</button><button class="sc-btn" data-dir="1" aria-label="Next events">→</button></div></div>' +
        '<div class="sc-track" tabindex="0" aria-label="Upcoming events"></div>';
      var track = el.querySelector(".sc-track"), sel = el.querySelector("select");
      function draw() {
        var list = up.filter(function (e) { return sel.value === "All" || e.category === sel.value; }).slice(0, max);
        track.innerHTML = list.map(function (e) {
          var s = soon(e), href = e.href || "events.html#" + e.id;
          return '<a class="sc-card" href="' + href + '" style="--cc:' + TAG[e.category] + '">' +
            '<div class="sc-when">' + esc(when(e)) + (s ? ' <span class="sc-soon">' + s + "</span>" : "") + "</div>" +
            '<div class="sc-title">' + esc(e.title) + "</div>" +
            '<div class="sc-meta">' + [e.location, e.yearGroup].filter(Boolean).map(esc).join(" · ") + "</div>" +
            '<div class="sc-tag">' + esc(e.category) + "</div></a>";
        }).join("");
        track.scrollLeft = 0;
      }
      sel.addEventListener("change", draw);
      el.querySelectorAll(".sc-btn").forEach(function (b) {
        b.addEventListener("click", function () {
          var card = track.querySelector(".sc-card"), step = card ? card.offsetWidth + 16 : 280;
          track.scrollBy({ left: step * Math.max(1, Math.floor(track.clientWidth / step)) * b.getAttribute("data-dir"), behavior: "smooth" });
        });
      });
      draw();
    });
  });

  /* ---- Full season list (events page): <div data-season-list> ---- */
  document.querySelectorAll("[data-season-list]").forEach(function (el) {
    loadDates().then(function (all) {
      var items = all.filter(function (e) { return !e.diary || isUpcoming(e); });
      var state = { cat: "All", past: false };
      var target = location.hash.slice(1);
      if (target && items.some(function (e) { return e.id === target && !isUpcoming(e); })) state.past = true;
      var cats = ["All"].concat(Object.keys(TAG).filter(function (c) { return items.some(function (e) { return e.category === c; }); }));
      el.innerHTML = '<div class="filters"><div class="filter-group sl-cats">' + cats.map(function (c) { return '<button class="chip' + (c === "All" ? " active" : "") + '" data-v="' + c + '">' + c + "</button>"; }).join("") + "</div>" +
        '<label class="sl-past"><input type="checkbox"' + (state.past ? " checked" : "") + "> Show past events</label></div><div class=\"sl-body\"></div>";
      var body = el.querySelector(".sl-body");
      function draw() {
        var list = items.filter(function (e) { return (state.cat === "All" || e.category === state.cat) && (state.past || isUpcoming(e)); });
        if (!list.length) { body.innerHTML = '<p class="empty-note">Nothing to show for that filter.</p>'; return; }
        var groups = [], map = {};
        list.forEach(function (e) { var m = fmt(e.start, { month: "long", year: "numeric" }); if (!map[m]) { map[m] = []; groups.push(m); } map[m].push(e); });
        body.innerHTML = groups.map(function (m) {
          return '<h3 class="month-head">' + m + '</h3><ul class="season-list">' + map[m].map(function (e) {
            var s = soon(e);
            return '<li id="' + e.id + '" class="' + (isUpcoming(e) ? "" : "past") + '" style="--cc:' + TAG[e.category] + '">' +
              '<div class="sl-date"><b>' + fmt(e.start, { day: "numeric" }) + "</b><span>" + fmt(e.start, { weekday: "short" }) + "</span></div>" +
              '<div class="sl-main"><div class="sl-title">' + esc(e.title) + (s ? ' <span class="sc-soon">' + s + "</span>" : "") + "</div>" +
              '<div class="up-meta">' + [e.end ? "Until " + fmt(e.end, { weekday: "short", day: "numeric", month: "short" }) : "", e.time ? e.time.replace("–", " – ") : "All day", e.location, e.yearGroup, e.staff].filter(Boolean).map(esc).join(" · ") + "</div></div>" +
              '<div class="sl-side"><span class="sc-tag">' + esc(e.category) + "</span>" + (e.url ? '<a href="' + e.url + '" target="_blank" rel="noopener">Official ↗</a>' : "") + "</div></li>";
          }).join("") + "</ul>";
        }).join("");
        if (target) { var t = document.getElementById(target); if (t) { t.classList.add("hl"); t.scrollIntoView({ block: "center" }); } target = ""; }
      }
      el.querySelector(".sl-cats").addEventListener("click", function (ev) {
        var b = ev.target.closest(".chip"); if (!b) return;
        state.cat = b.getAttribute("data-v");
        el.querySelectorAll(".sl-cats .chip").forEach(function (c) { c.classList.toggle("active", c === b); });
        draw();
      });
      var pastBox = el.querySelector(".sl-past input");
      pastBox.addEventListener("change", function (ev) { state.past = ev.target.checked; draw(); });
      window.addEventListener("hashchange", function () {
        target = location.hash.slice(1);
        var hit = items.filter(function (e) { return e.id === target; })[0];
        if (!hit) return;
        if (!isUpcoming(hit)) { state.past = pastBox.checked = true; }
        if (state.cat !== "All" && hit.category !== state.cat) { state.cat = "All"; el.querySelectorAll(".sl-cats .chip").forEach(function (c) { c.classList.toggle("active", c.getAttribute("data-v") === "All"); }); }
        el.querySelectorAll(".season-list li.hl").forEach(function (li) { li.classList.remove("hl"); });
        draw();
      });
      draw();
    });
  });

  /* ---- "Next up" bar (sitewide) ---- */
  (function hypeBar() {
    try { if (sessionStorage.getItem("stamford-hype-x")) return; } catch (e) {}
    loadDates().then(function (all) {
      var ev = all.filter(function (e) { return isUpcoming(e) && e.category !== "Term dates"; })[0];
      if (!ev) return;
      var days = Math.round((new Date(ev.start + "T12:00:00") - new Date(iso(new Date()) + "T12:00:00")) / 864e5);
      var w = days <= 0 ? "today" : days === 1 ? "tomorrow" : "in " + days + " days";
      var bar = document.createElement("div");
      bar.className = "hype";
      bar.innerHTML = '<span class="bolt">●</span><span><b>Next up:</b> ' + esc(ev.title) + " — <b>" + w + "</b></span>" +
        '<a href="events.html#' + ev.id + '">Details →</a><button class="hype-close" aria-label="Dismiss">×</button>';
      document.body.insertBefore(bar, document.body.firstChild);
      bar.querySelector(".hype-close").addEventListener("click", function () { try { sessionStorage.setItem("stamford-hype-x", "1"); } catch (e) {} bar.remove(); });
    });
  })();

  /* ---- Parliament meetings table: <div data-parliament="full|compact"> (from parliament.json) ---- */
  (function parliament() {
    var els = document.querySelectorAll("[data-parliament]");
    if (!els.length) return;
    fetch("data/parliament.json").then(function (r) { return r.json(); }).then(function (p) {
      function v(x) { return x ? esc(x) : '<span class="pill-tbc">TBC</span>'; }
      function next(x) { return x ? esc(new Date(x).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })) : v(""); }
      els.forEach(function (el) {
        var full = el.getAttribute("data-parliament") === "full";
        var cols = full ? ["Department", "Covers", "Day", "Time", "Room", "Chair", "Next"] : ["Department", "Day", "Time", "Room", "Next"];
        var rows = p.departments.map(function (d) {
          var cells = { Department: '<td class="dn">' + esc(d.name) + "</td>", Covers: '<td class="cv" data-l="Covers">' + esc(d.covers) + "</td>",
            Day: '<td data-l="Day">' + v(d.day) + "</td>", Time: '<td data-l="Time">' + v(d.time) + "</td>", Room: '<td data-l="Room">' + v(d.room) + "</td>",
            Chair: '<td data-l="Chair">' + v(d.chair) + "</td>", Next: '<td data-l="Next">' + next(d.next) + "</td>" };
          return "<tr>" + cols.map(function (c) { return cells[c]; }).join("") + "</tr>";
        }).join("");
        el.innerHTML = '<table class="sched"><thead><tr>' + cols.map(function (c) { return "<th>" + c + "</th>"; }).join("") + "</tr></thead><tbody>" + rows + "</tbody></table>" +
          (p.placeholder ? '<p class="muted" style="font-size:.8rem;margin-top:8px">Meets ' + esc(p.frequency).toLowerCase() + ". Days are provisional until the timetable is confirmed.</p>" : "");
      });
    }).catch(function () {
      els.forEach(function (el) { el.innerHTML = '<p class="empty-note">Couldn\'t load the meeting schedule.</p>'; });
    });
  })();

  /* ---- Live house-points leaderboard (Google Sheet CSV) ---- */
  (function leaderboard() {
    var board = document.getElementById("scoreboard");
    if (!board || !CFG.scoresCsvUrl) return;
    var colors = {
      stamford: { dot: "#1a4fd6", bar: "#1a4fd6" }, bradbury: { dot: "#d12b2b", bar: "#d12b2b" },
      massey: { dot: "#1f9d4d", bar: "#1f9d4d" }, tatton: { dot: "#f5b800", bar: "#f5b800" }
    };
    fetch(CFG.scoresCsvUrl).then(function (r) { return r.text(); }).then(function (csv) {
      var rows = csv.trim().split(/\r?\n/).map(function (l) { return l.split(","); });
      if (rows.length && isNaN(parseFloat(rows[0][1]))) rows.shift();
      var data = rows.map(function (c) { return { name: (c[0] || "").trim(), pts: parseFloat(c[1]) || 0 }; })
        .filter(function (d) { return d.name; }).sort(function (a, b) { return b.pts - a.pts; });
      if (!data.length) return;
      var max = Math.max.apply(null, data.map(function (d) { return d.pts; })) || 1;
      board.innerHTML = data.map(function (d) {
        var c = colors[d.name.toLowerCase()] || { dot: "#2f8fd0", bar: "#2f8fd0" };
        return '<div class="score-row"><div class="house"><span class="dot" style="background:' + c.dot + '"></span>' +
          d.name + '</div><div class="score-bar"><i data-w="' + Math.round(d.pts / max * 100) + '" style="background:' + c.bar + '"></i></div><div class="score-val">' + d.pts.toLocaleString() + '</div></div>';
      }).join("");
      var cap = board.parentNode.querySelector(".muted");
      if (cap) cap.textContent = "Live house points · updates from the house spreadsheet.";
      requestAnimationFrame(function () { board.querySelectorAll(".score-bar > i").forEach(function (el) { el.style.width = el.getAttribute("data-w") + "%"; }); });
    }).catch(function () {});
  })();

  /* ---- Real form submission (Formspree) ---- */
  document.querySelectorAll("form[data-form]").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!CFG.formEndpoint) { if (window.stamfordToast) window.stamfordToast("Thanks! (Demo mode — add a Formspree link to send for real.)", "✉️"); f.reset(); return; }
      var btn = f.querySelector('[type="submit"]'); if (btn) btn.disabled = true;
      fetch(CFG.formEndpoint, { method: "POST", body: new FormData(f), headers: { "Accept": "application/json" } })
        .then(function (r) {
          if (r.ok) { if (window.stamfordToast) window.stamfordToast("Thanks — your message is on its way!", "✉️"); f.reset(); }
          else if (window.stamfordToast) window.stamfordToast("Hmm, that didn't send. Try emailing us instead.", "⚠");
        })
        .catch(function () { if (window.stamfordToast) window.stamfordToast("Network error — please try again.", "⚠"); })
        .finally(function () { if (btn) btn.disabled = false; });
    });
  });
})();
