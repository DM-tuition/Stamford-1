/* Stamford House — futuristic interactions */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Theme (dark-first, persisted) ---- */
  var root = document.documentElement;
  var saved = localStorage.getItem("stamford-theme");
  if (saved) root.setAttribute("data-theme", saved);
  function toggleTheme() {
    var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("stamford-theme", next);
    var t = document.querySelector(".theme-toggle");
    if (t) t.textContent = next === "light" ? "☾" : "☀";
  }
  document.addEventListener("click", function (e) {
    if (e.target.closest(".theme-toggle")) toggleTheme();
  });
  (function initToggleIcon() {
    var t = document.querySelector(".theme-toggle");
    if (t) t.textContent = root.getAttribute("data-theme") === "light" ? "☾" : "☀";
  })();

  /* ---- Mobile nav ---- */
  document.addEventListener("click", function (e) {
    var toggle = e.target.closest(".nav-toggle");
    var links = document.querySelector(".nav-links");
    if (toggle && links) {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    } else if (e.target.tagName === "A" && links) {
      links.classList.remove("open");
    }
  });

  /* ---- Footer year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Scroll progress ---- */
  var bar = document.querySelector(".scroll-progress");
  if (bar) {
    window.addEventListener("scroll", function () {
      var h = document.documentElement;
      var pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      bar.style.width = pct + "%";
    }, { passive: true });
  }

  /* ---- Custom cursor ---- */
  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    var cur = document.createElement("div");
    cur.className = "cursor-glow";
    document.body.appendChild(cur);
    var cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
      cur.style.left = cx + "px"; cur.style.top = cy + "px";
      requestAnimationFrame(loop);
    })();
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest("a, button, .card, .event-card, .chip")) cur.classList.add("grow");
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest("a, button, .card, .event-card, .chip")) cur.classList.remove("grow");
    });
  }

  /* ---- Scroll reveal ---- */
  var revs = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revs.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    revs.forEach(function (el) { io.observe(el); });
  } else {
    revs.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Count up ---- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduced || isNaN(target)) { el.textContent = (el.getAttribute("data-raw") || target) + suffix; return; }
    var start = 0, dur = 1400, t0 = performance.now();
    (function step(now) {
      var p = Math.min((now - t0) / dur, 1);
      var val = Math.floor((start + (target - start) * (1 - Math.pow(1 - p, 3))));
      el.textContent = val + suffix;
      if (p < 1) requestAnimationFrame(step); else el.textContent = (el.getAttribute("data-raw") || target) + suffix;
    })(t0);
  }
  var nums = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window && nums.length) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { countUp(en.target); io2.unobserve(en.target); } });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { io2.observe(el); });
  }

  /* ---- Scoreboard bars ---- */
  var bars = document.querySelectorAll(".score-bar > i");
  if ("IntersectionObserver" in window && bars.length) {
    var io3 = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.style.width = en.target.getAttribute("data-w") + "%"; io3.unobserve(en.target); } });
    }, { threshold: 0.4 });
    bars.forEach(function (el) { io3.observe(el); });
  }

  /* ---- Magnetic buttons ---- */
  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".btn").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.25 + "px," + (e.clientY - r.top - r.height / 2) * 0.3 + "px)";
      });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
  }

  /* ---- Crest 3D tilt ---- */
  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    var crest = document.querySelector(".hero-crest");
    var inner = document.querySelector(".hero-crest__inner");
    if (crest && inner) {
      crest.addEventListener("mousemove", function (e) {
        var r = crest.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -18;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 18;
        inner.style.transform = "rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
      });
      crest.addEventListener("mouseleave", function () { inner.style.transform = ""; });
    }
  }

  /* ---- Card tilt ---- */
  if (!reduced && window.matchMedia("(hover: hover)").matches) {
    document.querySelectorAll("[data-tilt]").forEach(function (c) {
      c.addEventListener("mousemove", function (e) {
        var r = c.getBoundingClientRect();
        var rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
        var ry = ((e.clientX - r.left) / r.width - 0.5) * 8;
        c.style.transform = "perspective(700px) rotateX(" + rx + "deg) rotateY(" + ry + "deg) translateY(-6px)";
      });
      c.addEventListener("mouseleave", function () { c.style.transform = ""; });
    });
  }

  /* ---- Starfield particles ---- */
  var canvas = document.getElementById("starfield");
  if (canvas && !reduced) {
    var ctx = canvas.getContext("2d"), stars = [], W, H, raf;
    function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; build(); }
    function build() {
      stars = [];
      var count = Math.min(110, Math.floor(W * H / 14000));
      for (var i = 0; i < count; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + 0.3, vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18, a: Math.random() * 0.6 + 0.2 });
    }
    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x = W; if (s.x > W) s.x = 0; if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283);
        ctx.fillStyle = "rgba(150,190,255," + s.a + ")"; ctx.fill();
        for (var j = i + 1; j < stars.length; j++) {
          var dx = s.x - stars[j].x, dy = s.y - stars[j].y, d = dx * dx + dy * dy;
          if (d < 11000) { ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(stars[j].x, stars[j].y); ctx.strokeStyle = "rgba(90,130,255," + (0.12 * (1 - d / 11000)) + ")"; ctx.stroke(); }
        }
      }
      raf = requestAnimationFrame(tick);
    }
    addEventListener("resize", resize); resize(); tick();
  }

  /* ---- Page transition ---- */
  if (!reduced) {
    var curtain = document.createElement("div");
    curtain.className = "curtain";
    document.body.appendChild(curtain);
    document.querySelectorAll('a[href$=".html"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href");
        if (a.target === "_blank" || e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        curtain.classList.add("play");
        setTimeout(function () { window.location.href = href; }, 360);
      });
    });
  }
})();
