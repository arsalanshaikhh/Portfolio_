class CustomFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const currentYear = new Date().getFullYear();
        
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; margin-top: 4rem; background: linear-gradient(to top, rgba(15, 23, 42, 0.9), transparent); border-top: 1px solid rgba(255, 255, 255, 0.1); }
                footer { max-width: 1280px; margin: 0 auto; padding: 3rem 1.5rem 2rem; }
                .footer-content { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 2rem; }
                .footer-section h3 { font-size: 1.125rem; font-weight: 600; margin-bottom: 1rem; background: linear-gradient(to right, #06b6d4, #8b5cf6); background-clip: text; -webkit-background-clip: text; color: transparent; }
                .footer-section p, .footer-section a { color: #94a3b8; text-decoration: none; line-height: 1.6; transition: color 0.2s ease; }
                .footer-section a:hover { color: #06b6d4; }
                .social-links { display: flex; gap: 1rem; margin-top: 1rem; }
                .social-link { width: 40px; height: 40px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }
                .social-link:hover { background: rgba(6, 182, 212, 0.2); border-color: #06b6d4; transform: translateY(-2px); }
                .social-link svg { width: 20px; height: 20px; stroke: #94a3b8; stroke-width: 2; fill: none; }
                .social-link:hover svg { stroke: #06b6d4; }
                .footer-links { list-style: none; padding: 0; margin: 0; }
                .footer-links li { margin-bottom: 0.5rem; }
                .footer-divider { height: 1px; background: rgba(255, 255, 255, 0.1); margin: 2rem 0; }
                .footer-bottom { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; color: #64748b; font-size: 0.875rem; }
                .footer-bottom p { margin: 0; }
                .made-with { display: flex; align-items: center; gap: 0.5rem; }
                .heart { color: #ef4444; animation: heartbeat 1.5s ease-in-out infinite; }
                @keyframes heartbeat { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
                @media (max-width: 768px) { .footer-bottom { flex-direction: column; text-align: center; } }
            </style>
            <footer>
                <div class="footer-content">
                    <div class="footer-section">
                        <h3>About Arsalan</h3>
                        <p>AI-driven Full Stack Developer specializing in modern web technologies and AI-assisted development workflows. Building scalable digital solutions with cutting-edge technologies.</p>
                        <div class="social-links">
                            <a href="https://linkedin.com/in/iarsalanshaikh" title="LinkedIn" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="LinkedIn">
                                <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                            </a>
                            <a href="https://github.com/arsalanshaikhh" title="GitHub" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
                                <svg viewBox="0 0 24 24"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37
                                3.37 0 0 0 8.44 16.13V20"/></svg>
                            </a>
                            <a href="mailto:arsalan.developer7@gmail.com" title="Email" class="social-link" aria-label="Email">
                                <svg viewBox="0 0 24 24"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                            </a>
                            <a href="https://medium.com/@arsalan-shaikh" title="Medium" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Medium">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M4.37 6.31c.04-.36-.1-.71-.37-.95L2 3.06V2h6.21l4.8 10.53L17.29 2H23v1.06l-1.71 1.63c-.15.11-.23.3-.2.48v13.66c-.03.18.05.37.2.48L23 20.94V22h-8.6v-1.06l1.77-1.72c.17-.17.17-.22.17-.48V8.6l-4.92 13.4h-.66L5.09 8.6v8.53c-.05.35.07.7.32.94l2.3 2.79V22H1v-1.06l2.3-2.79c.25-.24.36-.59.31-.94V6.31z"/>
                                </svg>                            </a>
                        </div>
                    </div>
                    <div class="footer-section">
                        <h3>Quick Links</h3>
                        <ul class="footer-links">
                            <li><a href="#hero">Home</a></li>
                            <li><a href="#career">About</a></li>
                            <li><a href="#skills">Skills</a></li>
                            <li><a href="#experience">Experience</a></li>
                            <li><a href="#projects">Projects</a></li>
                        </ul>
                    </div>
                    <div class="footer-section">
                        <h3>Technologies</h3>
                        <p>MERN Stack • Django • React • Node.js • AI/ML • REST APIs • Microservices • Docker • Cloud Deployment</p>
                    </div>
                    <div class="footer-section">
                        <h3>Get In Touch</h3>
                        <p><strong>Email:</strong> arsalan.developer7@gmail.com</p>
                        <p><strong>Phone:</strong> +91 92847 99416</p>
                        <p style="margin-top: 1rem;"><strong>Available for:</strong> Full-time, Freelance, Consulting</p>
                    </div>
                </div>
                <div class="footer-divider"></div>
                <div class="footer-bottom">
                    <p>&copy; ${currentYear} Arsalan Shaikh. All rights reserved.</p>
                    <div class="made-with">
                        <span>Built with code, coffee, and curiosity.</span>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('custom-footer', CustomFooter);