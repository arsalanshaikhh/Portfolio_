const CONFIG = {
    email: 'arsalan.developer7@gmail.com',
    mediumFeedUrl: 'https://medium.com/feed/@arsalan-shaikh',
    mediumProfileUrl: 'https://medium.com/@arsalan-shaikh',
    available: true,
};

document.addEventListener('DOMContentLoaded', function() {
    initLandingLoader();
    initCustomCursor();
    refreshFeatherIcons();
    initSmoothScroll();
    initScrollAnimations();
    initScrollProgress();
    initFormHandler();
    initResumeDropdown();
    initCardHoverEffects();
    initBlogModal();
    initProjectFilter();
    initAvailabilityBadge();
    initCopyEmail();
    initFloatingResume();
    initFloatingContact();
    initBackToTop();
    initStatsCounter();
    initSectionReveal();
    initHeroParticles();
    initTiltCards();
    initMagneticButtons();
    initKeyboardShortcuts();
    initCommandPalette();
});

window.addEventListener('load', function() {
    initAOS();
    initTypewriter();
    if (window.feather) feather.replace({ width: 18, height: 18, 'stroke-width': 1.8 });
    if (typeof AOS !== 'undefined') AOS.refresh();
}, { once: true });

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

function initLandingLoader() {
    const loader = document.getElementById('landing-loader');
    if (!loader) return;

    const hideLoader = () => {
        loader.classList.add('is-hidden');
        document.body.classList.remove('page-loading');
        document.body.classList.add('loader-done');
        window.requestAnimationFrame(() => {
            if (window.feather) feather.replace({ width: 18, height: 18, 'stroke-width': 1.8 });
        });

        window.setTimeout(() => {
            loader.remove();
        }, 500);
    };

    if (document.readyState === 'complete') {
        window.requestAnimationFrame(hideLoader);
    } else {
        window.addEventListener('load', () => window.requestAnimationFrame(hideLoader), { once: true });
    }
}

function refreshFeatherIcons() {
    if (window.feather) {
        feather.replace({ width: 20, height: 20, 'stroke-width': 1.9 });
    }
}

function trackResumeDownload(variant) {
    try {
        const body = new URLSearchParams({
            'form-name': 'resume-downloads',
            variant,
            timestamp: new Date().toISOString()
        }).toString();
        fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body,
            keepalive: true
        }).catch(() => {});
    } catch (_) {}
}

function initResumeDropdown() {
    const dropdown = document.querySelector('.resume-dropdown');
    const toggle = dropdown?.querySelector('summary');
    const menu = document.getElementById('resume-menu');

    if (!dropdown || !toggle || !menu) return;

    const setOpen = (isOpen) => {
        dropdown.toggleAttribute('open', isOpen);
    };

    dropdown.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setOpen(false);
            toggle.focus();
        }
    });

    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            setOpen(false);
            const variant = link.textContent.trim().toLowerCase().includes('frontend') ? 'frontend' : 'fullstack';
            trackResumeDownload(variant);
        });
    });

    document.addEventListener('pointerdown', (event) => {
        if (!dropdown.contains(event.target)) {
            setOpen(false);
        }
    });
}

/**
 * ===== Smooth Scroll Navigation =====
 * Enables smooth scrolling behavior for all anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return; // bare hash — no section; let browser/link handle it
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(targetId);
            if (target) {
                const navbarHeight = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });
}

/**
 * ===== Scroll Animations with Intersection Observer =====
 * Implements scroll-triggered animations using Intersection Observer API
 * Animates elements as they enter the viewport
 */
function initScrollAnimations() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    // Configuration for Intersection Observer
    const observerOptions = {
        threshold: 0.1,           // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px'  // Start animation slightly before element enters viewport
    };

    // Create observer instance
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate element into view
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe only section containers so long pages do not feel sluggish or dim while scrolling.
    const animatedElements = document.querySelectorAll('section > .container');
    animatedElements.forEach((el, index) => {
        // Skip if parent section uses AOS (children handle their own animation)
        const section = el.closest('section');
        if (section && section.querySelector('[data-aos]')) return;
        // Skip elements that already have fade-in animation
        if (!el.classList.contains('animate-fade-in')) {
            // Set initial state for animation
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            // Add staggered delay for smooth animation sequence
            const delay = Math.min(index * 0.03, 0.18);
            el.style.transition = `opacity 0.45s ease ${delay}s, transform 0.45s ease ${delay}s`;
            observer.observe(el);
        }
    });
}

function initSectionReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const elements = document.querySelectorAll(
        'section:not(#hero) .section-eyebrow, section:not(#hero) .text-headline'
    );
    if (!elements.length) return;

    elements.forEach(el => el.classList.add('reveal-ready'));

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-done');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(el => observer.observe(el));
}

function initHeroParticles() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;

    // Skip particles for users who prefer reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Skip particles on low-end devices (fewer than 4 logical cores)
    const cores = navigator.hardwareConcurrency || 4;
    if (cores < 4) return;

    const ctx = canvas.getContext('2d');
    const hero = document.getElementById('hero');

    // Brand colors as [r, g, b] for rgba() usage
    const PALETTE = [
        [56,  189, 248],  // #38bdf8 primary sky
        [45,  212, 191],  // #2dd4bf secondary teal
        [129, 140, 248],  // #818cf8 indigo accent
    ];

    const COUNT = window.innerWidth < 768 ? 38 : 72;
    const CONNECT_DIST = 110;

    let particles = [];
    let mouse = { x: -9999, y: -9999 };
    let rafId;

    function resize() {
        canvas.width  = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    function mkParticle() {
        const depth = Math.random();
        const [r, g, b] = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r, g, b,
            radius:  0.5 + depth * 2.0,
            opacity: 0.06 + depth * 0.30,
            vx: (Math.random() - 0.5) * (0.08 + depth * 0.20),
            vy: (Math.random() - 0.5) * (0.08 + depth * 0.20),
            depth,
        };
    }

    function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const mx = (mouse.x - canvas.width  / 2) / canvas.width;
        const my = (mouse.y - canvas.height / 2) / canvas.height;

        // connections behind dots
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DIST) {
                    const a = (1 - dist / CONNECT_DIST) * 0.07;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(56,189,248,${a})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            // parallax: nearer particles shift more with mouse
            const px = p.x + mx * p.depth * 18;
            const py = p.y + my * p.depth * 18;

            ctx.beginPath();
            ctx.arc(px, py, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${p.opacity})`;
            ctx.fill();

            p.x += p.vx;
            p.y += p.vy;

            // wrap with small padding so particles don't pop into view
            const pad = 5;
            if (p.x < -pad) p.x = canvas.width  + pad;
            else if (p.x > canvas.width  + pad) p.x = -pad;
            if (p.y < -pad) p.y = canvas.height + pad;
            else if (p.y > canvas.height + pad) p.y = -pad;
        });

        rafId = requestAnimationFrame(tick);
    }

    resize();
    particles = Array.from({ length: COUNT }, mkParticle);
    tick();

    hero.addEventListener('mousemove', e => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });
    hero.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    const ro = new ResizeObserver(resize);
    ro.observe(hero);
}

function initTiltCards() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('.project-card').forEach(card => {
        const shine = document.createElement('div');
        shine.className = 'card-shine';
        shine.setAttribute('aria-hidden', 'true');
        card.appendChild(shine);

        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const cx = rect.left + rect.width  / 2;
            const cy = rect.top  + rect.height / 2;
            const nx = (e.clientX - cx) / (rect.width  / 2); // -1 to 1
            const ny = (e.clientY - cy) / (rect.height / 2); // -1 to 1

            const rotY =  nx * 8;
            const rotX = -ny * 6;

            card.style.transition = 'box-shadow 0.15s ease, border-color 0.15s ease';
            card.style.transform  = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;

            const sx = ((e.clientX - rect.left) / rect.width)  * 100;
            const sy = ((e.clientY - rect.top)  / rect.height) * 100;
            card.style.setProperty('--shine-x', sx + '%');
            card.style.setProperty('--shine-y', sy + '%');
            shine.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.45s ease, box-shadow 0.3s ease, border-color 0.3s ease';
            card.style.transform  = '';
            shine.style.opacity   = '0';
        });
    });
}

function initMagneticButtons() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const buttons = document.querySelectorAll(
        '.hero-actions .btn-primary, .hero-actions .btn-secondary, .hero-actions .btn-ghost'
    );

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width  / 2;
            const cy = rect.top  + rect.height / 2;
            const dx = (e.clientX - cx) * 0.22;
            const dy = (e.clientY - cy) * 0.22;
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

function initKeyboardShortcuts() {
    const SECTIONS = {
        '1': 'hero', '2': 'career',   '3': 'skills',    '4': 'experience',
        '5': 'projects', '6': 'projects2', '7': 'education', '8': 'contact',
    };

    const SECTION_NAMES = {
        '1': 'Home', '2': 'About', '3': 'Skills', '4': 'Experience',
        '5': 'Projects', '6': 'Featured', '7': 'Education', '8': 'Contact',
    };

    // --- Modal ---
    const backdrop = document.createElement('div');
    backdrop.id = 'shortcuts-backdrop';
    backdrop.setAttribute('role', 'dialog');
    backdrop.setAttribute('aria-modal', 'true');
    backdrop.setAttribute('aria-label', 'Keyboard shortcuts');
    backdrop.innerHTML = `
        <div id="shortcuts-panel">
            <div class="shortcuts-header">
                <span class="shortcuts-title">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="6" width="20" height="14" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"/></svg>
                    Keyboard Shortcuts
                </span>
                <button class="shortcuts-close" aria-label="Close">
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
            </div>
            <div class="shortcuts-body">
                <div class="shortcuts-group">
                    <div class="shortcuts-group-label">Navigate</div>
                    ${Object.entries(SECTION_NAMES).map(([k, v]) => `
                    <div class="shortcut-row"><kbd>${k}</kbd><span>${v}</span></div>`).join('')}
                </div>
                <div class="shortcuts-group">
                    <div class="shortcuts-group-label">Actions</div>
                    <div class="shortcut-row"><kbd>T</kbd><span>Toggle theme</span></div>
                    <div class="shortcut-row"><kbd>C</kbd><span>Copy email</span></div>
                    <div class="shortcut-row"><kbd>R</kbd><span>Open resume</span></div>
                    <div class="shortcut-row"><kbd>?</kbd><span>Toggle this panel</span></div>
                    <div class="shortcut-row"><kbd>Esc</kbd><span>Close panel</span></div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(backdrop);

    // --- Hint pill ---
    const hint = document.createElement('div');
    hint.className = 'shortcuts-hint';
    hint.innerHTML = `<kbd>?</kbd> for shortcuts`;
    document.body.appendChild(hint);

    try {
        if (!localStorage.getItem('shortcuts_hint_shown')) {
            setTimeout(() => {
                hint.classList.add('shortcuts-hint--visible');
                setTimeout(() => hint.classList.remove('shortcuts-hint--visible'), 3500);
            }, 2500);
            localStorage.setItem('shortcuts_hint_shown', '1');
        }
    } catch (_) {}

    const openPanel  = () => { backdrop.classList.add('shortcuts--open'); backdrop.querySelector('.shortcuts-close').focus(); };
    const closePanel = () => backdrop.classList.remove('shortcuts--open');

    backdrop.querySelector('.shortcuts-close').addEventListener('click', closePanel);
    backdrop.addEventListener('click', e => { if (e.target === backdrop) closePanel(); });

    document.addEventListener('keydown', e => {
        if (e.target.matches('input, textarea, [contenteditable]')) return;
        if (e.altKey || e.ctrlKey || e.metaKey) return;

        const isOpen = backdrop.classList.contains('shortcuts--open');

        if (e.key === 'Escape' && isOpen) { closePanel(); return; }
        if (e.key === '?') { e.preventDefault(); isOpen ? closePanel() : openPanel(); return; }

        if (isOpen) return; // don't fire shortcuts while panel is open

        switch (e.key.toLowerCase()) {
            case 't':
                document.querySelector('custom-navbar')?.shadowRoot?.getElementById('theme-toggle')?.click();
                break;
            case 'c':
                document.getElementById('copy-email-btn')?.click();
                break;
            case 'r':
                window.open('https://arsalan-cv.vercel.app/cv-pdf/Arsalan_Shaikh_FullStack_Developer_CV.pdf', '_blank', 'noopener');
                break;
            default:
                if (SECTIONS[e.key]) {
                    document.getElementById(SECTIONS[e.key])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
        }
    });
}

function initCommandPalette() {
    const COMMANDS = [
        { group: 'Navigate', label: 'Home',           icon: 'home',          action: () => scrollTo('hero') },
        { group: 'Navigate', label: 'Skills',          icon: 'zap',           action: () => scrollTo('skills') },
        { group: 'Navigate', label: 'Experience',      icon: 'briefcase',     action: () => scrollTo('experience') },
        { group: 'Navigate', label: 'Projects',        icon: 'code',          action: () => scrollTo('projects') },
        { group: 'Navigate', label: 'Featured Work',   icon: 'star',          action: () => scrollTo('projects2') },
        { group: 'Navigate', label: 'Education',       icon: 'book-open',     action: () => scrollTo('education') },
        { group: 'Navigate', label: 'Certifications',  icon: 'award',         action: () => scrollTo('certifications') },
        { group: 'Navigate', label: 'Contact',         icon: 'mail',          action: () => scrollTo('contact') },
        { group: 'Actions',  label: 'Toggle theme',    icon: 'sun',           action: () => document.querySelector('custom-navbar')?.shadowRoot?.getElementById('theme-toggle')?.click() },
        { group: 'Actions',  label: 'Copy email',      icon: 'copy',          action: () => document.getElementById('copy-email-btn')?.click() },
        { group: 'Actions',  label: 'Read blogs',      icon: 'rss',           action: () => document.getElementById('read-blogs-btn')?.click() },
        { group: 'Actions',  label: 'Download CV',     icon: 'download',      action: () => window.open('https://arsalan-cv.vercel.app/cv-pdf/Arsalan_Shaikh_FullStack_Developer_CV.pdf', '_blank', 'noopener') },
        { group: 'Actions',  label: 'GitHub profile',  icon: 'github',        action: () => window.open('https://github.com/arsalanshaikhh', '_blank', 'noopener') },
        { group: 'Actions',  label: 'LinkedIn profile', icon: 'linkedin',     action: () => window.open('https://linkedin.com/in/arsalan-shaikh', '_blank', 'noopener') },
    ];

    function scrollTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

    function featherSvg(name) {
        const icon = feather?.icons?.[name];
        return icon ? icon.toSvg({ width: 15, height: 15, 'stroke-width': 2 }) : '';
    }

    // Build overlay
    const overlay = document.createElement('div');
    overlay.id = 'cmd-palette';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Command palette');
    overlay.innerHTML = `
        <div id="cmd-palette-inner">
            <div id="cmd-palette-search-row">
                <span id="cmd-palette-search-icon"></span>
                <input id="cmd-palette-input" type="text" placeholder="Search commands…" autocomplete="off" spellcheck="false" aria-label="Search commands">
                <kbd id="cmd-palette-esc">esc</kbd>
            </div>
            <div id="cmd-palette-results" role="listbox" aria-label="Commands"></div>
            <div id="cmd-palette-footer">
                <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                <span><kbd>↵</kbd> select</span>
                <span><kbd>esc</kbd> close</span>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    // Render search icon via feather after icons are ready
    setTimeout(() => {
        const iconEl = document.getElementById('cmd-palette-search-icon');
        if (iconEl) iconEl.innerHTML = featherSvg('search');
    }, 500);

    const input    = overlay.querySelector('#cmd-palette-input');
    const results  = overlay.querySelector('#cmd-palette-results');
    let activeIdx  = -1;
    let filtered   = [];

    function open() {
        overlay.classList.add('cmd-palette--open');
        input.value = '';
        render('');
        input.focus();
    }

    function close() {
        overlay.classList.remove('cmd-palette--open');
        activeIdx = -1;
    }

    function render(query) {
        const q = query.toLowerCase().trim();
        filtered = q ? COMMANDS.filter(c => c.label.toLowerCase().includes(q) || c.group.toLowerCase().includes(q)) : COMMANDS;
        activeIdx = filtered.length ? 0 : -1;

        if (!filtered.length) {
            results.innerHTML = `<div class="cmd-palette-empty">No commands found</div>`;
            return;
        }

        let html = '';
        let lastGroup = '';
        filtered.forEach((cmd, i) => {
            if (cmd.group !== lastGroup) {
                html += `<div class="cmd-palette-group">${cmd.group}</div>`;
                lastGroup = cmd.group;
            }
            html += `<div class="cmd-palette-item${i === activeIdx ? ' cmd-palette-item--active' : ''}" role="option" aria-selected="${i === activeIdx}" data-idx="${i}">
                <span class="cmd-palette-item__icon">${featherSvg(cmd.icon)}</span>
                <span class="cmd-palette-item__label">${cmd.label}</span>
            </div>`;
        });
        results.innerHTML = html;
    }

    function setActive(idx) {
        activeIdx = Math.max(0, Math.min(filtered.length - 1, idx));
        results.querySelectorAll('.cmd-palette-item').forEach((el, i) => {
            el.classList.toggle('cmd-palette-item--active', i === activeIdx);
            el.setAttribute('aria-selected', i === activeIdx);
            if (i === activeIdx) el.scrollIntoView({ block: 'nearest' });
        });
    }

    function execute(idx) {
        if (filtered[idx]) { close(); filtered[idx].action(); }
    }

    input.addEventListener('input', () => render(input.value));

    input.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown') { e.preventDefault(); setActive(activeIdx + 1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(activeIdx - 1); }
        else if (e.key === 'Enter') { e.preventDefault(); execute(activeIdx); }
        else if (e.key === 'Escape') { e.preventDefault(); close(); }
    });

    results.addEventListener('click', e => {
        const item = e.target.closest('.cmd-palette-item');
        if (item) execute(Number(item.dataset.idx));
    });

    results.addEventListener('mouseover', e => {
        const item = e.target.closest('.cmd-palette-item');
        if (item) setActive(Number(item.dataset.idx));
    });

    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    // Cmd+K / Ctrl+K
    document.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            overlay.classList.contains('cmd-palette--open') ? close() : open();
        }
    });
}

/**
 * ===== Scroll Progress Bar =====
 * Creates and manages a visual progress bar indicating scroll position
 * Bar appears at top of page and fills as user scrolls down
 */
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

/**
 * ===== Form Handler =====
 * Manages contact form submission, validation, and user feedback
 * Handles loading states, success messages, and form reset
 */
function initFormHandler() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const inputs = form.querySelectorAll('input, textarea');
            const allValid = Array.from(inputs).every(validateInput);
            if (!allValid) {
                if (status) {
                    status.textContent = 'Please complete the required fields before continuing.';
                    status.classList.add('text-red-400');
                    status.classList.remove('text-gray-400', 'text-emerald-400');
                }
                return;
            }
            
            const submitButton = form.querySelector('button[type="submit"]');
            if (!submitButton) return;
            const originalContent = submitButton.innerHTML;
            const formData = new FormData(form);
            const senderName = (formData.get('name') || '').toString().trim();
            const senderEmail = (formData.get('email') || '').toString().trim();
            const message = (formData.get('message') || '').toString().trim();

            submitButton.innerHTML = `
                <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
            `;
            submitButton.disabled = true;

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    access_key: (form.querySelector('input[name="access_key"]') || {}).value || '',
                    name: senderName,
                    email: senderEmail,
                    message
                })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    const successCard = document.getElementById('form-success');
                    const successNameEl = document.getElementById('form-success-name');
                    if (successNameEl) successNameEl.textContent = `Hi ${senderName}, thanks for reaching out!`;
                    form.classList.add('hidden');
                    if (successCard) {
                        successCard.classList.remove('hidden');
                        void successCard.offsetWidth;
                        successCard.classList.add('form-success-card--visible');
                    }
                    form.reset();
                    submitButton.innerHTML = originalContent;
                    submitButton.disabled = false;
                    refreshFeatherIcons();
                } else {
                    throw new Error(data.message || 'Submission failed');
                }
            })
            .catch((err) => {
                console.error('[Contact form error]', err);
                submitButton.innerHTML = originalContent;
                submitButton.disabled = false;
                refreshFeatherIcons();
                if (status) {
                    status.textContent = `Something went wrong. Email me directly at ${CONFIG.email}`;
                    status.classList.add('text-red-400');
                    status.classList.remove('text-gray-400', 'text-emerald-400');
                }
            });
        });
        
        // Reset button on success card
        const resetBtn = document.getElementById('form-success-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                const successCard = document.getElementById('form-success');
                if (successCard) {
                    successCard.classList.remove('form-success-card--visible');
                    successCard.classList.add('hidden');
                }
                form.classList.remove('hidden');
                if (status) {
                    status.textContent = "I'll get back to you within 24 hours.";
                    status.classList.remove('text-emerald-400', 'text-red-400');
                    status.classList.add('text-gray-400');
                }
                refreshFeatherIcons();
            });
        }

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateInput(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateInput(input);
                }
            });
        });
    }
}

/**
 * Validates form input fields using HTML5 validation API
 * @param {HTMLInputElement|HTMLTextAreaElement} input - The input element to validate
 * @returns {boolean} - True if input is valid, false otherwise
 */
function validateInput(input) {
    const isValid = input.checkValidity();

    if (!isValid) {
        input.classList.add('error');
        input.style.borderColor = '#ef4444';
        input.setAttribute('aria-invalid', 'true');
    } else {
        input.classList.remove('error');
        input.style.borderColor = '';
        input.removeAttribute('aria-invalid');
    }

    return isValid;
}

/**
 * ===== Card Hover Effects =====
 * Adds interactive hover effects to glass cards including lift and tilt animations
 */
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.glass-card.tilt-effect');
    
    cards.forEach(card => {
        // Add subtle tilt effect on mouse move
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            // Apply 3D tilt effect
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });
        
        // Reset tilt effect on mouse leave
        card.addEventListener('mouseleave', function(e) {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

/**
 * ===== Utility Functions =====
 * Collection of helper functions for performance and common operations
 */

/**
 * Debounce function for performance optimization
 * Limits the rate at which a function can fire
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for performance optimization
 * Ensures a function is only called once per time period
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is currently visible in viewport
 * @param {HTMLElement} element - DOM element to check
 * @returns {boolean} - True if element is in viewport, false otherwise
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Get current year for dynamic copyright updates
 * @returns {number} - Current year
 */
window.portfolioUtils = {
    debounce,
    throttle,
    isInViewport,
};

// ===== Blog Modal Functionality =====
let blogIsLoading = false;
let prefetchedArticles = null;
let prefetchPromise = null;

function initBlogModal() {
    const blogBtn = document.getElementById('read-blogs-btn');
    const modal = document.getElementById('blog-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    let lastFocusedElement = null;

    if (!blogBtn || !modal) return;

    // Prefetch articles when the button scrolls into view (400px before)
    const prefetchObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !prefetchedArticles && !prefetchPromise) {
            prefetchObserver.disconnect();
            prefetchPromise = loadArticlesFromNetwork()
                .then(articles => {
                    prefetchedArticles = articles;
                    try {
                        localStorage.setItem('medium-articles-cache-v1', JSON.stringify({ ts: Date.now(), articles: articles.slice(0, 12) }));
                    } catch (_) {}
                })
                .catch(() => {});
        }
    }, { rootMargin: '400px' });
    prefetchObserver.observe(blogBtn);

    // Open modal
    blogBtn.addEventListener('click', () => {
        lastFocusedElement = document.activeElement;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        if (!blogIsLoading) fetchMediumArticles();
        refreshFeatherIcons();
        closeBtn?.focus();
    });
    
    // Close modal
    const closeModal = () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
        lastFocusedElement?.focus?.();
    };
    
    closeBtn?.addEventListener('click', closeModal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on Escape key + focus trapping
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden')) return;

        if (e.key === 'Escape') {
            closeModal();
            return;
        }

        if (e.key === 'Tab') {
            const focusable = Array.from(modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            )).filter(el => !el.disabled);
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last.focus(); }
            } else {
                if (document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        }
    });
}

// ===== Fetch Medium Articles via RSS =====
// Pure data fetcher — no DOM interaction. Returns articles array or throws.
async function loadArticlesFromNetwork() {
    const RSS_URL = CONFIG.mediumFeedUrl;
    let articles = null;

    const tryFetch = async (url, parse) => {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 8000);
        try {
            const res = await fetch(url, { signal: ctrl.signal });
            return await parse(res);
        } catch (_) { return null; } finally { clearTimeout(timer); }
    };

    // Method 1: Netlify function
    articles = await tryFetch('/.netlify/functions/medium-feed', async res => {
        if (!res.ok) return null;
        const xml = new DOMParser().parseFromString(await res.text(), 'text/xml');
        const items = xml.querySelectorAll('item');
        return items.length ? parseRSSItems(items) : null;
    });

    // Method 2: allorigins.win
    if (!articles?.length) articles = await tryFetch(
        `https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}&t=${Date.now()}`,
        async res => {
            const data = await res.json();
            if (!data.contents) return null;
            const xml = new DOMParser().parseFromString(data.contents, 'text/xml');
            const items = xml.querySelectorAll('item');
            return items.length ? parseRSSItems(items) : null;
        }
    );

    // Method 3: rss2json
    if (!articles?.length) articles = await tryFetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&count=50`,
        async res => {
            const data = await res.json();
            return data.status === 'ok' && data.items?.length ? data.items.filter(i => i.title && i.link) : null;
        }
    );

    // Method 4: corsproxy.io
    if (!articles?.length) articles = await tryFetch(
        `https://corsproxy.io/?${encodeURIComponent(RSS_URL)}`,
        async res => {
            if (!res.ok) return null;
            const xml = new DOMParser().parseFromString(await res.text(), 'text/xml');
            const items = xml.querySelectorAll('item');
            return items.length ? parseRSSItems(items) : null;
        }
    );

    // Method 5: allorigins raw
    if (!articles?.length) articles = await tryFetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_URL)}`,
        async res => {
            if (!res.ok) return null;
            const xml = new DOMParser().parseFromString(await res.text(), 'text/xml');
            const items = xml.querySelectorAll('item');
            return items.length ? parseRSSItems(items) : null;
        }
    );

    // Method 6: codetabs
    if (!articles?.length) articles = await tryFetch(
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(RSS_URL)}`,
        async res => {
            if (!res.ok) return null;
            const xml = new DOMParser().parseFromString(await res.text(), 'text/xml');
            const items = xml.querySelectorAll('item');
            return items.length ? parseRSSItems(items) : null;
        }
    );

    if (!articles?.length) throw new Error('Unable to fetch articles from Medium');
    return articles;
}

async function fetchMediumArticles() {
    const loadingEl = document.getElementById('blog-loading');
    const errorEl   = document.getElementById('blog-error');
    const articlesEl = document.getElementById('blog-articles');
    const CACHE_KEY = 'medium-articles-cache-v1';

    blogIsLoading = true;

    // Instant path — already prefetched in background
    if (prefetchedArticles) {
        renderArticles(prefetchedArticles);
        loadingEl.classList.add('hidden');
        articlesEl.classList.remove('hidden');
        blogIsLoading = false;
        return;
    }

    // Show skeleton while fetching
    loadingEl.classList.remove('hidden');
    errorEl.classList.add('hidden');
    errorEl.classList.remove('flex');
    articlesEl.classList.add('hidden');

    try {
        // If prefetch is in-flight, wait for it; otherwise start fresh
        const articles = await (prefetchPromise || loadArticlesFromNetwork());
        prefetchedArticles = articles;
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), articles: articles.slice(0, 12) }));
        } catch (_) {}
        renderArticles(articles);
        loadingEl.classList.add('hidden');
        articlesEl.classList.remove('hidden');
        blogIsLoading = false;
    } catch (error) {
        // Fallback: localStorage cache
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (raw) {
                const cached = JSON.parse(raw);
                const age = cached.ts ? Date.now() - cached.ts : Infinity;
                const arts = cached.articles || cached;
                if (age < 86400000 && Array.isArray(arts) && arts.length) {
                    renderArticles(arts);
                    loadingEl.classList.add('hidden');
                    articlesEl.classList.remove('hidden');
                    blogIsLoading = false;
                    return;
                }
            }
        } catch (_) {}
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
        errorEl.classList.add('flex');
        blogIsLoading = false;
        refreshFeatherIcons();
    }
}

// ===== Parse RSS Items from XML =====
function parseRSSItems(items) {
    const parsed = Array.from(items).map((item) => {
        const title = item.querySelector('title')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';

        let content = '';
        const allElements = item.querySelectorAll('*');
        for (const el of allElements) {
            if (el.localName === 'encoded' || el.tagName.toLowerCase().includes('encoded')) {
                content = el.textContent;
                break;
            }
        }
        if (!content) {
            content = item.querySelector('description')?.textContent || '';
        }

        const thumbnail = extractImageFromContent(content) || '';
        return { title, link, pubDate, content, description: content, thumbnail };
    });

    return parsed.filter(item => item.title && item.link);
}

function calcReadTime(content) {
    const text = content ? content.replace(/<[^>]*>/g, '') : '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
}

// ===== Render Articles =====
function renderArticles(articles) {
    const articlesEl = document.getElementById('blog-articles');

    articlesEl.innerHTML = articles.map((article) => {
        
        // Extract thumbnail from content or use default
        const fallbackThumbnail = 'https://miro.medium.com/max/1200/1*5AwDJU5kQGt9U7nR3CjBQg.png';
        const articleUrl = getSafeUrl(article.link, CONFIG.mediumProfileUrl);
        const thumbnail = getSafeUrl(article.thumbnail || extractImageFromContent(article.content), fallbackThumbnail);
        
        // Clean description (remove HTML tags and truncate)
        const description = stripHtml(article.description || article.content || '')
            .substring(0, 150)
            .trim() + '...';
        
        // Format date
        const pubDate = new Date(article.pubDate);
        const formattedDate = pubDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        return `
            <a href="${articleUrl}" target="_blank" rel="noopener noreferrer" 
               class="glass-card p-4 flex flex-col gap-3 hover:scale-[1.02] transition-transform duration-300 group no-underline">
                <div class="relative overflow-hidden rounded-lg aspect-video bg-slate-800">
                    <img src="${escapeHtml(thumbnail)}" alt="${escapeHtml(article.title)}"
                         width="600" height="338"
                         class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                         onerror="this.src='https://miro.medium.com/max/1200/1*5AwDJU5kQGt9U7nR3CjBQg.png'">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div class="flex-1 flex flex-col gap-2">
                    <h3 class="text-lg font-semibold text-gray-100 group-hover:text-emerald-400 transition-colors line-clamp-2">
                        ${escapeHtml(article.title)}
                    </h3>
                    <p class="text-sm text-gray-400 line-clamp-2 flex-1">
                        ${escapeHtml(description)}
                    </p>
                    <div class="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                        <span class="text-xs text-gray-500">${formattedDate}</span>
                        <span class="text-xs text-[#2dd4bf] flex items-center gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            ${calcReadTime(article.content)} min read
                        </span>
                    </div>
                </div>
            </a>
        `;
    }).join('');
}

// ===== Helper Functions =====
function extractImageFromContent(content) {
    if (!content) return null;
    const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : null;
}

function stripHtml(html) {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getSafeUrl(value, fallback) {
    try {
        const url = new URL(value, window.location.href);
        return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol) ? url.href : fallback;
    } catch {
        return fallback;
    }
}

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

function initTypewriter() {
    const el = document.getElementById('typed-roles');
    if (!el || typeof Typed === 'undefined') return;
    const ariaEl = document.getElementById('typed-roles-aria');
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
        onStringTyped(arrayPos, self) {
            if (ariaEl) ariaEl.textContent = self.strings[arrayPos];
        },
    });
}

function initCustomCursor() {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        dot.style.transform = `translate(calc(-50% + ${mouseX}px), calc(-50% + ${mouseY}px))`;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });

    const animateRing = () => {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        ring.style.transform = `translate(calc(-50% + ${ringX}px), calc(-50% + ${ringY}px))`;
        requestAnimationFrame(animateRing);
    };
    animateRing();

    const interactives = 'a, button, [role="button"], summary, .project-filter, .skill-tag';
    document.querySelectorAll(interactives).forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}

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
            if (typeof AOS !== 'undefined') AOS.refreshHard();
        });
    });
}

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

    btn.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    btn.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
}

function initCopyEmail() {
    const btn = document.getElementById('copy-email-btn');
    const toast = document.getElementById('copy-toast');
    if (!btn || !toast) return;

    btn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(CONFIG.email);
        } catch {
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

function initFloatingResume() {
    const container = document.getElementById('float-resume');
    const toggle = document.getElementById('float-resume-toggle');
    const menu = document.getElementById('float-resume-menu');
    const items = container?.querySelectorAll('.float-resume__item');
    if (!container || !toggle) return;

    let open = false;

    function openMenu() {
        open = true;
        container.classList.add('float-resume--open');
        toggle.setAttribute('aria-expanded', 'true');
        menu.setAttribute('aria-hidden', 'false');
        items.forEach((item, i) => { item.style.transitionDelay = `${i * 55}ms`; });
    }

    function closeMenu() {
        open = false;
        container.classList.remove('float-resume--open');
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        items.forEach(item => { item.style.transitionDelay = '0ms'; });
    }

    toggle.addEventListener('click', e => { e.stopPropagation(); open ? closeMenu() : openMenu(); });
    document.addEventListener('click', e => { if (open && !container.contains(e.target)) closeMenu(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) closeMenu(); });

    items.forEach(link => {
        link.addEventListener('click', () => {
            const variant = link.dataset.tooltip?.toLowerCase() === 'frontend' ? 'frontend' : 'fullstack';
            trackResumeDownload(variant);
            closeMenu();
        });
    });

    // Hide when hero is visible — resume button already present in the hero CTA
    const heroSection = document.getElementById('hero');
    if (heroSection && 'IntersectionObserver' in window) {
        new IntersectionObserver(([entry]) => {
            container.classList.toggle('float-resume--hidden', entry.isIntersecting);
            if (entry.isIntersecting) closeMenu();
        }, { threshold: 0.1 }).observe(heroSection);
    }
}

function initFloatingContact() {
    const container = document.getElementById('float-contact');
    const toggle = document.getElementById('float-contact-toggle');
    const menu = document.getElementById('float-contact-menu');
    const items = container?.querySelectorAll('.float-contact__item');
    if (!container || !toggle) return;

    const resumeEl = document.getElementById('float-resume');
    let open = false;
    let contactSectionVisible = false;

    function isMobile() { return window.innerWidth <= 768; }

    // Single source of truth for resume button's vertical position.
    // Called on every contact state change so resume always sits correctly.
    function syncResumeBottom() {
        if (!resumeEl) return;
        const mob = isMobile();
        if (contactSectionVisible) {
            // Contact button is hidden — resume slides down into its spot
            resumeEl.style.bottom = mob ? '4.75rem' : '5.5rem';
        } else if (open) {
            // Contact menu is expanded (3 items: ~8.7rem) — push resume above them
            // Contact top: 5.5rem+2.75rem=8.25rem, menu gap: 0.6rem, menu: 8.7rem → top ~17.55rem
            resumeEl.style.bottom = mob ? '17.5rem' : '18.5rem';
        } else {
            // Default stacked position directly above the contact toggle
            resumeEl.style.bottom = mob ? '8.25rem' : '9rem';
        }
    }

    function openMenu() {
        open = true;
        container.classList.add('float-contact--open');
        toggle.setAttribute('aria-expanded', 'true');
        menu.setAttribute('aria-hidden', 'false');
        items.forEach((item, i) => { item.style.transitionDelay = `${i * 55}ms`; });
        syncResumeBottom();
    }

    function closeMenu() {
        open = false;
        container.classList.remove('float-contact--open');
        toggle.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        items.forEach(item => { item.style.transitionDelay = '0ms'; });
        syncResumeBottom();
    }

    toggle.addEventListener('click', e => { e.stopPropagation(); open ? closeMenu() : openMenu(); });
    document.addEventListener('click', e => { if (open && !container.contains(e.target)) closeMenu(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) closeMenu(); });

    const contactSection = document.getElementById('contact');
    if (contactSection && 'IntersectionObserver' in window) {
        new IntersectionObserver(([entry]) => {
            contactSectionVisible = entry.isIntersecting;
            container.classList.toggle('float-contact--hidden', entry.isIntersecting);
            // closeMenu sets open=false then calls syncResumeBottom with correct state
            if (entry.isIntersecting) closeMenu();
            else syncResumeBottom(); // contact reappeared, restore resume to stacked position
        }, { threshold: 0.2 }).observe(contactSection);
    }

    // Recalculate on resize so mobile/desktop breakpoint stays correct
    window.addEventListener('resize', syncResumeBottom, { passive: true });
}

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

