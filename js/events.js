/* Stamford House — interactive events calendar (v2) */
(function () {
  "use strict";
  var listEl = document.getElementById("events-list");
  if (!listEl) return;

  var catFilters = document.getElementById("cat-filters");
  var yearFilters = document.getElementById("year-filters");
  var countEl = document.getElementById("events-count");
  var searchEl = document.getElementById("events-search");
  var monthNav = document.getElementById("month-nav");
  var statsEl = document.getElementById("season-stats");
  var state = { cat: "All", year: "All", q: "", view: "grid" };
  var ALL = [];

  function yearMatch(ev, sel) {
    if (sel === "All") return true;
    var g = (ev.yearGroup || "").toLowerCase();
    if (sel === "6th Form") return /12|13|6th/.test(g);
    if (sel === "All-years") return /all/.test(g);
    return g.indexOf(sel) !== -1;
  }
  function textMatch(ev, q) {
    if (!q) return true;
    var hay = (ev.title + " " + ev.staff + " " + ev.category + " " + (ev.ethos || []).join(" ") + " " + ev.notes).toLowerCase();
    return hay.indexOf(q.toLowerCase()) !== -1;
  }
  function esc(s) { return (s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function slug(s) { return s.replace(/[^a-z0-9]+/gi, "-").toLowerCase(); }

  function filtered() {
    return ALL.filter(function (ev) {
      return (state.cat === "All" || ev.category === state.cat) && yearMatch(ev, state.year) && textMatch(ev, state.q);
    });
  }

  function render() {
    var items = filtered();
    countEl.textContent = items.length + (items.length === 1 ? " event" : " events") + " shown";
    listEl.classList.toggle("list", state.view === "list");

    // update chip counts (respect year + search, ignore category)
    if (catFilters) {
      catFilters.querySelectorAll(".chip").forEach(function (chip) {
        var c = chip.getAttribute("data-val");
        var n = ALL.filter(function (ev) { return (c === "All" || ev.category === c) && yearMatch(ev, state.year) && textMatch(ev, state.q); }).length;
        var span = chip.querySelector(".n"); if (span) span.textContent = n;
      });
    }

    if (!items.length) { listEl.innerHTML = '<p class="muted">No events match those filters. Try clearing the search.</p>'; if (monthNav) monthNav.innerHTML = ""; return; }

    var groups = [], map = {};
    items.forEach(function (ev) { if (!map[ev.month]) { map[ev.month] = []; groups.push(ev.month); } map[ev.month].push(ev); });

    if (monthNav) monthNav.innerHTML = groups.map(function (m) { return '<a href="#m-' + slug(m) + '">' + esc(m.replace(/ 20\d\d/, "")) + '</a>'; }).join("");

    listEl.innerHTML = groups.map(function (m) {
      var cards = map[m].map(function (ev, idx) {
        var ethos = (ev.ethos || []).slice(0, 5).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
        var meta = '<span><b>' + esc(ev.staff) + '</b></span><span>Year ' + esc(ev.yearGroup) + '</span><span>' + esc(ev.number) + '</span>';
        var notes = ev.notes ? '<div class="ec-notes">' + esc(ev.notes) + '</div>' : '';
        var ics = ev.date ? '<div class="ec-actions"><button class="ics-btn" data-ics="' + esc(ev.month) + '|' + idx + '">+ Add to calendar</button></div>' : '';
        var star = ev.flagship ? ' ★' : '';
        return '<article class="event-card glass' + (ev.flagship ? ' flagship' : '') + '">' +
          '<div class="ec-top"><span class="ec-date">' + esc(ev.dateLabel) + '</span><span class="ec-cat cat-' + ev.category + '">' + ev.category + '</span></div>' +
          '<h3>' + esc(ev.title) + star + '</h3><div class="ec-meta">' + meta + '</div>' +
          '<div class="ec-ethos">' + ethos + '</div>' + notes + ics + '</article>';
      }).join("");
      return '<div class="month-block" id="m-' + slug(m) + '"><h2 class="month-head">' + esc(m) + '</h2><div class="event-grid">' + cards + '</div></div>';
    }).join("");

    // wire ics buttons
    listEl.querySelectorAll(".ics-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var parts = btn.getAttribute("data-ics").split("|");
        var ev = map[parts[0]][parseInt(parts[1], 10)];
        downloadIcs(ev);
      });
    });
  }

  function pad(n) { return String(n).padStart(2, "0"); }
  function downloadIcs(ev) {
    var d = new Date(ev.date);
    var start = d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate());
    var end = new Date(d.getTime() + 864e5);
    var endStr = end.getFullYear() + pad(end.getMonth() + 1) + pad(end.getDate());
    var body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Stamford House AGSB//EN", "BEGIN:VEVENT",
      "UID:" + slug(ev.title) + "-" + start + "@stamford-agsb",
      "DTSTAMP:" + start + "T090000",
      "DTSTART;VALUE=DATE:" + start, "DTEND;VALUE=DATE:" + endStr,
      "SUMMARY:Stamford — " + ev.title,
      "DESCRIPTION:" + (ev.notes || "").replace(/[,;]/g, " ") + " (Staff: " + ev.staff + ", Year " + ev.yearGroup + ")",
      "END:VEVENT", "END:VCALENDAR"].join("\r\n");
    var blob = new Blob([body], { type: "text/calendar" });
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = slug(ev.title) + ".ics";
    document.body.appendChild(a); a.click(); a.remove();
    if (window.stamfordToast) window.stamfordToast("Added “" + ev.title + "” to your calendar", "📅");
  }

  function buildChips(container, values, key, labels, withCount) {
    container.innerHTML = values.map(function (v, i) {
      var lbl = labels ? labels[i] : v;
      var count = withCount ? ' <span class="n"></span>' : '';
      return '<button class="chip' + (v === state[key] ? ' active' : '') + '" data-val="' + v + '">' + lbl + count + '</button>';
    }).join("");
    container.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip"); if (!btn) return;
      state[key] = btn.getAttribute("data-val");
      container.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c === btn); });
      render();
    });
  }

  function renderStats() {
    if (!statsEl) return;
    var by = function (c) { return ALL.filter(function (e) { return e.category === c; }).length; };
    var months = {}; ALL.forEach(function (e) { months[e.month] = 1; });
    var data = [
      { n: ALL.length, l: "House events" },
      { n: by("Sport"), l: "Sporting" },
      { n: by("Academic"), l: "Academic" },
      { n: by("Performance") + by("Arts"), l: "Arts & stage" },
      { n: Object.keys(months).length, l: "Months of action" }
    ];
    statsEl.innerHTML = data.map(function (d) { return '<div class="ss glass"><div class="n gradient-text" data-count="' + d.n + '">0</div><div class="l">' + d.l + '</div></div>'; }).join("");
    if ("IntersectionObserver" in window && window.stamfordCountUp) {
      var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { window.stamfordCountUp(x.target); io.unobserve(x.target); } }); }, { threshold: 0.5 });
      statsEl.querySelectorAll("[data-count]").forEach(function (el) { io.observe(el); });
    }
  }

  function startCountdown(events) {
    var box = document.getElementById("countdown"), nameEl = document.getElementById("cd-event"), dateEl = document.getElementById("cd-date");
    if (!box) return;
    var now = new Date();
    var up = events.filter(function (e) { return e.date && new Date(e.date) >= new Date(now.toDateString()); }).sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
    if (!up.length) { box.innerHTML = '<p class="muted">The season is complete — see you next year.</p>'; if (nameEl) nameEl.textContent = "That's a wrap on 2025/26"; return; }
    var ev = up[0];
    if (nameEl) nameEl.textContent = ev.title;
    if (dateEl) dateEl.textContent = ev.dateLabel + " · " + ev.month;
    function unit(n, l) { return '<div class="cd-unit glass"><div class="n">' + pad(n) + '</div><div class="l">' + l + '</div></div>'; }
    function tick() {
      var diff = Math.max(0, new Date(ev.date) - new Date());
      box.innerHTML = unit(Math.floor(diff / 864e5), "Days") + unit(Math.floor(diff / 36e5) % 24, "Hrs") + unit(Math.floor(diff / 6e4) % 60, "Min") + unit(Math.floor(diff / 1e3) % 60, "Sec");
    }
    tick(); setInterval(tick, 1000);
  }

  // search + view wiring
  if (searchEl) searchEl.addEventListener("input", function () { state.q = searchEl.value.trim(); render(); });
  var vt = document.getElementById("view-toggle");
  if (vt) vt.addEventListener("click", function (e) { var b = e.target.closest("button"); if (!b) return; state.view = b.getAttribute("data-view"); vt.querySelectorAll("button").forEach(function (x) { x.classList.toggle("active", x === b); }); render(); });

  fetch("data/events.json").then(function (r) { return r.json(); }).then(function (data) {
    ALL = data.events;
    buildChips(catFilters, ["All"].concat(data.categories), "cat", null, true);
    buildChips(yearFilters, ["All", "7", "8", "9", "10", "11", "6th Form", "All-years"], "year", ["All", "Yr 7", "Yr 8", "Yr 9", "Yr 10", "Yr 11", "6th Form", "Whole school"], false);
    renderStats();
    render();
    startCountdown(ALL);
  }).catch(function () {
    listEl.innerHTML = '<p class="muted">Could not load the events data. If viewing the file directly, run a local server (<code>python3 -m http.server</code>) so the calendar can fetch its data.</p>';
  });
})();
