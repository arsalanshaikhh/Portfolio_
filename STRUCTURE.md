# Portfolio Website Structure

## Overview

A modern, responsive portfolio website for **Arsalan Shaikh** - AI Driven Full Stack Developer. Built with vanilla HTML, CSS, and JavaScript using Web Components architecture.

## Directory Structure

```
portfolio/
├── index.html                 # Main entry point - single page application
├── style.css                  # Custom styles, animations, glass effects
├── script.js                  # Core JavaScript functionality
├── STRUCTURE.md               # This documentation file
│
├── components/
│   ├── navbar.js              # <custom-navbar> Web Component
│   └── footer.js              # <custom-footer> Web Component
│
└── assets/
    ├── favicon.svg            # Site favicon (SVG format)
    └── site.webmanifest       # PWA manifest configuration
```

## Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Markup** | HTML5 | Semantic structure |
| **Styling** | Tailwind CSS (CDN) | Utility-first styling |
| **Custom CSS** | style.css | Glass effects, animations, themes |
| **JavaScript** | ES6+ | Interactivity and components |
| **Icons** | Feather Icons | Lightweight icon library |
| **Components** | Web Components API | Reusable navbar/footer |

## File Descriptions

### `index.html`
Main HTML file containing all sections:
- **Hero Section** - Centered introduction with name, title, and CTAs
- **Career Summary** - Professional background overview
- **Technical Skills** - Categorized skill grid (Frontend, Backend, Databases, DevOps, AI, Cloud)
- **Professional Experience** - Timeline-style work history
- **Featured Projects** - Project showcase cards
- **Education** - Academic background
- **Certifications** - Professional certifications
- **Contact** - Contact form and social links

### `style.css`
Custom styles including:
- `.glass-card` - Glassmorphism effect with backdrop blur
- `.skill-chip` - Skill tag styling with hover effects
- `.tech-tag` - Technology label styling
- Light/dark theme support
- Custom scrollbar
- Animations (fade-in, pulse-glow)
- Responsive breakpoints

### `script.js`
JavaScript functionality:
- Smooth scroll navigation
- Intersection Observer scroll animations
- Theme toggle with localStorage persistence
- Scroll progress bar
- Parallax effects
- Form submission handling
- Mobile menu toggle
- Typing animation (optional)

### `components/navbar.js`
Custom `<custom-navbar>` element featuring:
- Fixed position with backdrop blur
- Logo with gradient text
- Navigation links with hover underline effect
- Theme toggle button (sun/moon icons)
- Mobile hamburger menu
- Scroll-based styling changes

### `components/footer.js`
Custom `<custom-footer>` element featuring:
- Four-column responsive grid
- About section with social links
- Quick navigation links
- Technologies list
- Contact information
- Dynamic copyright year
- Heartbeat animation

### `assets/favicon.svg`
SVG favicon with gradient lightning bolt icon.

### `assets/site.webmanifest`
PWA manifest for installable web app support.

## Design System

### Colors
```css
--primary: cyan-400 (#22d3ee)
--secondary: violet-400 (#a78bfa)
--accent: purple-500 (#a855f7)
--background: slate-900 (#0f172a)
--surface: rgba(255, 255, 255, 0.03)
```

### Typography
- **Headings**: System font stack, bold weights
- **Body**: Gray-300/400 for readability on dark background
- **Accents**: Gradient text for emphasis

### Spacing
- Container max-width: 1280px
- Section padding: 5rem vertical
- Card padding: 1.5rem - 2rem
- Gap utilities: 1rem - 3rem

## Features

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px)
- Mobile navigation drawer
- Flexible grid layouts

### Accessibility
- Semantic HTML5 elements
- Focus states for interactive elements
- Sufficient color contrast
- Keyboard navigation support

### Performance
- CDN-hosted dependencies
- Minimal JavaScript bundle
- CSS animations (GPU accelerated)
- Lazy intersection observer animations

### SEO
- Semantic heading hierarchy
- Meta description and keywords
- Open Graph tags for social sharing
- Structured content sections

## Browser Support
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

### Local Development
Simply open `index.html` in a browser or use a local server:
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

### Customization
1. Update personal information in `index.html`
2. Modify color scheme in `style.css` CSS variables
3. Add/remove sections as needed
4. Update social links and contact information

## Contact Information

- **Name**: Arsalan Shaikh
- **Email**: arsalan.developer7@gmail.com
- **Phone**: +91 92847 99416
- **Location**: Jalgaon, India
- **GitHub**: [github.com/arsalanshaikhh](https://github.com/arsalanshaikhh)
- **LinkedIn**: [linkedin.com/in/iarsalanshaikh](https://linkedin.com/in/iarsalanshaikh)

---

*Last updated: December 2024*