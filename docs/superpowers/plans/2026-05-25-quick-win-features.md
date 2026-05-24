# Quick Win Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four self-contained UX features: availability badge, copy-email button, back-to-top button, and reading time on blog cards.

**Architecture:** All four features are purely additive — no existing code is restructured. Each feature touches at most 2 files (`index.html` + `style.css`, or `script.js` + `style.css`). They share no state and can be implemented and verified independently. The `CONFIG` object in `script.js` (line 1) is the single source of truth for the availability status flag.

**Tech Stack:** Vanilla HTML5, CSS3 custom properties (design tokens from Task 1), ES6+ JS, Feather Icons (already loaded), Clipboard API (browser-native)

---

## File Map

| File | Changes |
|------|---------|
| `index.html` | Availability badge markup in hero; copy-email button in contact; back-to-top button element |
| `style.css` | Badge styles; toast styles; back-to-top button styles |
| `script.js` | CONFIG flag; initCopyEmail(); initBackToTop(); reading time in renderArticles() |

---

## Task 1: Availability Badge

**Files:**
- Modify: `index.html` — hero section eyebrow (around line 104)
- Modify: `script.js` — CONFIG object (line 1–4), new `initAvailabilityBadge()` function
- Modify: `style.css` — badge styles appended at end

The badge replaces the static "Available for opportunities" eyebrow text with a dynamic version driven by `CONFIG.available`. When `true` it shows a pulsing green dot + "Open to work". When `false` it shows a grey dot + "Currently busy".

- [ ] **Step 1: Add `available` flag to CONFIG in `script.js`**

Find the `CONFIG` object at the very top of script.js (line 1). Change it to:

```js
const CONFIG = {
    email: 'arsalan.developer7@gmail.com',
    mediumFeedUrl: 'https://medium.com/feed/@arsalan-shaikh',
    mediumProfileUrl: 'https://medium.com/@arsalan-shaikh',
    available: true,  // set false when busy
};
```

- [ ] **Step 2: Replace the hero eyebrow markup in `index.html`**

Find the line (around line 104–106):
```html
<div class="hero-stagger delay-0 section-eyebrow justify-center mb-6">
    Available for opportunities
</div>
```

Replace it with:
```html
<div class="hero-stagger delay-0 section-eyebrow justify-center mb-6" id="availability-badge">
    <span class="avail-dot" id="avail-dot"></span>
    <span id="avail-text">Open to work</span>
</div>
```

- [ ] **Step 3: Add `initAvailabilityBadge()` to `script.js`**

Add `initAvailabilityBadge();` to the `DOMContentLoaded` handler. Then add this function:

```js
function initAvailabilityBadge() {
    const dot = document.getElementById('avail-dot');
    const text = document.getElementById('avail-text');
    if (!dot || !text) return;

    if (CONFIG.available) {
        dot.classList.add('avail-dot--open');
        text.textContent = 'Open to work';
    } else {
        dot.classList.add('avail-dot--busy');
        text.textContent = 'Currently busy';
    }
}
```

- [ ] **Step 4: Add badge CSS to `style.css`**

Append at the end of style.css:

```css
/* ===== Availability Badge ===== */
.avail-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}
.avail-dot--open {
    background: #22c55e;
    box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6);
    animation: avail-pulse 2s ease-in-out infinite;
}
.avail-dot--busy {
    background: #94a3b8;
}
@keyframes avail-pulse {
    0%   { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.6); }
    70%  { box-shadow: 0 0 0 7px rgba(34, 197, 94, 0); }
    100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
}
```

- [ ] **Step 5: Verify in browser**

Load the page. The hero eyebrow should show a pulsing green dot + "Open to work". Change `CONFIG.available` to `false`, reload — should show grey dot + "Currently busy". Change back to `true`.

- [ ] **Step 6: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: add availability badge to hero with CONFIG toggle"
```

---

## Task 2: Copy Email Button

**Files:**
- Modify: `index.html` — contact section email item (around line 818–823)
- Modify: `style.css` — copy button + toast styles
- Modify: `script.js` — `initCopyEmail()` function

Adds a small copy icon next to the email address in the contact section. Clicking it copies `CONFIG.email` to clipboard, then shows a "Copied!" toast that auto-dismisses after 2 seconds.

- [ ] **Step 1: Replace email contact item in `index.html`**

Find the email `contact-info__item` in the contact section (around lines 818–824):
```html
<div class="contact-info__item">
    <span class="contact-info__icon"><i data-feather="mail"></i></span>
    <div>
        <p class="contact-info__label">Email</p>
        <a href="mailto:arsalan.developer7@gmail.com" class="contact-info__value">arsalan.developer7@gmail.com</a>
    </div>
</div>
```

Replace with:
```html
<div class="contact-info__item">
    <span class="contact-info__icon"><i data-feather="mail"></i></span>
    <div>
        <p class="contact-info__label">Email</p>
        <div class="copy-email-row">
            <a href="mailto:arsalan.developer7@gmail.com" class="contact-info__value">arsalan.developer7@gmail.com</a>
            <button id="copy-email-btn" class="copy-btn" aria-label="Copy email address">
                <i data-feather="copy"></i>
            </button>
        </div>
    </div>
</div>
```

Also add the toast element just before the closing `</body>` tag:
```html
<div id="copy-toast" class="copy-toast" aria-live="polite" aria-atomic="true">Copied!</div>
```

- [ ] **Step 2: Add `initCopyEmail()` to `script.js`**

Add `initCopyEmail();` to the `DOMContentLoaded` handler. Then add:

```js
function initCopyEmail() {
    const btn = document.getElementById('copy-email-btn');
    const toast = document.getElementById('copy-toast');
    if (!btn || !toast) return;

    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(CONFIG.email);
        } catch {
            // Fallback for browsers without Clipboard API
            const ta = document.createElement('textarea');
            ta.value = CONFIG.email;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        }
        showCopyToast(toast);
    });
}

function showCopyToast(toast) {
    toast.classList.add('copy-toast--visible');
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
        toast.classList.remove('copy-toast--visible');
    }, 2000);
}
```

- [ ] **Step 3: Add copy button + toast CSS to `style.css`**

Append at end of style.css:

```css
/* ===== Copy Email ===== */
.copy-email-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.copy-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 26px; height: 26px;
    border: 1px solid var(--surface-border);
    border-radius: var(--radius-sm);
    background: transparent;
    color: var(--text-muted);
    cursor: pointer;
    transition: var(--transition-fast);
    flex-shrink: 0;
}
.copy-btn:hover {
    border-color: var(--primary);
    color: var(--primary);
    background: var(--primary-dim);
}
.copy-btn svg { width: 13px; height: 13px; }

.copy-toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(12px);
    background: #22c55e;
    color: #fff;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 0.5rem 1.25rem;
    border-radius: var(--radius-full);
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease, transform 0.2s ease;
    z-index: 9999;
    white-space: nowrap;
}
.copy-toast--visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}
```

- [ ] **Step 4: Verify in browser**

In the contact section, there should be a small copy icon next to the email address. Clicking it should show a green "Copied!" toast that slides up from the bottom and disappears after 2 seconds. Paste in a text field to confirm the email was actually copied.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: add copy-email button with toast confirmation"
```

---

## Task 3: Back to Top Button

**Files:**
- Modify: `index.html` — add button element before `</body>`
- Modify: `style.css` — button styles
- Modify: `script.js` — `initBackToTop()` function

A circular floating button (bottom-right) that appears when the user scrolls past 400px. Clicking it smoothly scrolls back to the hero section and triggers the cursor-hover state on entry.

- [ ] **Step 1: Add back-to-top button to `index.html`**

Find the `<div id="copy-toast" ...>` line added in Task 2 (before `</body>`). Add the back-to-top button right before it:

```html
<button id="back-to-top" class="back-to-top" aria-label="Back to top">
    <i data-feather="chevron-up"></i>
</button>
```

- [ ] **Step 2: Add `initBackToTop()` to `script.js`**

Add `initBackToTop();` to the `DOMContentLoaded` handler. Then add:

```js
function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    const SHOW_THRESHOLD = 400;

    const updateVisibility = () => {
        btn.classList.toggle('back-to-top--visible', window.scrollY > SHOW_THRESHOLD);
    };

    window.addEventListener('scroll', updateVisibility, { passive: true });
    updateVisibility();

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Wire up cursor hover state (same as other interactive elements)
    btn.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    btn.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
}
```

- [ ] **Step 3: Add back-to-top CSS to `style.css`**

Append at end of style.css:

```css
/* ===== Back to Top ===== */
.back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 44px; height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: #071521;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: var(--shadow-md);
    opacity: 0;
    transform: translateY(12px) scale(0.9);
    pointer-events: none;
    transition: opacity 0.25s ease, transform 0.25s ease, box-shadow 0.2s ease;
    z-index: 900;
}
.back-to-top--visible {
    opacity: 1;
    transform: translateY(0) scale(1);
    pointer-events: auto;
}
.back-to-top:hover {
    box-shadow: 0 8px 24px rgba(56,189,248,0.4);
    transform: translateY(-2px) scale(1.05);
}
.back-to-top svg { width: 18px; height: 18px; }

@media (max-width: 768px) {
    .back-to-top {
        bottom: 1.25rem;
        right: 1.25rem;
    }
}
```

- [ ] **Step 4: Verify in browser**

Scroll past 400px — the button should smoothly appear in the bottom-right. Clicking it should scroll back to the top smoothly. The button should disappear once the page is back at the top.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: add back-to-top floating button"
```

---

## Task 4: Reading Time on Blog Cards

**Files:**
- Modify: `script.js` — add `calcReadTime()` helper, update `renderArticles()` template

Calculates estimated reading time from the article's content (word count ÷ 200 words/minute, minimum 1 min). Displays it alongside the publication date in each blog card.

- [ ] **Step 1: Add `calcReadTime()` helper to `script.js`**

Add this function anywhere before `renderArticles()` in script.js:

```js
function calcReadTime(content) {
    const text = content ? content.replace(/<[^>]*>/g, '') : '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
}
```

- [ ] **Step 2: Update `renderArticles()` in `script.js` to show reading time**

In `renderArticles()`, find the date/footer row of the article card template. It currently looks like:

```js
<div class="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
    <span class="text-xs text-gray-500">${formattedDate}</span>
    <span class="text-xs text-emerald-400 flex items-center gap-1">
```

Update the entire footer `<div>` of the card template to include reading time. Replace the existing date/bottom row with:

```js
<div class="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
    <span class="text-xs text-gray-500">${formattedDate}</span>
    <span class="text-xs text-[#2dd4bf] flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        ${calcReadTime(article.content)} min read
    </span>
</div>
```

- [ ] **Step 3: Verify in browser**

Open the blog modal (click "Read Blogs"). Each article card should now show a clock icon + "N min read" in the bottom-right of the card footer, next to the publication date.

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "feat: add reading time estimate to blog cards"
```

---

## Summary

| Task | Feature | Files |
|------|---------|-------|
| 1 | Availability badge (CONFIG-driven, pulsing dot) | `index.html`, `style.css`, `script.js` |
| 2 | Copy email button + green toast | `index.html`, `style.css`, `script.js` |
| 3 | Back to top floating button | `index.html`, `style.css`, `script.js` |
| 4 | Reading time on blog cards | `script.js` |
