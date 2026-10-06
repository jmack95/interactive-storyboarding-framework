/* =============================================================================
   Leeds Building Society — Connected Member Engagement Demo Hub — APP
   -----------------------------------------------------------------------------
   A flat, illustrated TOP-DOWN city-map of Leeds (inspired by hand-drawn tourist
   maps): muted blue-grey backdrop, yellow ribbon roads, the River Aire winding
   through, and charming flat buildings you click to open a storyboard card.
   Brand: Leeds Building Society navy (#14294f) + gold (#f4c400).

   No backend, no build, no internet. Content lives in data.js.

   STRUCTURE
     • PART A — the illustrated map engine (this is the re-themeable layer).
     • PART B — the storyboard CARD system (metaphor-agnostic; do not rebrand).
   ============================================================================= */
(function () {
  "use strict";

  const SVGNS = "http://www.w3.org/2000/svg";

  // Tiny element helper.
  function el(tag, attrs, parent) {
    const n = document.createElementNS(SVGNS, tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  // Rounded rect.
  function rr(parent, x, y, w, h, r, fill, extra) {
    const a = { x: x, y: y, width: w, height: h, rx: r, ry: r, fill: fill };
    if (extra) for (const k in extra) a[k] = extra[k];
    return el("rect", a, parent);
  }

  /* ===========================================================================
     PART A — THE ILLUSTRATED MAP
     ======================================================================== */

  // ---- Palette --------------------------------------------------------------
  const C = {
    navy: "#14294f", navyD: "#0d1c39", gold: "#f4c400", goldD: "#d9ab00",
    coral: "#e07a4a", coralD: "#c15f38", coralL: "#ee9a6f", roof: "#b24525",
    cream: "#f7efe0", glass: "#bfe0ef", glassD: "#94c3da",
    green: "#7cbf5c", greenD: "#57a03d", park: "#a9d68c", parkD: "#8cc471",
    water: "#7fb9cb", waterD: "#5fa3b8", waterL: "#a7d3df",
    bg: "#b6c5c7", blockL: "#c4d1d2", blockD: "#a6b6b8",
    road: "#f6c81f", roadCase: "#ffffff", ink: "#22303a", white: "#ffffff",
  };

  const VIEW_W = 1600, VIEW_H = 1040;
  const stage = document.getElementById("stage");
  const svg = el("svg", { viewBox: `0 0 ${VIEW_W} ${VIEW_H}`, preserveAspectRatio: "xMidYMid meet" });

  // Layers (draw order = back to front)
  const bgLayer   = el("g", {}, svg);
  const roadLayer = el("g", {}, svg);
  const riverLayer= el("g", {}, svg);
  const parkLayer = el("g", {}, svg);
  const decoLayer = el("g", {}, svg);
  const nodeLayer = el("g", {}, svg);

  /* ---- Background: muted blue-grey with faint "city block" texture --------- */
  (function background() {
    el("rect", { x: 0, y: 0, width: VIEW_W, height: VIEW_H, fill: C.bg }, bgLayer);
    // scattered rounded blocks to suggest an aerial townscape
    let seed = 7;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < 130; i++) {
      const x = rnd() * VIEW_W, y = rnd() * VIEW_H;
      const w = 26 + rnd() * 60, h = 20 + rnd() * 46;
      rr(bgLayer, x, y, w, h, 5, rnd() > 0.5 ? C.blockL : C.blockD, { opacity: 0.5 });
    }
  })();

  /* ---- Yellow ribbon roads ------------------------------------------------- */
  (function roads() {
    const paths = [
      "M -40 560 C 260 500, 520 600, 800 540 S 1320 500, 1640 560",   // main horizontal
      "M 800 -40 C 760 260, 860 380, 808 560 S 760 860, 808 1080",     // main vertical
      "M -40 300 C 220 300, 300 340, 360 372",                          // spur to HQ
      "M 1258 356 C 1360 380, 1500 360, 1640 340",                      // spur to contact centre
      "M 360 560 C 360 640, 360 690, 360 726",                          // spur to home
      "M 1262 560 C 1262 650, 1262 700, 1262 738",                      // spur to back office
    ];
    paths.forEach((d) => {
      el("path", { d: d, fill: "none", stroke: C.roadCase, "stroke-width": 40, "stroke-linecap": "round", opacity: 0.9 }, roadLayer);
    });
    paths.forEach((d) => {
      el("path", { d: d, fill: "none", stroke: C.road, "stroke-width": 28, "stroke-linecap": "round" }, roadLayer);
      el("path", { d: d, fill: "none", stroke: "#fff", "stroke-width": 2.5, "stroke-dasharray": "14 18", opacity: 0.75 }, roadLayer);
    });
  })();

  /* ---- The River Aire ------------------------------------------------------ */
  (function river() {
    const d = "M -40 930 C 260 880, 520 1000, 820 940 S 1320 880, 1640 950 L 1640 1080 L -40 1080 Z";
    el("path", { d: d, fill: C.water }, riverLayer);
    el("path", { d: "M -40 930 C 260 880, 520 1000, 820 940 S 1320 880, 1640 950", fill: "none", stroke: C.waterD, "stroke-width": 4, opacity: 0.6 }, riverLayer);
    // ripples
    for (let i = 0; i < 5; i++) {
      const yy = 980 + i * 12;
      el("path", { d: `M ${120 + i * 30} ${yy} q 22 -8 44 0 t 44 0`, fill: "none", stroke: C.waterL, "stroke-width": 2.4, opacity: 0.7 }, riverLayer);
      el("path", { d: `M ${900 + i * 30} ${yy - 6} q 22 -8 44 0 t 44 0`, fill: "none", stroke: C.waterL, "stroke-width": 2.4, opacity: 0.7 }, riverLayer);
    }
    const t = el("text", { x: 760, y: 1000, "font-size": 34, "font-weight": 800, fill: "#fff", "letter-spacing": "6", opacity: 0.9,
      "font-family": "var(--font)" }, riverLayer);
    t.textContent = "RIVER AIRE";
  })();

  /* ---- Small illustration primitives --------------------------------------- */
  function tree(parent, x, y, s) {
    s = s || 1; const g = el("g", {}, parent);
    el("ellipse", { cx: x, cy: y + 2, rx: 15 * s, ry: 5 * s, fill: "rgba(20,40,15,0.15)" }, g);
    el("rect", { x: x - 3 * s, y: y - 16 * s, width: 6 * s, height: 18 * s, rx: 2, fill: "#7a5230" }, g);
    el("circle", { cx: x, cy: y - 26 * s, r: 16 * s, fill: C.green }, g);
    el("circle", { cx: x - 10 * s, cy: y - 20 * s, r: 11 * s, fill: C.greenD }, g);
    el("circle", { cx: x + 11 * s, cy: y - 21 * s, r: 10 * s, fill: "#8fce6c" }, g);
    return g;
  }
  function flower(parent, x, y, col) {
    const g = el("g", {}, parent);
    el("rect", { x: x - 1, y: y - 8, width: 2, height: 9, fill: C.greenD }, g);
    for (let a = 0; a < 5; a++) {
      const r = a * (Math.PI * 2 / 5);
      el("circle", { cx: x + Math.cos(r) * 4.5, cy: y - 10 + Math.sin(r) * 4.5, r: 3, fill: col }, g);
    }
    el("circle", { cx: x, cy: y - 10, r: 2.4, fill: C.gold }, g);
    return g;
  }
  function bush(parent, x, y, s) {
    s = s || 1; const g = el("g", {}, parent);
    el("ellipse", { cx: x, cy: y - 6 * s, rx: 14 * s, ry: 10 * s, fill: C.greenD }, g);
    el("ellipse", { cx: x - 8 * s, cy: y - 2 * s, rx: 9 * s, ry: 7 * s, fill: C.green }, g);
    el("ellipse", { cx: x + 8 * s, cy: y - 2 * s, rx: 9 * s, ry: 7 * s, fill: C.green }, g);
    return g;
  }
  function cloud(parent, x, y, s) {
    s = s || 1; const g = el("g", { opacity: 0.9 }, parent);
    [[0, 0, 22], [20, 5, 16], [-19, 5, 15], [4, -9, 14]].forEach(([dx, dy, r]) =>
      el("ellipse", { cx: x + dx * s, cy: y + dy * s, rx: r * s, ry: r * 0.72 * s, fill: "#fff" }, g));
    return g;
  }

  // A little front-facing person. opts: coat, hair, skin, phone, headset, bag, scale
  function person(parent, x, y, opts) {
    opts = opts || {}; const s = opts.scale || 1; const g = el("g", { class: opts.bob ? "bob" : "" }, parent);
    el("ellipse", { cx: x, cy: y + 1, rx: 9 * s, ry: 3 * s, fill: "rgba(20,20,30,0.16)" }, g);
    // legs
    el("rect", { x: x - 4.2 * s, y: y - 10 * s, width: 3.4 * s, height: 11 * s, rx: 1.4, fill: "#3a3f4a" }, g);
    el("rect", { x: x + 0.8 * s, y: y - 10 * s, width: 3.4 * s, height: 11 * s, rx: 1.4, fill: "#3a3f4a" }, g);
    // body
    el("path", { d: `M ${x - 7 * s} ${y - 9 * s} Q ${x} ${y - 12 * s} ${x + 7 * s} ${y - 9 * s} L ${x + 5.5 * s} ${y - 26 * s} Q ${x} ${y - 30 * s} ${x - 5.5 * s} ${y - 26 * s} Z`, fill: opts.coat || C.navy }, g);
    // head + hair
    el("circle", { cx: x, cy: y - 32 * s, r: 6 * s, fill: opts.skin || "#eac29a" }, g);
    el("path", { d: `M ${x - 6 * s} ${y - 33 * s} a ${6 * s} ${6 * s} 0 0 1 ${12 * s} 0 L ${x + 6 * s} ${y - 34 * s} Q ${x} ${y - 40 * s} ${x - 6 * s} ${y - 34 * s} Z`, fill: opts.hair || "#4a3627" }, g);
    if (opts.phone) {
      el("rect", { x: x + 5 * s, y: y - 26 * s, width: 5 * s, height: 8 * s, rx: 1.2, fill: "#1c1c22" }, g);
      el("rect", { x: x + 5.8 * s, y: y - 25 * s, width: 3.4 * s, height: 5.4 * s, fill: "#8fd6ff" }, g);
    }
    if (opts.headset) {
      el("path", { d: `M ${x - 6.5 * s} ${y - 32 * s} a ${6.5 * s} ${6.5 * s} 0 0 1 ${13 * s} 0`, stroke: "#1c1c22", "stroke-width": 1.6, fill: "none" }, g);
      el("rect", { x: x + 5 * s, y: y - 32 * s, width: 2.6 * s, height: 5 * s, rx: 1, fill: "#1c1c22" }, g);
      el("path", { d: `M ${x + 5 * s} ${y - 28 * s} q ${-3.4 * s} ${1.4 * s} ${-3.4 * s} ${4.6 * s}`, stroke: "#1c1c22", "stroke-width": 1.3, fill: "none" }, g);
    }
    if (opts.bag) {
      el("rect", { x: x + 6 * s, y: y - 20 * s, width: 8 * s, height: 9 * s, rx: 1.4, fill: opts.bag }, g);
      el("path", { d: `M ${x + 7.5 * s} ${y - 20 * s} v -3 M ${x + 12.5 * s} ${y - 20 * s} v -3`, stroke: "#fff", "stroke-width": 1.2 }, g);
    }
    return g;
  }

  function bench(parent, x, y) {
    const g = el("g", {}, parent);
    el("ellipse", { cx: x, cy: y + 2, rx: 18, ry: 4, fill: "rgba(20,20,30,0.13)" }, g);
    rr(g, x - 16, y - 7, 32, 4, 1.5, "#9a6a48");
    rr(g, x - 16, y - 17, 32, 4, 1.5, "#aa7a55");
    [-14, 10].forEach((dx) => el("rect", { x: x + dx, y: y - 7, width: 3, height: 9, fill: "#6b4a2a" }, g));
    return g;
  }
  function cyclist(parent, x, y) {
    const g = el("g", { class: "bob" }, parent);
    el("ellipse", { cx: x, cy: y + 3, rx: 20, ry: 5, fill: "rgba(20,20,30,0.14)" }, g);
    el("circle", { cx: x - 12, cy: y - 6, r: 9, fill: "none", stroke: "#2b2b2b", "stroke-width": 2.4 }, g);
    el("circle", { cx: x + 12, cy: y - 6, r: 9, fill: "none", stroke: "#2b2b2b", "stroke-width": 2.4 }, g);
    el("path", { d: `M ${x - 12} ${y - 6} L ${x} ${y - 6} L ${x + 12} ${y - 6} M ${x} ${y - 6} L ${x + 3} ${y - 20}`, stroke: C.gold, "stroke-width": 3, fill: "none" }, g);
    person(g, x + 1, y - 12, { scale: 0.7, coat: C.coral });
    return g;
  }

  /* ---- Playground kit (for the HQ park) ------------------------------------ */
  function swingSet(parent, x, y) {
    const g = el("g", {}, parent);
    el("path", { d: `M ${x - 18} ${y} L ${x - 10} ${y - 28} L ${x + 10} ${y - 28} L ${x + 18} ${y}`, fill: "none", stroke: C.coralD, "stroke-width": 3 }, g);
    el("line", { x1: x - 10, y1: y - 28, x2: x + 10, y2: y - 28, stroke: C.coralD, "stroke-width": 3 }, g);
    [-6, 6].forEach((dx) => {
      el("line", { x1: x + dx - 4, y1: y - 27, x2: x + dx - 4, y2: y - 10, stroke: "#5b616b", "stroke-width": 1.4 }, g);
      el("line", { x1: x + dx + 4, y1: y - 27, x2: x + dx + 4, y2: y - 10, stroke: "#5b616b", "stroke-width": 1.4 }, g);
      rr(g, x + dx - 5, y - 11, 10, 3, 1, C.gold);
    });
    return g;
  }
  function slide(parent, x, y) {
    const g = el("g", {}, parent);
    el("path", { d: `M ${x + 12} ${y - 30} L ${x + 12} ${y} M ${x + 12} ${y - 30} L ${x - 14} ${y}`, fill: "none", stroke: "#5b616b", "stroke-width": 2 }, g);
    el("path", { d: `M ${x + 12} ${y - 28} L ${x - 14} ${y + 2} L ${x - 14} ${y - 4} L ${x + 8} ${y - 30} Z`, fill: C.gold }, g);
    rr(g, x + 6, y - 40, 12, 12, 2, C.coral);
    return g;
  }
  function roundabout(parent, x, y) {
    const g = el("g", {}, parent);
    el("ellipse", { cx: x, cy: y, rx: 18, ry: 8, fill: C.coral }, g);
    el("ellipse", { cx: x, cy: y - 3, rx: 18, ry: 8, fill: C.coralL }, g);
    for (let a = 0; a < 4; a++) { const r = a * Math.PI / 4; el("line", { x1: x, y1: y - 3, x2: x + Math.cos(r) * 18, y2: y - 3 + Math.sin(r) * 8, stroke: C.coralD, "stroke-width": 1.6 }, g); }
    return g;
  }
  function seesaw(parent, x, y) {
    const g = el("g", {}, parent);
    el("path", { d: `M ${x - 4} ${y} L ${x} ${y - 10} L ${x + 4} ${y} Z`, fill: "#5b616b" }, g);
    el("line", { x1: x - 18, y1: y - 4, x2: x + 18, y2: y - 14, stroke: C.gold, "stroke-width": 4, "stroke-linecap": "round" }, g);
    return g;
  }

  /* ---- The HQ park (green space with playground) --------------------------- */
  (function drawPark() {
    const cx = 340, cy = 380;
    // organic green blob
    el("path", { d:
      `M ${cx - 220} ${cy - 20}
       C ${cx - 240} ${cy - 150}, ${cx - 80} ${cy - 180}, ${cx + 40} ${cy - 160}
       C ${cx + 200} ${cy - 135}, ${cx + 235} ${cy - 20}, ${cx + 205} ${cy + 60}
       C ${cx + 180} ${cy + 150}, ${cx + 20} ${cy + 175}, ${cx - 110} ${cy + 155}
       C ${cx - 210} ${cy + 140}, ${cx - 205} ${cy + 70}, ${cx - 220} ${cy - 20} Z`,
      fill: C.park }, parkLayer);
    // darker grass patches + a path
    el("ellipse", { cx: cx - 90, cy: cy + 90, rx: 80, ry: 40, fill: C.parkD, opacity: 0.6 }, parkLayer);
    el("ellipse", { cx: cx + 110, cy: cy - 70, rx: 70, ry: 34, fill: C.parkD, opacity: 0.55 }, parkLayer);
    el("path", { d: `M ${cx - 200} ${cy + 120} Q ${cx - 40} ${cy + 40}, ${cx + 180} ${cy + 90}`, fill: "none", stroke: "#e9e0c8", "stroke-width": 10, opacity: 0.8, "stroke-linecap": "round" }, parkLayer);
    // playground cluster (lower-left of the park)
    swingSet(parkLayer, cx - 150, cy + 120);
    slide(parkLayer, cx - 90, cy + 130);
    roundabout(parkLayer, cx - 30, cy + 138);
    seesaw(parkLayer, cx + 24, cy + 132);
    // trees + flowers dotted around
    [[cx - 190, cy - 60, 1], [cx + 150, cy + 40, 1.1], [cx + 120, cy - 110, 0.9], [cx - 60, cy - 120, 1], [cx + 190, cy - 30, 0.85]].forEach((t) => tree(parkLayer, t[0], t[1], t[2]));
    const fc = ["#e0784a", "#f4c400", "#e46a8b", "#8f6fd0"];
    for (let i = 0; i < 14; i++) flower(parkLayer, cx - 200 + (i * 30) % 400, cy - 130 + ((i * 53) % 250), fc[i % 4]);
    // Olivia on a bench in the park, on her phone (web chat about savings)
    bench(parkLayer, cx + 70, cy + 120);
    person(parkLayer, cx + 92, cy + 118, { coat: C.gold, hair: "#3a2a1a", phone: true, scale: 1.05, bob: true });
    bubble(parkLayer, cx + 108, cy + 66, "chat", "Savings?", "#1668c1");
  })();

  /* ---- Decorative characters + street life --------------------------------- */
  (function streetLife() {
    cloud(decoLayer, 560, 120, 1); cloud(decoLayer, 1120, 90, 1.25); cloud(decoLayer, 1400, 200, 0.9);
    cyclist(decoLayer, 620, 610);
    // a walker with shopping near the concierge
    person(decoLayer, 690, 300, { coat: C.coral, hair: "#2a2a2a", bag: C.navy, bob: true });
    // roadside trees
    [[520, 470], [1080, 470], [1150, 620], [250, 560], [980, 250], [640, 800], [1120, 900]].forEach((t) => tree(decoLayer, t[0], t[1], 0.8));
    // a Yorkshire-rose compass token, bottom-left
    const rx = 90, ry = 940;
    el("circle", { cx: rx, cy: ry, r: 24, fill: "#fff", stroke: C.navy, "stroke-width": 2 }, decoLayer);
    for (let a = 0; a < 5; a++) { const r = a * (Math.PI * 2 / 5) - Math.PI / 2; el("circle", { cx: rx + Math.cos(r) * 9, cy: ry + Math.sin(r) * 9, r: 6, fill: C.gold }, decoLayer); }
    el("circle", { cx: rx, cy: ry, r: 5, fill: C.navy }, decoLayer);
  })();

  /* ---- Channel badges + speech bubbles ------------------------------------- */
  function miniGlyph(parent, gx, gy, kind, tone) {
    const s = (t, a) => el(t, a, parent);
    if (kind === "chat") { s("rect", { x: gx - 6, y: gy - 5, width: 12, height: 8, rx: 3, fill: tone }); s("path", { d: `M ${gx - 2} ${gy + 3} l 0 3 l 3 -3 z`, fill: tone }); }
    else if (kind === "branch") { s("path", { d: `M ${gx - 6} ${gy + 4} L ${gx} ${gy - 5} L ${gx + 6} ${gy + 4} Z`, fill: tone }); s("rect", { x: gx - 4, y: gy + 1, width: 8, height: 4, fill: tone }); }
    else if (kind === "app") { s("rect", { x: gx - 4, y: gy - 6, width: 8, height: 12, rx: 2, fill: tone }); s("circle", { cx: gx, cy: gy + 3.6, r: 1, fill: "#fff" }); }
    else if (kind === "care") { s("path", { d: `M ${gx} ${gy + 4} C ${gx - 8} ${gy - 3}, ${gx - 3} ${gy - 8}, ${gx} ${gy - 3} C ${gx + 3} ${gy - 8}, ${gx + 8} ${gy - 3}, ${gx} ${gy + 4} Z`, fill: tone }); }
    else if (kind === "copilot") { s("path", { d: `M ${gx} ${gy - 6} c .5 3.2 1.9 4.6 5 5 c -3.1 .4 -4.5 1.8 -5 5 c -.5 -3.2 -1.9 -4.6 -5 -5 c 3.1 -.4 4.5 -1.8 5 -5 z`, fill: tone }); }
    else { [-4, 0, 4].forEach((dx) => s("circle", { cx: gx + dx, cy: gy, r: 2, fill: tone })); }
  }
  function bubble(parent, sx, sy, glyphKind, label, tone) {
    tone = tone || C.navy;
    const g = el("g", { class: "bob" }, parent);
    const padL = 20, w = padL + label.length * 6.4 + 12, h = 22;
    const x = sx - w / 2, y = sy - h - 6;
    el("path", { d: `M ${sx - 5} ${y + h - 1} l 5 9 l 5 -9 z`, fill: "#fff" }, g);
    rr(g, x, y, w, h, 11, "#fff", { stroke: tone, "stroke-width": 1.6, filter: "drop-shadow(0 4px 7px rgba(20,20,30,0.22))" });
    miniGlyph(g, x + 11, y + h / 2, glyphKind, tone);
    const t = el("text", { x: x + padL, y: y + h / 2 + 3.7, "font-size": 11, "font-weight": 700, fill: tone, "font-family": "var(--font)" }, g);
    t.textContent = label;
    return g;
  }
  const CHANNELS = {
    branch:  { label: "In branch",        glyph: "branch",  tone: C.navy },
    chat:    { label: "Web chat",         glyph: "chat",    tone: "#1668c1" },
    omni:    { label: "Any channel",      glyph: "omni",    tone: C.navy },
    app:     { label: "Mobile app",       glyph: "app",     tone: "#2e8b57" },
    care:    { label: "With due care",    glyph: "care",    tone: "#b23a6b" },
    copilot: { label: "Copilot-assisted", glyph: "copilot", tone: "#6a3fb0" },
  };

  /* ---- BRAND MARK: the gold chevron used on LBS fascia ---------------------- */
  function chevron(parent, x, y, w) {
    const h = w * 0.62;
    el("path", { d: `M ${x} ${y} L ${x + w / 2} ${y - h} L ${x + w} ${y} L ${x + w * 0.72} ${y} L ${x + w / 2} ${y - h * 0.45} L ${x + w * 0.28} ${y} Z`, fill: C.gold }, parent);
  }

  /* ---- BUILDING ILLUSTRATIONS (flat, front-elevation with light depth) ------
     Each drawer is anchored at ground-centre (x, y) and draws upward. --------- */
  function windows(parent, x0, y0, cols, rows, cw, ch, gap, frame) {
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      rr(parent, x0 + c * (cw + gap), y0 + r * (ch + gap), cw, ch, 1.5, C.glass, { stroke: frame || C.navy, "stroke-width": 1 });
    }
  }
  function fascia(parent, x, y, w, brandText) {
    rr(parent, x, y, w, 22, 4, C.navy);
    chevron(parent, x + 8, y + 17, 20);
    const t = el("text", { x: x + 34, y: y + 15.5, "font-size": 12, "font-weight": 800, fill: "#fff", "font-family": "var(--font)" }, parent);
    t.textContent = brandText || "Leeds Building Society";
  }
  function shadowBlob(parent, x, y, rx) { el("ellipse", { cx: x, cy: y + 8, rx: rx, ry: rx * 0.28, fill: "rgba(20,25,35,0.16)" }, parent); }

  function drawBuilding(g, x, y, kind) {
    if (kind === "hq") {
      // Big modern HQ: a glass tower + lower branded wing, in the park.
      shadowBlob(g, x, y, 130);
      // lower wing
      rr(g, x - 118, y - 96, 96, 96, 6, C.cream, { stroke: "#e2d6bd" });
      windows(g, x - 108, y - 84, 3, 3, 20, 18, 8, C.navy);
      // tower
      rr(g, x - 28, y - 210, 150, 210, 8, "#1c3a63");
      rr(g, x - 16, y - 198, 126, 186, 5, "#28517f");
      windows(g, x - 8, y - 190, 5, 8, 18, 16, 5, "#12294a");
      // gold crown band + chevron + name
      rr(g, x - 28, y - 210, 150, 26, 6, C.navy);
      chevron(g, x - 20, y - 189, 22);
      const nm = el("text", { x: x + 12, y: y - 191, "font-size": 13, "font-weight": 800, fill: "#fff", "font-family": "var(--font)" }, g);
      nm.textContent = "Leeds";
      // entrance
      rr(g, x + 30, y - 34, 34, 34, 3, C.navyD);
      chevron(g, x + 34, y - 6, 26);
      // flag
      el("line", { x1: x + 122, y1: y - 210, x2: x + 122, y2: y - 240, stroke: "#7a6a5a", "stroke-width": 2 }, g);
      el("path", { d: `M ${x + 122} ${y - 240} l 22 6 l -22 6 z`, fill: C.gold }, g);
      return;
    }
    if (kind === "shop") {
      // A branded high-street storefront with the "Hello" window motif.
      shadowBlob(g, x, y, 82);
      rr(g, x - 74, y - 118, 148, 118, 6, C.coral);
      rr(g, x - 74, y - 118, 148, 20, 6, C.roof);          // roofline
      fascia(g, x - 70, y - 96, 140, "Leeds Building Society");
      // glass front
      rr(g, x - 62, y - 66, 124, 54, 4, C.glass, { stroke: C.navy, "stroke-width": 1.4 });
      // "Hello" in gold
      const h = el("text", { x: x - 56, y: y - 30, "font-size": 26, "font-weight": 800, fill: C.gold, "font-family": "var(--font)", transform: `rotate(-3 ${x - 40} ${y - 34})` }, g);
      h.textContent = "Hello";
      // door + awning
      rr(g, x + 22, y - 66, 34, 54, 3, C.navy);
      el("path", { d: `M ${x - 62} ${y - 12} l 124 0 l -8 12 l -108 0 z`, fill: C.gold, opacity: 0.9 }, g);
      return;
    }
    if (kind === "office") {
      // Contact-centre office block (many windows) with a rooftop dish.
      shadowBlob(g, x, y, 100);
      rr(g, x - 92, y - 168, 184, 168, 6, C.coralL);
      rr(g, x - 92, y - 168, 184, 22, 6, C.coralD);
      windows(g, x - 78, y - 138, 6, 6, 20, 16, 6, C.navy);
      fascia(g, x - 88, y - 166, 176, "Leeds Building Society");
      rr(g, x - 20, y - 40, 40, 40, 3, C.navyD);            // doors
      // rooftop dish/aerial (omnichannel)
      el("line", { x1: x + 60, y1: y - 168, x2: x + 60, y2: y - 196, stroke: "#5b616b", "stroke-width": 2.4 }, g);
      el("path", { d: `M ${x + 48} ${y - 196} a 12 12 0 0 1 24 0 z`, fill: C.gold }, g);
      return;
    }
    if (kind === "home") {
      // A cosy home (the relationship / "remember me"), with a SOLD board.
      shadowBlob(g, x, y, 84);
      rr(g, x - 66, y - 92, 132, 92, 5, C.cream, { stroke: "#e6dcc4" });
      el("path", { d: `M ${x - 78} ${y - 90} L ${x} ${y - 150} L ${x + 78} ${y - 90} Z`, fill: C.roof }, g);
      chevron(g, x - 11, y - 118, 22);                       // gold chevron in the gable
      windows(g, x - 52, y - 74, 2, 1, 30, 26, 12, C.navy);
      rr(g, x + 20, y - 60, 26, 46, 3, C.navy);              // door
      // SOLD board
      el("line", { x1: x - 84, y1: y - 40, x2: x - 84, y2: y - 96, stroke: "#5c4433", "stroke-width": 4 }, g);
      rr(g, x - 88, y - 108, 40, 18, 2, C.gold);
      const sold = el("text", { x: x - 68, y: y - 95, "text-anchor": "middle", "font-size": 10, "font-weight": 800, fill: C.navy, "font-family": "var(--font)" }, g);
      sold.textContent = "SOLD";
      return;
    }
    if (kind === "care") {
      // A welcoming care centre with a canopy + heart sign.
      shadowBlob(g, x, y, 88);
      rr(g, x - 80, y - 120, 160, 120, 8, "#f3e7ef");
      rr(g, x - 80, y - 120, 160, 22, 8, "#b23a6b");
      const t = el("text", { x: x - 66, y: y - 104, "font-size": 12, "font-weight": 800, fill: "#fff", "font-family": "var(--font)" }, g);
      t.textContent = "Member Care";
      rr(g, x - 66, y - 90, 132, 50, 4, C.glass, { stroke: "#b23a6b", "stroke-width": 1.2 });
      // heart
      el("path", { d: `M ${x} ${y - 46} C ${x - 16} ${y - 64}, ${x - 6} ${y - 76}, ${x} ${y - 66} C ${x + 6} ${y - 76}, ${x + 16} ${y - 64}, ${x} ${y - 46} Z`, fill: "#e46a8b" }, g);
      rr(g, x - 14, y - 40, 28, 40, 3, "#9a2f57");           // door
      // canopy
      el("path", { d: `M ${x - 66} ${y - 40} l 132 0 l -10 14 l -112 0 z`, fill: "#d68", opacity: 0.85 }, g);
      return;
    }
    // backoffice — a modern data/office block (Copilot single-view).
    shadowBlob(g, x, y, 92);
    rr(g, x - 84, y - 150, 168, 150, 6, C.navy);
    rr(g, x - 72, y - 138, 144, 126, 4, "#20406e");
    windows(g, x - 62, y - 128, 5, 5, 22, 18, 6, "#12294a");
    rr(g, x - 84, y - 150, 168, 22, 6, C.navyD);
    chevron(g, x - 74, y - 130, 20);
    const nm2 = el("text", { x: x - 44, y: y - 132, "font-size": 12, "font-weight": 800, fill: "#fff", "font-family": "var(--font)" }, g);
    nm2.textContent = "Leeds · Back office";
    rr(g, x - 18, y - 36, 36, 36, 3, C.navyD);
    return;
  }

  /* ---- A labelled banner sign (navy) with number + short label ------------- */
  function drawSign(parent, x, topY, sc) {
    const label = sc.sign || sc.name;
    const w = Math.max(120, label.length * 8.4 + 54);
    const h = 34;
    const bx = x - w / 2, by = topY - h;
    const g = el("g", { class: "farm__sign" }, parent);
    // post
    el("line", { x1: x, y1: by + h, x2: x, y2: topY + 26, stroke: "#54463a", "stroke-width": 3 }, g);
    // banner
    rr(g, bx, by, w, h, 8, C.navy, { filter: "drop-shadow(0 6px 8px rgba(15,25,45,0.32))" });
    rr(g, bx, by, w, h, 8, "none", { stroke: C.gold, "stroke-width": 1.5 });
    // number chip (gold)
    el("circle", { cx: bx + 20, cy: by + h / 2, r: 12, fill: C.gold }, g);
    const num = el("text", { x: bx + 20, y: by + h / 2 + 4, "text-anchor": "middle", class: "farm__signnum", "font-size": 13, fill: C.navy }, g);
    num.textContent = sc.number;
    // label
    const t = el("text", { x: bx + 38, y: by + h / 2 + 4.5, class: "farm__signtext", "font-size": 13, fill: "#fff" }, g);
    t.textContent = label;
  }

  function channelBadge(parent, x, y, key) {
    const ch = CHANNELS[key]; if (!ch) return;
    bubble(parent, x, y + 30, ch.glyph, ch.label, ch.tone);
  }

  /* ---- Build the interactive nodes ----------------------------------------- */
  // Approx building heights (for sign placement) by kind.
  const KIND_TOP = { hq: 250, shop: 128, office: 178, home: 160, care: 130, backoffice: 160 };
  const KIND_RX  = { hq: 150, shop: 84, office: 100, home: 86, care: 90, backoffice: 94 };

  MAP_CONFIG.farms.forEach((f, i) => {
    const sc = SCENARIOS.find((s) => s.id === f.id) || SCENARIOS[i];
    const x = f.pos[0], y = f.pos[1], kind = f.kind || "shop";
    const g = el("g", { class: "farm", "data-index": i, role: "button", tabindex: "0", "aria-label": sc.name }, nodeLayer);
    // soft plot highlight (hover)
    const rx = KIND_RX[kind] || 90;
    el("ellipse", { class: "farm__plot", cx: x, cy: y + 4, rx: rx + 14, ry: (rx + 14) * 0.34, fill: "rgba(255,255,255,0.45)", opacity: 0 }, g);
    drawBuilding(g, x, y, kind);
    if (f.channel) channelBadge(g, x, y, f.channel);
    drawSign(g, x, y - (KIND_TOP[kind] || 130), sc);
    g.addEventListener("click", () => showDetail(i));
    g.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showDetail(i); } });
  });

  // A couple of extra characters tied to specific nodes (colleagues serving).
  person(nodeLayer, 1258 + 120, 356 + 10, { coat: "#1668c1", hair: "#2a2a2a", headset: true, bob: true }); // contact-centre colleague
  bubble(nodeLayer, 1258 + 120, 356 - 32, "omni", "How can I help?", "#1668c1");
  person(nodeLayer, 1262 + 118, 738 + 8, { coat: "#6a3fb0", hair: "#3a2a1a", headset: true, bob: true });   // back-office colleague
  bubble(nodeLayer, 1262 + 118, 738 - 34, "copilot", "Single view", "#6a3fb0");
  // a member arriving at the branch/HQ for an appointment
  person(nodeLayer, 360 - 150, 372 + 30, { coat: C.coral, hair: "#5b3b2a", bob: true });
  bubble(nodeLayer, 360 - 150, 372 - 6, "branch", "Appointment", C.navy);

  stage.appendChild(svg);

  /* ===========================================================================
     PART B — THE STORYBOARD CARD SYSTEM  (metaphor-agnostic — do not rebrand)
     ======================================================================== */
  const mapView = document.getElementById("mapView");
  const detailView = document.getElementById("detailView");
  let currentIndex = 0;

  // Build the journey strip in the header
  (function buildJourney() {
    const strip = document.getElementById("journeyStrip");
    REP_JOURNEY.forEach((step, i) => {
      const span = document.createElement("span");
      span.className = "journey__step";
      span.textContent = step;
      strip.appendChild(span);
      if (i < REP_JOURNEY.length - 1) {
        const arr = document.createElement("span");
        arr.className = "journey__arrow";
        arr.textContent = "→";
        strip.appendChild(arr);
      }
    });
  })();

  // A small inline SVG icon for the card hero (member + care mark).
  const HERO_ICON =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<circle cx="12" cy="8" r="3.4" stroke="currentColor" stroke-width="1.6"/>' +
    '<path d="M5.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
    '</svg>';

  function fillList(ul, items, ordered) {
    ul.innerHTML = "";
    items.forEach((it) => {
      const li = document.createElement("li");
      li.textContent = it;
      ul.appendChild(li);
    });
  }

  /* ITEM LOGOS — simplified original icons that evoke each product. */
  const ICONS = {
    copilot:
      '<svg viewBox="0 0 24 24"><defs><linearGradient id="ic-cop" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#2aa5ff"/><stop offset=".5" stop-color="#7a5cff"/><stop offset="1" stop-color="#ff5fa2"/></linearGradient></defs>' +
      '<path d="M12 2c.7 4.8 3 7.1 7.8 7.8C15 10.5 12.7 12.8 12 17.6 11.3 12.8 9 10.5 4.2 9.8 9 9.1 11.3 6.8 12 2Z" fill="url(#ic-cop)"/>' +
      '<path d="M18.6 14.4c.3 2 1.1 2.8 3.1 3.1-2 .3-2.8 1.1-3.1 3.1-.3-2-1.1-2.8-3.1-3.1 2-.3 2.8-1.1 3.1-3.1Z" fill="url(#ic-cop)" opacity=".75"/></svg>',
    copilotstudio:
      '<svg viewBox="0 0 24 24"><defs><linearGradient id="ic-cst" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#2aa5ff"/><stop offset="1" stop-color="#7a5cff"/></linearGradient></defs>' +
      '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v6A2.5 2.5 0 0 1 17.5 15H10l-4 3.5V15H6.5A2.5 2.5 0 0 1 4 12.5v-6Z" fill="url(#ic-cst)"/>' +
      '<path d="M12 6.6c.3 1.8 1.1 2.6 2.9 2.9-1.8.3-2.6 1.1-2.9 2.9-.3-1.8-1.1-2.6-2.9-2.9 1.8-.3 2.6-1.1 2.9-2.9Z" fill="#fff"/></svg>',
    dynamics:
      '<svg viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="#0b6ad4"/>' +
      '<path d="M6.8 15.5l3-3 2.2 2.2 4.4-4.7" stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="16.4" cy="9.6" r="1.5" fill="#fff"/></svg>',
    customerinsights:
      '<svg viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="#0a8a7a"/>' +
      '<circle cx="12" cy="9.6" r="2.7" fill="#fff"/>' +
      '<path d="M6.8 17.5c.6-2.7 2.7-4.2 5.2-4.2s4.6 1.5 5.2 4.2" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg>',
    powerbi:
      '<svg viewBox="0 0 24 24"><rect x="4" y="11" width="4" height="9" rx="1.2" fill="#f2c811"/>' +
      '<rect x="10" y="7" width="4" height="13" rx="1.2" fill="#e8a200"/>' +
      '<rect x="16" y="3" width="4" height="17" rx="1.2" fill="#f2c811"/></svg>',
    teams:
      '<svg viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="#4b53bc"/>' +
      '<circle cx="9.5" cy="9.5" r="2.4" fill="#fff"/><circle cx="15.6" cy="8.8" r="1.8" fill="#cfd3f7"/>' +
      '<path d="M5.5 17c.5-2.2 2-3.4 4-3.4s3.5 1.2 4 3.4" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>',
    service:
      '<svg viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="#c0612a"/>' +
      '<path d="M14.8 7.2a3.2 3.2 0 0 0-4.1 4.1l-4 4 1.9 1.9 4-4a3.2 3.2 0 0 0 4.1-4.1l-1.9 1.9-1.7-1.7 1.7-2Z" fill="#fff"/></svg>',
    data:
      '<svg viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="#2b7a4b"/>' +
      '<path d="M7 13l3 3 7-7" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    powerautomate:
      '<svg viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="#0b6ad4"/>' +
      '<path d="M13 4l-6 9h4l-2 7 6-9h-4l2-7Z" fill="#fff"/></svg>',
    generic:
      '<svg viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="#8a8f98"/>' +
      '<circle cx="12" cy="12" r="3.4" fill="#fff"/></svg>',
  };

  function iconForItem(s) {
    const t = s.toLowerCase();
    if (t.includes("copilot studio") || t.includes("concierge") || t.includes("voice agent")) return ICONS.copilotstudio;
    if (t.includes("copilot")) return ICONS.copilot;
    if (t.includes("power bi")) return ICONS.powerbi;
    if (t.includes("power automate")) return ICONS.powerautomate;
    if (t.includes("customer insights")) return ICONS.customerinsights;
    if (t.includes("teams") || t.includes("outlook")) return ICONS.teams;
    if (t.includes("contact center") || t.includes("contact centre") || t.includes("service")) return ICONS.service;
    if (t.includes("data")) return ICONS.data;
    if (t.includes("dynamics")) return ICONS.dynamics;
    return ICONS.generic;
  }

  function shortLabel(s) { return s.split(/\s+—\s+|\s+\(|:\s/)[0].trim(); }

  function logoForItem(s) {
    const t = s.toLowerCase();
    if (t.includes("copilot studio") || t.includes("concierge")) return null;
    if (t.includes("copilot")) return "logos/copilot";
    if (t.includes("power bi")) return "logos/powerbi";
    if (t.includes("power apps")) return "logos/powerapps";
    if (t.includes("power automate")) return "logos/powerautomate";
    if (t.includes("teams")) return "logos/teams";
    if (t.includes("customer insights")) return "logos/customerinsights";
    if (t.includes("dynamics")) return "logos/dynamics";
    return null;
  }

  function attachLogo(container, base, rawItem) {
    const exts = [".png", ".svg", ".jpg", ".jpeg"];
    let i = 0;
    const img = document.createElement("img");
    img.className = "itemchip__logo";
    img.alt = "";
    img.onerror = function () { i++; if (i < exts.length) { img.src = base + exts[i]; } else { container.innerHTML = iconForItem(rawItem); } };
    img.src = base + exts[i];
    container.appendChild(img);
  }

  function renderItems(ul, items) {
    ul.innerHTML = "";
    items.forEach((it) => {
      const li = document.createElement("li");
      li.className = "itemchip";
      li.title = it;
      const ic = document.createElement("span");
      ic.className = "itemchip__icon";
      const logoBase = logoForItem(it);
      if (logoBase) attachLogo(ic, logoBase, it);
      else ic.innerHTML = iconForItem(it);
      const lb = document.createElement("span");
      lb.className = "itemchip__label";
      lb.textContent = shortLabel(it);
      li.appendChild(ic);
      li.appendChild(lb);
      ul.appendChild(li);
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  function renderKeyMessage(km) {
    const block = document.getElementById("blockKeyMsg");
    const host = document.getElementById("cKeyMsg");
    if (!km) { block.style.display = "none"; host.innerHTML = ""; return; }
    block.style.display = "";
    let html = "";
    if (km.headline) html += '<p class="keymsg__lead">' + escapeHtml(km.headline) + "</p>";
    if (km.points && km.points.length) {
      html += '<ul class="keymsg__points">';
      km.points.forEach((p) => { html += "<li>" + escapeHtml(p) + "</li>"; });
      html += "</ul>";
    }
    host.innerHTML = html;
  }

  const NODE_COLORS = ["#14294f", "#1668c1", "#2e8b57", "#b23a6b", "#6a3fb0", "#c98a3c", "#0a8a7a", "#d99a3c"];

  function renderSequence(host, steps) {
    if (host.__ro) { host.__ro.disconnect(); host.__ro = null; }
    host.innerHTML = "";
    const s = document.createElementNS(SVGNS, "svg");
    s.setAttribute("class", "road__svg");
    s.setAttribute("preserveAspectRatio", "none");
    ["road__edge", "road__lane", "road__dash"].forEach((cls) => {
      const p = document.createElementNS(SVGNS, "path");
      p.setAttribute("class", cls);
      s.appendChild(p);
    });
    host.appendChild(s);
    steps.forEach((st, i) => {
      const obj = typeof st === "object" && st !== null;
      const title = obj ? st.title : null;
      const text = obj ? st.text : st;
      const color = NODE_COLORS[i % NODE_COLORS.length];
      const side = i % 2 === 0 ? "left" : "right";
      const row = document.createElement("div");
      row.className = "roadstep roadstep--" + side;
      const node = document.createElement("div");
      node.className = "roadstep__node";
      node.style.background = color;
      node.textContent = i + 1;
      const body = document.createElement("div");
      body.className = "roadstep__body";
      let h = '<div class="roadstep__eyebrow" style="color:' + color + '">Step ' + (i + 1) + "</div>";
      if (title) h += '<div class="roadstep__title">' + escapeHtml(title) + "</div>";
      h += '<div class="roadstep__text">' + escapeHtml(text) + "</div>";
      body.innerHTML = h;
      row.appendChild(node);
      row.appendChild(body);
      host.appendChild(row);
    });
    const draw = () => drawRoad(host);
    draw();
    requestAnimationFrame(draw);
    if (window.ResizeObserver) { const ro = new ResizeObserver(() => draw()); ro.observe(host); host.__ro = ro; }
  }

  function drawRoad(host) {
    const s = host.querySelector(".road__svg");
    const nodes = Array.prototype.slice.call(host.querySelectorAll(".roadstep__node"));
    if (!s || !nodes.length) return;
    const W = host.clientWidth, H = host.clientHeight;
    if (!W || !H) return;
    s.setAttribute("viewBox", "0 0 " + W + " " + H);
    s.setAttribute("width", W);
    s.setAttribute("height", H);
    const rb = host.getBoundingClientRect();
    const pts = nodes.map((n) => { const b = n.getBoundingClientRect(); return [b.left + b.width / 2 - rb.left, b.top + b.height / 2 - rb.top]; });
    const first = pts[0], last = pts[pts.length - 1];
    const all = [[first[0], 0]].concat(pts).concat([[last[0], H]]);
    let d = "M " + all[0][0].toFixed(1) + " " + all[0][1].toFixed(1);
    for (let i = 1; i < all.length; i++) {
      const p0 = all[i - 1], p1 = all[i];
      const my = ((p0[1] + p1[1]) / 2).toFixed(1);
      d += " C " + p0[0].toFixed(1) + " " + my + " " + p1[0].toFixed(1) + " " + my + " " + p1[0].toFixed(1) + " " + p1[1].toFixed(1);
    }
    host.querySelector(".road__edge").setAttribute("d", d);
    host.querySelector(".road__lane").setAttribute("d", d);
    host.querySelector(".road__dash").setAttribute("d", d);
  }

  function toggleBlock(blockId, show) { const b = document.getElementById(blockId); if (b) b.style.display = show ? "" : "none"; }

  function setField(textId, blockId, value) {
    const has = value != null && String(value).trim() !== "";
    const t = document.getElementById(textId);
    if (t) t.textContent = has ? value : "";
    toggleBlock(blockId, has);
  }

  function renderFacts(dl, facts) {
    if (!dl) return;
    dl.innerHTML = "";
    if (!facts || !facts.length) { dl.style.display = "none"; return; }
    dl.style.display = "";
    facts.forEach((f) => {
      const row = document.createElement("div");
      row.className = "facts__row";
      const dt = document.createElement("dt"); dt.textContent = f.label;
      const dd = document.createElement("dd"); dd.textContent = f.value;
      row.appendChild(dt); row.appendChild(dd); dl.appendChild(row);
    });
  }

  function renderHeroMeta(facts) {
    const host = document.getElementById("cardMeta");
    if (!host) return;
    host.innerHTML = "";
    if (!facts || !facts.length) { host.style.display = "none"; return; }
    host.style.display = "";
    facts.forEach((f) => {
      const chip = document.createElement("span");
      chip.className = "metachip";
      if (typeof f === "object" && f !== null) chip.innerHTML = '<span class="metachip__k">' + escapeHtml(f.label) + '</span> ' + escapeHtml(f.value);
      else chip.textContent = f;
      host.appendChild(chip);
    });
  }

  function showDetail(index) {
    currentIndex = ((index % SCENARIOS.length) + SCENARIOS.length) % SCENARIOS.length;
    const sc = SCENARIOS[currentIndex];
    try { if (location.hash !== "#" + sc.id) history.replaceState(null, "", "#" + sc.id); } catch (e) {}
    document.getElementById("cardBadge").textContent = "Scenario " + sc.number + " / " + SCENARIOS.length;
    document.getElementById("cardHeroIcon").innerHTML = HERO_ICON;
    document.getElementById("cardTitle").textContent = sc.name;
    document.getElementById("cardFarmer").textContent = sc.farmer;
    document.getElementById("cardUseCase").textContent = sc.useCase;
    renderHeroMeta(sc.heroFacts);
    setField("cSummary", "blockSummary", sc.summary);
    setField("cContext", "blockContext", sc.context);
    renderFacts(document.getElementById("cContextFacts"), sc.contextFacts);
    toggleBlock("blockContext", (sc.context && String(sc.context).trim() !== "") || (sc.contextFacts && sc.contextFacts.length));
    setField("cProblem", "blockProblem", sc.problem);
    setField("cSolution", "blockSolution", sc.solution);
    setField("cOutcome", "blockOutcome", sc.outcome);
    renderKeyMessage(sc.keyMessage);
    toggleBlock("blockItems", sc.items && sc.items.length);
    if (sc.items && sc.items.length) renderItems(document.getElementById("cItems"), sc.items);
    toggleBlock("blockSequence", sc.sequence && sc.sequence.length);
    if (sc.sequence && sc.sequence.length) renderSequence(document.getElementById("cSequence"), sc.sequence);
    mapView.classList.remove("is-active");
    detailView.classList.add("is-active");
    detailView.setAttribute("aria-hidden", "false");
    detailView.scrollTop = 0;
    document.getElementById("backBtn").focus();
  }

  function showMap() {
    try { if (location.hash) history.replaceState(null, "", location.pathname); } catch (e) {}
    detailView.classList.remove("is-active");
    detailView.setAttribute("aria-hidden", "true");
    mapView.classList.add("is-active");
    const f = stage.querySelector('.farm[data-index="' + currentIndex + '"]');
    if (f) f.focus();
  }

  document.getElementById("backBtn").addEventListener("click", showMap);
  document.getElementById("backBtn2").addEventListener("click", showMap);
  document.getElementById("prevBtn").addEventListener("click", () => showDetail(currentIndex - 1));
  document.getElementById("nextBtn").addEventListener("click", () => showDetail(currentIndex + 1));

  document.addEventListener("keydown", (e) => {
    if (!detailView.classList.contains("is-active")) return;
    if (e.key === "Escape") showMap();
    else if (e.key === "ArrowLeft") showDetail(currentIndex - 1);
    else if (e.key === "ArrowRight") showDetail(currentIndex + 1);
  });

  (function openFromHash() {
    const id = location.hash.replace("#", "");
    if (!id) return;
    const idx = SCENARIOS.findIndex((s) => s.id === id);
    if (idx >= 0) showDetail(idx);
  })();
})();
