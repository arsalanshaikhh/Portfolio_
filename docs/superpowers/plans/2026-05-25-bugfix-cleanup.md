# Bug Fix & Cleanup Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all bugs and dead code found in the project analysis: broken project links, render-blocking script, missing canonical tag, unsafe localStorage calls, a null-check gap, unused JS/CSS, and a duplicate CSS rule.

**Architecture:** Three independent tasks. Task 1 is all JS/HTML point fixes. Task 2 cleans dead CSS. Task 3 wires GitHub links. No structural changes — purely additive fixes and deletions.

**Note on Tailwind CDN:** `cdn.tailwindcss.com` cannot be safely deferred — it scans the DOM and injects a `<style>` tag at parse time. Deferring it would cause a full-page FOUC for all utility classes. Fixing this properly requires a build step (out of scope). Only Feather Icons gets `defer`.

**Tech Stack:** Vanilla HTML5, CSS3, ES6+ JS

---

## File Map

| File | Changes |
|------|---------|
| `index.html` | Add `defer` to Feather Icons; add canonical `<link>`; add `defer` to Feather Icons |
| `script.js` | Null-check for submit button; wrap localStorage in catch block; remove `getCurrentYear()`; add `width`/`height` to blog images; wire GitHub hrefs in `initGitHubStars()` |
| `style.css` | Delete duplicate `html.light .glass-card` block at line 633; delete `.skill-chip` / `.skill-chip:hover` / `html.light .skill-chip`; delete `.motion-safe-hover` |
| `components/navbar.js` | Wrap `localStorage.setItem` in try/catch |

---

## Task 1: JS + HTML point fixes

**Files:**
- Modify: `index.html` — add `defer` to Feather Icons (line 76); add canonical tag (after line 12)
- Modify: `script.js` — null-check submit button (line 305); wrap localStorage in catch block (line 656); remove `getCurrentYear()` (lines 479–489); add `width`/`height` to blog image (line 738)
- Modify: `components/navbar.js` — wrap localStorage.setItem in try/catch (line 131)

- [ ] **Step 1: Add `defer` to Feather Icons in `index.html`**

Find (around line 76):
```html
    <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
```

Replace with:
```html
    <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js" defer></script>
```

All `feather.replace()` calls in the codebase are already guarded with `if (window.feather)` and called from `window.load` or `requestAnimationFrame`, so deferring is safe.

- [ ] **Step 2: Add canonical URL to `index.html`**

Find (around line 12):
```html
    <meta name="robots" content="index, follow">
```

Add the canonical tag directly after it:
```html
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://arsalanshaikh.dev">
```

- [ ] **Step 3: Null-check the form submit button in `script.js`**

Find (around line 305):
```js
            const submitButton = form.querySelector('button[type="submit"]');
            const originalContent = submitButton.innerHTML;
```

Replace with:
```js
            const submitButton = form.querySelector('button[type="submit"]');
            if (!submitButton) return;
            const originalContent = submitButton.innerHTML;
```

- [ ] **Step 4: Wrap localStorage.getItem in the blog catch block in `script.js`**

Find (around line 655):
```js
    } catch (error) {
        const cachedArticles = localStorage.getItem(CACHE_KEY);
        if (cachedArticles) {
            try {
                renderArticles(JSON.parse(cachedArticles));
```

Replace with:
```js
    } catch (error) {
        let cachedArticles = null;
        try { cachedArticles = localStorage.getItem(CACHE_KEY); } catch (_) {}
        if (cachedArticles) {
            try {
                renderArticles(JSON.parse(cachedArticles));
```

- [ ] **Step 5: Remove `getCurrentYear()` from `script.js`**

Find and delete the entire block (around lines 479–489):
```js
function getCurrentYear() {
    return new Date().getFullYear();
}

window.portfolioUtils = {
    debounce,
    throttle,
    isInViewport,
    getCurrentYear,
};
```

Replace with just the utils object without `getCurrentYear`:
```js
window.portfolioUtils = {
    debounce,
    throttle,
    isInViewport,
};
```

- [ ] **Step 6: Add `width` and `height` to blog article images in `script.js`**

Find (around line 736):
```js
                    <img src="${escapeHtml(thumbnail)}" alt="${escapeHtml(article.title)}" 
                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                         onerror="this.src='https://miro.medium.com/max/1200/1*5AwDJU5kQGt9U7nR3CjBQg.png'">
```

Replace with:
```js
                    <img src="${escapeHtml(thumbnail)}" alt="${escapeHtml(article.title)}" 
                         width="600" height="338"
                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                         onerror="this.src='https://miro.medium.com/max/1200/1*5AwDJU5kQGt9U7nR3CjBQg.png'">
```

(600×338 matches the 16:9 `aspect-video` container the image sits in.)

- [ ] **Step 7: Wrap `localStorage.setItem` in `navbar.js`**

Find (around line 131):
```js
                localStorage.setItem('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
```

Replace with:
```js
                try { localStorage.setItem('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark'); } catch (_) {}
```

- [ ] **Step 8: Commit**

```bash
git add index.html script.js components/navbar.js
git commit -m "fix: null check, localStorage guards, canonical tag, feather defer, image dimensions"
```

---

## Task 2: CSS dead code removal

**Files:**
- Modify: `style.css` — delete 3 dead blocks

Dead code confirmed by grep: `.skill-chip` and its variants are defined but the HTML only uses `.skill-tag` — `.skill-chip` has zero matches in `index.html`. `.motion-safe-hover` is defined but has zero matches in `index.html` or `script.js`. The first `html.light .glass-card` block (line 633) is a weaker duplicate of the second one (line 675) — both have the same selector with no media query, so line 633 is entirely overridden by line 675.

- [ ] **Step 1: Delete `.motion-safe-hover` block**

Find and delete this entire block (around lines 130–134):
```css
.motion-safe-hover {
    transition-property: transform, box-shadow, border-color, background-color, color;
    transition-duration: 0.24s;
    transition-timing-function: ease;
}
```

Replace with nothing (delete it entirely).

- [ ] **Step 2: Delete `.skill-chip` blocks**

Find and delete this block (around lines 403–422):
```css
/* ===== Skill Chips ===== */
/* Styling for skill badges displayed in the skills section */
/* Uses cyan color scheme with hover effects */
.skill-chip {
    display: inline-block;
    padding: 6px 14px;
    background: rgba(56, 189, 248, 0.12);        /* Subtle sky background */
    border: 1px solid rgba(56, 189, 248, 0.22);  /* Sky border */
    border-radius: 20px;                          /* Pill-shaped */
    font-size: 0.875rem;
    color: var(--primary);                        /* Branded text */
    transition: all 0.2s ease;                    /* Smooth hover transition */
}

/* Hover state for skill chips */
.skill-chip:hover {
    background: rgba(56, 189, 248, 0.2);          /* Stronger sky background on hover */
    transform: translateY(-2px);                  /* Lift effect */
    box-shadow: 0 4px 12px rgba(56, 189, 248, 0.22); /* Shadow on hover */
}
```

Also find and delete `html.light .skill-chip` block (around lines 639–644):
```css
/* Skill chips in light mode */
html.light .skill-chip {
    background: rgba(6, 182, 212, 0.08);       /* Very subtle cyan */
    border: 1px solid rgba(6, 182, 212, 0.15); /* Cyan border */
    color: #0e7490;                            /* Dark cyan text */
}
```

- [ ] **Step 3: Delete the first (weaker) `html.light .glass-card` block**

There are two `html.light .glass-card` blocks. The first one (around lines 632–637) is weaker and overridden by the second (around lines 675–679). Delete the first one:

```css
/* Glass card effect in light mode */
html.light .glass-card {
    background: rgba(255, 255, 255, 0.8);      /* Semi-transparent white */
    border: 1px solid rgba(0, 0, 0, 0.05);     /* Subtle dark border */
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05); /* Soft shadow */
}
```

Keep the second one (around line 675) — it has slightly stronger values and overrides the first anyway.

- [ ] **Step 4: Commit**

```bash
git add style.css
git commit -m "refactor: remove dead CSS (.skill-chip, .motion-safe-hover, duplicate glass-card)"
```

---

## Task 3: Wire project card GitHub links

**Files:**
- Modify: `script.js` — update `initGitHubStars()` to set GitHub link hrefs from `data-github`

Currently all project card GitHub icon links have `href="#"`. Each card already has `data-github="arsalanshaikhh/repo-name"` added in a previous session. The fix is to set the href unconditionally at the start of `initGitHubStars()` — before the async fetch — so links work even if the API is rate-limited.

- [ ] **Step 1: Update `initGitHubStars()` in `script.js`**

Find the `cards.forEach(async (card) => {` line in `initGitHubStars()` and the block that follows. The current function looks like:

```js
    cards.forEach(async (card) => {
        const repo = card.dataset.github;
        const badge = card.querySelector('.star-badge');
        if (!badge) return;

        try {
            const res = await fetch(`https://api.github.com/repos/${repo}`, {
```

Replace the opening of the `forEach` to wire the GitHub link href first, then proceed with the star fetch:

```js
    cards.forEach(async (card) => {
        const repo = card.dataset.github;

        // Wire the GitHub icon link href unconditionally
        const githubLink = card.querySelector('a[aria-label="GitHub"]');
        if (githubLink) githubLink.href = `https://github.com/${repo}`;

        const badge = card.querySelector('.star-badge');
        if (!badge) return;

        try {
            const res = await fetch(`https://api.github.com/repos/${repo}`, {
```

- [ ] **Step 2: Commit**

```bash
git add script.js
git commit -m "fix: wire project card GitHub links from data-github attribute"
```

---

## Summary

| Task | What it fixes | Files |
|------|--------------|-------|
| 1 | Feather defer, canonical tag, form null check, localStorage guards, remove unused getCurrentYear(), image dimensions | `index.html`, `script.js`, `navbar.js` |
| 2 | Delete dead CSS: `.skill-chip`, `.motion-safe-hover`, duplicate `html.light .glass-card` | `style.css` |
| 3 | Wire all project card GitHub icon links from `data-github` | `script.js` |
