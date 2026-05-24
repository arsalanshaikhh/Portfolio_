# Portfolio UI Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Revamp the portfolio UI to be visually distinctive, polished, and modern while keeping the vanilla HTML/CSS/JS stack.

**Architecture:** All changes are confined to 5 files — `style.css`, `script.js`, `index.html`, `components/navbar.js`, `components/footer.js`. No build step is added; improvements use CDN libraries where needed (AOS for scroll animations, Typed.js for typewriter). Sections are tackled independently so each task produces a visible improvement on its own.

**Tech Stack:** HTML5, Tailwind CSS (CDN), Vanilla ES6+ JS, AOS (scroll animations), Typed.js (typewriter), Feather Icons, Syne + DM Sans fonts, Netlify

---

## File Map

| File | Changes |
|------|---------|
| `style.css` | New CSS variables, typography scale, timeline styles, cursor styles, skills grid, project filter styles |
| `script.js` | Scroll-spy, typewriter init, project filter, custom cursor, staggered card animations |
| `index.html` | Hero markup, skills markup, experience timeline markup, project filter UI, contact layout |
| `components/navbar.js` | Scroll-spy active class logic |

---

## Task 1: Design System — CSS Variables & Typography

**Files:**
- Modify: `style.css` (lines 1–25, CSS variables block)

Replace the `:root` block and add a typographic scale. This is the foundation — all later tasks reference these tokens.

- [ ] **Step 1: Replace the `:root` block in `style.css`**

Find the existing `:root { ... }` block (lines 8–21) and replace it with:

```css
:root {
    /* Brand colors */
    --primary:        #38bdf8;
    --primary-dim:    rgba(56, 189, 248, 0.15);
    --secondary:      #2dd4bf;
    --accent:         #f59e0b;
    --accent-dim:     rgba(245, 158, 11, 0.15);
    --danger:         #f87171;

    /* Backgrounds */
    --bg:             #060f1a;
    --bg-soft:        #0b1d2e;
    --bg-card:        rgba(8, 20, 34, 0.75);

    /* Surfaces */
    --surface:        rgba(10, 27, 40, 0.72);
    --surface-border: rgba(125, 211, 252, 0.12);
    --surface-hover:  rgba(45, 212, 191, 0.08);

    /* Text */
    --text-primary:   #e2e8f0;
    --text-secondary: #94a3b8;
    --text-muted:     #475569;

    /* Fonts */
    --font-display: 'Syne', sans-serif;
    --font-body:    'DM Sans', sans-serif;
    --font-mono:    'JetBrains Mono', 'Fira Code', monospace;

    /* Spacing scale */
    --space-xs:  0.25rem;
    --space-sm:  0.5rem;
    --space-md:  1rem;
    --space-lg:  1.5rem;
    --space-xl:  2.5rem;
    --space-2xl: 4rem;

    /* Radius */
    --radius-sm:  8px;
    --radius-md:  12px;
    --radius-lg:  18px;
    --radius-xl:  24px;
    --radius-full: 999px;

    /* Transitions */
    --transition-fast:   0.15s ease;
    --transition-base:   0.25s ease;
    --transition-slow:   0.45s ease;

    /* Shadows */
    --shadow-sm:  0 4px 12px rgba(0,0,0,0.3);
    --shadow-md:  0 8px 28px rgba(0,0,0,0.35);
    --shadow-lg:  0 20px 50px rgba(0,0,0,0.4);
    --shadow-glow: 0 0 20px rgba(56, 189, 248, 0.2);
}
```

- [ ] **Step 2: Update `body.site-shell` background to use new `--bg` token**

Find `background: radial-gradient...` inside `body.site-shell` and replace with:

```css
body.site-shell {
    background:
        radial-gradient(ellipse at 0% 0%, rgba(56, 189, 248, 0.10) 0%, transparent 50%),
        radial-gradient(ellipse at 100% 0%, rgba(45, 212, 191, 0.08) 0%, transparent 40%),
        radial-gradient(ellipse at 50% 100%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
        var(--bg);
    color: var(--text-primary);
    overflow-x: hidden;
    font-family: var(--font-body);
}
```

- [ ] **Step 3: Add typographic utility classes after the `h1, h2, h3` block**

```css
/* Typographic scale */
.text-display {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 6vw, 5rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    line-height: 1.05;
}
.text-headline {
    font-family: var(--font-display);
    font-size: clamp(1.75rem, 3vw, 2.5rem);
    font-weight: 700;
    letter-spacing: -0.02em;
}
.text-label {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-muted);
}
.gradient-text {
    background: linear-gradient(135deg, var(--primary) 0%, #818cf8 50%, var(--secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
.section-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--primary);
    margin-bottom: 1rem;
}
.section-eyebrow::before {
    content: '';
    width: 24px;
    height: 2px;
    background: var(--primary);
    border-radius: 2px;
}
```

- [ ] **Step 4: Verify in browser**

Open `index.html` in a browser. The page should render normally — no broken styles. The background may look slightly different (deeper, more atmospheric). Colors should still match the original palette.

- [ ] **Step 5: Commit**

```bash
git add style.css
git commit -m "design: update CSS variables and typography scale"
```

---

## Task 2: Add AOS & Typed.js via CDN + Init in script.js

**Files:**
- Modify: `index.html` (CDN script tags in `<head>`)
- Modify: `script.js` (init functions)

- [ ] **Step 1: Add AOS and Typed.js CDN links to `index.html` `<head>`**

Find the closing `</head>` tag in `index.html` and add before it:

```html
    <!-- AOS scroll animations -->
    <link rel="stylesheet" href="https://unpkg.com/aos@2.3.4/dist/aos.css" />
    <script src="https://unpkg.com/aos@2.3.4/dist/aos.js" defer></script>
    <!-- Typed.js typewriter -->
    <script src="https://unpkg.com/typed.js@2.1.0/dist/typed.umd.js" defer></script>
```

- [ ] **Step 2: Initialize AOS in `script.js`**

In the `DOMContentLoaded` listener, add `initAOS();` call after `initScrollAnimations();`. Then add this function:

```js
function initAOS() {
    if (typeof AOS === 'undefined') return;
    AOS.init({
        duration: 600,
        easing: 'ease-out-cubic',
        once: true,
        offset: 60,
        delay: 0,
    });
}
```

- [ ] **Step 3: Verify in browser console**

Open browser DevTools → Console. Reload the page. There should be no errors about AOS or Typed being undefined (they load deferred, so errors only appear if the CDN fails). Network tab should show both scripts loading with status 200.

- [ ] **Step 4: Commit**

```bash
git add index.html script.js
git commit -m "feat: add AOS and Typed.js CDN libraries"
```

---

## Task 3: Hero Section Revamp

**Files:**
- Modify: `index.html` (hero section, lines ~82–187)
- Modify: `style.css` (hero styles)
- Modify: `script.js` (typewriter init)

- [ ] **Step 1: Replace hero section in `index.html`**

Find `<section id="hero" ...>` through its closing `</section>` (lines ~82–187) and replace with:

```html
<section id="hero" class="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
    <!-- Background grid -->
    <div class="hero-grid-bg" aria-hidden="true"></div>
    <!-- Glow orbs -->
    <div class="hero-orb hero-orb--1" aria-hidden="true"></div>
    <div class="hero-orb hero-orb--2" aria-hidden="true"></div>
    <div class="hero-orb hero-orb--3" aria-hidden="true"></div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-4xl mx-auto text-center">

            <!-- Eyebrow label -->
            <div class="hero-stagger delay-0 section-eyebrow justify-center mb-6">
                Available for opportunities
            </div>

            <!-- Name -->
            <h1 class="hero-stagger delay-1 text-display gradient-text mb-4">
                Arsalan Shaikh
            </h1>

            <!-- Typewriter role -->
            <div class="hero-stagger delay-2 flex items-center justify-center gap-3 mb-6 text-xl sm:text-2xl text-gray-300 font-medium">
                <span class="text-gray-500">I build</span>
                <span id="typed-roles" class="text-primary font-semibold"></span>
            </div>

            <!-- Bio -->
            <p class="hero-stagger delay-3 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
                Full-stack developer with 3+ years crafting scalable applications, AI-powered tools, and seamless digital experiences.
            </p>

            <!-- Stats row -->
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

            <!-- CTAs -->
            <div class="hero-stagger delay-5 hero-actions flex flex-wrap items-center justify-center gap-4">
                <button id="read-blogs-btn" class="btn-primary">
                    <i data-feather="book-open"></i>
                    Read Blogs
                </button>
                <a href="#contact" class="btn-secondary">
                    <i data-feather="mail"></i>
                    Contact Me
                </a>
                <details class="resume-dropdown relative" aria-label="Download resume">
                    <summary class="btn-ghost list-none cursor-pointer">
                        <i data-feather="download"></i>
                        Resume
                        <i data-feather="chevron-down" class="resume-chevron"></i>
                    </summary>
                    <div id="resume-menu" class="resume-menu">
                        <a href="https://arsalan-cv.vercel.app/cv-pdf/full-stack-developer-resume.pdf" target="_blank" rel="noopener" class="resume-menu__item">
                            <i data-feather="layers"></i> Full Stack
                        </a>
                        <a href="https://arsalan-cv.vercel.app/cv-pdf/front-end-developer-resume.pdf" target="_blank" rel="noopener" class="resume-menu__item">
                            <i data-feather="monitor"></i> Frontend
                        </a>
                    </div>
                </details>
            </div>

            <!-- Scroll indicator -->
            <div class="hero-stagger delay-5 mt-16 flex justify-center">
                <a href="#career" class="scroll-indicator" aria-label="Scroll down">
                    <i data-feather="chevron-down"></i>
                </a>
            </div>

        </div>
    </div>
</section>
```

- [ ] **Step 2: Add hero CSS to `style.css`**

Append after the existing `.glass-card` block:

```css
/* ===== Hero ===== */
.hero-grid-bg {
    position: absolute;
    inset: 0;
    background-image:
        linear-gradient(rgba(56,189,248,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(56,189,248,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
    pointer-events: none;
}

.hero-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    animation: orb-pulse 8s ease-in-out infinite;
}
.hero-orb--1 {
    width: 500px; height: 500px;
    top: -10%; left: -5%;
    background: radial-gradient(circle, rgba(56,189,248,0.12), transparent 70%);
    animation-delay: 0s;
}
.hero-orb--2 {
    width: 400px; height: 400px;
    top: 20%; right: -5%;
    background: radial-gradient(circle, rgba(45,212,191,0.10), transparent 70%);
    animation-delay: -3s;
}
.hero-orb--3 {
    width: 300px; height: 300px;
    bottom: 10%; left: 30%;
    background: radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%);
    animation-delay: -6s;
}
@keyframes orb-pulse {
    0%, 100% { transform: scale(1) translate(0,0); opacity: 0.7; }
    33%       { transform: scale(1.08) translate(15px, -10px); opacity: 1; }
    66%       { transform: scale(0.95) translate(-10px, 12px); opacity: 0.8; }
}

/* Hero stat cards */
.hero-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.75rem 1rem;
    background: var(--surface);
    border: 1px solid var(--surface-border);
    border-radius: var(--radius-md);
    backdrop-filter: blur(8px);
}
.hero-stat__number {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
.hero-stat__label {
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin-top: 2px;
}

/* Scroll indicator */
.scroll-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px; height: 40px;
    border: 1px solid var(--surface-border);
    border-radius: 50%;
    color: var(--text-secondary);
    transition: var(--transition-base);
    animation: bounce-y 2s ease-in-out infinite;
}
.scroll-indicator:hover {
    border-color: var(--primary);
    color: var(--primary);
}
@keyframes bounce-y {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(6px); }
}

/* Shared button system */
.btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: #071521;
    font-weight: 700;
    font-size: 0.9rem;
    border-radius: var(--radius-md);
    border: none;
    cursor: pointer;
    transition: var(--transition-base);
    text-decoration: none;
}
.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(56,189,248,0.35);
}
.btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: transparent;
    color: var(--secondary);
    font-weight: 600;
    font-size: 0.9rem;
    border-radius: var(--radius-md);
    border: 1.5px solid rgba(45,212,191,0.4);
    cursor: pointer;
    transition: var(--transition-base);
    text-decoration: none;
}
.btn-secondary:hover {
    background: rgba(45,212,191,0.08);
    border-color: var(--secondary);
    transform: translateY(-2px);
}
.btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: var(--surface);
    color: var(--text-secondary);
    font-weight: 500;
    font-size: 0.9rem;
    border-radius: var(--radius-md);
    border: 1px solid var(--surface-border);
    cursor: pointer;
    transition: var(--transition-base);
    text-decoration: none;
}
.btn-ghost:hover {
    border-color: rgba(56,189,248,0.3);
    color: var(--text-primary);
}

/* Resume dropdown */
.resume-dropdown { position: relative; }
.resume-menu {
    position: absolute;
    top: calc(100% + 8px);
    left: 50%;
    transform: translateX(-50%);
    min-width: 160px;
    background: #0b1d2e;
    border: 1px solid var(--surface-border);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    z-index: 50;
}
.resume-menu__item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.65rem 1rem;
    color: var(--text-secondary);
    font-size: 0.875rem;
    text-decoration: none;
    transition: var(--transition-fast);
}
.resume-menu__item:hover {
    background: var(--surface-hover);
    color: var(--text-primary);
}
.resume-chevron {
    width: 14px !important;
    height: 14px !important;
    transition: transform var(--transition-fast);
}
.resume-dropdown[open] .resume-chevron {
    transform: rotate(180deg);
}
```

- [ ] **Step 3: Initialize Typed.js in `script.js`**

Add `initTypewriter();` call in the `DOMContentLoaded` handler, then add:

```js
function initTypewriter() {
    const el = document.getElementById('typed-roles');
    if (!el || typeof Typed === 'undefined') return;
    new Typed('#typed-roles', {
        strings: [
            'Full-Stack Apps',
            'AI-Powered Tools',
            'React Interfaces',
            'REST APIs',
            'Cloud Solutions',
        ],
        typeSpeed: 55,
        backSpeed: 30,
        backDelay: 1800,
        loop: true,
        smartBackspace: true,
    });
}
```

- [ ] **Step 4: Verify in browser**

Load the page. The hero should show:
- Bold gradient "Arsalan Shaikh" heading
- Animated typewriter cycling through roles
- 3 stat cards
- 3 CTA buttons (Blogs, Contact Me, Resume dropdown)
- Bouncing scroll indicator at bottom
- Subtle grid background with glowing orbs

- [ ] **Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: revamp hero section with typewriter and new layout"
```

---

## Task 4: Navbar Scroll-Spy

**Files:**
- Modify: `components/navbar.js`
- Modify: `style.css`

- [ ] **Step 1: Add scroll-spy logic to `components/navbar.js`**

Open `components/navbar.js`. Find the `connectedCallback()` method and add a call to `this._initScrollSpy()` at the end of it. Then add this method inside the class:

```js
_initScrollSpy() {
    const sections = ['hero','career','skills','experience','projects','education','certifications','contact'];
    const links = this.shadowRoot.querySelectorAll('nav a[href^="#"]');

    const setActive = (id) => {
        links.forEach(link => {
            const isActive = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('nav-link--active', isActive);
        });
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActive(entry.target.id);
            }
        });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
}
```

- [ ] **Step 2: Add `.nav-link--active` style inside the navbar's Shadow DOM styles**

In `components/navbar.js`, find the `<style>` block inside the shadow DOM template and add:

```css
.nav-link--active {
    color: var(--primary, #38bdf8) !important;
}
.nav-link--active::after {
    width: 100% !important;
    opacity: 1 !important;
}
```

- [ ] **Step 3: Verify in browser**

Scroll through the page. The active nav link should highlight as each section enters the viewport. Only one link is active at a time.

- [ ] **Step 4: Commit**

```bash
git add components/navbar.js style.css
git commit -m "feat: add scroll-spy active state to navbar"
```

---

## Task 5: Skills Section Redesign

**Files:**
- Modify: `index.html` (skills section, lines ~206–313)
- Modify: `style.css`

- [ ] **Step 1: Replace skills section in `index.html`**

Find `<section id="skills" ...>` through `</section>` and replace with:

```html
<section id="skills" class="py-24 relative">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14" data-aos="fade-up">
            <div class="section-eyebrow justify-center">What I work with</div>
            <h2 class="text-headline gradient-text">Technical Skills</h2>
            <p class="text-gray-400 mt-3 max-w-xl mx-auto text-sm">Tools and technologies I use to build products from idea to deployment.</p>
        </div>

        <div class="skills-grid">
            <!-- Frontend -->
            <div class="skill-category" data-aos="fade-up" data-aos-delay="0">
                <div class="skill-category__header">
                    <span class="skill-category__icon"><i data-feather="monitor"></i></span>
                    <span>Frontend</span>
                </div>
                <div class="skill-tags">
                    <span class="skill-tag skill-tag--primary">React</span>
                    <span class="skill-tag skill-tag--primary">Next.js</span>
                    <span class="skill-tag">TypeScript</span>
                    <span class="skill-tag">Tailwind CSS</span>
                    <span class="skill-tag">JavaScript</span>
                    <span class="skill-tag">HTML5 / CSS3</span>
                    <span class="skill-tag">Redux</span>
                    <span class="skill-tag">Framer Motion</span>
                </div>
            </div>

            <!-- Backend -->
            <div class="skill-category" data-aos="fade-up" data-aos-delay="80">
                <div class="skill-category__header">
                    <span class="skill-category__icon"><i data-feather="server"></i></span>
                    <span>Backend</span>
                </div>
                <div class="skill-tags">
                    <span class="skill-tag skill-tag--secondary">Node.js</span>
                    <span class="skill-tag skill-tag--secondary">Python</span>
                    <span class="skill-tag">Django</span>
                    <span class="skill-tag">Express</span>
                    <span class="skill-tag">REST APIs</span>
                    <span class="skill-tag">GraphQL</span>
                    <span class="skill-tag">FastAPI</span>
                </div>
            </div>

            <!-- Databases -->
            <div class="skill-category" data-aos="fade-up" data-aos-delay="160">
                <div class="skill-category__header">
                    <span class="skill-category__icon"><i data-feather="database"></i></span>
                    <span>Databases</span>
                </div>
                <div class="skill-tags">
                    <span class="skill-tag">PostgreSQL</span>
                    <span class="skill-tag">MongoDB</span>
                    <span class="skill-tag">MySQL</span>
                    <span class="skill-tag">Redis</span>
                    <span class="skill-tag">Supabase</span>
                    <span class="skill-tag">Firebase</span>
                </div>
            </div>

            <!-- AI & ML -->
            <div class="skill-category" data-aos="fade-up" data-aos-delay="240">
                <div class="skill-category__header">
                    <span class="skill-category__icon"><i data-feather="cpu"></i></span>
                    <span>AI & ML</span>
                </div>
                <div class="skill-tags">
                    <span class="skill-tag skill-tag--accent">Claude API</span>
                    <span class="skill-tag skill-tag--accent">OpenAI</span>
                    <span class="skill-tag">LangChain</span>
                    <span class="skill-tag">LLM Integration</span>
                    <span class="skill-tag">Prompt Engineering</span>
                    <span class="skill-tag">RAG</span>
                </div>
            </div>

            <!-- DevOps -->
            <div class="skill-category" data-aos="fade-up" data-aos-delay="320">
                <div class="skill-category__header">
                    <span class="skill-category__icon"><i data-feather="git-branch"></i></span>
                    <span>DevOps</span>
                </div>
                <div class="skill-tags">
                    <span class="skill-tag">Docker</span>
                    <span class="skill-tag">Git / GitHub</span>
                    <span class="skill-tag">CI/CD</span>
                    <span class="skill-tag">Nginx</span>
                    <span class="skill-tag">Linux</span>
                    <span class="skill-tag">Netlify</span>
                    <span class="skill-tag">Vercel</span>
                </div>
            </div>

            <!-- Cloud -->
            <div class="skill-category" data-aos="fade-up" data-aos-delay="400">
                <div class="skill-category__header">
                    <span class="skill-category__icon"><i data-feather="cloud"></i></span>
                    <span>Cloud</span>
                </div>
                <div class="skill-tags">
                    <span class="skill-tag">AWS</span>
                    <span class="skill-tag">GCP</span>
                    <span class="skill-tag">Azure</span>
                    <span class="skill-tag">S3</span>
                    <span class="skill-tag">EC2</span>
                    <span class="skill-tag">Cloudflare</span>
                </div>
            </div>
        </div>
    </div>
</section>
```

- [ ] **Step 2: Add skills CSS to `style.css`**

```css
/* ===== Skills ===== */
.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.25rem;
}
.skill-category {
    background: var(--surface);
    border: 1px solid var(--surface-border);
    border-radius: var(--radius-lg);
    padding: 1.25rem 1.5rem;
    backdrop-filter: blur(10px);
    transition: var(--transition-base);
}
.skill-category:hover {
    border-color: rgba(56,189,248,0.25);
    box-shadow: var(--shadow-glow);
    transform: translateY(-2px);
}
.skill-category__header {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 0.9rem;
    color: var(--text-primary);
    margin-bottom: 1rem;
    letter-spacing: -0.01em;
}
.skill-category__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px; height: 32px;
    background: var(--primary-dim);
    border-radius: var(--radius-sm);
    color: var(--primary);
}
.skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
}
.skill-tag {
    padding: 0.25rem 0.65rem;
    border-radius: var(--radius-full);
    font-size: 0.75rem;
    font-weight: 500;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: var(--text-secondary);
    transition: var(--transition-fast);
}
.skill-tag:hover {
    background: rgba(255,255,255,0.08);
    color: var(--text-primary);
}
.skill-tag--primary {
    background: var(--primary-dim);
    border-color: rgba(56,189,248,0.2);
    color: var(--primary);
}
.skill-tag--secondary {
    background: rgba(45,212,191,0.1);
    border-color: rgba(45,212,191,0.2);
    color: var(--secondary);
}
.skill-tag--accent {
    background: var(--accent-dim);
    border-color: rgba(245,158,11,0.2);
    color: var(--accent);
}
```

- [ ] **Step 3: Verify in browser**

Skills section should show 6 category cards in a responsive grid. Each category has an icon header and color-coded skill tags. Hovering a card lifts it with a cyan glow.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: redesign skills section with grouped tags"
```

---

## Task 6: Experience Timeline

**Files:**
- Modify: `index.html` (experience section, lines ~316–395)
- Modify: `style.css`

- [ ] **Step 1: Replace experience section in `index.html`**

Find `<section id="experience" ...>` through `</section>` and replace with:

```html
<section id="experience" class="py-24 relative">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div class="text-center mb-14" data-aos="fade-up">
            <div class="section-eyebrow justify-center">Where I've worked</div>
            <h2 class="text-headline gradient-text">Experience</h2>
        </div>

        <div class="timeline">
            <!-- BayOne Solutions -->
            <div class="timeline-item" data-aos="fade-up" data-aos-delay="0">
                <div class="timeline-dot"></div>
                <div class="timeline-card glass-card p-6">
                    <div class="timeline-card__meta">
                        <span class="timeline-card__date">2023 – Present</span>
                        <span class="timeline-card__badge">Current</span>
                    </div>
                    <h3 class="timeline-card__title">Software Developer</h3>
                    <p class="timeline-card__company">
                        <i data-feather="briefcase"></i> BayOne Solutions
                    </p>
                    <ul class="timeline-card__points">
                        <li>Built AI Voice Interview platform reducing recruiter workload by 60%</li>
                        <li>Developed TechScore.ai skill-assessment tool used by 500+ candidates</li>
                        <li>Architected microservices with Node.js, React, PostgreSQL on AWS</li>
                        <li>Implemented CI/CD pipelines cutting deployment time by 40%</li>
                    </ul>
                    <div class="skill-tags mt-4">
                        <span class="skill-tag skill-tag--primary">React</span>
                        <span class="skill-tag skill-tag--primary">Node.js</span>
                        <span class="skill-tag">AWS</span>
                        <span class="skill-tag">PostgreSQL</span>
                        <span class="skill-tag skill-tag--accent">AI/ML</span>
                    </div>
                </div>
            </div>

            <!-- Masai School -->
            <div class="timeline-item" data-aos="fade-up" data-aos-delay="100">
                <div class="timeline-dot"></div>
                <div class="timeline-card glass-card p-6">
                    <div class="timeline-card__meta">
                        <span class="timeline-card__date">2022 – 2023</span>
                    </div>
                    <h3 class="timeline-card__title">Teaching Assistant</h3>
                    <p class="timeline-card__company">
                        <i data-feather="briefcase"></i> Masai School
                    </p>
                    <ul class="timeline-card__points">
                        <li>Mentored 200+ students in full-stack development fundamentals</li>
                        <li>Conducted code reviews and guided project architectures</li>
                        <li>Created curriculum materials for React and Node.js modules</li>
                    </ul>
                    <div class="skill-tags mt-4">
                        <span class="skill-tag">React</span>
                        <span class="skill-tag">JavaScript</span>
                        <span class="skill-tag">Mentoring</span>
                    </div>
                </div>
            </div>

            <!-- BECIS -->
            <div class="timeline-item" data-aos="fade-up" data-aos-delay="200">
                <div class="timeline-dot"></div>
                <div class="timeline-card glass-card p-6">
                    <div class="timeline-card__meta">
                        <span class="timeline-card__date">2021 – 2022</span>
                    </div>
                    <h3 class="timeline-card__title">Junior Developer</h3>
                    <p class="timeline-card__company">
                        <i data-feather="briefcase"></i> BECIS
                    </p>
                    <ul class="timeline-card__points">
                        <li>Developed responsive web interfaces with HTML, CSS, JavaScript</li>
                        <li>Integrated third-party APIs and managed MySQL databases</li>
                        <li>Collaborated with design team to implement pixel-perfect UIs</li>
                    </ul>
                    <div class="skill-tags mt-4">
                        <span class="skill-tag">JavaScript</span>
                        <span class="skill-tag">MySQL</span>
                        <span class="skill-tag">PHP</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
```

- [ ] **Step 2: Add timeline CSS to `style.css`**

```css
/* ===== Timeline ===== */
.timeline {
    position: relative;
    padding-left: 2rem;
}
.timeline::before {
    content: '';
    position: absolute;
    left: 7px;
    top: 8px;
    bottom: 8px;
    width: 2px;
    background: linear-gradient(to bottom, var(--primary), var(--secondary), transparent);
    border-radius: 2px;
}
.timeline-item {
    position: relative;
    margin-bottom: 2rem;
}
.timeline-item:last-child {
    margin-bottom: 0;
}
.timeline-dot {
    position: absolute;
    left: -2rem;
    top: 1.25rem;
    width: 14px; height: 14px;
    background: var(--bg);
    border: 2px solid var(--primary);
    border-radius: 50%;
    box-shadow: 0 0 12px rgba(56,189,248,0.4);
    transform: translateX(1px);
}
.timeline-card {
    border-radius: var(--radius-lg) !important;
}
.timeline-card__meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.5rem;
}
.timeline-card__date {
    font-size: 0.75rem;
    color: var(--text-muted);
    font-family: var(--font-mono);
}
.timeline-card__badge {
    padding: 0.125rem 0.5rem;
    background: rgba(56,189,248,0.1);
    border: 1px solid rgba(56,189,248,0.25);
    border-radius: var(--radius-full);
    font-size: 0.65rem;
    font-weight: 600;
    color: var(--primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.timeline-card__title {
    font-family: var(--font-display);
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
}
.timeline-card__company {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.85rem;
    color: var(--secondary);
    margin-bottom: 0.75rem;
}
.timeline-card__company svg {
    width: 14px; height: 14px;
}
.timeline-card__points {
    list-style: none;
    padding: 0;
    margin: 0;
    space-y: 0.4rem;
}
.timeline-card__points li {
    position: relative;
    padding-left: 1rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 0.35rem;
}
.timeline-card__points li::before {
    content: '›';
    position: absolute;
    left: 0;
    color: var(--primary);
    font-weight: 700;
}
```

- [ ] **Step 3: Verify in browser**

Experience section should show a vertical timeline with a gradient line on the left, glowing dots, and cards for each role. The "Current" badge should appear on the BayOne entry.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: replace experience cards with animated timeline"
```

---

## Task 7: Projects Section — Featured + Filterable Grid

**Files:**
- Modify: `index.html` (projects section, lines ~398–722)
- Modify: `style.css`
- Modify: `script.js`

- [ ] **Step 1: Replace projects section in `index.html`**

Find `<section id="projects" ...>` through its closing `</section>` (~lines 398–722) and replace with:

```html
<section id="projects" class="py-24 relative">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-14" data-aos="fade-up">
            <div class="section-eyebrow justify-center">What I've built</div>
            <h2 class="text-headline gradient-text">Personal Projects</h2>
        </div>

        <!-- Filter tabs -->
        <div class="project-filters" data-aos="fade-up" data-aos-delay="50">
            <button class="project-filter active" data-filter="all">All</button>
            <button class="project-filter" data-filter="ai">AI / ML</button>
            <button class="project-filter" data-filter="fullstack">Full Stack</button>
            <button class="project-filter" data-filter="frontend">Frontend</button>
        </div>

        <!-- Projects grid -->
        <div class="projects-grid" id="projects-grid">

            <div class="project-card glass-card p-6" data-category="ai fullstack" data-aos="fade-up">
                <div class="project-card__header">
                    <span class="project-card__icon">🤖</span>
                    <div class="project-card__links">
                        <a href="#" target="_blank" rel="noopener" aria-label="GitHub" class="project-link"><i data-feather="github"></i></a>
                        <a href="#" target="_blank" rel="noopener" aria-label="Live demo" class="project-link"><i data-feather="external-link"></i></a>
                    </div>
                </div>
                <h3 class="project-card__title">ResumePilot</h3>
                <p class="project-card__desc">AI-powered resume builder that tailors your resume to job descriptions using GPT-4 and Claude.</p>
                <div class="skill-tags mt-4">
                    <span class="skill-tag skill-tag--accent">Claude API</span>
                    <span class="skill-tag skill-tag--primary">React</span>
                    <span class="skill-tag">Node.js</span>
                    <span class="skill-tag">MongoDB</span>
                </div>
            </div>

            <div class="project-card glass-card p-6" data-category="ai fullstack" data-aos="fade-up" data-aos-delay="60">
                <div class="project-card__header">
                    <span class="project-card__icon">🏗️</span>
                    <div class="project-card__links">
                        <a href="#" target="_blank" rel="noopener" aria-label="GitHub" class="project-link"><i data-feather="github"></i></a>
                        <a href="#" target="_blank" rel="noopener" aria-label="Live demo" class="project-link"><i data-feather="external-link"></i></a>
                    </div>
                </div>
                <h3 class="project-card__title">Blueprint AI</h3>
                <p class="project-card__desc">Full-stack project generator that scaffolds entire applications from a single text prompt using LLMs.</p>
                <div class="skill-tags mt-4">
                    <span class="skill-tag skill-tag--accent">OpenAI</span>
                    <span class="skill-tag skill-tag--primary">Next.js</span>
                    <span class="skill-tag">Python</span>
                </div>
            </div>

            <div class="project-card glass-card p-6" data-category="frontend fullstack" data-aos="fade-up" data-aos-delay="120">
                <div class="project-card__header">
                    <span class="project-card__icon">₿</span>
                    <div class="project-card__links">
                        <a href="#" target="_blank" rel="noopener" aria-label="GitHub" class="project-link"><i data-feather="github"></i></a>
                        <a href="#" target="_blank" rel="noopener" aria-label="Live demo" class="project-link"><i data-feather="external-link"></i></a>
                    </div>
                </div>
                <h3 class="project-card__title">Crypto Tracker</h3>
                <p class="project-card__desc">Real-time cryptocurrency dashboard with portfolio tracking, price alerts, and chart analysis.</p>
                <div class="skill-tags mt-4">
                    <span class="skill-tag skill-tag--primary">React</span>
                    <span class="skill-tag">WebSocket</span>
                    <span class="skill-tag">Chart.js</span>
                </div>
            </div>

            <div class="project-card glass-card p-6" data-category="fullstack" data-aos="fade-up" data-aos-delay="180">
                <div class="project-card__header">
                    <span class="project-card__icon">🐾</span>
                    <div class="project-card__links">
                        <a href="#" target="_blank" rel="noopener" aria-label="GitHub" class="project-link"><i data-feather="github"></i></a>
                        <a href="#" target="_blank" rel="noopener" aria-label="Live demo" class="project-link"><i data-feather="external-link"></i></a>
                    </div>
                </div>
                <h3 class="project-card__title">PawHaven</h3>
                <p class="project-card__desc">Pet adoption platform connecting shelters with adopters featuring real-time messaging and smart matching.</p>
                <div class="skill-tags mt-4">
                    <span class="skill-tag skill-tag--primary">React</span>
                    <span class="skill-tag">Django</span>
                    <span class="skill-tag">PostgreSQL</span>
                    <span class="skill-tag">Redis</span>
                </div>
            </div>

            <div class="project-card glass-card p-6" data-category="ai" data-aos="fade-up" data-aos-delay="240">
                <div class="project-card__header">
                    <span class="project-card__icon">💬</span>
                    <div class="project-card__links">
                        <a href="#" target="_blank" rel="noopener" aria-label="GitHub" class="project-link"><i data-feather="github"></i></a>
                        <a href="#" target="_blank" rel="noopener" aria-label="Live demo" class="project-link"><i data-feather="external-link"></i></a>
                    </div>
                </div>
                <h3 class="project-card__title">DocChat</h3>
                <p class="project-card__desc">RAG-powered document chat — upload PDFs and ask questions with context-aware AI responses.</p>
                <div class="skill-tags mt-4">
                    <span class="skill-tag skill-tag--accent">LangChain</span>
                    <span class="skill-tag">FastAPI</span>
                    <span class="skill-tag">Pinecone</span>
                </div>
            </div>

            <div class="project-card glass-card p-6" data-category="frontend" data-aos="fade-up" data-aos-delay="300">
                <div class="project-card__header">
                    <span class="project-card__icon">🛒</span>
                    <div class="project-card__links">
                        <a href="#" target="_blank" rel="noopener" aria-label="GitHub" class="project-link"><i data-feather="github"></i></a>
                        <a href="#" target="_blank" rel="noopener" aria-label="Live demo" class="project-link"><i data-feather="external-link"></i></a>
                    </div>
                </div>
                <h3 class="project-card__title">ShopFlow</h3>
                <p class="project-card__desc">Modern e-commerce UI with animated product cards, cart state management, and smooth checkout flow.</p>
                <div class="skill-tags mt-4">
                    <span class="skill-tag skill-tag--primary">React</span>
                    <span class="skill-tag">TypeScript</span>
                    <span class="skill-tag">Zustand</span>
                </div>
            </div>

            <div class="project-card glass-card p-6" data-category="fullstack ai" data-aos="fade-up" data-aos-delay="360">
                <div class="project-card__header">
                    <span class="project-card__icon">📊</span>
                    <div class="project-card__links">
                        <a href="#" target="_blank" rel="noopener" aria-label="GitHub" class="project-link"><i data-feather="github"></i></a>
                        <a href="#" target="_blank" rel="noopener" aria-label="Live demo" class="project-link"><i data-feather="external-link"></i></a>
                    </div>
                </div>
                <h3 class="project-card__title">DataPulse</h3>
                <p class="project-card__desc">Analytics dashboard with natural-language query interface — ask questions, get charts.</p>
                <div class="skill-tags mt-4">
                    <span class="skill-tag skill-tag--primary">Next.js</span>
                    <span class="skill-tag skill-tag--accent">Claude API</span>
                    <span class="skill-tag">D3.js</span>
                </div>
            </div>

            <div class="project-card glass-card p-6" data-category="frontend" data-aos="fade-up" data-aos-delay="420">
                <div class="project-card__header">
                    <span class="project-card__icon">🎨</span>
                    <div class="project-card__links">
                        <a href="#" target="_blank" rel="noopener" aria-label="GitHub" class="project-link"><i data-feather="github"></i></a>
                        <a href="#" target="_blank" rel="noopener" aria-label="Live demo" class="project-link"><i data-feather="external-link"></i></a>
                    </div>
                </div>
                <h3 class="project-card__title">DesignKit</h3>
                <p class="project-card__desc">Component library of 40+ accessible, customizable UI components with Storybook documentation.</p>
                <div class="skill-tags mt-4">
                    <span class="skill-tag skill-tag--primary">React</span>
                    <span class="skill-tag">Storybook</span>
                    <span class="skill-tag">Radix UI</span>
                </div>
            </div>
        </div>
    </div>
</section>
```

- [ ] **Step 2: Add project section CSS to `style.css`**

```css
/* ===== Projects ===== */
.project-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
    margin-bottom: 2.5rem;
}
.project-filter {
    padding: 0.4rem 1rem;
    border-radius: var(--radius-full);
    border: 1px solid var(--surface-border);
    background: transparent;
    color: var(--text-secondary);
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition-fast);
}
.project-filter:hover {
    border-color: rgba(56,189,248,0.3);
    color: var(--text-primary);
}
.project-filter.active {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border-color: transparent;
    color: #071521;
    font-weight: 700;
}
.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
}
.project-card {
    display: flex;
    flex-direction: column;
    border-radius: var(--radius-lg) !important;
    transition: var(--transition-base);
}
.project-card:hover {
    border-color: rgba(56,189,248,0.3) !important;
    box-shadow: var(--shadow-glow) !important;
    transform: translateY(-3px);
}
.project-card.is-hidden {
    display: none;
}
.project-card__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 0.75rem;
}
.project-card__icon {
    font-size: 1.75rem;
    line-height: 1;
}
.project-card__links {
    display: flex;
    gap: 0.5rem;
}
.project-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px; height: 30px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--surface-border);
    color: var(--text-muted);
    transition: var(--transition-fast);
    text-decoration: none;
}
.project-link:hover {
    border-color: rgba(56,189,248,0.3);
    color: var(--primary);
    background: var(--primary-dim);
}
.project-link svg { width: 14px; height: 14px; }
.project-card__title {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.375rem;
}
.project-card__desc {
    font-size: 0.82rem;
    color: var(--text-secondary);
    line-height: 1.6;
    flex-grow: 1;
}
```

- [ ] **Step 3: Add project filter JS to `script.js`**

Add `initProjectFilter();` in `DOMContentLoaded` handler, then add:

```js
function initProjectFilter() {
    const filters = document.querySelectorAll('.project-filter');
    const cards = document.querySelectorAll('.project-card');
    if (!filters.length) return;

    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            cards.forEach(card => {
                const cats = card.dataset.category || '';
                const show = filter === 'all' || cats.includes(filter);
                card.classList.toggle('is-hidden', !show);
            });
        });
    });
}
```

- [ ] **Step 4: Verify in browser**

Projects section should show filter tabs (All / AI / Full Stack / Frontend). Clicking a tab hides/shows cards based on their category. Cards should lift on hover with cyan glow.

- [ ] **Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: redesign projects section with filter tabs"
```

---

## Task 8: Contact Section Polish

**Files:**
- Modify: `index.html` (contact section, lines ~966–1021)
- Modify: `style.css`

- [ ] **Step 1: Replace contact section in `index.html`**

Find `<section id="contact" ...>` through `</section>` and replace with:

```html
<section id="contact" class="py-24 relative">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div class="text-center mb-14" data-aos="fade-up">
            <div class="section-eyebrow justify-center">Let's talk</div>
            <h2 class="text-headline gradient-text">Get In Touch</h2>
            <p class="text-gray-400 mt-3 max-w-lg mx-auto text-sm">Open to full-time roles, freelance projects, and interesting collaborations.</p>
        </div>

        <div class="contact-layout" data-aos="fade-up" data-aos-delay="80">
            <!-- Info column -->
            <div class="contact-info">
                <div class="contact-info__item">
                    <span class="contact-info__icon"><i data-feather="mail"></i></span>
                    <div>
                        <p class="contact-info__label">Email</p>
                        <a href="mailto:arsalan.developer7@gmail.com" class="contact-info__value">arsalan.developer7@gmail.com</a>
                    </div>
                </div>
                <div class="contact-info__item">
                    <span class="contact-info__icon"><i data-feather="map-pin"></i></span>
                    <div>
                        <p class="contact-info__label">Location</p>
                        <p class="contact-info__value">India · Remote-friendly</p>
                    </div>
                </div>
                <div class="contact-socials">
                    <a href="https://linkedin.com/in/arsalan-shaikh" target="_blank" rel="noopener" class="social-link" aria-label="LinkedIn">
                        <i data-feather="linkedin"></i>
                    </a>
                    <a href="https://github.com/arsalanshaikhh" target="_blank" rel="noopener" class="social-link" aria-label="GitHub">
                        <i data-feather="github"></i>
                    </a>
                    <a href="https://medium.com/@arsalan-shaikh" target="_blank" rel="noopener" class="social-link" aria-label="Medium">
                        <i data-feather="book-open"></i>
                    </a>
                </div>
            </div>

            <!-- Form column -->
            <form id="contact-form" class="contact-form glass-card p-6">
                <div class="form-group">
                    <label for="name" class="form-label">Name</label>
                    <input type="text" id="name" name="name" required class="form-input" placeholder="Your Name">
                </div>
                <div class="form-group">
                    <label for="email" class="form-label">Email</label>
                    <input type="email" id="email" name="email" required class="form-input" placeholder="your@email.com">
                </div>
                <div class="form-group">
                    <label for="message" class="form-label">Message</label>
                    <textarea id="message" name="message" rows="4" required class="form-input form-textarea" placeholder="Your message..."></textarea>
                </div>
                <button type="submit" class="btn-primary w-full justify-center">
                    <i data-feather="send"></i>
                    Send Message
                </button>
                <p id="form-status" class="text-sm text-gray-400 mt-3 text-center" aria-live="polite">Opens your email app with the message prefilled.</p>
            </form>
        </div>
    </div>
</section>
```

- [ ] **Step 2: Add contact CSS to `style.css`**

```css
/* ===== Contact ===== */
.contact-layout {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 2rem;
    align-items: start;
}
@media (max-width: 768px) {
    .contact-layout { grid-template-columns: 1fr; }
}
.contact-info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}
.contact-info__item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
}
.contact-info__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px; height: 36px;
    background: var(--primary-dim);
    border-radius: var(--radius-sm);
    color: var(--primary);
    flex-shrink: 0;
}
.contact-info__icon svg { width: 16px; height: 16px; }
.contact-info__label {
    font-size: 0.7rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 2px;
}
.contact-info__value {
    font-size: 0.875rem;
    color: var(--text-primary);
    text-decoration: none;
    transition: var(--transition-fast);
}
a.contact-info__value:hover { color: var(--primary); }
.contact-socials {
    display: flex;
    gap: 0.625rem;
}
.social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px; height: 38px;
    border-radius: var(--radius-sm);
    border: 1px solid var(--surface-border);
    color: var(--text-secondary);
    transition: var(--transition-base);
    text-decoration: none;
}
.social-link:hover {
    border-color: var(--primary);
    color: var(--primary);
    background: var(--primary-dim);
    transform: translateY(-2px);
}
.social-link svg { width: 16px; height: 16px; }
.contact-form { border-radius: var(--radius-lg) !important; }
.form-group { margin-bottom: 1rem; }
.form-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 0.375rem;
    letter-spacing: 0.02em;
}
.form-input {
    width: 100%;
    padding: 0.625rem 0.875rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--surface-border);
    border-radius: var(--radius-sm);
    color: var(--text-primary);
    font-size: 0.875rem;
    font-family: var(--font-body);
    transition: var(--transition-fast);
    outline: none;
}
.form-input:focus {
    border-color: var(--primary);
    background: rgba(56,189,248,0.04);
    box-shadow: 0 0 0 3px rgba(56,189,248,0.1);
}
.form-input::placeholder { color: var(--text-muted); }
.form-textarea { resize: vertical; min-height: 100px; }
.btn-primary.w-full { width: 100%; }
.btn-primary.justify-center { justify-content: center; }
```

- [ ] **Step 3: Verify in browser**

Contact section should show a two-column layout: left side with email, location, and social icons; right side with a styled glass-card form. Responsive: stacks to single column on mobile.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: polish contact section with two-column layout"
```

---

## Task 9: Custom Cursor

**Files:**
- Modify: `index.html` (add cursor HTML near `<body>`)
- Modify: `style.css`
- Modify: `script.js`

- [ ] **Step 1: Add cursor markup to `index.html`**

Right after the `<body class="...">` opening tag, add:

```html
<div id="cursor-dot" aria-hidden="true"></div>
<div id="cursor-ring" aria-hidden="true"></div>
```

- [ ] **Step 2: Add cursor CSS to `style.css`**

```css
/* ===== Custom Cursor ===== */
@media (pointer: fine) {
    body { cursor: none; }
    a, button, [role="button"], summary, .project-filter { cursor: none; }
}
#cursor-dot {
    position: fixed;
    top: 0; left: 0;
    width: 6px; height: 6px;
    background: var(--primary);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99998;
    transform: translate(-50%, -50%);
    transition: width 0.15s, height 0.15s, background 0.15s;
    will-change: transform;
}
#cursor-ring {
    position: fixed;
    top: 0; left: 0;
    width: 30px; height: 30px;
    border: 1.5px solid rgba(56,189,248,0.5);
    border-radius: 50%;
    pointer-events: none;
    z-index: 99997;
    transform: translate(-50%, -50%);
    transition: width 0.2s ease, height 0.2s ease, border-color 0.2s ease;
    will-change: transform;
}
body.cursor-hover #cursor-dot {
    width: 10px; height: 10px;
    background: var(--secondary);
}
body.cursor-hover #cursor-ring {
    width: 44px; height: 44px;
    border-color: rgba(45,212,191,0.4);
}
```

- [ ] **Step 3: Add cursor JS to `script.js`**

Add `initCustomCursor();` in `DOMContentLoaded` handler, then add:

```js
function initCustomCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let rafId;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(calc(-50% + ${mouseX}px), calc(-50% + ${mouseY}px))`;
    });

    const animateRing = () => {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.transform = `translate(calc(-50% + ${ringX}px), calc(-50% + ${ringY}px))`;
        rafId = requestAnimationFrame(animateRing);
    };
    animateRing();

    const interactives = 'a, button, [role="button"], summary, .project-filter, .skill-tag';
    document.querySelectorAll(interactives).forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}
```

- [ ] **Step 4: Verify in browser**

Move the mouse over the page. A small filled dot (cyan) should follow the cursor exactly. A slightly larger ring should lag behind with a smooth easing effect. When hovering over links or buttons, both elements should scale up with a color shift to teal.

On a touchscreen or non-pointer device, the default cursor should remain (the `@media (pointer: fine)` guard prevents the cursor: none from applying).

- [ ] **Step 5: Commit**

```bash
git add index.html style.css script.js
git commit -m "feat: add custom cursor with lag-ring and hover states"
```

---

## Task 10: Scroll Animation Polish — Stagger Section Headings

**Files:**
- Modify: `index.html` — add `data-aos` attributes to remaining sections (career, education, certifications)
- Modify: `style.css` — section heading dividers

All remaining sections (career, education, certifications) should get `data-aos="fade-up"` on their heading containers and `data-aos-delay` on their cards for a staggered entrance.

- [ ] **Step 1: Add AOS attributes to career section heading**

Find `<section id="career" ...>` and add `data-aos="fade-up"` to the section's inner heading div.

- [ ] **Step 2: Add AOS attributes to education section**

Find `<section id="education" ...>`. Add `data-aos="fade-up"` to the heading container. Add `data-aos="fade-up" data-aos-delay="N*80"` to each education card (N = 0, 1, 2, 3).

- [ ] **Step 3: Add AOS attributes to certifications section**

Find `<section id="certifications" ...>`. Add `data-aos="fade-up"` to the heading. Add `data-aos="zoom-in" data-aos-delay="N*50"` to each cert card.

- [ ] **Step 4: Add section divider style to `style.css`**

```css
/* Section separator visual rhythm */
section + section {
    border-top: 1px solid rgba(255,255,255,0.03);
}
```

- [ ] **Step 5: Verify in browser**

Scroll through all sections. Each should animate in as it enters the viewport. Cards inside sections should stagger (appear one after another, not all at once). No section should pop in instantly.

- [ ] **Step 6: Commit**

```bash
git add index.html style.css
git commit -m "feat: add staggered AOS scroll animations to all sections"
```

---

## Task 11: Loader Upgrade

**Files:**
- Modify: `index.html` (landing-loader markup, lines ~75–81)
- Modify: `style.css`

- [ ] **Step 1: Replace loader markup in `index.html`**

Find the `<div id="landing-loader" ...>` block and replace with:

```html
<div id="landing-loader" class="landing-loader" aria-live="polite" aria-label="Loading portfolio">
    <div class="loader-inner">
        <div class="loader-logo">AS</div>
        <div class="loader-bar">
            <div class="loader-bar__fill"></div>
        </div>
        <p class="loader-hint">Loading portfolio…</p>
    </div>
</div>
```

- [ ] **Step 2: Replace `.landing-loader` CSS in `style.css`**

Find the existing `.landing-loader`, `.landing-loader.is-hidden`, and `.landing-loader__spinner` blocks and replace with:

```css
.landing-loader {
    position: fixed;
    inset: 0;
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    opacity: 1;
    visibility: visible;
    transition: opacity 0.6s ease, visibility 0.6s ease;
}
.landing-loader.is-hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
}
.loader-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.25rem;
}
.loader-logo {
    font-family: var(--font-display);
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: -0.04em;
    animation: loader-pop 0.5s ease both;
}
@keyframes loader-pop {
    from { transform: scale(0.85); opacity: 0; }
    to   { transform: scale(1);    opacity: 1; }
}
.loader-bar {
    width: 160px;
    height: 2px;
    background: rgba(255,255,255,0.08);
    border-radius: 2px;
    overflow: hidden;
}
.loader-bar__fill {
    height: 100%;
    background: linear-gradient(to right, var(--primary), var(--secondary));
    border-radius: 2px;
    animation: loader-fill 1.2s ease forwards;
}
@keyframes loader-fill {
    from { width: 0%; }
    to   { width: 100%; }
}
.loader-hint {
    font-size: 0.75rem;
    color: var(--text-muted);
    letter-spacing: 0.05em;
    animation: loader-fade 0.8s 0.3s ease both;
}
@keyframes loader-fade {
    from { opacity: 0; transform: translateY(4px); }
    to   { opacity: 1; transform: translateY(0); }
}
```

- [ ] **Step 3: Verify in browser**

Hard-reload the page (Cmd+Shift+R). The loader should show "AS" in gradient text, a progress bar that fills over 1.2s, and a "Loading portfolio…" hint below. Then it fades out smoothly revealing the page.

- [ ] **Step 4: Commit**

```bash
git add index.html style.css
git commit -m "feat: upgrade loader to branded AS logo with progress bar"
```

---

## Task 12: Final Polish — Feather Icons Re-init & Mobile

**Files:**
- Modify: `script.js`
- Modify: `style.css`

After all the new HTML sections were added with `data-feather` attributes, Feather Icons needs to re-init after AOS and Typed.js load (since they're deferred).

- [ ] **Step 1: Move `refreshFeatherIcons()` to run after deferred scripts load**

In `script.js`, find `initLandingLoader()` → the loader `hideLoader` function. After `document.body.classList.add('loader-done');` add:

```js
window.requestAnimationFrame(() => {
    if (window.feather) feather.replace({ width: 18, height: 18, 'stroke-width': 1.8 });
});
```

Also add a `window.load` fallback at bottom of `DOMContentLoaded`:

```js
window.addEventListener('load', () => {
    if (window.feather) feather.replace({ width: 18, height: 18, 'stroke-width': 1.8 });
    if (typeof AOS !== 'undefined') AOS.refresh();
    initTypewriter();
}, { once: true });
```

- [ ] **Step 2: Add mobile touch-friendly tap target rules to `style.css`**

```css
/* Mobile tap targets */
@media (max-width: 768px) {
    .btn-primary, .btn-secondary, .btn-ghost {
        min-height: 44px;
    }
    .project-filter {
        min-height: 36px;
        padding: 0.4rem 1rem;
    }
    .social-link {
        width: 44px; height: 44px;
    }
}
```

- [ ] **Step 3: Verify in browser (desktop + mobile viewport)**

In Chrome DevTools, toggle device mode (Cmd+Shift+M). Check at 375px width:
- Buttons are tall enough to tap (≥44px)
- Filter tabs wrap cleanly
- Contact layout stacks vertically
- Timeline renders correctly

Also verify on desktop: Feather icons appear throughout all new sections (no blank squares).

- [ ] **Step 4: Final commit**

```bash
git add style.css script.js
git commit -m "feat: fix icon init timing and improve mobile tap targets"
```

---

## Summary

| Task | Section | Files Changed |
|------|---------|--------------|
| 1 | Design system tokens | `style.css` |
| 2 | CDN libraries (AOS, Typed) | `index.html`, `script.js` |
| 3 | Hero revamp | `index.html`, `style.css`, `script.js` |
| 4 | Navbar scroll-spy | `components/navbar.js` |
| 5 | Skills redesign | `index.html`, `style.css` |
| 6 | Experience timeline | `index.html`, `style.css` |
| 7 | Projects filter grid | `index.html`, `style.css`, `script.js` |
| 8 | Contact polish | `index.html`, `style.css` |
| 9 | Custom cursor | `index.html`, `style.css`, `script.js` |
| 10 | Scroll animation stagger | `index.html`, `style.css` |
| 11 | Loader upgrade | `index.html`, `style.css` |
| 12 | Icon init + mobile polish | `style.css`, `script.js` |
