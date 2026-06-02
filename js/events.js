/* Stamford House — interactive events calendar */
(function () {
  "use strict";
  var listEl = document.getElementById("events-list");
  if (!listEl) return;

  var catFilters = document.getElementById("cat-filters");
  var yearFilters = document.getElementById("year-filters");
  var countEl = document.getElementById("events-count");
  var state = { cat: "All", year: "All" };
  var ALL = [];

  function yearMatch(ev, sel) {
    if (sel === "All") return true;
    var g = (ev.yearGroup || "").toLowerCase();
    if (sel === "6th Form") return /12|13|6th/.test(g);
    if (sel === "All-years") return /all/.test(g);
    return g.indexOf(sel) !== -1;
  }

  function esc(s) { return (s || "").replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function render() {
    var items = ALL.filter(function (ev) {
      return (state.cat === "All" || ev.category === state.cat) && yearMatch(ev, state.year);
    });
    countEl.textContent = items.length + (items.length === 1 ? " event" : " events") + " shown";

    if (!items.length) { listEl.innerHTML = '<p class="muted">No events match those filters.</p>'; return; }

    // group by month, preserving JSON order
    var groups = [], map = {};
    items.forEach(function (ev) {
      if (!map[ev.month]) { map[ev.month] = []; groups.push(ev.month); }
      map[ev.month].push(ev);
    });

    listEl.innerHTML = groups.map(function (m) {
      var cards = map[m].map(function (ev) {
        var ethos = (ev.ethos || []).slice(0, 5).map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("");
        var meta = '<span><b>' + esc(ev.staff) + '</b></span><span>Year ' + esc(ev.yearGroup) + '</span><span>' + esc(ev.number) + '</span>';
        var notes = ev.notes ? '<div class="ec-notes">' + esc(ev.notes) + '</div>' : '';
        var flag = ev.flagship ? ' flagship' : '';
        var star = ev.flagship ? ' ★' : '';
        return '<article class="event-card glass' + flag + '">' +
          '<div class="ec-top"><span class="ec-date">' + esc(ev.dateLabel) + '</span>' +
          '<span class="ec-cat cat-' + ev.category + '">' + ev.category + '</span></div>' +
          '<h3>' + esc(ev.title) + star + '</h3>' +
          '<div class="ec-meta">' + meta + '</div>' +
          '<div class="ec-ethos">' + ethos + '</div>' + notes + '</article>';
      }).join("");
      return '<div class="month-block"><h2 class="month-head">' + esc(m) + '</h2><div class="event-grid">' + cards + '</div></div>';
    }).join("");
  }

  function buildChips(container, values, key, labels) {
    container.innerHTML = values.map(function (v, i) {
      var lbl = labels ? labels[i] : v;
      return '<button class="chip' + (v === state[key] ? ' active' : '') + '" data-val="' + v + '">' + lbl + '</button>';
    }).join("");
    container.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip"); if (!btn) return;
      state[key] = btn.getAttribute("data-val");
      container.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c === btn); });
      render();
    });
  }

  function startCountdown(events) {
    var box = document.getElementById("countdown");
    var nameEl = document.getElementById("cd-event");
    var dateEl = document.getElementById("cd-date");
    if (!box) return;
    var now = new Date();
    var upcoming = events.filter(function (e) { return e.date && new Date(e.date) >= new Date(now.toDateString()); })
                         .sort(function (a, b) { return new Date(a.date) - new Date(b.date); });
    if (!upcoming.length) { box.innerHTML = '<p class="muted">The season is complete — see you next year.</p>'; return; }
    var ev = upcoming[0];
    if (nameEl) nameEl.textContent = ev.title;
    if (dateEl) dateEl.textContent = ev.dateLabel + " · " + ev.month;
    function tick() {
      var diff = new Date(ev.date) - new Date();
      if (diff < 0) diff = 0;
      var d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, m = Math.floor(diff / 6e4) % 60, s = Math.floor(diff / 1e3) % 60;
      box.innerHTML = unit(d, "Days") + unit(h, "Hrs") + unit(m, "Min") + unit(s, "Sec");
    }
    function unit(n, l) { return '<div class="cd-unit glass"><div class="n">' + String(n).padStart(2, "0") + '</div><div class="l">' + l + '</div></div>'; }
    tick(); setInterval(tick, 1000);
  }

  fetch("data/events.json")
    .then(function (r) { return r.json(); })
    .then(function (data) {
      ALL = data.events;
      var cats = ["All"].concat(data.categories);
      buildChips(catFilters, cats, "cat");
      buildChips(yearFilters, ["All", "7", "8", "9", "10", "11", "6th Form", "All-years"], "year",
                 ["All", "Yr 7", "Yr 8", "Yr 9", "Yr 10", "Yr 11", "6th Form", "Whole school"]);
      render();
      startCountdown(ALL);
    })
    .catch(function () {
      listEl.innerHTML = '<p class="muted">Could not load the events data. If you are viewing this file directly, run a local server (e.g. <code>python3 -m http.server</code>) so the calendar can fetch its data.</p>';
    });
})();
