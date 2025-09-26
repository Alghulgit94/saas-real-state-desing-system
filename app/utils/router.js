/**
 * Router Utility for Real Estate SaaS
 * Handles client-side routing for SPA navigation
 */

class Router {
    constructor() {
        this.routes = new Map();
        this.middlewares = [];
        this.currentRoute = null;
        this.basePath = '';
        
        // Bind methods
        this.handleRouteChange = this.handleRouteChange.bind(this);
        this.handleLinkClick = this.handleLinkClick.bind(this);
        
        // Initialize router
        this.init();
    }

    /**
     * Initialize router
     */
    init() {
        // Listen for browser navigation
        window.addEventListener('popstate', this.handleRouteChange);
        
        // Listen for link clicks
        document.addEventListener('click', this.handleLinkClick);
        
        // Handle initial route
        this.handleRouteChange();
    }

    /**
     * Register a route
     * @param {string} path - Route path (supports parameters like /user/:id)
     * @param {Function} handler - Route handler function
     * @param {Object} options - Route options
     */
    addRoute(path, handler, options = {}) {
        const route = {
            path,
            handler,
            options,
            regex: this.pathToRegex(path),
            params: this.extractParamNames(path)
        };
        
        this.routes.set(path, route);
        return this;
    }

    /**
     * Add middleware function
     * @param {Function} middleware - Middleware function
     */
    use(middleware) {
        this.middlewares.push(middleware);
        return this;
    }

    /**
     * Navigate to a route
     * @param {string} path - Path to navigate to
     * @param {Object} state - State object to pass
     * @param {boolean} replace - Whether to replace current history entry
     */
    navigate(path, state = {}, replace = false) {
        const fullPath = this.basePath + path;
        
        if (replace) {
            window.history.replaceState(state, '', fullPath);
        } else {
            window.history.pushState(state, '', fullPath);
        }
        
        this.handleRouteChange();
    }

    /**
     * Replace current route
     * @param {string} path - Path to navigate to
     * @param {Object} state - State object to pass
     */
    replace(path, state = {}) {
        this.navigate(path, state, true);
    }

    /**
     * Go back in history
     */
    back() {
        window.history.back();
    }

    /**
     * Go forward in history
     */
    forward() {
        window.history.forward();
    }

    /**
     * Refresh current route
     */
    refresh() {
        this.handleRouteChange();
    }

    /**
     * Handle route changes
     */
    async handleRouteChange() {
        const path = window.location.pathname.replace(this.basePath, '') || '/';
        const search = window.location.search;
        const hash = window.location.hash;
        const state = window.history.state || {};

        const context = {
            path,
            search,
            hash,
            state,
            params: {},
            query: this.parseQuery(search),
            router: this
        };

        try {
            // Run middlewares
            for (const middleware of this.middlewares) {
                const result = await middleware(context);
                if (result === false) {
                    return; // Middleware blocked navigation
                }
            }

            // Find matching route
            const route = this.findRoute(path);
            if (route) {
                // Extract parameters
                context.params = this.extractParams(route, path);
                this.currentRoute = { ...context, route };
                
                // Call route handler
                await route.handler(context);
            } else {
                // No route found, handle 404
                await this.handle404(context);
            }
        } catch (error) {
            console.error('Route handler error:', error);
            await this.handleError(error, context);
        }
    }

    /**
     * Handle link clicks for SPA navigation
     * @param {Event} event - Click event
     */
    handleLinkClick(event) {
        // Check if it's a left click on a link
        if (event.button !== 0) return;
        
        const link = event.target.closest('a[href]');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Ignore external links, special protocols, and links with target
        if (
            !href ||
            href.startsWith('http') ||
            href.startsWith('mailto:') ||
            href.startsWith('tel:') ||
            href.startsWith('#') ||
            link.hasAttribute('target') ||
            link.hasAttribute('download') ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey
        ) {
            return;
        }
        
        // Check if link has data-route attribute for SPA navigation
        if (link.hasAttribute('data-route') || href.startsWith('/')) {
            event.preventDefault();
            this.navigate(href);
        }
    }

    /**
     * Convert path pattern to regex
     * @param {string} path - Path pattern
     * @returns {RegExp} Regular expression
     */
    pathToRegex(path) {
        // Escape special regex characters except :
        const escaped = path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Replace :param with regex group
        const pattern = escaped.replace(/\\:([^/]+)/g, '([^/]+)');
        
        return new RegExp(`^${pattern}$`);
    }

    /**
     * Extract parameter names from path
     * @param {string} path - Path pattern
     * @returns {Array} Parameter names
     */
    extractParamNames(path) {
        const matches = path.match(/:([^/]+)/g);
        return matches ? matches.map(match => match.substr(1)) : [];
    }

    /**
     * Extract parameter values from path
     * @param {Object} route - Route object
     * @param {string} path - Current path
     * @returns {Object} Parameters object
     */
    extractParams(route, path) {
        const matches = path.match(route.regex);
        const params = {};
        
        if (matches && route.params) {
            route.params.forEach((paramName, index) => {
                params[paramName] = matches[index + 1];
            });
        }
        
        return params;
    }

    /**
     * Find matching route
     * @param {string} path - Path to match
     * @returns {Object|null} Matching route
     */
    findRoute(path) {
        for (const route of this.routes.values()) {
            if (route.regex.test(path)) {
                return route;
            }
        }
        return null;
    }

    /**
     * Parse query string
     * @param {string} search - Query string
     * @returns {Object} Query parameters
     */
    parseQuery(search) {
        const query = {};
        if (search.startsWith('?')) {
            const params = new URLSearchParams(search);
            for (const [key, value] of params) {
                query[key] = value;
            }
        }
        return query;
    }

    /**
     * Handle 404 errors
     * @param {Object} context - Route context
     */
    async handle404(context) {
        console.warn(`Route not found: ${context.path}`);
        
        // Try to redirect to dashboard or show 404 page
        if (context.path !== '/' && context.path !== '/dashboard') {
            this.replace('/dashboard');
        } else {
            // Show 404 content
            const content = document.getElementById('page-content');
            if (content) {
                content.innerHTML = `
                    <div class="flex flex--center flex--column" style="min-height: 400px; gap: 1rem;">
                        <i data-lucide="file-x" class="icon" style="width: 4rem; height: 4rem; color: var(--muted-foreground);"></i>
                        <h2 style="margin: 0; color: var(--foreground);">Page Not Found</h2>
                        <p style="color: var(--muted-foreground); margin: 0;">The page you're looking for doesn't exist.</p>
                        <button class="btn btn--primary" onclick="router.navigate('/dashboard')">
                            Go to Dashboard
                        </button>
                    </div>
                `;
                lucide.createIcons();
            }
        }
    }

    /**
     * Handle route errors
     * @param {Error} error - Error object
     * @param {Object} context - Route context
     */
    async handleError(error, context) {
        console.error('Router error:', error);
        
        const content = document.getElementById('page-content');
        if (content) {
            content.innerHTML = `
                <div class="flex flex--center flex--column" style="min-height: 400px; gap: 1rem;">
                    <i data-lucide="alert-triangle" class="icon" style="width: 4rem; height: 4rem; color: var(--destructive);"></i>
                    <h2 style="margin: 0; color: var(--foreground);">Something went wrong</h2>
                    <p style="color: var(--muted-foreground); margin: 0;">An error occurred while loading this page.</p>
                    <button class="btn btn--outline" onclick="router.refresh()">
                        Try Again
                    </button>
                </div>
            `;
            lucide.createIcons();
        }
    }

    /**
     * Get current route information
     * @returns {Object|null} Current route context
     */
    getCurrentRoute() {
        return this.currentRoute;
    }

    /**
     * Check if path matches current route
     * @param {string} path - Path to check
     * @returns {boolean} True if matches
     */
    isCurrentRoute(path) {
        return this.currentRoute && this.currentRoute.path === path;
    }

    /**
     * Set base path for the application
     * @param {string} basePath - Base path
     */
    setBasePath(basePath) {
        this.basePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath;
    }

    /**
     * Destroy router (cleanup)
     */
    destroy() {
        window.removeEventListener('popstate', this.handleRouteChange);
        document.removeEventListener('click', this.handleLinkClick);
    }
}

// Create and export router instance
const router = new Router();

// Set up default routes
router
    .addRoute('/', async (context) => {
        router.replace('/dashboard');
    })
    .addRoute('/dashboard', async (context) => {
        await loadPage('dashboard');
        updateNavigation('dashboard');
    })
    .addRoute('/properties', async (context) => {
        await loadPage('properties');
        updateNavigation('properties');
    })
    .addRoute('/properties/:id', async (context) => {
        await loadPage('property-detail', { id: context.params.id });
        updateNavigation('properties');
    })
    .addRoute('/clients', async (context) => {
        await loadPage('clients');
        updateNavigation('clients');
    })
    .addRoute('/clients/:id', async (context) => {
        await loadPage('client-detail', { id: context.params.id });
        updateNavigation('clients');
    })
    .addRoute('/agents', async (context) => {
        await loadPage('agents');
        updateNavigation('agents');
    })
    .addRoute('/agents/:id', async (context) => {
        await loadPage('agent-detail', { id: context.params.id });
        updateNavigation('agents');
    })
    .addRoute('/analytics', async (context) => {
        await loadPage('analytics');
        updateNavigation('analytics');
    })
    .addRoute('/reports', async (context) => {
        await loadPage('reports');
        updateNavigation('reports');
    })
    .addRoute('/settings', async (context) => {
        await loadPage('settings');
        updateNavigation('settings');
    });

/**
 * Load page content
 * @param {string} pageName - Name of the page to load
 * @param {Object} data - Additional data to pass to page
 */
async function loadPage(pageName, data = {}) {
    const content = document.getElementById('page-content');
    const breadcrumb = document.getElementById('current-page');
    
    if (!content) return;
    
    try {
        Helpers.toggleLoading(true);
        
        // Update page title and breadcrumb
        const pageTitle = Helpers.capitalize(pageName.replace('-', ' '));
        document.title = `${pageTitle} - Real Estate SaaS`;
        
        if (breadcrumb) {
            breadcrumb.textContent = pageTitle;
        }
        
        // Load page-specific controller if available
        if (window[pageName + 'Controller']) {
            await window[pageName + 'Controller'].load(content, data);
        } else {
            // Fallback to generic page loader
            content.innerHTML = `
                <div class="page-header">
                    <div>
                        <h1 class="page-title">${pageTitle}</h1>
                        <p class="page-description">Manage your ${pageName.toLowerCase()} efficiently</p>
                    </div>
                    <div class="page-actions">
                        <button class="btn btn--primary">
                            <i data-lucide="plus" class="icon icon--sm"></i>
                            Add New
                        </button>
                    </div>
                </div>
                <div class="card">
                    <div class="card__content">
                        <p>Page content for ${pageTitle} will be loaded here.</p>
                    </div>
                </div>
            `;
        }
        
        // Initialize icons for the new content
        lucide.createIcons();
        
    } catch (error) {
        console.error('Error loading page:', error);
        content.innerHTML = `
            <div class="alert alert--error">
                <div class="alert__content">
                    <div class="alert__title">Error Loading Page</div>
                    <div class="alert__description">Failed to load ${pageName}. Please try again.</div>
                </div>
            </div>
        `;
    } finally {
        Helpers.toggleLoading(false);
    }
}

/**
 * Update navigation active state
 * @param {string} activeRoute - Currently active route
 */
function updateNavigation(activeRoute) {
    const navLinks = document.querySelectorAll('[data-route]');
    navLinks.forEach(link => {
        const route = link.getAttribute('data-route');
        if (route === activeRoute) {
            link.classList.add('nav-link--active');
        } else {
            link.classList.remove('nav-link--active');
        }
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = router;
}

// Make available globally
window.router = router;