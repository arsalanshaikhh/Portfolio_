class CustomNavbar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.initEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; position: fixed; top: 0; left: 0; right: 0; z-index: 1000; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.3s ease; }
                :host(.scrolled) { background: rgba(15, 23, 42, 0.95); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); }
                nav { max-width: 1280px; margin: 0 auto; padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; }
                .logo { font-size: 1.5rem; font-weight: bold; background: linear-gradient(135deg, #06b6d4, #8b5cf6); background-clip: text; -webkit-background-clip: text; color: transparent; text-decoration: none; display: flex; align-items: center; gap: 0.5rem; transition: transform 0.2s ease; }
                .logo:hover { transform: scale(1.05); }
                .logo svg { width: 28px; height: 28px; }
                .nav-links { display: flex; gap: 2rem; align-items: center; list-style: none; margin: 0; padding: 0; }
                .nav-links a { color: #e2e8f0; text-decoration: none; font-weight: 500; font-size: 0.95rem; transition: all 0.2s ease; position: relative; padding: 0.5rem 0; }
                .nav-links a:hover { color: #06b6d4; }
                .nav-links a::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: linear-gradient(to right, #06b6d4, #8b5cf6); transition: width 0.3s ease; border-radius: 1px; }
                .nav-links a:hover::after { width: 100%; }
                .nav-actions { display: flex; gap: 0.75rem; align-items: center; }
                .theme-toggle, .mobile-menu-button { width: 42px; height: 42px; border-radius: 12px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.15); color: #e2e8f0; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s ease; }
                .theme-toggle:hover, .mobile-menu-button:hover { background: rgba(255, 255, 255, 0.15); transform: scale(1.05); }
                .theme-toggle svg, .mobile-menu-button svg { width: 20px; height: 20px; stroke: currentColor; stroke-width: 2; fill: none; }
                .mobile-menu-button { display: none; }
                .mobile-menu { display: none; position: fixed; top: 73px; left: 0; right: 0; background: rgba(15, 23, 42, 0.98); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding: 1rem; }
                .mobile-menu.active { display: block; }
                .mobile-menu-links { display: flex; flex-direction: column; gap: 0.5rem; }
                .mobile-menu-links a { color: #e2e8f0; text-decoration: none; font-weight: 500; padding: 0.875rem 1rem; border-radius: 10px; transition: all 0.2s ease; }
                .mobile-menu-links a:hover { background: rgba(255, 255, 255, 0.1); color: #06b6d4; }
                @media (max-width: 768px) { .nav-links { display: none; } .mobile-menu-button { display: flex; } nav { padding: 0.875rem 1rem; } }
            </style>
            <nav>
                <a href="#hero" class="logo">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <defs><linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#06b6d4"/><stop offset="100%" style="stop-color:#8b5cf6"/></linearGradient></defs>
                        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="url(#logo-gradient)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
                    </svg>
                    AS
                </a>
                <ul class="nav-links">
                    <li><a href="#hero">Home</a></li>
                    <li><a href="#career">About</a></li>
                    <li><a href="#skills">Skills</a></li>
                    <li><a href="#experience">Experience</a></li>
                    <li><a href="#projects">Projects</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <div class="nav-actions">
                    <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
                        <svg class="sun-icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                    </button>
                    <button class="mobile-menu-button" id="mobile-menu-button" aria-label="Toggle menu">
                        <svg class="menu-icon" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                    </button>
                </div>
            </nav>
            <div class="mobile-menu" id="mobile-menu">
                <div class="mobile-menu-links">
                    <a href="#hero">Home</a><a href="#career">About</a><a href="#skills">Skills</a><a href="#experience">Experience</a><a href="#projects">Projects</a><a href="#contact">Contact</a>
                </div>
            </div>
        `;
    }

    initEventListeners() {
        const themeToggle = this.shadowRoot.getElementById('theme-toggle');
        const mobileMenuButton = this.shadowRoot.getElementById('mobile-menu-button');
        const mobileMenu = this.shadowRoot.getElementById('mobile-menu');
        const mobileLinks = this.shadowRoot.querySelectorAll('.mobile-menu-links a');

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.documentElement.classList.toggle('light');
                this.classList.toggle('light');
                localStorage.setItem('theme', document.documentElement.classList.contains('light') ? 'light' : 'dark');
            });
        }

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
            });
        }

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) this.classList.add('scrolled');
            else this.classList.remove('scrolled');
        });

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.documentElement.classList.add('light');
            this.classList.add('light');
        }
    }
}

customElements.define('custom-navbar', CustomNavbar);