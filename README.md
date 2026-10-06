# Interactive Storyboarding Framework for Building Business-Led Demos and Technical Narratives

A reusable framework (packaged as a Microsoft Scout "skill") for building captivating, self-contained, **interactive demo hubs** — a clickable scene of nodes where each node opens a rich storyboard card (key message, solution components, a sequence-of-actions "road", problem/solution/outcome).

Every build is a single folder of static files — **no backend, no build step, no internet dependency** — so it opens by double-clicking `index.html` in a browser and screen-shares perfectly.

## What's in here

- **`SKILL.md`** — the full authoring guide: how to choose a world metaphor for the industry, what's fixed in the engine vs. what to re-theme, the workflow, and the content schema.
- **`reference/`** — the isometric 3D "world" engine (countryside/campus/industrial-park style), reference quality bar.
- **`reference-flatmap/`** — the flat, illustrated top-down city-map engine (branch/high-street/journey style).

Each reference folder contains:

```
index.html   page structure + storyboard card markup
styles.css   all styling (palette as CSS variables)
app.js       map engine (re-themed per build) + card system (kept)
data.js      MAP_CONFIG + SCENARIOS + JOURNEY content
logos/       Microsoft product icons used by the solution-component tiles
```

> Note: customer-specific logos used in the original internal builds (e.g. customer branding) have been removed from this public copy. Only generic Microsoft product icons are included. Swap in your own customer/partner logo assets under each `logos/` folder when building a new demo.

## How to use

1. Pick the reference engine that fits your story (isometric `reference/` for "places you travel between"; `reference-flatmap/` for journey/branch/customer stories).
2. Copy the chosen folder to a new output folder.
3. Re-theme the palette (`styles.css :root`), the world props (`app.js`), and the content (`data.js`) following the guide in `SKILL.md`.
4. Open `index.html` directly in a browser — no build step required.

See `SKILL.md` for the complete authoring workflow, content schema, and quality bar.

## License

No license has been specified yet — all rights reserved by the author unless/until a license is added.
