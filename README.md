# Checkpoint

A small plain HTML/CSS wiki for the games I play — Geometry Dash, Eternal Towers of Hell, Blox Fruits, and more as I add them.

## File structure

```
checkpoint-wiki/
├── index.html              ← hub page, lists all games
├── css/
│   └── style.css           ← shared styles + per-game color themes
├── games/
│   ├── geometry-dash.html
│   ├── tower-of-hell.html
│   └── blox-fruits.html
└── README.md
```

## Putting it on GitHub Pages

1. Create a new repository on GitHub (or use an existing one).
2. Copy everything in this folder into the root of that repository (so `index.html` sits at the repo root, not inside a subfolder).
3. Commit and push:
   ```
   git init
   git add .
   git commit -m "Initial wiki"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
   git push -u origin main
   ```
4. On GitHub, go to **Settings → Pages**.
5. Under **Build and deployment → Source**, choose **Deploy from a branch**.
6. Under **Branch**, choose `main` and folder `/ (root)`, then **Save**.
7. Wait a minute or two — GitHub will give you a URL like `https://YOUR-USERNAME.github.io/YOUR-REPO/`.

No build step, no dependencies — it's just static files.

## Adding a new game page

1. Duplicate one of the files in `games/` (pick whichever is closest in structure — e.g. `tower-of-hell.html` for another obby-style game).
2. Update the `<title>`, `<meta name="description">`, hero text, ticker text, and sections for the new game.
3. Give the page its own accent color: add a new theme block near the top of `css/style.css`, right after `.theme-bf`:
   ```css
   body.theme-yourgame {
     --accent: #hexcode;
     --accent-2: #hexcode;
   }
   ```
   Then set `<body class="theme-yourgame">` in your new HTML file.
4. Add a matching card to `index.html` in the `.shelf` section, and give it the same accent by adding a small CSS rule like the existing `.cart[data-accent="gd"]` ones (or just reuse an existing accent name).
5. Replace the "Coming soon" placeholder card, or add your new card above it and duplicate the placeholder again for the next game.

## Notes

- Fonts (Space Grotesk, Inter, JetBrains Mono) load from Google Fonts via a CDN link in each page's `<head>` — no local font files needed.
- The scrolling ticker bar respects `prefers-reduced-motion` and will stop animating for users who have that OS setting on.
- Game codes/redeem codes change often in live games — this wiki intentionally doesn't hardcode a codes list that would go stale. If you want one, keep it in its own page and note the date you last checked it.
