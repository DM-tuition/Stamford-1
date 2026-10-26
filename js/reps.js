/* AGSB Houses — house reps directory (reads data/reps.json) */
(function () {
  var root = document.getElementById("reps");
  if (!root) return;

  var HOUSES = ["Bradbury", "Massey", "Stamford", "Tatton"];
  var COLOUR = { Bradbury: "#d12b2b", Massey: "#1f9d4d", Stamford: "#1a4fd6", Tatton: "#f5b800" };
  var state = { house: "All", year: "All", q: "" };
  var data = null;

  // ?house=stamford preselects a house (used by links from the house sites)
  var ph = new URLSearchParams(location.search).get("house");
  if (ph) {
    ph = ph.charAt(0).toUpperCase() + ph.slice(1).toLowerCase();
    if (HOUSES.indexOf(ph) > -1) state.house = ph;
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function email(year, house) { return data.emailFormat.replace("{year}", year).replace("{House}", house); }

  function chips(el, values, key) {
    el.innerHTML = values.map(function (v) {
      var label = key === "year" && v !== "All" ? "Year " + v : v;
      var dot = key === "house" && v !== "All" ? '<span class="dot" style="background:' + COLOUR[v] + ';display:inline-block;margin-right:7px"></span>' : "";
      return '<button class="chip' + (String(state[key]) === String(v) ? " active" : "") + '" data-v="' + v + '">' + dot + label + "</button>";
    }).join("");
    el.addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      state[key] = b.getAttribute("data-v");
      el.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("active", c === b); });
      render();
    });
  }

  function render() {
    var houses = state.house === "All" ? HOUSES : [state.house];
    var q = state.q.trim().toLowerCase();
    var shown = 0;
    var html = data.years.filter(function (y) { return state.year === "All" || String(y.year) === state.year; }).map(function (y) {
      var rows = y.forms.filter(function (f) {
        if (!q) return true;
        return f.form.toLowerCase().indexOf(q) > -1 || houses.some(function (h) { return f[h].toLowerCase().indexOf(q) > -1; });
      });
      if (!rows.length) return "";
      shown += rows.length * houses.length;
      var head = houses.map(function (h) {
        var mail = email(y.year, h);
        return '<th style="--hc:' + COLOUR[h] + '"><span class="rh-name">' + h + '</span>' +
          '<a class="rh-mail" href="mailto:' + mail + '" title="Email all Year ' + y.year + " " + h + ' reps">✉ ' + mail + "</a></th>";
      }).join("");
      var body = rows.map(function (f) {
        return '<tr><td class="rf">' + esc(f.form) + "</td>" + houses.map(function (h) {
          var hit = q && f[h].toLowerCase().indexOf(q) > -1;
          return '<td' + (hit ? ' class="hit"' : "") + ">" + esc(f[h]) + "</td>";
        }).join("") + "</tr>";
      }).join("");
      return '<div class="rep-year reveal in"><h3 class="month-head">Year ' + y.year + '</h3>' +
        '<div class="rep-scroll"><table class="rep-table' + (houses.length === 1 ? " one" : "") + '"><thead><tr><th>Form</th>' + head + "</tr></thead><tbody>" + body + "</tbody></table></div></div>";
    }).join("");
    root.innerHTML = html || '<p class="muted">No reps match that search.</p>';
    document.getElementById("reps-count").textContent = "Showing " + shown + " rep" + (shown === 1 ? "" : "s");
  }

  function directory() {
    var el = document.getElementById("reps-lists");
    if (!el) return;
    el.innerHTML = HOUSES.map(function (h) {
      return '<div class="list-card" style="--hc:' + COLOUR[h] + '"><h4>' + h + "</h4><ul>" + data.years.map(function (y) {
        var mail = email(y.year, h);
        return '<li><span>Year ' + y.year + '</span><button class="copy-mini" data-copy="' + mail + '" title="Copy address">' + mail + "</button></li>";
      }).join("") + "</ul></div>";
    }).join("");
  }

  fetch("data/reps.json").then(function (r) { return r.json(); }).then(function (d) {
    data = d;
    chips(document.getElementById("rep-house"), ["All"].concat(HOUSES), "house");
    chips(document.getElementById("rep-year"), ["All"].concat(d.years.map(function (y) { return y.year; })), "year");
    document.getElementById("rep-search").addEventListener("input", function (e) { state.q = e.target.value; render(); });
    render();
    directory();
  }).catch(function () {
    root.innerHTML = '<p class="muted">Could not load the reps list. If viewing the file directly, run a local server (<code>python3 -m http.server</code>).</p>';
  });
})();
