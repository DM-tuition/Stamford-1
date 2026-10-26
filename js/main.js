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

  /* ---- "Next event" bar (sitewide, from events.json) ---- */
  (function hypeBar() {
    if (sessionStorage.getItem("stamford-hype-x")) return;
    fetch("data/events.json").then(function (r) { return r.json(); }).then(function (data) {
      var now = new Date(new Date().toDateString());
      var up = (data.events || []).filter(function (e) { return e.date && new Date(e.date) >= now; })
        .sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
      if (!up.length) return;
      var ev = up[0];
      var days = Math.ceil((new Date(ev.date) - now) / 864e5);
      var when = days <= 0 ? "today" : days === 1 ? "tomorrow" : "in " + days + " days";
      var bar = document.createElement("div");
      bar.className = "hype";
      bar.innerHTML = '<span class="bolt">●</span><span><b>Next up:</b> ' + ev.title + ' — <b>' + when + '</b></span>' +
        '<a href="events.html">See the calendar →</a><button class="hype-close" aria-label="Dismiss">×</button>';
      document.body.insertBefore(bar, document.body.firstChild);
      bar.querySelector(".hype-close").addEventListener("click", function () { sessionStorage.setItem("stamford-hype-x", "1"); bar.remove(); });
    }).catch(function () {});
  })();

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function yearLabel(y) { if (!y) return ""; if (/^all/i.test(y)) return "All years"; return /^\d/.test(y) ? "Year " + y : y; }

  /* ---- "Coming up" list: <div data-upcoming="5"> (next dated events from events.json) ---- */
  (function upcoming() {
    var els = document.querySelectorAll("[data-upcoming]");
    if (!els.length) return;
    fetch("data/events.json").then(function (r) { return r.json(); }).then(function (data) {
      var now = new Date(new Date().toDateString());
      var up = (data.events || []).filter(function (e) { return e.date && new Date(e.date) >= now; })
        .sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
      els.forEach(function (el) {
        if (!up.length) {
          el.innerHTML = '<p class="empty-note">No upcoming events in the diary yet. New dates will appear here as soon as they\'re added.</p>';
          return;
        }
        var n = parseInt(el.getAttribute("data-upcoming"), 10) || 5;
        el.innerHTML = '<ul class="upcoming">' + up.slice(0, n).map(function (e) {
          var d = new Date(e.date);
          var meta = [yearLabel(e.yearGroup), e.staff].filter(Boolean).map(esc).join(" · ");
          return '<li><div class="up-date"><b>' + d.getDate() + "</b><span>" + d.toLocaleString("en-GB", { month: "short" }) + "</span></div>" +
            '<div><div class="up-title">' + esc(e.title) + '</div><div class="up-meta">' + meta + "</div></div>" +
            '<span class="up-cat">' + esc(e.category) + "</span></li>";
        }).join("") + "</ul>";
      });
    }).catch(function () {
      els.forEach(function (el) { el.innerHTML = '<p class="empty-note">Couldn\'t load events.</p>'; });
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
