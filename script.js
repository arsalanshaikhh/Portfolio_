// Portfolio Website JavaScript
// Enhanced functionality with smooth animations and interactions

document.addEventListener('DOMContentLoaded', function() {
    initSmoothScroll();
    initScrollAnimations();
    initScrollProgress();
    initParallaxEffect();
    initFormHandler();
    initCardHoverEffects();
    initNavbarScroll();
    initBlogModal();
});

// ===== Smooth Scroll Navigation =====
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

// ===== Scroll Animations with Intersection Observer =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe all sections and cards
    const animatedElements = document.querySelectorAll('section > .container, .glass-card');
    animatedElements.forEach((el, index) => {
        if (!el.classList.contains('animate-fade-in')) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `opacity 0.6s ease ${index * 0.05}s, transform 0.6s ease ${index * 0.05}s`;
            observer.observe(el);
        }
    });
}

// ===== Scroll Progress Bar =====
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(to right, #06b6d4, #8b5cf6);
        z-index: 9999;
        transition: width 0.1s ease;
        width: 0%;
    `;
    document.body.appendChild(progressBar);

    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                progressBar.style.width = Math.min(scrollPercent, 100) + '%';
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ===== Parallax Effect =====
function initParallaxEffect() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.dataset.parallax) || 0.5;
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    });
}

// ===== Form Handler =====
function initFormHandler() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitButton = form.querySelector('button[type="submit"]');
            const originalContent = submitButton.innerHTML;
            
            // Show loading state
            submitButton.innerHTML = `
                <svg class="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
            `;
            submitButton.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success state
            submitButton.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Message Sent!
            `;
            submitButton.classList.add('success');
            
            // Reset form
            form.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                submitButton.innerHTML = originalContent;
                submitButton.classList.remove('success');
                submitButton.disabled = false;
                feather.replace();
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

function validateInput(input) {
    const isValid = input.checkValidity();
    
    if (!isValid) {
        input.classList.add('error');
        input.style.borderColor = '#ef4444';
    } else {
        input.classList.remove('error');
        input.style.borderColor = '';
    }
    
    return isValid;
}

// ===== Card Hover Effects =====
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            if (!this.classList.contains('no-hover')) {
                this.style.transform = 'translateY(-5px)';
            }
        });
        
        card.addEventListener('mouseleave', function(e) {
            if (!this.classList.contains('no-hover')) {
                this.style.transform = 'translateY(0)';
            }
        });
        
        // Add subtle tilt effect on mouse move
        card.addEventListener('mousemove', function(e) {
            if (this.classList.contains('tilt-effect')) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            }
        });
        
        card.addEventListener('mouseleave', function(e) {
            if (this.classList.contains('tilt-effect')) {
                this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            }
        });
    });
}

// ===== Navbar Scroll Effect =====
function initNavbarScroll() {
    const navbar = document.querySelector('custom-navbar');
    
    if (navbar) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        });
    }
}

// ===== Typing Animation (Optional) =====
function initTypingAnimation(element, texts, options = {}) {
    const {
        typeSpeed = 100,
        deleteSpeed = 50,
        pauseTime = 2000
    } = options;
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            element.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            element.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let timeout = isDeleting ? deleteSpeed : typeSpeed;
        
        if (!isDeleting && charIndex === currentText.length) {
            timeout = pauseTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            timeout = 500;
        }
        
        setTimeout(type, timeout);
    }
    
    type();
}

// ===== Utility Functions =====

// Debounce function for performance
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

// Throttle function for performance
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

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Get current year for footer
function getCurrentYear() {
    return new Date().getFullYear();
}

// Export functions for use in other scripts
window.portfolioUtils = {
    debounce,
    throttle,
    isInViewport,
    getCurrentYear,
    initTypingAnimation
};

// ===== Blog Modal Functionality =====
function initBlogModal() {
    const blogBtn = document.getElementById('read-blogs-btn');
    const modal = document.getElementById('blog-modal');
    const closeBtn = document.getElementById('close-modal-btn');
    
    if (!blogBtn || !modal) return;
    
    // Open modal
    blogBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
        fetchMediumArticles();
        feather.replace();
    });
    
    // Close modal
    const closeModal = () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        document.body.style.overflow = '';
    };
    
    closeBtn.addEventListener('click', closeModal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
}

// ===== Fetch Medium Articles via RSS =====
async function fetchMediumArticles() {
    const loadingEl = document.getElementById('blog-loading');
    const errorEl = document.getElementById('blog-error');
    const articlesEl = document.getElementById('blog-articles');
    
    // Reset states
    loadingEl.classList.remove('hidden');
    loadingEl.classList.add('flex');
    errorEl.classList.add('hidden');
    errorEl.classList.remove('flex');
    articlesEl.classList.add('hidden');
    
    const RSS_URL = 'https://medium.com/feed/@arsalan-shaikh';
    // Add cache-busting to ensure fresh data
    const cacheBuster = `?t=${Date.now()}`;
    
    try {
        let articles = null;
        
        // Method 1: allorigins.win - gets all items from RSS (try this first as it has no limits)
        console.log('Trying allorigins.win...');
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}&t=${Date.now()}`);
            const data = await response.json();
            
            if (data.contents) {
                console.log('allorigins: Raw XML length:', data.contents.length);
                const parser = new DOMParser();
                const xml = parser.parseFromString(data.contents, 'text/xml');
                const items = xml.querySelectorAll('item');
                console.log(`allorigins: Found ${items.length} items in RSS feed`);
                
                if (items.length > 0) {
                    articles = parseRSSItems(items);
                    console.log(`allorigins: Parsed ${articles.length} articles`);
                }
            }
        } catch (e) {
            console.log('allorigins failed:', e.message);
        }
        
        // Method 2: rss2json API with count=50
        if (!articles || articles.length === 0) {
            console.log('Trying rss2json API...');
            try {
                const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}&count=50`);
                const data = await response.json();
                console.log('rss2json response:', data);
                
                if (data.status === 'ok' && data.items && data.items.length > 0) {
                    articles = data.items.filter(item => item.title && item.link);
                    console.log(`rss2json: Found ${articles.length} articles`);
                }
            } catch (e) {
                console.log('rss2json failed:', e.message);
            }
        }
        
        // Method 3: corsproxy.io
        if (!articles || articles.length === 0) {
            console.log('Trying corsproxy.io...');
            try {
                const response = await fetch(`https://corsproxy.io/?${encodeURIComponent(RSS_URL)}`);
                if (response.ok) {
                    const text = await response.text();
                    console.log('corsproxy: Response length:', text.length);
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(text, 'text/xml');
                    const items = xml.querySelectorAll('item');
                    console.log(`corsproxy: Found ${items.length} items`);
                    
                    if (items.length > 0) {
                        articles = parseRSSItems(items);
                    }
                }
            } catch (e) {
                console.log('corsproxy failed:', e.message);
            }
        }
        
        // Method 4: allorigins raw
        if (!articles || articles.length === 0) {
            console.log('Trying allorigins raw...');
            try {
                const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(RSS_URL)}`);
                if (response.ok) {
                    const text = await response.text();
                    console.log('allorigins raw: Response length:', text.length);
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(text, 'text/xml');
                    const items = xml.querySelectorAll('item');
                    console.log(`allorigins raw: Found ${items.length} items`);
                    
                    if (items.length > 0) {
                        articles = parseRSSItems(items);
                    }
                }
            } catch (e) {
                console.log('allorigins raw failed:', e.message);
            }
        }
        
        // Method 5: codetabs proxy
        if (!articles || articles.length === 0) {
            console.log('Trying codetabs proxy...');
            try {
                const response = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(RSS_URL)}`);
                if (response.ok) {
                    const text = await response.text();
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(text, 'text/xml');
                    const items = xml.querySelectorAll('item');
                    console.log(`codetabs: Found ${items.length} items`);
                    
                    if (items.length > 0) {
                        articles = parseRSSItems(items);
                    }
                }
            } catch (e) {
                console.log('codetabs failed:', e.message);
            }
        }
        
        if (!articles || articles.length === 0) {
            throw new Error('Unable to fetch articles from Medium');
        }
        
        console.log(`Total articles to display: ${articles.length}`);
        renderArticles(articles);
        
        loadingEl.classList.add('hidden');
        loadingEl.classList.remove('flex');
        articlesEl.classList.remove('hidden');
        
    } catch (error) {
        console.error('Error fetching Medium articles:', error);
        loadingEl.classList.add('hidden');
        loadingEl.classList.remove('flex');
        errorEl.classList.remove('hidden');
        errorEl.classList.add('flex');
        feather.replace();
    }
}

// ===== Parse RSS Items from XML =====
function parseRSSItems(items) {
    console.log(`parseRSSItems: Processing ${items.length} items`);
    
    const parsed = Array.from(items).map((item, index) => {
        const title = item.querySelector('title')?.textContent || '';
        const link = item.querySelector('link')?.textContent || '';
        const pubDate = item.querySelector('pubDate')?.textContent || '';
        
        // Get content - try content:encoded first, then description
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
        
        console.log(`Item ${index}: title="${title.substring(0, 50)}...", link="${link}"`);
        
        return { title, link, pubDate, content, description: content, thumbnail };
    });
    
    const filtered = parsed.filter(item => item.title && item.link);
    console.log(`parseRSSItems: ${filtered.length} items after filtering`);
    
    return filtered;
}

// ===== Render Articles =====
function renderArticles(articles) {
    const articlesEl = document.getElementById('blog-articles');
    
    console.log(`renderArticles: Rendering ${articles.length} articles`);
    
    articlesEl.innerHTML = articles.map((article, index) => {
        console.log(`Rendering article ${index}: ${article.title}`);
        
        // Extract thumbnail from content or use default
        let thumbnail = article.thumbnail || extractImageFromContent(article.content) || 'https://miro.medium.com/max/1200/1*5AwDJU5kQGt9U7nR3CjBQg.png';
        
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
            <a href="${article.link}" target="_blank" rel="noopener noreferrer" 
               class="glass-card p-4 flex flex-col gap-3 hover:scale-[1.02] transition-transform duration-300 group no-underline">
                <div class="relative overflow-hidden rounded-lg aspect-video bg-slate-800">
                    <img src="${thumbnail}" alt="${escapeHtml(article.title)}" 
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