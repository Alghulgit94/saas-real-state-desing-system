/**
 * Main Application Controller for Real Estate SaaS
 * Initializes the application, sets up global event handlers, and manages app state
 */

class App {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
        this.globalEventHandlers = new Map();
        
        // Initialize app when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        try {
            console.log('🚀 Initializing Real Estate SaaS Application...');
            
            // Check authentication
            await this.checkAuthentication();
            
            // Initialize core systems
            this.initializeErrorHandling();
            this.initializeNetworkMonitoring();
            this.initializeKeyboardShortcuts();
            this.initializePerformanceMonitoring();
            
            // Set up global event listeners
            this.setupGlobalEventListeners();
            
            // Initialize icons
            this.initializeIcons();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('✅ Application initialized successfully');
            
            // Dispatch app ready event
            window.dispatchEvent(new CustomEvent('app:ready', {
                detail: { timestamp: Date.now() }
            }));
            
        } catch (error) {
            console.error('❌ Failed to initialize application:', error);
            this.handleInitializationError(error);
        }
    }

    async checkAuthentication() {
        try {
            const session = Storage.getSession();
            
            if (!session || !session.token) {
                console.log('No valid session found');
                return;
            }
            
            // Validate session with server
            try {
                const user = await API.get('/auth/me');
                this.currentUser = user;
                
                console.log('User authenticated:', user.name);
                
                // Update UI with user info
                if (window.sidebarController) {
                    window.sidebarController.updateUserInfo(user);
                }
                
            } catch (error) {
                console.warn('Session validation failed:', error);
                Storage.clearSession();
            }
            
        } catch (error) {
            console.error('Authentication check failed:', error);
        }
    }

    initializeErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.handleGlobalError(event.error, 'javascript');
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleGlobalError(event.reason, 'promise');
        });

        // API error handler
        window.addEventListener('api:error', (event) => {
            this.handleAPIError(event.detail);
        });
    }

    initializeNetworkMonitoring() {
        // Monitor online/offline status
        window.addEventListener('online', () => {
            console.log('🌐 Connection restored');
            Toast.success('Connection restored');
            this.handleConnectionRestore();
        });

        window.addEventListener('offline', () => {
            console.log('🔌 Connection lost');
            Toast.warning('Connection lost. Some features may not work.', {
                duration: 0,
                closable: true
            });
        });

        // Monitor slow network
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            const handleConnectionChange = () => {
                if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
                    console.log('🐌 Slow connection detected');
                    Toast.info('Slow connection detected. Please be patient.', {
                        duration: 5000
                    });
                }
            };
            
            connection.addEventListener('change', handleConnectionChange);
        }
    }

    initializeKeyboardShortcuts() {
        const shortcuts = new Map([
            ['ctrl+k,cmd+k', () => this.focusGlobalSearch()],
            ['ctrl+/,cmd+/', () => this.showShortcutsHelp()],
            ['ctrl+shift+n,cmd+shift+n', () => this.quickAddProperty()],
            ['esc', () => this.handleEscapeKey()],
            ['ctrl+r,cmd+r', (e) => this.handleRefresh(e)]
        ]);

        document.addEventListener('keydown', (e) => {
            const key = this.getShortcutKey(e);
            
            for (const [shortcut, handler] of shortcuts) {
                if (shortcut.split(',').includes(key)) {
                    // Don't prevent default for regular refresh
                    if (key !== 'ctrl+r' && key !== 'cmd+r') {
                        e.preventDefault();
                    }
                    handler(e);
                    break;
                }
            }
        });
    }

    getShortcutKey(e) {
        const parts = [];
        
        if (e.ctrlKey) parts.push('ctrl');
        if (e.metaKey) parts.push('cmd');
        if (e.shiftKey) parts.push('shift');
        if (e.altKey) parts.push('alt');
        
        parts.push(e.key.toLowerCase());
        
        return parts.join('+');
    }

    initializePerformanceMonitoring() {
        // Monitor page load performance
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                console.log(`📊 Page load time: ${loadTime}ms`);
                
                // Log slow page loads
                if (loadTime > 3000) {
                    console.warn('⚠️ Slow page load detected');
                }
                
                // Store performance data
                Storage.setItem('last_performance', {
                    loadTime,
                    timestamp: Date.now()
                });
            }, 0);
        });

        // Monitor memory usage (if available)
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const used = memory.usedJSHeapSize / 1048576; // Convert to MB
                
                // Warn if memory usage is high
                if (used > 100) {
                    console.warn(`⚠️ High memory usage: ${used.toFixed(2)}MB`);
                }
            }, 60000); // Check every minute
        }
    }

    setupGlobalEventListeners() {
        // Theme change handler
        theme.onThemeChange((event) => {
            console.log('🎨 Theme changed to:', event.detail.theme);
            this.handleThemeChange(event.detail.theme);
        });

        // Router events
        window.addEventListener('beforeunload', () => {
            this.handleBeforeUnload();
        });

        // Visibility change (tab focus/blur)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handleTabBlur();
            } else {
                this.handleTabFocus();
            }
        });

        // Custom app events
        window.addEventListener('app:notification', (event) => {
            this.handleAppNotification(event.detail);
        });

        window.addEventListener('app:user-action', (event) => {
            this.trackUserAction(event.detail);
        });
    }

    initializeIcons() {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
            console.log('🎨 Icons initialized');
        } else {
            console.warn('⚠️ Lucide icons not available');
        }
    }

    // Event Handlers
    handleGlobalError(error, type) {
        const errorInfo = {
            message: error.message || 'Unknown error',
            stack: error.stack || '',
            type: type,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Log to console
        console.error('Global error captured:', errorInfo);

        // Store error for debugging
        const errors = Storage.getItem('app_errors', []);
        errors.push(errorInfo);
        
        // Keep only last 10 errors
        if (errors.length > 10) {
            errors.splice(0, errors.length - 10);
        }
        
        Storage.setItem('app_errors', errors);

        // Show user-friendly error message
        if (type === 'javascript' && !error.message.includes('Script error')) {
            Toast.error('Something went wrong. Please try refreshing the page.');
        }
    }

    handleAPIError(errorDetail) {
        const { error, status, endpoint } = errorDetail;
        
        console.error(`API Error [${status}]:`, error, 'Endpoint:', endpoint);
        
        // Handle specific error types
        switch (status) {
            case 401:
                this.handleUnauthorized();
                break;
            case 403:
                Toast.error('You don\'t have permission to perform this action.');
                break;
            case 404:
                Toast.error('The requested resource was not found.');
                break;
            case 429:
                Toast.warning('Too many requests. Please slow down.');
                break;
            case 500:
                Toast.error('Server error. Please try again later.');
                break;
            default:
                if (status >= 400) {
                    Toast.error(error || 'An error occurred. Please try again.');
                }
        }
    }

    handleUnauthorized() {
        console.log('🔐 User unauthorized - clearing session');
        Storage.clearSession();
        this.currentUser = null;
        
        Toast.error('Your session has expired. Please log in again.');
        
        // Redirect to login after a short delay
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 2000);
    }

    handleConnectionRestore() {
        // Refresh current page data
        if (router.getCurrentRoute()) {
            router.refresh();
        }
    }

    handleThemeChange(newTheme) {
        // Update any theme-dependent components
        document.body.setAttribute('data-theme', newTheme);
        
        // Trigger custom event for components that need to respond
        window.dispatchEvent(new CustomEvent('app:theme-changed', {
            detail: { theme: newTheme }
        }));
    }

    handleBeforeUnload() {
        // Save any pending data
        this.savePendingData();
        
        // Stop any running intervals
        if (window.dashboardController) {
            window.dashboardController.stopAutoRefresh();
        }
    }

    handleTabBlur() {
        console.log('👁️ Tab hidden');
        // Pause any animations or expensive operations
    }

    handleTabFocus() {
        console.log('👁️ Tab visible');
        // Resume operations and check for updates
        this.checkForUpdates();
    }

    handleAppNotification(notification) {
        Toast.show(notification.message, notification.type || 'info', notification.options || {});
    }

    trackUserAction(action) {
        console.log('📊 User action:', action);
        
        // Store user actions for analytics
        const actions = Storage.getItem('user_actions', []);
        actions.push({
            ...action,
            timestamp: Date.now()
        });
        
        // Keep only last 100 actions
        if (actions.length > 100) {
            actions.splice(0, actions.length - 100);
        }
        
        Storage.setItem('user_actions', actions);
    }

    // Keyboard Shortcut Handlers
    focusGlobalSearch() {
        const searchInput = document.getElementById('global-search');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    showShortcutsHelp() {
        const modal = new Modal({
            title: 'Keyboard Shortcuts',
            content: `
                <div class="shortcuts-help">
                    <div class="shortcut-group">
                        <h4>Navigation</h4>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>K</kbd> <span>Focus search</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Esc</kbd> <span>Close modals/dropdowns</span>
                        </div>
                    </div>
                    <div class="shortcut-group">
                        <h4>Actions</h4>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>N</kbd> <span>Add property</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>R</kbd> <span>Refresh page</span>
                        </div>
                    </div>
                    <div class="shortcut-group">
                        <h4>Help</h4>
                        <div class="shortcut-item">
                            <kbd>Ctrl</kbd> + <kbd>/</kbd> <span>Show this help</span>
                        </div>
                    </div>
                </div>
            `,
            size: 'medium'
        });

        modal.open();
        this.addShortcutsStyles();
    }

    addShortcutsStyles() {
        if (document.getElementById('shortcuts-help-styles')) return;

        const style = document.createElement('style');
        style.id = 'shortcuts-help-styles';
        style.textContent = `
            .shortcuts-help {
                padding: 1rem 0;
            }
            
            .shortcut-group {
                margin-bottom: 1.5rem;
            }
            
            .shortcut-group:last-child {
                margin-bottom: 0;
            }
            
            .shortcut-group h4 {
                margin: 0 0 0.75rem 0;
                color: var(--foreground);
                font-size: 1rem;
                font-weight: 600;
            }
            
            .shortcut-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.5rem 0;
                border-bottom: 1px solid var(--border);
            }
            
            .shortcut-item:last-child {
                border-bottom: none;
            }
            
            .shortcut-item kbd {
                background: var(--muted);
                color: var(--muted-foreground);
                padding: 0.25rem 0.5rem;
                border-radius: var(--radius-sm);
                font-size: 0.75rem;
                border: 1px solid var(--border);
                margin: 0 0.125rem;
            }
            
            .shortcut-item span {
                color: var(--muted-foreground);
                font-size: 0.875rem;
            }
        `;
        document.head.appendChild(style);
    }

    quickAddProperty() {
        if (window.headerController) {
            window.headerController.openAddPropertyModal();
        }
    }

    handleEscapeKey() {
        // Close any open modals
        const modal = document.querySelector('.modal-container:not(.hidden)');
        if (modal) {
            const closeBtn = modal.querySelector('.modal-close');
            if (closeBtn) {
                closeBtn.click();
                return;
            }
        }

        // Close any open dropdowns
        const openDropdown = document.querySelector('.dropdown__menu--open');
        if (openDropdown) {
            openDropdown.classList.remove('dropdown__menu--open');
            return;
        }

        // Blur focused input
        if (document.activeElement && document.activeElement.tagName === 'INPUT') {
            document.activeElement.blur();
        }
    }

    handleRefresh(e) {
        // Custom refresh logic if needed
        console.log('🔄 Page refresh requested');
    }

    // Utility Methods
    async checkForUpdates() {
        // Check if there are any app updates or notifications
        try {
            // This would typically check with your server for updates
            console.log('🔄 Checking for updates...');
        } catch (error) {
            console.error('Update check failed:', error);
        }
    }

    savePendingData() {
        // Save any forms or data that might be lost on page refresh
        const forms = document.querySelectorAll('form[data-autosave]');
        forms.forEach(form => {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            Storage.setFormDraft(form.id || 'default', data);
        });
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isUserAuthenticated() {
        return this.currentUser !== null;
    }

    getAppInfo() {
        return {
            version: '1.0.0',
            initialized: this.isInitialized,
            user: this.currentUser,
            theme: theme.getCurrentTheme(),
            route: router.getCurrentRoute()
        };
    }

    handleInitializationError(error) {
        document.body.innerHTML = `
            <div style="
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                padding: 2rem;
                background: var(--background, #f8fafc);
                font-family: system-ui, sans-serif;
            ">
                <div style="
                    text-align: center;
                    max-width: 500px;
                ">
                    <h1 style="color: #dc2626; margin-bottom: 1rem;">
                        Application Failed to Load
                    </h1>
                    <p style="color: #6b7280; margin-bottom: 2rem;">
                        There was an error initializing the application. Please try refreshing the page.
                    </p>
                    <button 
                        onclick="window.location.reload()" 
                        style="
                            background: #3b82f6;
                            color: white;
                            border: none;
                            padding: 0.75rem 1.5rem;
                            border-radius: 0.5rem;
                            cursor: pointer;
                            font-size: 1rem;
                        "
                    >
                        Refresh Page
                    </button>
                    <details style="margin-top: 2rem; text-align: left;">
                        <summary style="cursor: pointer; color: #6b7280;">Technical Details</summary>
                        <pre style="
                            background: #f3f4f6;
                            padding: 1rem;
                            border-radius: 0.5rem;
                            margin-top: 1rem;
                            overflow: auto;
                            font-size: 0.875rem;
                        ">${error.stack || error.message}</pre>
                    </details>
                </div>
            </div>
        `;
    }
}

// Initialize the application
const app = new App();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = app;
}

// Make available globally
window.app = app;