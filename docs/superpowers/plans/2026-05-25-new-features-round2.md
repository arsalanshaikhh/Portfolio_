# New Features Round 2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four self-contained UX features: animated stats counter, dark/light mode FOUC fix, scroll progress tooltip, and GitHub star count badges on project cards.

**Architecture:** All four features are purely additive. Tasks 1–3 touch at most 2 files each. Task 4 adds `data-github` attributes to project cards and a new JS function. Each feature is independent and can be verified in isolation. The `CONFIG` object in `script.js` (lines 1–6) is the single source of truth for global settings. Theme persistence is currently handled in `components/navbar.js connectedCallback()` — Task 2 moves it earlier (inline script in `<head>`) without removing the fallback in navbar.js.

**Tech Stack:** Vanilla HTML5, CSS3 custom properties, ES6+ JS, IntersectionObserver, requestAnimationFrame, GitHub REST API (unauthenticated, public repos), Feather Icons (already loaded)

---

## File Map

| File | Changes |
|------|---------|
| `index.html` | FOUC inline script in `<head>`; `data-github` on project cards; `data-stat-target` on hero stat numbers |
| `script.js` | `initStatsCounter()`; `initScrollProgressTooltip()` replaces `initScrollProgress()`; `initGitHubStars()` |
| `style.css` | Scroll progress tooltip styles; GitHub star badge styles |

---

## Task 1: Animated Stats Counter

**Files:**
- Modify: `index.html` — hero stats section (lines 127–138) — add `data-stat-target` attributes
- Modify: `script.js` — add `initStatsCounter()` and call it in DOMContentLoaded

The `.hero-stat__number` elements currently show static text like "3+", "15+", "10+". This task animates them from 0 up to their target value using IntersectionObserver + requestAnimationFrame. The "+" suffix is preserved. Animation fires once when the hero scrolls into view.

- [ ] **Step 1: Add `data-stat-target` to hero stat numbers in `index.html`**

Find (lines 127–138):
```html
<div class="hero-stagger delay-4 grid grid-cols-3 gap-4 max-w-md mx-auto mb-10">
    <div class="hero-stat">
        <span class="hero-stat__number">3+</span>
        <span class="hero-stat__label">Years</span>
    </div>
    <div class="hero-stat">
        <span class="hero-stat__number">15+</span>
        <span class="hero-stat__label">Projects</span>
    </div>
    <div class="hero-stat">
        <span class="hero-stat__number">10+</span>
        <span class="hero-stat__label">Technologies</span>
    </div>
</div>
```

Replace with:
```html
<div class="hero-stagger delay-4 grid grid-cols-3 gap-4 max-w-md mx-auto mb-10">
    <div class="hero-stat">
        <span class="hero-stat__number" data-stat-target="3" data-stat-suffix="+">3+</span>
        <span class="hero-stat__label">Years</span>
    </div>
    <div class="hero-stat">
        <span class="hero-stat__number" data-stat-target="15" data-stat-suffix="+">15+</span>
        <span class="hero-stat__label">Projects</span>
    </div>
    <div class="hero-stat">
        <span class="hero-stat__number" data-stat-target="10" data-stat-suffix="+">10+</span>
        <span class="hero-stat__label">Technologies</span>
    </div>
</div>
```

- [ ] **Step 2: Add `initStatsCounter()` to `script.js`**

Add `initStatsCounter();` to the DOMContentLoaded handler (after the existing calls). Then add this function:

```js
function initStatsCounter() {
    const stats = document.querySelectorAll('[data-stat-target]');
    if (!stats.length) return;

    const animateStat = (el) => {
        const target = parseInt(el.dataset.statTarget, 10);
        const suffix = el.dataset.statSuffix || '';
        const duration = 1200;
        const start = performance.now();

        const step = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStat(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(el => observer.observe(el));
}
```

- [ ] **Step 3: Verify in browser**

Load the page. When the hero section loads (it's at the top so it fires immediately), the three stat numbers should animate from 0 up to 3+, 15+, 10+ over about 1.2 seconds with an ease-out cubic curve. Reload to watch again.

- [ ] **Step 4: Commit**

```bash
git add index.html script.js
git commit -m "feat: add animated stats counter to hero section"
```

---

## Task 2: Dark/Light Mode FOUC Fix

**Files:**
- Modify: `index.html` — add inline script in `<head>` before any stylesheets

**What FOUC is:** The page HTML starts with `class="dark"` on `<html>`. If the user previously set light mode, `localStorage` has `theme: 'light'`. Currently the navbar's `initEventListeners()` reads localStorage and adds `class="light"` — but this fires after CSS is parsed and the page is already painted dark, causing a visible flash to light.

**Fix:** An inline (non-deferred, non-async) `<script>` in `<head>` runs synchronously before first paint. It reads `localStorage` and sets the class before any CSS is applied.

- [ ] **Step 1: Add inline FOUC-prevention script to `<head>` in `index.html`**

Find this exact line near the top of `<head>` (around line 50):
```html
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="assets/my-avatar.png">
```

Insert the inline script BEFORE the `<!-- Favicon -->` comment (it must be before any `<link rel="stylesheet">` tags to guarantee it runs first):

```html
    <!-- Theme FOUC prevention: runs synchronously before first paint -->
    <script>
        (function(){
            try {
                var t = localStorage.getItem('theme');
                if (t === 'light') document.documentElement.classList.add('light');
                else document.documentElement.classList.remove('light');
            } catch(e) {}
        })();
    </script>
```

The `try/catch` guards against private-browsing environments where `localStorage` access throws. The navbar's existing theme-load code in `initEventListeners()` becomes a no-op for the first load (class already set) but stays as a safe fallback.

- [ ] **Step 2: Verify in browser**

1. Open the page in dark mode (default). Open DevTools → Application → Local Storage. Set `theme` to `light`.
2. Hard-reload (Ctrl+Shift+R / Cmd+Shift+R).
3. The page should render light from the very first frame — no dark flash.
4. Clear localStorage and reload — should render dark without any flash.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "fix: prevent light/dark mode FOUC with inline head script"
```

---

## Task 3: Scroll Progress Tooltip

**Files:**
- Modify: `script.js` — update `initScrollProgress()` to also create + update a section-name label
- Modify: `style.css` — add tooltip label styles

The existing `initScrollProgress()` creates a 2px bar at the top of the page showing scroll percentage. This task adds a small pill-shaped label beside the right end of the bar that shows the current section name (e.g. "Experience", "Projects") as the user scrolls. The label fades in when scrolling starts and fades out after 1.5 s of inactivity.

Section names map to the section IDs already in the page: `hero → Home`, `career → About`, `skills → Skills`, `experience → Experience`, `projects → Projects`, `projects2 → Featured`, `education → Education`, `contact → Contact`.

- [ ] **Step 1: Replace `initScrollProgress()` in `script.js`**

Find the entire existing `initScrollProgress()` function (lines 167–199) and replace it with:

```js
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 2px;
        background: linear-gradient(to right, #06b6d4, #8b5cf6);
        z-index: 9999;
        transition: width 0.1s ease;
        width: 0%;
        box-shadow: 0 0 12px rgba(56, 189, 248, 0.45);
    `;
    document.body.appendChild(progressBar);

    const tooltip = document.createElement('div');
    tooltip.id = 'scroll-tooltip';
    tooltip.className = 'scroll-tooltip';
    document.body.appendChild(tooltip);

    const SECTION_NAMES = {
        hero: 'Home',
        career: 'About',
        skills: 'Skills',
        experience: 'Experience',
        projects: 'Projects',
        projects2: 'Featured',
        education: 'Education',
        contact: 'Contact',
    };

    const sectionIds = Object.keys(SECTION_NAMES);
    let hideTimer = null;

    const getCurrentSection = () => {
        const scrollMid = window.scrollY + window.innerHeight / 2;
        let current = sectionIds[0];
        for (const id of sectionIds) {
            const el = document.getElementById(id);
            if (el && el.offsetTop <= scrollMid) current = id;
        }
        return current;
    };

    const showTooltip = (sectionId) => {
        const name = SECTION_NAMES[sectionId] || sectionId;
        tooltip.textContent = name;
        tooltip.classList.add('scroll-tooltip--visible');
        clearTimeout(hideTimer);
        hideTimer = setTimeout(() => tooltip.classList.remove('scroll-tooltip--visible'), 1500);
    };

    let ticking = false;
    let lastSection = null;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                progressBar.style.width = Math.min(scrollPercent, 100) + '%';

                const section = getCurrentSection();
                if (section !== lastSection) {
                    lastSection = section;
                    showTooltip(section);
                } else {
                    // Refresh hide timer on continued scroll in same section
                    clearTimeout(hideTimer);
                    tooltip.classList.add('scroll-tooltip--visible');
                    hideTimer = setTimeout(() => tooltip.classList.remove('scroll-tooltip--visible'), 1500);
                }

                ticking = false;
            });
            ticking = true;
        }
    });
}
```

- [ ] **Step 2: Add scroll tooltip CSS to `style.css`**

Append at the end of `style.css`:

```css
/* ===== Scroll Progress Tooltip ===== */
.scroll-tooltip {
    position: fixed;
    top: 6px;
    right: 1rem;
    background: rgba(15, 23, 42, 0.85);
    color: #e2e8f0;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    padding: 2px 8px;
    border-radius: var(--radius-full);
    border: 1px solid rgba(56, 189, 248, 0.3);
    z-index: 9999;
    pointer-events: none;
    opacity: 0;
    transform: translateY(-4px);
    transition: opacity 0.2s ease, transform 0.2s ease;
    white-space: nowrap;
}
.scroll-tooltip--visible {
    opacity: 1;
    transform: translateY(0);
}
html.light .scroll-tooltip {
    background: rgba(255, 255, 255, 0.9);
    color: #334155;
    border-color: rgba(8, 145, 178, 0.3);
}
```

- [ ] **Step 3: Verify in browser**

Scroll the page. A small pill label should appear at the top-right corner (right end of the progress bar area) showing the current section name ("Home", "About", "Skills", etc.). It should fade out after 1.5 s of no scrolling and reappear when scrolling resumes.

- [ ] **Step 4: Commit**

```bash
git add script.js style.css
git commit -m "feat: add section-name tooltip to scroll progress bar"
```

---

## Task 4: Project Card GitHub Star Count

**Files:**
- Modify: `index.html` — add `data-github="owner/repo"` to project cards
- Modify: `script.js` — add `initGitHubStars()` function and call from DOMContentLoaded
- Modify: `style.css` — add star badge styles

Fetches live star counts from the GitHub REST API (unauthenticated, 60 req/hour limit) and injects a star badge into each project card. Cards without a `data-github` attribute are silently skipped. If the API returns an error or network fails, the badge stays hidden — no broken UI.

The GitHub user is `arsalanshaikhh` (from the JSON-LD in `index.html`). Since the portfolio project cards are examples, we use plausible repo names. Cards that have `href="#"` links don't have real repos yet, so we add `data-github` only to the two cards that might match real repos. The feature still shows the badge infrastructure on all cards that have the attribute.

- [ ] **Step 1: Add `data-github` attributes to project cards in `index.html`**

Find each project card's opening `<div class="project-card ...">` tag and add `data-github="arsalanshaikhh/repo-name"`. Use the following mapping (add only to cards where a real public repo is plausible — leave others without the attribute so they show nothing):

```html
<!-- ResumePilot -->
<div class="project-card glass-card p-6" data-category="ai fullstack" data-aos="fade-up" data-github="arsalanshaikhh/ResumePilot">

<!-- Blueprint AI -->
<div class="project-card glass-card p-6" data-category="ai fullstack" data-aos="fade-up" data-aos-delay="60" data-github="arsalanshaikhh/Blueprint-AI">

<!-- Crypto Tracker -->
<div class="project-card glass-card p-6" data-category="frontend fullstack" data-aos="fade-up" data-aos-delay="120" data-github="arsalanshaikhh/crypto-tracker">

<!-- PawHaven -->
<div class="project-card glass-card p-6" data-category="fullstack" data-aos="fade-up" data-aos-delay="180" data-github="arsalanshaikhh/PawHaven">

<!-- DocChat -->
<div class="project-card glass-card p-6" data-category="ai" data-aos="fade-up" data-aos-delay="240" data-github="arsalanshaikhh/DocChat">

<!-- ShopFlow -->
<div class="project-card glass-card p-6" data-category="frontend" data-aos="fade-up" data-aos-delay="300" data-github="arsalanshaikhh/ShopFlow">
```

Also, inside each of those cards, add a star badge placeholder right after the opening `<div class="project-card__header">` tag's closing `</div>` — i.e., after the header block. Actually, place it more precisely: inside `.project-card__links`, add a star badge span that will be populated by JS. Or better: add a `<div class="star-badge" style="display:none"></div>` right after `</div>` of `.project-card__header`.

Add `<div class="star-badge" style="display:none"></div>` immediately after each `<div class="project-card__header">...</div>` closing tag for each of the 6 cards above. Example for ResumePilot:

```html
<div class="project-card glass-card p-6" data-category="ai fullstack" data-aos="fade-up" data-github="arsalanshaikhh/ResumePilot">
    <div class="project-card__header">
        <span class="project-card__icon">🤖</span>
        <div class="project-card__links">
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub" class="project-link"><i data-feather="github"></i></a>
            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Live demo" class="project-link"><i data-feather="external-link"></i></a>
        </div>
    </div>
    <div class="star-badge" style="display:none"></div>
    <h3 class="project-card__title">ResumePilot</h3>
    ...
```

Do the same pattern for all 6 project cards that have `data-github`.

- [ ] **Step 2: Add `initGitHubStars()` to `script.js`**

Add `initGitHubStars();` to the DOMContentLoaded handler. Then add:

```js
function initGitHubStars() {
    const cards = document.querySelectorAll('[data-github]');
    if (!cards.length) return;

    const formatStars = (n) => {
        if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
        return String(n);
    };

    cards.forEach(async (card) => {
        const repo = card.dataset.github;
        const badge = card.querySelector('.star-badge');
        if (!badge) return;

        try {
            const res = await fetch(`https://api.github.com/repos/${repo}`, {
                headers: { Accept: 'application/vnd.github.v3+json' },
            });
            if (!res.ok) return;
            const data = await res.json();
            const stars = data.stargazers_count;
            badge.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                ${formatStars(stars)}
            `;
            badge.style.display = 'inline-flex';
        } catch {
            // Network error or repo private — badge stays hidden
        }
    });
}
```

- [ ] **Step 3: Add star badge CSS to `style.css`**

Append at end of `style.css`:

```css
/* ===== GitHub Star Badge ===== */
.star-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-muted);
    background: rgba(56, 189, 248, 0.08);
    border: 1px solid rgba(56, 189, 248, 0.2);
    border-radius: var(--radius-full);
    padding: 2px 8px;
    margin-bottom: 0.5rem;
    transition: var(--transition-fast);
}
.star-badge svg {
    color: #f59e0b;
    flex-shrink: 0;
}
html.light .star-badge {
    background: rgba(8, 145, 178, 0.06);
    border-color: rgba(8, 145, 178, 0.2);
}
```

- [ ] **Step 4: Verify in browser**

Open the Projects section. For repos that exist on GitHub under `arsalanshaikhh`, a small gold-star badge should appear below each card header showing the star count. For repos that don't exist (404), no badge appears — the card looks unchanged. Open DevTools → Network to confirm API calls are made on page load.

- [ ] **Step 5: Commit**

```bash
git add index.html script.js style.css
git commit -m "feat: add GitHub star count badges to project cards"
```

---

## Summary

| Task | Feature | Files |
|------|---------|-------|
| 1 | Animated stats counter (ease-out cubic, IntersectionObserver) | `index.html`, `script.js` |
| 2 | Dark/light mode FOUC fix (inline head script) | `index.html` |
| 3 | Scroll progress tooltip (section name pill) | `script.js`, `style.css` |
| 4 | GitHub star count badges on project cards | `index.html`, `script.js`, `style.css` |
