/* ============================================================================
 * hero-visual.js — page-wide drifting field of typographic marks
 * ----------------------------------------------------------------------------
 * APPROACH: B (DOM variant) — real serif <span> glyphs animated with GSAP
 * (Three.js dropped these historic marks; the bundle blew the budget). The
 * marks form a faint field across the WHOLE page, fixed behind all content;
 * each drifts on its own slow journey, fading in as it appears and out as it
 * leaves, then re-entering elsewhere.
 *
 * DENSITY: ~55 marks (dialled back per the user). A small curated set of big
 * "ghost letters" (the DS .ghost-letter signature, incl. gold) + a couple of
 * deleaturs, then ~50 procedurally-placed marks drawn from the DS vocabulary:
 * editorial/proofing
 * marks (¶ § † ‡ — "" '' … # / ¿ ¡ × ‹› « » ; * Aa 01 A→B ′ ″), the
 * translator's language codes in mono (PT EN ES FR DE IT BR), and sparing gold
 * accents. Kept faint (low opacity) so it reads as a watermark behind the copy.
 *
 * Performance: GPU transforms/opacity only; journeys pause on tab hide; far
 * fewer marks on small screens. Accessibility: prefers-reduced-motion → static
 * faint scatter; the container is aria-hidden.
 * ========================================================================== */

(function () {
  "use strict";

  var field = document.getElementById("page-field");
  if (!field) return;

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMobile = window.matchMedia("(max-width: 767.98px)").matches;
  var hasGSAP = typeof window.gsap !== "undefined";

  // Deleatur — the proofreader's "delete" flourish (not in Unicode).
  var DELEATUR =
    '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
    '<path d="M78 30 C58 16 31 24 30 46 C29 63 53 69 56 50 C58 38 43 37 44 51 ' +
    'C45 69 63 80 84 70"/></svg>';

  // DS vocabulary.
  var MARKS = ["¶", "§", "†", "‡", "—", "“”", "‘’", "…", "#", "/",
               "¿", "¡", "×", "‹›", "«", "»", ";", "*", "Aa", "01", "A→B", "′″"];
  var CODES = ["PT", "EN", "ES", "FR", "DE", "IT", "BR"];

  function rand(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  function buildList() {
    var arr = [];

    // Big outlined ghost letters — deep background (curated, few).
    var ghosts = [
      { c: "¶",  bx: 0.70, by: 0.30, s: 18, p: 0.85, ghost: true },
      { c: "§",  bx: 0.22, by: 0.72, s: 16, p: 0.85, ghost: true },
      { c: "Aa", bx: 0.52, by: 0.20, s: 20, p: 0.80, ghost: true },
      { c: "§",  bx: 0.86, by: 0.82, s: 14, p: 0.90, ghostGold: true },
      { c: "¶",  bx: 0.10, by: 0.48, s: 15, p: 0.85, ghost: true },
      { c: "Aa", bx: 0.42, by: 0.88, s: 13, p: 0.85, ghostGold: true }
    ];
    (isMobile ? ghosts.slice(0, 2) : ghosts.slice(0, 3)).forEach(function (g) { arr.push(g); });

    // A few deleaturs.
    var deleaturs = [
      { c: "deleatur", bx: 0.34, by: 0.46, s: 5.5, p: 0.14, svg: true },
      { c: "deleatur", bx: 0.76, by: 0.60, s: 4.5, p: 0.12, svg: true },
      { c: "deleatur", bx: 0.16, by: 0.24, s: 4.0, p: 0.11, svg: true, far: true }
    ];
    (isMobile ? deleaturs.slice(0, 1) : deleaturs.slice(0, 2)).forEach(function (g) { arr.push(g); });

    // The bulk — procedurally placed marks.
    var n = isMobile ? 14 : 50;
    for (var i = 0; i < n; i++) {
      var g = { bx: rand(0.02, 0.98), by: rand(0.03, 0.97), far: Math.random() < 0.5 };
      var roll = Math.random();
      if (roll < 0.16) {            // language code (mono)
        g.c = pick(CODES); g.mono = true; g.far = true;
        g.s = rand(3.0, 3.8); g.p = rand(0.08, 0.14);
      } else if (roll < 0.22) {     // sparing gold accent
        g.c = pick(MARKS); g.accent = true;
        g.s = rand(3.6, 5.5); g.p = rand(0.22, 0.32);
      } else {                      // plain ink mark
        g.c = pick(MARKS);
        g.s = rand(3.2, 6.5); g.p = rand(0.06, 0.15);
      }
      arr.push(g);
    }
    return arr;
  }

  var list = buildList();
  var animating = false;

  function vw() { return window.innerWidth; }
  function vh() { return window.innerHeight; }
  function vmin() { return Math.min(vw(), vh()); }

  function build() {
    var frag = document.createDocumentFragment();
    list.forEach(function (g) {
      var cls = "glyph";
      if (g.far) cls += " glyph--far";
      if (g.mono) cls += " glyph--mono";
      if (g.ghost) cls += " glyph--ghost";
      if (g.ghostGold) cls += " glyph--ghost-gold";
      if (g.accent) cls += " glyph--accent";

      var wrap = document.createElement("div");
      wrap.className = cls;

      var mark = document.createElement("span");
      mark.className = "glyph__mark";
      // Cap every mark at 12cqmin — 60% of the former 20cqmin maximum. It's a
      // ceiling only: smaller marks keep their size, just nothing exceeds it.
      mark.style.fontSize = Math.min(g.s, 12) + "cqmin";
      if (g.svg) { mark.innerHTML = DELEATUR; }
      else { mark.textContent = g.c; }

      wrap.appendChild(mark);
      frag.appendChild(wrap);
      g.el = wrap;
      g.dur = g.ghost || g.ghostGold ? rand(44, 64) : (g.far ? rand(26, 38) : rand(18, 30));
    });
    field.appendChild(frag);
  }

  function layoutStatic() {
    list.forEach(function (g) {
      g.el.style.transform =
        "translate(" + (g.bx * vw()) + "px," + (g.by * vh()) + "px) rotate(" + rand(-14, 14) + "deg)";
      g.el.style.opacity = g.p;
    });
  }

  function journey(g) {
    var gsap = window.gsap;
    var ghosty = g.ghost || g.ghostGold;
    var sx = g.bx * vw() + rand(-vw() * 0.10, vw() * 0.10);
    var sy = g.by * vh() + rand(-vh() * 0.10, vh() * 0.10);
    var ang = rand(0, Math.PI * 2);
    var span = ghosty ? rand(vmin() * 0.10, vmin() * 0.26) : rand(vmin() * 0.30, vmin() * 0.70);
    var ex = sx + Math.cos(ang) * span;
    var ey = sy + Math.sin(ang) * span;
    var rmax = ghosty ? 5 : 24;
    var rspan = ghosty ? 10 : (g.far ? 25 : 50);
    var rot0 = rand(-rmax, rmax);
    var rot1 = rot0 + rand(-rspan, rspan);
    var d = g.dur;

    gsap.set(g.el, { x: sx, y: sy, rotation: rot0, opacity: 0 });

    var tl = gsap.timeline({ onComplete: function () { journey(g); } });
    tl.to(g.el, { x: ex, y: ey, rotation: rot1, duration: d, ease: "none" }, 0);
    tl.to(g.el, { opacity: g.p, duration: d * 0.20, ease: "sine.in" }, 0);
    tl.to(g.el, { opacity: 0, duration: d * 0.28, ease: "sine.out" }, d * 0.72);
    g.tl = tl;
  }

  function animate() {
    list.forEach(function (g) {
      journey(g);
      if (g.tl) g.tl.progress(Math.random()); // desync so they don't pulse together
    });
    animating = true;
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) pause(); else resume();
    });
  }

  function pause() { list.forEach(function (g) { if (g.tl) g.tl.pause(); }); }
  function resume() {
    if (!animating) return;
    list.forEach(function (g) { if (g.tl) g.tl.resume(); });
  }

  function boot() {
    build();
    if (reduceMotion || !hasGSAP) { layoutStatic(); return; }
    animate();
  }

  boot();
})();
