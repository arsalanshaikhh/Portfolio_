const CONFIG = {
    email: 'arsalan.developer7@gmail.com',
    mediumFeedUrl: 'https://medium.com/feed/@arsalan-shaikh',
    mediumProfileUrl: 'https://medium.com/@arsalan-shaikh',
};

document.addEventListener('DOMContentLoaded', function() {
    initLandingLoader();
    refreshFeatherIcons();
    initSmoothScroll();
    initScrollAnimations();
    initScrollProgress();
    initFormHandler();
    initResumeDropdown();
    initCardHoverEffects();
    initBlogModal();
});

window.addEventListener('load', function() {
    initAOS();
}, { once: true });

function initLandingLoader() {
    const loader = document.getElementById('landing-loader');
    if (!loader) return;

    const hideLoader = () => {
        loader.classList.add('is-hidden');
        document.body.classList.remove('page-loading');
        document.body.classList.add('loader-done');

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
        link.addEventListener('click', () => setOpen(false));
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
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                const navbarHeight = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
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

/**
 * ===== Scroll Progress Bar =====
 * Creates and manages a visual progress bar indicating scroll position
 * Bar appears at top of page and fills as user scrolls down
 */
function initScrollProgress() {
    // Create progress bar element
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

    // Throttle scroll events for performance
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                // Calculate scroll percentage
                const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                // Update progress bar width
                progressBar.style.width = Math.min(scrollPercent, 100) + '%';
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
            const originalContent = submitButton.innerHTML;
            const formData = new FormData(form);
            const name = (formData.get('name') || '').toString().trim();
            const email = (formData.get('email') || '').toString().trim();
            const message = (formData.get('message') || '').toString().trim();
            const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
            const body = encodeURIComponent([
                `Name: ${name}`,
                `Email: ${email}`,
                '',
                message
            ].join('\n'));
            
            submitButton.innerHTML = `
                <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Opening Email...
            `;
            submitButton.disabled = true;

            window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;

            submitButton.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Email Ready
            `;
            submitButton.classList.add('success');

            if (status) {
                status.textContent = `Your email app should open with the message prefilled. If it does not, email me directly at ${CONFIG.email}.`;
                status.classList.add('text-emerald-400');
                status.classList.remove('text-gray-400', 'text-red-400');
            }

            setTimeout(() => {
                submitButton.innerHTML = originalContent;
                submitButton.classList.remove('success');
                submitButton.disabled = false;
                refreshFeatherIcons();
            }, 3000);
        });
        
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
function getCurrentYear() {
    return new Date().getFullYear();
}

window.portfolioUtils = {
    debounce,
    throttle,
    isInViewport,
    getCurrentYear,
};

// ===== Blog Modal Functionality =====
function initBlogModal() {
    const blogBtn = document.getElementById('read-blogs-btn');
    const modal = document.getElementById('blog-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    let lastFocusedElement = null;
    
    if (!blogBtn || !modal) return;
    
    // Open modal
    blogBtn.addEventListener('click', () => {
        lastFocusedElement = document.activeElement;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        fetchMediumArticles();
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
async function fetchMediumArticles() {
    const loadingEl = document.getElementById('blog-loading');
    const errorEl = document.getElementById('blog-error');
    const articlesEl = document.getElementById('blog-articles');

    loadingEl.classList.remove('hidden');
    loadingEl.classList.add('flex');
    errorEl.classList.add('hidden');
    errorEl.classList.remove('flex');
    articlesEl.classList.add('hidden');

    const RSS_URL = CONFIG.mediumFeedUrl;
    const CACHE_KEY = 'medium-articles-cache-v1';

    try {
        let articles = null;

        // Method 1: Netlify serverless function (no CORS, most reliable)
        try {
            const response = await fetch('/.netlify/functions/medium-feed');
            if (response.ok) {
                const xml = new DOMParser().parseFromString(await response.text(), 'text/xml');
                const items = xml.querySelectorAll('item');
                if (items.length > 0) articles = parseRSSItems(items);
            }
        } catch (e) { /* try next proxy */ }

        // Method 2: allorigins.win
        if (!articles || articles.length === 0) {
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}&t=${Date.now()}`);
            const data = await response.json();
            if (data.contents) {
                const parser = new DOMParser();
                const xml = parser.parseFromString(data.contents, 'text/xml');
                const items = xml.querySelectorAll('item');
                if (items.length > 0) articles = parseRSSItems(items);
            }
        } catch (e) { /* try next proxy */ }
        }

        // Method 3: rss2json API
        if (!articles || articles.length === 0) {
            try {
                const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&count=50`);
                const data = await response.json();
                if (data.status === 'ok' && data.items?.length > 0) {
                    articles = data.items.filter(item => item.title && item.link);
                }
            } catch (e) { /* try next proxy */ }
        }

        // Method 4: corsproxy.io
        if (!articles || articles.length === 0) {
            try {
                const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(RSS_URL)}`);
                if (response.ok) {
                    const xml = new DOMParser().parseFromString(await response.text(), 'text/xml');
                    const items = xml.querySelectorAll('item');
                    if (items.length > 0) articles = parseRSSItems(items);
                }
            } catch (e) { /* try next proxy */ }
        }

        // Method 5: allorigins raw
        if (!articles || articles.length === 0) {
            try {
                const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_URL)}`);
                if (response.ok) {
                    const xml = new DOMParser().parseFromString(await response.text(), 'text/xml');
                    const items = xml.querySelectorAll('item');
                    if (items.length > 0) articles = parseRSSItems(items);
                }
            } catch (e) { /* try next proxy */ }
        }

        // Method 6: codetabs proxy
        if (!articles || articles.length === 0) {
            try {
                const response = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(RSS_URL)}`);
                if (response.ok) {
                    const xml = new DOMParser().parseFromString(await response.text(), 'text/xml');
                    const items = xml.querySelectorAll('item');
                    if (items.length > 0) articles = parseRSSItems(items);
                }
            } catch (e) { /* try next proxy */ }
        }

        if (!articles || articles.length === 0) {
            throw new Error('Unable to fetch articles from Medium');
        }

        localStorage.setItem(CACHE_KEY, JSON.stringify(articles.slice(0, 12)));
        renderArticles(articles);

        loadingEl.classList.add('hidden');
        loadingEl.classList.remove('flex');
        articlesEl.classList.remove('hidden');

    } catch (error) {
        const cachedArticles = localStorage.getItem(CACHE_KEY);
        if (cachedArticles) {
            try {
                renderArticles(JSON.parse(cachedArticles));
                loadingEl.classList.add('hidden');
                loadingEl.classList.remove('flex');
                articlesEl.classList.remove('hidden');
                return;
            } catch (e) { /* fall through to error state */ }
        }
        loadingEl.classList.add('hidden');
        loadingEl.classList.remove('flex');
        errorEl.classList.remove('hidden');
        errorEl.classList.add('flex');
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
                        <span class="text-xs text-emerald-400 flex items-center gap-1">
                            Read more
                            <svg class="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                            </svg>
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
