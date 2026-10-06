/* =============================================================================
   Kwizda Countryside Demo Hub — APP
   -----------------------------------------------------------------------------
   Builds the isometric countryside scene as SVG and wires up navigation.
   You normally edit CONTENT in data.js and COLOURS in styles.css — not here.
   The scene is generated from MAP_CONFIG + SCENARIOS (see data.js).

   Isometric model: every point has world coordinates (x = column, y = row,
   z = height). proj() turns those into 2D screen coordinates. Tiles are 1x1
   world units; buildings sit on top with a height in z units.
   ============================================================================= */

(function () {
  "use strict";

  /* ---- Projection constants (tweak to zoom / change the iso angle) -------- */
  const TW = 58;   // tile half-width  (screen px)
  const TH = 29;   // tile half-height (screen px)
  const ZH = 40;   // height of one z-unit (screen px)
  const N  = MAP_CONFIG.gridSize;

  const PAD_X = 80, PAD_TOP = 180, PAD_BOT = 70;
  const ORIGIN_X = N * TW + PAD_X;
  const ORIGIN_Y = PAD_TOP;
  const VIEW_W = 2 * N * TW + 2 * PAD_X;
  const VIEW_H = PAD_TOP + 2 * N * TH + PAD_BOT;

  const SVGNS = "http://www.w3.org/2000/svg";

  /* World (x,y,z) -> screen [sx, sy] */
  function proj(x, y, z) {
    z = z || 0;
    return [
      ORIGIN_X + (x - y) * TW,
      ORIGIN_Y + (x + y) * TH - z * ZH,
    ];
  }

  /* ---- Tiny SVG + colour helpers ----------------------------------------- */
  function el(tag, attrs, parent) {
    const n = document.createElementNS(SVGNS, tag);
    if (attrs) for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function pts(arr) { return arr.map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" "); }

  // Lighten (pct>0) or darken (pct<0) a hex colour.
  function shade(hex, pct) {
    const m = hex.replace("#", "");
    let r = parseInt(m.substring(0, 2), 16),
        g = parseInt(m.substring(2, 4), 16),
        b = parseInt(m.substring(4, 6), 16);
    const t = pct < 0 ? 0 : 255, a = Math.abs(pct) / 100;
    r = Math.round((t - r) * a + r);
    g = Math.round((t - g) * a + g);
    b = Math.round((t - b) * a + b);
    return "rgb(" + r + "," + g + "," + b + ")";
  }

  /* =========================================================================
     SHAPE BUILDERS
     ====================================================================== */

  // A flat ground tile (diamond) occupying world (x..x+1, y..y+1).
  function tile(parent, x, y, fill, stroke) {
    const p = [proj(x, y), proj(x + 1, y), proj(x + 1, y + 1), proj(x, y + 1)];
    return el("polygon", {
      points: pts(p), fill: fill,
      stroke: stroke || "none", "stroke-width": stroke ? 1 : 0,
      "shape-rendering": "geometricPrecision",
    }, parent);
  }

  // An isometric box (building body). centre (cx,cy) world, footprint w x d, height h.
  function isoBox(parent, cx, cy, w, d, h, color) {
    const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - d / 2, y1 = cy + d / 2;
    // top face
    el("polygon", {
      points: pts([proj(x0, y0, h), proj(x1, y0, h), proj(x1, y1, h), proj(x0, y1, h)]),
      fill: shade(color, 16),
    }, parent);
    // right face (x = x1) -> faces lower-right
    el("polygon", {
      points: pts([proj(x1, y0, h), proj(x1, y1, h), proj(x1, y1, 0), proj(x1, y0, 0)]),
      fill: shade(color, -24),
    }, parent);
    // left/front face (y = y1) -> faces lower-left
    el("polygon", {
      points: pts([proj(x1, y1, h), proj(x0, y1, h), proj(x0, y1, 0), proj(x1, y1, 0)]),
      fill: shade(color, -8),
    }, parent);
  }

  // A gable roof sitting on top of a box of footprint w x d at height h. Ridge runs along x.
  function gableRoof(parent, cx, cy, w, d, h, rh, color) {
    const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - d / 2, y1 = cy + d / 2;
    const overhang = 0.08;
    const ex0 = x0 - overhang, ex1 = x1 + overhang, ey0 = y0 - overhang, ey1 = y1 + overhang;
    const ridgeZ = h + rh;
    // front slope (towards y1) — most visible
    el("polygon", {
      points: pts([proj(ex0, cy, ridgeZ), proj(ex1, cy, ridgeZ), proj(ex1, ey1, h), proj(ex0, ey1, h)]),
      fill: shade(color, 6),
    }, parent);
    // back slope (towards y0) — partly visible at top
    el("polygon", {
      points: pts([proj(ex0, cy, ridgeZ), proj(ex1, cy, ridgeZ), proj(ex1, ey0, h), proj(ex0, ey0, h)]),
      fill: shade(color, 22),
    }, parent);
    // right gable triangle (x = ex1)
    el("polygon", {
      points: pts([proj(ex1, ey0, h), proj(ex1, ey1, h), proj(ex1, cy, ridgeZ)]),
      fill: shade(color, -22),
    }, parent);
  }

  // A simple silo: projected base, drawn upward in screen space.
  function silo(parent, cx, cy, h, color) {
    const base = proj(cx, cy, 0);
    const rx = 13, ry = 7, bodyH = h * ZH;
    const bx = base[0], by = base[1];
    el("path", { // body
      d: `M ${bx - rx} ${by} L ${bx - rx} ${by - bodyH} A ${rx} ${ry} 0 0 1 ${bx + rx} ${by - bodyH} L ${bx + rx} ${by} A ${rx} ${ry} 0 0 1 ${bx - rx} ${by} Z`,
      fill: color,
    }, parent);
    el("ellipse", { cx: bx, cy: by - bodyH, rx: rx, ry: ry, fill: shade(color, 20) }, parent); // dome
    el("ellipse", { cx: bx, cy: by - bodyH, rx: rx, ry: ry, fill: "none", stroke: shade(color, -15), "stroke-width": 1 }, parent);
  }

  // A tree at world (cx,cy). Drawn in screen space from the projected base.
  function tree(parent, cx, cy, scale) {
    scale = scale || 1;
    const b = proj(cx, cy, 0);
    const g = el("g", { class: "bob" }, parent);
    el("ellipse", { cx: b[0], cy: b[1] + 2, rx: 14 * scale, ry: 5 * scale, fill: "rgba(20,40,15,0.18)" }, g); // shadow
    el("rect", { x: b[0] - 3 * scale, y: b[1] - 22 * scale, width: 6 * scale, height: 24 * scale, rx: 2, fill: "#7a5230" }, g); // trunk
    el("circle", { cx: b[0], cy: b[1] - 30 * scale, r: 16 * scale, fill: "#4c9a4a" }, g);
    el("circle", { cx: b[0] - 11 * scale, cy: b[1] - 24 * scale, r: 11 * scale, fill: "#56a851" }, g);
    el("circle", { cx: b[0] + 11 * scale, cy: b[1] - 24 * scale, r: 11 * scale, fill: "#3f8a3f" }, g);
    el("circle", { cx: b[0], cy: b[1] - 36 * scale, r: 10 * scale, fill: "#62b25c" }, g);
  }

  // A small tractor at world (cx,cy) in screen space.
  function tractor(parent, cx, cy, color) {
    const b = proj(cx, cy, 0);
    const g = el("g", { class: "bob" }, parent);
    el("ellipse", { cx: b[0], cy: b[1] + 3, rx: 22, ry: 6, fill: "rgba(20,40,15,0.18)" }, g);
    el("circle", { cx: b[0] + 11, cy: b[1] - 6, r: 9, fill: "#2b2b2b" }, g);   // big rear wheel
    el("circle", { cx: b[0] + 11, cy: b[1] - 6, r: 4, fill: "#777" }, g);
    el("circle", { cx: b[0] - 13, cy: b[1] - 3, r: 6, fill: "#2b2b2b" }, g);   // small front wheel
    el("rect", { x: b[0] - 16, y: b[1] - 16, width: 26, height: 11, rx: 3, fill: color }, g); // body
    el("rect", { x: b[0] + 2, y: b[1] - 26, width: 11, height: 12, rx: 2, fill: shade(color, -12) }, g); // cabin
    el("rect", { x: b[0] + 4, y: b[1] - 24, width: 7, height: 6, rx: 1, fill: "#cfe8ff" }, g); // window
  }

  /* =========================================================================
     SCENE ASSEMBLY
     ====================================================================== */
  const stage = document.getElementById("stage");

  const svg = el("svg", {
    viewBox: `0 0 ${VIEW_W} ${VIEW_H}`,
    preserveAspectRatio: "xMidYMid meet",
  });

  // ---- soft drifting clouds (purely decorative) ----
  (function clouds() {
    const data = [[260, 90, 1], [820, 60, 1.3], [1330, 110, 0.9]];
    data.forEach(([x, y, s], i) => {
      const g = el("g", { opacity: 0.85 }, svg);
      [[0, 0, 30], [26, 6, 22], [-24, 6, 20], [6, -10, 18]].forEach(([dx, dy, r]) =>
        el("ellipse", { cx: x + dx * s, cy: y + dy * s, rx: r * s, ry: r * 0.7 * s, fill: "#ffffff" }, g));
      const a = el("animateTransform", {
        attributeName: "transform", type: "translate",
        from: "0 0", to: "60 0", dur: (40 + i * 12) + "s",
        repeatCount: "indefinite", additive: "sum",
      }, g);
      // ping-pong drift
      a.setAttribute("values", "0 0; 50 0; 0 0");
      a.setAttribute("keyTimes", "0; 0.5; 1");
    });
  })();

  /* ---- Ground base diamond (with a thickness rim for a 3D edge) ---------- */
  (function ground() {
    const top = [proj(0, 0), proj(N, 0), proj(N, N), proj(0, N)];
    // earth rim under the south edges
    const rimDepth = 26;
    const rimRight = [proj(N, 0), proj(N, N), [proj(N, N)[0], proj(N, N)[1] + rimDepth], [proj(N, 0)[0], proj(N, 0)[1] + rimDepth]];
    const rimLeft  = [proj(N, N), proj(0, N), [proj(0, N)[0], proj(0, N)[1] + rimDepth], [proj(N, N)[0], proj(N, N)[1] + rimDepth]];
    el("polygon", { points: pts(rimRight), fill: "#6b4a2a" }, svg);
    el("polygon", { points: pts(rimLeft), fill: "#5c3f24" }, svg);
    el("polygon", { points: pts(top), fill: MAP_CONFIG.cropColors.pasture }, svg);
  })();

  /* ---- Decide what each tile is: road, field(crop) or grass -------------- */
  const ROADS_R = [4, 8];   // horizontal lanes at these rows
  const ROADS_C = [4, 8];   // vertical lanes at these cols
  const roadSet = new Set();
  for (let x = 0; x < N; x++) for (let y = 0; y < N; y++) {
    if (ROADS_R.indexOf(y) >= 0 || ROADS_C.indexOf(x) >= 0) roadSet.add(x + "," + y);
  }

  // crop field map: each farm paints its surrounding block tiles with its crop.
  const cropMap = {}; // "x,y" -> cropKey
  MAP_CONFIG.farms.forEach((f) => {
    const bx = Math.floor(f.tile[0] / 4) * 4; // block origin col (0,4,8)
    const by = Math.floor(f.tile[1] / 4) * 4; // block origin row
    for (let x = bx; x < Math.min(bx + 4, N); x++) {
      for (let y = by; y < Math.min(by + 4, N); y++) {
        if (roadSet.has(x + "," + y)) continue;
        cropMap[x + "," + y] = f.crop;
      }
    }
  });

  // A small pond in the empty block (cols 4-8, rows 8-12).
  const pondSet = new Set(["5,6", "6,6", "5,7", "6,7", "7,6"]);

  /* ---- Paint tiles -------------------------------------------------------- */
  const fieldLayer = el("g", {}, svg);
  for (let y = 0; y < N; y++) {       // paint back-to-front for clean edges
    for (let x = 0; x < N; x++) {
      const key = x + "," + y;
      if (pondSet.has(key)) {
        tile(fieldLayer, x, y, "#5aa9d6");
        continue;
      }
      if (roadSet.has(key)) {
        tile(fieldLayer, x, y, "#d9c79c", "#cbb888");
        continue;
      }
      const crop = cropMap[key];
      if (crop) {
        const c = MAP_CONFIG.cropColors[crop];
        tile(fieldLayer, x, y, c, shade(c, -8));
        // crop rows: a couple of thin darker lines along x for texture
        const rowC = shade(c, -16);
        [0.33, 0.66].forEach((off) => {
          const a = proj(x + 0.08, y + off), b = proj(x + 0.92, y + off);
          el("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: rowC, "stroke-width": 1.4, opacity: 0.7 }, fieldLayer);
        });
      } else {
        // grass: subtle checkerboard of two greens
        const g = (x + y) % 2 ? "#86c06a" : "#7fb863";
        tile(fieldLayer, x, y, g);
      }
    }
  }

  // Pond highlight + cattails
  (function pondDeco() {
    const c = proj(6, 6.7);
    el("ellipse", { cx: c[0], cy: c[1], rx: 30, ry: 10, fill: "rgba(255,255,255,0.25)" }, fieldLayer);
    tree(fieldLayer, 7.6, 6.2, 0.7);
  })();

  // Dashed centre lines along the main lanes (nice road detail)
  (function roadLines() {
    const lineLayer = el("g", {}, svg);
    ROADS_R.forEach((r) => {
      const a = proj(0, r + 0.5), b = proj(N, r + 0.5);
      el("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: "#fff", "stroke-width": 2, "stroke-dasharray": "10 12", opacity: 0.65 }, lineLayer);
    });
    ROADS_C.forEach((cc) => {
      const a = proj(cc + 0.5, 0), b = proj(cc + 0.5, N);
      el("line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: "#fff", "stroke-width": 2, "stroke-dasharray": "10 12", opacity: 0.65 }, lineLayer);
    });
  })();

  /* =========================================================================
     3D OBJECTS — depth sorted so nearer things overlap farther ones.
     Each entry: { depth, draw(parent) }
     ====================================================================== */
  const objects = [];

  // Decorative roadside trees (avoid farms/pond).
  const decoTrees = [
    [4.5, 1.5], [4.5, 6.5], [8.5, 3.5], [8.5, 9.5],
    [1.5, 4.5], [6.5, 4.5], [11.5, 4.5], [2.5, 8.5], [11.5, 8.5], [0.5, 11.5],
  ];
  decoTrees.forEach((t) => objects.push({ depth: t[0] + t[1], draw: (p) => tree(p, t[0], t[1], 0.85) }));

  // A few tractors on the lanes.
  [[4.5, 2.5, "#f25022"], [8.5, 6.5, "#7fba00"], [6.5, 8.5, "#0078d4"]].forEach((t) =>
    objects.push({ depth: t[0] + t[1], draw: (p) => tractor(p, t[0], t[1], t[2]) }));

  /* ---- The 8 farmsteads --------------------------------------------------- */
  MAP_CONFIG.farms.forEach((f, i) => {
    const sc = SCENARIOS.find((s) => s.id === f.id) || SCENARIOS[i];
    const cx = f.tile[0], cy = f.tile[1];
    objects.push({
      depth: cx + cy + 0.5, // farms slightly forward so signs/houses sit above nearby trees
      draw: (parent) => drawFarm(parent, cx, cy, f, sc, i),
    });
  });

  // Sort and render
  objects.sort((a, b) => a.depth - b.depth);
  const objLayer = el("g", {}, svg);
  objects.forEach((o) => o.draw(objLayer));

  stage.appendChild(svg);

  /* ---- Draw one interactive farm group ----------------------------------- */
  function drawFarm(parent, cx, cy, f, sc, index) {
    const g = el("g", { class: "farm", "data-index": index, role: "button",
      tabindex: "0", "aria-label": sc.name }, parent);

    // soft plot highlight under the farmstead (shows clearly on hover)
    const plot = [proj(cx - 1.1, cy - 1.1), proj(cx + 1.1, cy - 1.1), proj(cx + 1.1, cy + 1.1), proj(cx - 1.1, cy + 1.1)];
    el("polygon", { class: "farm__plot", points: pts(plot), fill: "rgba(255,255,255,0.30)", opacity: 0.55 }, g);

    // tiny variant offsets so farms differ a little
    const v = f.variant || 0;
    const houseColor = ["#f3ede1", "#efe6d2", "#f6efe0", "#ede4cf"][v];
    const barnColor  = ["#b4502f", "#a8472a", "#bb5a36", "#9e4127"][v];

    // ground shadow blob
    const sb = proj(cx, cy, 0);
    el("ellipse", { cx: sb[0], cy: sb[1] + 6, rx: 64, ry: 22, fill: "rgba(20,40,15,0.16)" }, g);

    // Farmhouse (main building) — slightly back-left
    isoBox(g, cx - 0.35, cy - 0.35, 0.95, 0.8, 0.95, houseColor);
    gableRoof(g, cx - 0.35, cy - 0.35, 0.95, 0.8, 0.95, 0.55, "#9c5236");
    // a little door + window on the front face
    const dp = proj(cx - 0.35 + 0.4, cy - 0.35 + 0.4, 0);
    el("rect", { x: dp[0] - 16, y: dp[1] - 30, width: 9, height: 18, rx: 1.5, fill: "#6b4a2a" }, g);
    el("rect", { x: dp[0] + 2, y: dp[1] - 30, width: 10, height: 10, rx: 1.5, fill: "#bfe0f5" }, g);

    // Barn (secondary building) — front-right
    isoBox(g, cx + 0.5, cy + 0.45, 0.85, 0.7, 0.7, barnColor);
    gableRoof(g, cx + 0.5, cy + 0.45, 0.85, 0.7, 0.7, 0.4, "#7a3f22");

    // Silo next to the barn
    silo(g, cx + 0.95, cy - 0.1, 1.15, "#cfd3d6");

    // A tree by the house
    tree(g, cx - 1.0, cy + 0.6, 0.7);

    // Floating name sign above the farmstead
    drawSign(g, cx, cy, sc);

    // interactions
    g.addEventListener("click", () => showDetail(index));
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); showDetail(index); }
    });
  }

  /* ---- A label banner that floats above a farm (like a building name) ----
     Long labels wrap across multiple lines and the banner grows to fit. */
  function drawSign(parent, cx, cy, sc) {
    const top = proj(cx, cy, 1.7);                  // anchor above the roof
    const label = sc.sign || sc.name;

    // wrap the label into lines of at most ~maxChars characters
    const maxChars = 20;
    const words = label.split(/\s+/);
    const lines = [];
    let line = "";
    words.forEach((wd) => {
      const test = line ? line + " " + wd : wd;
      if (test.length > maxChars && line) { lines.push(line); line = wd; }
      else { line = test; }
    });
    if (line) lines.push(line);

    const longest = lines.reduce((m, l) => Math.max(m, l.length), 0);
    const lineH = 17;
    const padV = 9;
    const textLeft = 38;                              // space for the number badge
    const w = Math.max(96, longest * 7.4 + textLeft + 16);
    const h = lines.length * lineH + padV * 2;
    const x = top[0] - w / 2, y = top[1] - 30 - h;

    const sign = el("g", { class: "farm__sign" }, parent);
    // post connecting sign to ground
    el("line", { x1: top[0], y1: y + h, x2: top[0], y2: top[1] - 6, stroke: "#6b4a2a", "stroke-width": 3 }, sign);
    // banner
    el("rect", { x: x, y: y, width: w, height: h, rx: 14,
      fill: "#ffffff", stroke: "#2f6b34", "stroke-width": 2,
      filter: "drop-shadow(0 6px 8px rgba(20,40,15,0.28))" }, sign);
    // number badge (vertically centred)
    el("circle", { cx: x + 19, cy: y + h / 2, r: 11, fill: "#0078d4" }, sign);
    const num = el("text", { x: x + 19, y: y + h / 2 + 4, "text-anchor": "middle",
      class: "farm__signnum", "font-size": "13" }, sign);
    num.textContent = sc.number;
    // label text (one <tspan>-style line per row)
    const txt = el("text", { x: x + textLeft, y: y + padV + 13,
      class: "farm__signtext", "font-size": "13" }, sign);
    lines.forEach((ln, i) => {
      const t = el("tspan", { x: x + textLeft, dy: i === 0 ? 0 : lineH }, txt);
      t.textContent = ln;
    });
  }

  /* =========================================================================
     NAVIGATION + DETAIL CARD
     ====================================================================== */
  const mapView = document.getElementById("mapView");
  const detailView = document.getElementById("detailView");
  let currentIndex = 0;

  // Build the journey strip in the header
  (function buildJourney() {
    const strip = document.getElementById("journeyStrip");
    REP_JOURNEY.forEach((step, i) => {
      const s = el ? null : null; // (placeholder to keep lination tidy)
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

  // A small inline SVG icon for the card hero (generic farm/leaf mark).
  const HERO_ICON =
    '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M4 20V10l8-6 8 6v10" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M9 20v-6h6v6" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>' +
    '<path d="M12 4v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>' +
    '</svg>';

  function fillList(ul, items, ordered) {
    ul.innerHTML = "";
    items.forEach((it) => {
      const li = document.createElement("li");
      li.textContent = it;
      ul.appendChild(li);
    });
  }

  /* -------------------------------------------------------------------------
     ITEM LOGOS
     -------------------------------------------------------------------------
     Simplified, original icons that *evoke* each product (not exact trademarked
     logos) so the card stays clean and offline-safe. To use real brand assets
     instead, drop image files next to this app and return an <img> here.
     Add a new icon by adding an entry to ICONS and a rule in iconForItem().
     ---------------------------------------------------------------------- */
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
    accelerator:
      '<svg viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="#6b3fa0"/>' +
      '<path d="M12.5 5l-5 8h3.3l-1.3 6 5.5-8.4h-3.4L12.5 5Z" fill="#fff"/></svg>',
    orbis:
      '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="2" fill="#ef7d22"/>' +
      '<rect x="13" y="3" width="8" height="8" rx="2" fill="#f6b27a"/>' +
      '<rect x="3" y="13" width="8" height="8" rx="2" fill="#f6b27a"/>' +
      '<rect x="13" y="13" width="8" height="8" rx="2" fill="#ef7d22"/></svg>',
    powerbi:
      '<svg viewBox="0 0 24 24"><rect x="4" y="11" width="4" height="9" rx="1.2" fill="#f2c811"/>' +
      '<rect x="10" y="7" width="4" height="13" rx="1.2" fill="#e8a200"/>' +
      '<rect x="16" y="3" width="4" height="17" rx="1.2" fill="#f2c811"/></svg>',
    customerinsights:
      '<svg viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="#0a8a7a"/>' +
      '<circle cx="12" cy="9.6" r="2.7" fill="#fff"/>' +
      '<path d="M6.8 17.5c.6-2.7 2.7-4.2 5.2-4.2s4.6 1.5 5.2 4.2" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg>',
    quote:
      '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="3" fill="#1668c1"/>' +
      '<path d="M8.5 8h7M8.5 11.5h7M8.5 15h4.5" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>',
    teams:
      '<svg viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="#4b53bc"/>' +
      '<circle cx="9.5" cy="9.5" r="2.4" fill="#fff"/><circle cx="15.6" cy="8.8" r="1.8" fill="#cfd3f7"/>' +
      '<path d="M5.5 17c.5-2.2 2-3.4 4-3.4s3.5 1.2 4 3.4" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>',
    research:
      '<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6" fill="none" stroke="#3a6df0" stroke-width="2"/>' +
      '<path d="M15 15l4.5 4.5" stroke="#3a6df0" stroke-width="2.2" stroke-linecap="round"/>' +
      '<path d="M10.5 7.4c.2 1.4.8 2 2.2 2.2-1.4.2-2 .8-2.2 2.2-.2-1.4-.8-2-2.2-2.2 1.4-.2 2-.8 2.2-2.2Z" fill="#3a6df0"/></svg>',
    service:
      '<svg viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="#c0612a"/>' +
      '<path d="M14.8 7.2a3.2 3.2 0 0 0-4.1 4.1l-4 4 1.9 1.9 4-4a3.2 3.2 0 0 0 4.1-4.1l-1.9 1.9-1.7-1.7 1.7-2Z" fill="#fff"/></svg>',
    data:
      '<svg viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="#2b7a4b"/>' +
      '<path d="M7 13l3 3 7-7" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    visitprep:
      '<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="17" rx="3" fill="#1f8a70"/>' +
      '<rect x="9" y="2.6" width="6" height="3.4" rx="1.2" fill="#0f5f4c"/>' +
      '<path d="M8.5 11h7M8.5 14.5h7M8.5 18h4" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>',
    generic:
      '<svg viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="#8a8f98"/>' +
      '<circle cx="12" cy="12" r="3.4" fill="#fff"/></svg>',
    bpf:
      '<svg viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="#3a6df0"/>' +
      '<path d="M5 8.5h4.2l1.8 3.5-1.8 3.5H5l1.8-3.5L5 8.5Z" fill="#fff"/>' +
      '<path d="M11.4 8.5h4.2l1.8 3.5-1.8 3.5h-4.2l1.8-3.5-1.8-3.5Z" fill="#cfe0ff"/></svg>',
    mcp:
      '<svg viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5" fill="#2d2f36"/>' +
      '<circle cx="12" cy="6.5" r="2" fill="#fff"/><circle cx="6.5" cy="16" r="2" fill="#fff"/>' +
      '<circle cx="17.5" cy="16" r="2" fill="#fff"/>' +
      '<path d="M12 8.2 7.2 14.6M12 8.2l4.8 6.4M8.4 16h7.2" stroke="#fff" stroke-width="1.5" stroke-linecap="round" fill="none"/></svg>',
  };

  // Pick an icon for a free-text item label (most specific keyword wins).
  function iconForItem(s) {
    const t = s.toLowerCase();
    if (t.includes("copilot studio") || t.includes("voice agent")) return ICONS.copilotstudio;
    if (t.includes("research agent")) return ICONS.research;
    if (t.includes("copilot")) return ICONS.copilot;
    if (t.includes("power bi")) return ICONS.powerbi;
    if (t.includes("orbis")) return ICONS.orbis;
    if (t.includes("business process") || t.includes("process flow")) return ICONS.bpf;
    if (t.includes("mcp") || t.includes("model context protocol")) return ICONS.mcp;
    if (t.includes("accelerator") || t.includes("sequence")) return ICONS.accelerator;
    if (t.includes("customer insights") || t.includes("consent") || t.includes("preference")) return ICONS.customerinsights;
    if (t.includes("quote") || t.includes("opportunity")) return ICONS.quote;
    if (t.includes("teams") || t.includes("outlook") || t.includes("approval")) return ICONS.teams;
    if (t.includes("service") || t.includes("case") || t.includes("technical")) return ICONS.service;
    if (t.includes("data quality") || t.includes("dashboard") || t.includes("bulk")) return ICONS.data;
    if (t.includes("visit-prep") || t.includes("account view") || t.includes("survey")) return ICONS.visitprep;
    if (t.includes("dynamics")) return ICONS.dynamics;
    return ICONS.generic;
  }

  // Trim the long descriptive label down to a clean product name for the chip.
  function shortLabel(s) {
    return s.split(/\s+—\s+|\s+\(|:\s/)[0].trim();
  }

  // Which products get a real brand asset from /logos. Return the file base
  // WITHOUT extension — attachLogo() then prefers .png (a colour asset you drop
  // in) and falls back to .svg, so you can swap logos with no code change.
  function logoForItem(s) {
    const t = s.toLowerCase();
    if (t.includes("copilot studio")) return null;       // a feature, keep stylized
    if (t.includes("copilot")) return "logos/copilot";
    if (t.includes("power bi")) return "logos/powerbi";
    if (t.includes("power apps")) return "logos/powerapps";
    if (t.includes("power automate")) return "logos/powerautomate";
    if (t.includes("teams")) return "logos/teams";
    if (t.includes("cowork")) return "logos/cowork";
    if (t.includes("pcf")) return "logos/pcf";
    // Customer Insights must be checked BEFORE "dynamics" (its name contains it).
    if (t.includes("customer insights")) return "logos/customerinsights";
    if (t.includes("dynamics")) return "logos/dynamics";
    return null;
  }

  // Build a logo <img> that tries asset file types in order, then falls back to
  // the simplified inline icon if no file is found. PNG is tried first so a
  // colour asset (e.g. logos/copilot.png) overrides any .svg default.
  function attachLogo(container, base, rawItem) {
    const exts = [".png", ".svg", ".jpg", ".jpeg"];
    let i = 0;
    const img = document.createElement("img");
    img.className = "itemchip__logo";
    img.alt = "";
    img.onerror = function () {
      i++;
      if (i < exts.length) { img.src = base + exts[i]; }
      else { container.innerHTML = iconForItem(rawItem); }
    };
    img.src = base + exts[i];
    container.appendChild(img);
  }

  // Render the Solution-components list as logo tiles.
  function renderItems(ul, items) {
    ul.innerHTML = "";
    items.forEach((it) => {
      const li = document.createElement("li");
      li.className = "itemchip";
      li.title = it; // full text on hover
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
    return String(s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  }

  // Render the Key-demo-message callout: a clear headline plus a few crisp
  // one-line value statements.
  function renderKeyMessage(km) {
    const block = document.getElementById("blockKeyMsg");
    const host = document.getElementById("cKeyMsg");
    if (!km) { block.style.display = "none"; host.innerHTML = ""; return; }
    block.style.display = "";
    let html = "";
    if (km.headline) {
      html += '<p class="keymsg__lead">' + escapeHtml(km.headline) + "</p>";
    }
    if (km.points && km.points.length) {
      html += '<ul class="keymsg__points">';
      km.points.forEach((p) => { html += "<li>" + escapeHtml(p) + "</li>"; });
      html += "</ul>";
    }
    host.innerHTML = html;
  }

  /* -------------------------------------------------------------------------
     SEQUENCE — rendered as a winding country road.
     Each step is a circular node (crop-coloured, themed to the map) sitting on
     a tan country lane with a dashed centre line. The road path is drawn to fit
     the measured node positions, so it stays clean at any width / text length.
     A sequence item can be a plain string, or { title, text } for a richer node.
     ---------------------------------------------------------------------- */
  const NODE_COLORS = ["#6aa84f", "#4c9a4a", "#e0b54a", "#7fb863", "#5aa9d6", "#c98a3c", "#5a8f3e", "#d99a3c"];

  function renderSequence(host, steps) {
    if (host.__ro) { host.__ro.disconnect(); host.__ro = null; }
    host.innerHTML = "";

    // the road graphic (behind the nodes)
    const svg = document.createElementNS(SVGNS, "svg");
    svg.setAttribute("class", "road__svg");
    svg.setAttribute("preserveAspectRatio", "none");
    ["road__edge", "road__lane", "road__dash"].forEach((cls) => {
      const p = document.createElementNS(SVGNS, "path");
      p.setAttribute("class", cls);
      svg.appendChild(p);
    });
    host.appendChild(svg);

    // the step rows
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
    requestAnimationFrame(draw); // redraw once layout has settled
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => draw());
      ro.observe(host);
      host.__ro = ro;
    }
  }

  // Draw the road path through the measured centres of the step nodes.
  function drawRoad(host) {
    const svg = host.querySelector(".road__svg");
    const nodes = Array.prototype.slice.call(host.querySelectorAll(".roadstep__node"));
    if (!svg || !nodes.length) return;
    const W = host.clientWidth, H = host.clientHeight;
    if (!W || !H) return;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    svg.setAttribute("width", W);
    svg.setAttribute("height", H);

    const rb = host.getBoundingClientRect();
    const pts = nodes.map((n) => {
      const b = n.getBoundingClientRect();
      return [b.left + b.width / 2 - rb.left, b.top + b.height / 2 - rb.top];
    });
    // extend the lane off the top and bottom of the frame, like an open road
    const first = pts[0], last = pts[pts.length - 1];
    const all = [[first[0], 0]].concat(pts).concat([[last[0], H]]);

    let d = "M " + all[0][0].toFixed(1) + " " + all[0][1].toFixed(1);
    for (let i = 1; i < all.length; i++) {
      const p0 = all[i - 1], p1 = all[i];
      const my = ((p0[1] + p1[1]) / 2).toFixed(1);
      d += " C " + p0[0].toFixed(1) + " " + my + " " + p1[0].toFixed(1) + " " + my +
           " " + p1[0].toFixed(1) + " " + p1[1].toFixed(1);
    }
    host.querySelector(".road__edge").setAttribute("d", d);
    host.querySelector(".road__lane").setAttribute("d", d);
    host.querySelector(".road__dash").setAttribute("d", d);
  }

  // Show or hide a block by id.
  function toggleBlock(blockId, show) {
    const b = document.getElementById(blockId);
    if (b) b.style.display = show ? "" : "none";
  }

  // Set a text field's content and hide its block if the value is empty.
  function setField(textId, blockId, value) {
    const has = value != null && String(value).trim() !== "";
    const t = document.getElementById(textId);
    if (t) t.textContent = has ? value : "";
    toggleBlock(blockId, has);
  }

  // Render structured profile facts as a clean key/value list.
  // facts: array of { label, value }. Clears and hides if none.
  function renderFacts(dl, facts) {
    if (!dl) return;
    dl.innerHTML = "";
    if (!facts || !facts.length) { dl.style.display = "none"; return; }
    dl.style.display = "";
    facts.forEach((f) => {
      const row = document.createElement("div");
      row.className = "facts__row";
      const dt = document.createElement("dt");
      dt.textContent = f.label;
      const dd = document.createElement("dd");
      dd.textContent = f.value;
      row.appendChild(dt);
      row.appendChild(dd);
      dl.appendChild(row);
    });
  }

  // Render compact key-detail chips in the hero. Accepts either plain strings
  // ("2,400 ha") or { label, value } objects (shown as "label · value").
  function renderHeroMeta(facts) {
    const host = document.getElementById("cardMeta");
    if (!host) return;
    host.innerHTML = "";
    if (!facts || !facts.length) { host.style.display = "none"; return; }
    host.style.display = "";
    facts.forEach((f) => {
      const chip = document.createElement("span");
      chip.className = "metachip";
      if (typeof f === "object" && f !== null) {
        chip.innerHTML = '<span class="metachip__k">' + escapeHtml(f.label) +
          '</span> ' + escapeHtml(f.value);
      } else {
        chip.textContent = f;
      }
      host.appendChild(chip);
    });
  }

  function showDetail(index) {
    currentIndex = ((index % SCENARIOS.length) + SCENARIOS.length) % SCENARIOS.length;
    const sc = SCENARIOS[currentIndex];
    // keep the URL hash in sync so scenarios are bookmarkable / shareable.
    // Wrapped: on file:// pages (origin "null", e.g. a downloaded copy with
    // Mark-of-the-Web) history.replaceState can throw SecurityError — which must
    // never break navigation.
    try {
      if (location.hash !== "#" + sc.id) history.replaceState(null, "", "#" + sc.id);
    } catch (e) { /* ignore — hash sync is non-essential */ }

    document.getElementById("cardBadge").textContent = "Scenario " + sc.number + " / " + SCENARIOS.length;
    document.getElementById("cardHeroIcon").innerHTML = HERO_ICON;
    document.getElementById("cardTitle").textContent = sc.name;
    document.getElementById("cardFarmer").textContent = sc.farmer;
    document.getElementById("cardUseCase").textContent = sc.useCase;
    renderHeroMeta(sc.heroFacts);
    // Set a text field and show/hide its parent block based on whether the
    // scenario provides content. This lets any scenario omit cards simply by
    // leaving the field out in data.js (e.g. Scenario 1).
    setField("cSummary", "blockSummary", sc.summary);
    setField("cContext", "blockContext", sc.context);
    renderFacts(document.getElementById("cContextFacts"), sc.contextFacts);
    // the context block shows if it has text OR structured facts
    toggleBlock("blockContext",
      (sc.context && String(sc.context).trim() !== "") ||
      (sc.contextFacts && sc.contextFacts.length));
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
    try {
      if (location.hash) history.replaceState(null, "", location.pathname);
    } catch (e) { /* ignore — hash reset is non-essential on file:// */ }
    detailView.classList.remove("is-active");
    detailView.setAttribute("aria-hidden", "true");
    mapView.classList.add("is-active");
    // re-focus the farm we came from for keyboard users
    const f = stage.querySelector('.farm[data-index="' + currentIndex + '"]');
    if (f) f.focus();
  }

  document.getElementById("backBtn").addEventListener("click", showMap);
  document.getElementById("backBtn2").addEventListener("click", showMap);
  document.getElementById("prevBtn").addEventListener("click", () => showDetail(currentIndex - 1));
  document.getElementById("nextBtn").addEventListener("click", () => showDetail(currentIndex + 1));

  // Keyboard: Esc -> map, arrows -> prev/next while in a card
  document.addEventListener("keydown", (e) => {
    if (!detailView.classList.contains("is-active")) return;
    if (e.key === "Escape") showMap();
    else if (e.key === "ArrowLeft") showDetail(currentIndex - 1);
    else if (e.key === "ArrowRight") showDetail(currentIndex + 1);
  });

  // Deep-link support: open #farm-id directly (bookmarkable scenarios).
  (function openFromHash() {
    const id = location.hash.replace("#", "");
    if (!id) return;
    const idx = SCENARIOS.findIndex((s) => s.id === id);
    if (idx >= 0) showDetail(idx);
  })();
})();
