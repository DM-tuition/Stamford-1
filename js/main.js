/* Stamford House — futuristic interactions (v2) */
(function () {
  "use strict";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canHover = window.matchMedia("(hover: hover)").matches;

  /* ---- Preloader (injected before first paint) ---- */
  (function preloader() {
    var pl = document.createElement("div");
    pl.className = "preloader";
    pl.innerHTML = '<div style="text-align:center">' +
      '<img class="pl-crest" src="assets/crest.svg" alt="" />' +
      '<div class="pl-bar"><i></i></div>' +
      '<div class="pl-word">Stamford</div></div>';
    (document.body || document.documentElement).appendChild(pl);
    function hide() { pl.classList.add("done"); setTimeout(function () { pl.remove(); }, 700); }
    if (reduced) { hide(); return; }
    window.addEventListener("load", function () { setTimeout(hide, 650); });
    setTimeout(hide, 2200); // safety
  })();

  /* ---- Global chrome injection ---- */
  function inject() {
    var body = document.body;
    // skip link
    var skip = document.createElement("a");
    skip.className = "skip-link"; skip.href = "#main"; skip.textContent = "Skip to content";
    body.insertBefore(skip, body.firstChild);
    var main = document.querySelector("main") || document.querySelector(".hero, .page-hero");
    if (main && !main.id) main.id = "main";
    // grain
    var grain = document.createElement("div"); grain.className = "grain"; body.appendChild(grain);
    // toasts
    var toasts = document.createElement("div"); toasts.className = "toasts"; toasts.id = "toasts"; body.appendChild(toasts);
    // back to top
    var top = document.createElement("button"); top.className = "to-top"; top.setAttribute("aria-label", "Back to top"); top.innerHTML = "↑"; body.appendChild(top);
    top.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }); });
    window.addEventListener("scroll", function () { top.classList.toggle("show", window.scrollY > 600); }, { passive: true });
    // social meta
    var head = document.head;
    function meta(a, v, c) { var m = document.createElement("meta"); m.setAttribute(a, v); m.content = c; head.appendChild(m); }
    var desc = (document.querySelector('meta[name="description"]') || {}).content || "Stamford House, AGSB.";
    meta("name", "theme-color", "#04081e");
    meta("property", "og:title", document.title);
    meta("property", "og:type", "website");
    meta("property", "og:description", desc);
    meta("name", "twitter:card", "summary_large_image");
  }
  inject();

  /* ---- Toast helper ---- */
  window.stamfordToast = function (msg, icon) {
    var box = document.getElementById("toasts"); if (!box) return;
    var t = document.createElement("div"); t.className = "toast";
    t.innerHTML = '<span class="ic">' + (icon || "✓") + '</span><span>' + msg + '</span>';
    box.appendChild(t);
    setTimeout(function () { t.classList.add("out"); setTimeout(function () { t.remove(); }, 300); }, 3200);
  };

  /* ---- Copy to clipboard ---- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-copy]"); if (!el) return;
    var val = el.getAttribute("data-copy");
    if (navigator.clipboard) navigator.clipboard.writeText(val).then(function () { window.stamfordToast("Copied: " + val, "📋"); });
    else window.stamfordToast(val, "📋");
  });

  /* ---- Theme ---- */
  var root = document.documentElement;
  var saved = localStorage.getItem("stamford-theme");
  if (saved) root.setAttribute("data-theme", saved);
  function setIcon() { var t = document.querySelector(".theme-toggle"); if (t) t.textContent = root.getAttribute("data-theme") === "light" ? "☾" : "☀"; }
  setIcon();
  document.addEventListener("click", function (e) {
    if (e.target.closest(".theme-toggle")) {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next); localStorage.setItem("stamford-theme", next); setIcon();
    }
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

  /* ---- Scroll progress + header hide ---- */
  var bar = document.querySelector(".scroll-progress");
  var header = document.querySelector(".site-header");
  var lastY = 0;
  window.addEventListener("scroll", function () {
    var h = document.documentElement;
    if (bar) bar.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%";
    var y = window.scrollY;
    if (header) {
      if (y > lastY && y > 200) header.classList.add("hide");
      else header.classList.remove("hide");
    }
    lastY = y;
  }, { passive: true });

  /* ---- Custom cursor ---- */
  if (!reduced && canHover) {
    var cur = document.createElement("div"); cur.className = "cursor-glow"; document.body.appendChild(cur);
    var cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; });
    (function loop() { cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2; cur.style.left = cx + "px"; cur.style.top = cy + "px"; requestAnimationFrame(loop); })();
    document.addEventListener("mouseover", function (e) { if (e.target.closest("a,button,.card,.event-card,.chip,summary")) cur.classList.add("grow"); });
    document.addEventListener("mouseout", function (e) { if (e.target.closest("a,button,.card,.event-card,.chip,summary")) cur.classList.remove("grow"); });
  }

  /* ---- Scroll reveal ---- */
  function observeReveals() {
    var revs = document.querySelectorAll(".reveal:not(.in)");
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
      }, { threshold: 0.12 });
      revs.forEach(function (el) { io.observe(el); });
    } else { revs.forEach(function (el) { el.classList.add("in"); }); }
  }
  observeReveals();
  window.stamfordObserveReveals = observeReveals;

  /* ---- Count up ---- */
  window.stamfordCountUp = function (el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var raw = el.getAttribute("data-raw");
    if (reduced || isNaN(target)) { el.textContent = (raw || target) + suffix; return; }
    var dur = 1400, t0 = performance.now();
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

  /* ---- Magnetic buttons ---- */
  if (!reduced && canHover) {
    document.querySelectorAll(".btn").forEach(function (b) {
      b.addEventListener("mousemove", function (e) { var r = b.getBoundingClientRect(); b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.25 + "px," + (e.clientY - r.top - r.height / 2) * 0.3 + "px)"; });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
  }

  /* ---- Crest + card tilt ---- */
  if (!reduced && canHover) {
    var crest = document.querySelector(".hero-crest"), inner = document.querySelector(".hero-crest__inner");
    if (crest && inner) {
      crest.addEventListener("mousemove", function (e) { var r = crest.getBoundingClientRect(); inner.style.transform = "rotateX(" + (((e.clientY - r.top) / r.height - 0.5) * -18) + "deg) rotateY(" + (((e.clientX - r.left) / r.width - 0.5) * 18) + "deg)"; });
      crest.addEventListener("mouseleave", function () { inner.style.transform = ""; });
    }
    document.querySelectorAll("[data-tilt]").forEach(function (c) {
      c.addEventListener("mousemove", function (e) { var r = c.getBoundingClientRect(); c.style.transform = "perspective(700px) rotateX(" + (((e.clientY - r.top) / r.height - 0.5) * -8) + "deg) rotateY(" + (((e.clientX - r.left) / r.width - 0.5) * 8) + "deg) translateY(-6px)"; });
      c.addEventListener("mouseleave", function () { c.style.transform = ""; });
    });
  }

  /* ---- Starfield ---- */
  var canvas = document.getElementById("starfield");
  if (canvas && !reduced) {
    var ctx = canvas.getContext("2d"), stars = [], W, H;
    function build() { stars = []; var n = Math.min(110, Math.floor(W * H / 14000)); for (var i = 0; i < n; i++) stars.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.6 + 0.3, vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18, a: Math.random() * 0.6 + 0.2 }); }
    function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; build(); }
    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i]; s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x = W; if (s.x > W) s.x = 0; if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fillStyle = "rgba(150,190,255," + s.a + ")"; ctx.fill();
        for (var j = i + 1; j < stars.length; j++) { var dx = s.x - stars[j].x, dy = s.y - stars[j].y, d = dx * dx + dy * dy; if (d < 11000) { ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(stars[j].x, stars[j].y); ctx.strokeStyle = "rgba(90,130,255," + (0.12 * (1 - d / 11000)) + ")"; ctx.stroke(); } }
      }
      requestAnimationFrame(tick);
    }
    addEventListener("resize", resize); resize(); tick();
  }

  /* ---- Quote carousel ---- */
  document.querySelectorAll(".carousel").forEach(function (car) {
    var slides = car.querySelectorAll(".slide"); if (slides.length < 2) return;
    var dots = car.querySelector(".dots"), i = 0, timer;
    slides.forEach(function (_, k) { var b = document.createElement("button"); b.setAttribute("aria-label", "Slide " + (k + 1)); if (k === 0) b.classList.add("active"); b.addEventListener("click", function () { go(k); restart(); }); dots.appendChild(b); });
    function go(n) { slides[i].classList.remove("active"); dots.children[i].classList.remove("active"); i = (n + slides.length) % slides.length; slides[i].classList.add("active"); dots.children[i].classList.add("active"); }
    function restart() { if (reduced) return; clearInterval(timer); timer = setInterval(function () { go(i + 1); }, 6000); }
    slides[0].classList.add("active"); restart();
    car.addEventListener("mouseenter", function () { clearInterval(timer); });
    car.addEventListener("mouseleave", restart);
  });

  /* ---- Scroll-spy ---- */
  var spied = document.querySelectorAll("[data-spy]");
  if (spied.length && "IntersectionObserver" in window) {
    var spy = document.createElement("nav"); spy.className = "spy"; spy.setAttribute("aria-label", "Section navigation");
    spied.forEach(function (sec, k) {
      if (!sec.id) sec.id = "spy-" + k;
      var a = document.createElement("a"); a.href = "#" + sec.id; if (k === 0) a.classList.add("active");
      a.innerHTML = '<span>' + sec.getAttribute("data-spy") + '</span>';
      spy.appendChild(a);
    });
    document.body.appendChild(spy);
    var links = spy.querySelectorAll("a");
    var spyIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { links.forEach(function (l) { l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id); }); }
      });
    }, { threshold: 0.5 });
    spied.forEach(function (s) { spyIo.observe(s); });
  }

  /* ---- Split text into characters ---- */
  function splitChars(el, gradChars) {
    var i = 0;
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          if (!n.textContent.trim()) return;
          var frag = document.createDocumentFragment();
          n.textContent.split("").forEach(function (ch) {
            if (ch === " ") { frag.appendChild(document.createTextNode(" ")); return; }
            var s = document.createElement("span");
            s.className = "char" + (gradChars ? " char--grad" : "");
            s.textContent = ch; s.style.setProperty("--i", i++);
            frag.appendChild(s);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) {
          if (!gradChars && n.classList.contains("gradient-text")) { n.classList.add("char"); n.style.setProperty("--i", i++); }
          else walk(n);
        }
      });
    })(el);
  }

  if (!reduced) {
    // Floating hero word (per-letter gradient)
    document.querySelectorAll(".hero h1 .gradient-text").forEach(function (g) {
      g.classList.add("floaty"); splitChars(g, true);
    });
    // Letter-by-letter reveal on headings
    var splitTargets = document.querySelectorAll(".section-title, .page-hero h1");
    splitTargets.forEach(function (h) { h.setAttribute("data-split", ""); splitChars(h, false); });
    if ("IntersectionObserver" in window) {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); sio.unobserve(en.target); } });
      }, { threshold: 0.2 });
      document.querySelectorAll("[data-split]").forEach(function (h) { sio.observe(h); });
    } else { document.querySelectorAll("[data-split]").forEach(function (h) { h.classList.add("in"); }); }
  }

  /* ---- Drifting background orbs ---- */
  if (!reduced) {
    var heroEl = document.querySelector(".hero") || document.querySelector(".page-hero");
    if (heroEl) {
      [{ s: 280, x: "6%", y: "18%", c: "rgba(42,75,255,.5)", t: 17, d: 0 },
       { s: 200, x: "80%", y: "10%", c: "rgba(111,214,255,.4)", t: 21, d: 2 },
       { s: 170, x: "64%", y: "70%", c: "rgba(47,143,208,.4)", t: 15, d: 1 }].forEach(function (o) {
        var el = document.createElement("span"); el.className = "orb";
        el.style.cssText = "width:" + o.s + "px;height:" + o.s + "px;left:" + o.x + ";top:" + o.y +
          ";background:radial-gradient(circle," + o.c + ",transparent 70%);animation:floatOrb " + o.t + "s ease-in-out infinite;animation-delay:" + o.d + "s;";
        heroEl.insertBefore(el, heroEl.firstChild);
      });
    }
  }

  /* ---- Sparkle burst ---- */
  window.stamfordSparkle = function (x, y, count) {
    if (reduced) return;
    var glyphs = ["✦", "✧", "✺", "＊", "•"], colors = ["#6fd6ff", "#4d6bff", "#9fc4ff", "#ffffff"];
    for (var i = 0; i < (count || 16); i++) {
      var s = document.createElement("span"); s.className = "spark";
      s.textContent = glyphs[(Math.random() * glyphs.length) | 0];
      s.style.left = x + "px"; s.style.top = y + "px";
      s.style.color = colors[(Math.random() * colors.length) | 0];
      s.style.fontSize = (8 + Math.random() * 12) + "px";
      document.body.appendChild(s);
      var a = Math.random() * Math.PI * 2, dist = 40 + Math.random() * 95;
      var dx = Math.cos(a) * dist, dy = Math.sin(a) * dist - 20;
      (function (node) {
        node.animate([
          { transform: "translate(-50%,-50%) scale(1) rotate(0deg)", opacity: 1 },
          { transform: "translate(calc(-50% + " + dx + "px),calc(-50% + " + dy + "px)) scale(0) rotate(" + (Math.random() * 360) + "deg)", opacity: 0 }
        ], { duration: 700 + Math.random() * 500, easing: "cubic-bezier(.2,.7,.3,1)" }).onfinish = function () { node.remove(); };
      })(s);
    }
  };
  document.addEventListener("click", function (e) {
    if (e.target.closest(".btn--primary, .theme-toggle, [data-sparkle]")) window.stamfordSparkle(e.clientX, e.clientY, 18);
    var flag = e.target.closest(".event-card.flagship");
    if (flag) { var r = flag.getBoundingClientRect(); window.stamfordSparkle(e.clientX || r.left + r.width / 2, e.clientY || r.top + 30, 22); }
  });

  /* ---- Page transition ---- */
  if (!reduced) {
    var curtain = document.createElement("div"); curtain.className = "curtain"; document.body.appendChild(curtain);
    document.querySelectorAll('a[href$=".html"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href");
        if (a.target === "_blank" || e.metaKey || e.ctrlKey) return;
        e.preventDefault(); curtain.classList.add("play");
        setTimeout(function () { window.location.href = href; }, 360);
      });
    });
  }
})();
