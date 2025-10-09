# CLAUDE.md - Real Estate SaaS Platform

This file contains essential information for Claude Code instances working on this Real Estate SaaS platform.

## 🏗️ Project Overview

A comprehensive real estate management platform built with **vanilla HTML, CSS, and JavaScript**. No frameworks or build tools - just modern web standards implemented in a structured, maintainable way.

**Key Characteristics:**
- Single Page Application (SPA) with client-side routing
- Component-based architecture using vanilla JavaScript
- Comprehensive design system with light/dark theme support
- Modular structure with clear separation of concerns
- Progressive enhancement and accessibility-focused

## 📁 Project Structure

```
app/
├── index.html                 # Main application entry point
├── assets/
│   ├── css/
│   │   ├── components.css     # UI component styles
│   │   ├── layout.css         # Layout and responsive design
│   │   └── pages.css          # Page-specific styles
│   ├── js/
│   │   ├── components.js      # Component classes (Modal, Dropdown, Toast, FormValidator)
│   │   ├── sidebar.js         # Sidebar navigation controller
│   │   ├── header.js          # Header and search functionality
│   │   └── app.js             # Application initialization
│   └── images/                # Static assets
├── components/
│   ├── sidebar.html           # Sidebar navigation template
│   └── header.html            # Header template
├── pages/
│   ├── dashboard.js           # Dashboard controller
│   ├── properties.js          # Properties management
│   ├── clients.js             # Client management
│   └── agents.js              # Agent management
├── utils/
│   ├── helpers.js             # Utility functions (formatting, validation, DOM helpers)
│   ├── storage.js             # LocalStorage management with JSON serialization
│   ├── api.js                 # HTTP client for backend communication
│   ├── router.js              # Hash-based SPA routing system
│   └── theme.js               # Light/dark theme management
└── docs/                      # Comprehensive documentation
```

## 🎨 Design System

The application uses a comprehensive design system documented in `STYLE_GUIDE.md` and implemented in `index.css`:

### Key Design Tokens
- **Colors**: Semantic color system with light/dark mode support
- **Typography**: DM Sans (primary), Lora (serif), IBM Plex Mono (monospace)
- **Spacing**: 4px base unit with consistent scale
- **Border Radius**: Unified 0.5rem system
- **Shadows**: Layered shadow system for depth

### Theme System
- Automatic system preference detection
- Manual theme switching via `theme.js`
- CSS custom properties for dynamic theming
- Theme persistence in localStorage

## 🚀 Core Architecture Patterns

### 1. Component Pattern
Each UI component follows a consistent class-based pattern:

```javascript
class ComponentName {
    constructor(options = {}) {
        this.options = { ...defaults, ...options };
        this.element = null;
        this.init();
    }
    
    init() {
        this.createElement();
        this.bindEvents();
    }
    
    createElement() {
        // Create DOM elements
    }
    
    bindEvents() {
        // Attach event listeners
    }
    
    destroy() {
        // Cleanup
    }
}
```

### 2. Page Controller Pattern
Each page has a controller in `pages/` that manages:

```javascript
const pageController = {
    async load(container, options = {}) {
        await this.loadData();
        this.render(container);
        this.setupEventListeners();
        this.initializeComponents();
    },
    
    render(container) {
        container.innerHTML = this.generateHTML();
    },
    
    setupEventListeners() {
        // Bind interactions
    },
    
    destroy() {
        // Cleanup when page unloads
    }
};
```

### 3. Routing System
Hash-based routing in `utils/router.js`:
- Route parameters (e.g., `/properties/:id`)
- Middleware support
- 404 handling
- Browser history management

## 🔧 Key Utilities

### Storage (`utils/storage.js`)
- Prefixed localStorage keys: `real_estate_saas_`
- Automatic JSON serialization/deserialization
- Error handling for quota exceeded
- User preferences, session data, and form drafts

### API Client (`utils/api.js`)
- RESTful methods (GET, POST, PUT, DELETE)
- Authentication token handling
- Request/response interceptors
- Error handling with retry logic
- File upload support

### Helpers (`utils/helpers.js`)
Essential utility functions:
- `formatCurrency(amount)` - Currency formatting
- `formatDate(date)` - Date formatting
- `getRelativeTime(date)` - Relative time (e.g., "2 hours ago")
- `isValidEmail(email)` - Email validation
- `debounce(fn, delay)` - Function debouncing
- `toggleLoading(show)` - Loading state management

## 🎯 Development Guidelines

### Adding New Pages
1. Create controller in `pages/[name].js`
2. Add route in `utils/router.js`
3. Add navigation link in `components/sidebar.html`
4. Add page-specific styles in `assets/css/pages.css`

### Creating Components
1. Add component class to `assets/js/components.js`
2. Add component styles to `assets/css/components.css`
3. Follow the established component pattern
4. Include proper cleanup in `destroy()` method

### Styling Guidelines
- Use existing design tokens from `index.css`
- Follow the CSS architecture: tokens → layout → components → pages
- Mobile-first responsive design
- Use CSS custom properties for theming
- Follow the BEM-like naming convention

### Code Quality Standards
- **No comments unless explicitly requested**
- Use ES6+ features consistently
- Follow existing naming conventions
- Ensure proper error handling
- Clean up event listeners and references
- Test in both light and dark themes

## ⚠️ Important Notes

### File Management
- **Always prefer editing existing files over creating new ones**
- Never create documentation files unless explicitly requested
- Use `Read` tool before editing any file
- Follow exact indentation and formatting from existing files

### Routing
- All routing is hash-based (e.g., `#/properties`)
- Default route redirects to `/dashboard`
- Page controllers are loaded dynamically via `window[pageName + 'Controller']`

### State Management
- Component-level state in component instances
- Global state via custom events and localStorage
- No complex state management framework
- Event-driven communication between components

### Performance Considerations
- Lazy loading of components and images
- Event delegation for dynamic content
- Debounced search and scroll handlers
- Proper memory management and cleanup

## 🔒 Security & Best Practices

### Input Sanitization
- Always escape HTML content: `Helpers.escapeHtml(userInput)`
- Validate all form inputs client-side (server validation still required)
- Use the FormValidator component for consistent validation

### Authentication Flow
- JWT tokens stored in localStorage
- API client handles authentication headers
- Route guards for protected pages
- Automatic redirect to login on auth failure

## 📝 Common Tasks

### Running the Application
```bash
# Navigate to app directory
cd app

# Serve with Python
python -m http.server 8000

# Or with Node.js
npx serve .

# Open http://localhost:8000
```

### Adding a New Property Feature
1. Extend `propertiesController` in `pages/properties.js`
2. Add API methods to `utils/api.js`
3. Update property card component in `components.js`
4. Add styles to `components.css` or `pages.css`

### Implementing Form Validation
```javascript
const validator = new FormValidator(form, {
    email: {
        required: true,
        email: true,
        messages: {
            required: 'Email is required',
            email: 'Please enter a valid email'
        }
    },
    price: {
        required: true,
        pattern: /^\d+$/,
        messages: {
            required: 'Price is required',
            pattern: 'Price must be a number'
        }
    }
});
```

## 🚀 Build & Deployment

### Development
- No build process required
- Direct file serving with any static server
- Hot reload with `browser-sync` for development

### Production
- Minify CSS and JavaScript files
- Optimize images
- Configure proper caching headers
- Enable gzip compression
- Set up HTTPS

### Hosting Options
- Static hosting: Netlify, Vercel, GitHub Pages
- Traditional hosting: Any web server with static file support
- CDN: CloudFlare, AWS CloudFront

---

This platform demonstrates that powerful, modern web applications can be built without complex frameworks, using fundamental web technologies in a structured, maintainable way. The vanilla approach ensures broad compatibility, easy debugging, and minimal dependencies while maintaining professional functionality and user experience.