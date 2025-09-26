/**
 * Theme Utility for Real Estate SaaS
 * Handles dark/light mode switching and theme persistence
 */

class Theme {
    static THEMES = {
        LIGHT: 'light',
        DARK: 'dark',
        SYSTEM: 'system'
    };

    static STORAGE_KEY = 'theme_preference';

    constructor() {
        this.currentTheme = null;
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Bind methods
        this.handleSystemThemeChange = this.handleSystemThemeChange.bind(this);
        
        // Initialize theme
        this.init();
    }

    /**
     * Initialize theme system
     */
    init() {
        // Listen for system theme changes
        this.mediaQuery.addEventListener('change', this.handleSystemThemeChange);
        
        // Load saved theme preference
        const savedTheme = Storage.getItem(Theme.STORAGE_KEY, Theme.THEMES.SYSTEM);
        this.setTheme(savedTheme);
        
        // Set up theme toggle button
        this.setupThemeToggle();
    }

    /**
     * Set theme
     * @param {string} theme - Theme to set (light, dark, system)
     */
    setTheme(theme) {
        if (!Object.values(Theme.THEMES).includes(theme)) {
            console.warn(`Invalid theme: ${theme}`);
            return;
        }

        this.currentTheme = theme;
        
        // Save preference
        Storage.setItem(Theme.STORAGE_KEY, theme);
        
        // Apply theme
        this.applyTheme();
        
        // Update UI
        this.updateThemeToggle();
        
        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: this.getEffectiveTheme() }
        }));
    }

    /**
     * Apply theme to document
     */
    applyTheme() {
        const effectiveTheme = this.getEffectiveTheme();
        const html = document.documentElement;
        
        // Remove existing theme classes
        html.classList.remove('light', 'dark');
        
        // Add current theme class
        html.classList.add(effectiveTheme);
        
        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(effectiveTheme);
    }

    /**
     * Get effective theme (resolves 'system' to actual theme)
     * @returns {string} Effective theme
     */
    getEffectiveTheme() {
        if (this.currentTheme === Theme.THEMES.SYSTEM) {
            return this.mediaQuery.matches ? Theme.THEMES.DARK : Theme.THEMES.LIGHT;
        }
        return this.currentTheme;
    }

    /**
     * Get current theme preference
     * @returns {string} Current theme preference
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Toggle between light and dark themes
     */
    toggle() {
        const currentEffective = this.getEffectiveTheme();
        const newTheme = currentEffective === Theme.THEMES.LIGHT 
            ? Theme.THEMES.DARK 
            : Theme.THEMES.LIGHT;
        
        this.setTheme(newTheme);
    }

    /**
     * Handle system theme changes
     */
    handleSystemThemeChange() {
        if (this.currentTheme === Theme.THEMES.SYSTEM) {
            this.applyTheme();
            
            // Dispatch theme change event
            window.dispatchEvent(new CustomEvent('themechange', {
                detail: { theme: this.getEffectiveTheme() }
            }));
        }
    }

    /**
     * Set up theme toggle button
     */
    setupThemeToggle() {
        const toggleButton = document.getElementById('theme-toggle');
        if (toggleButton) {
            toggleButton.addEventListener('click', () => this.toggle());
        }
    }

    /**
     * Update theme toggle button appearance
     */
    updateThemeToggle() {
        const toggleButton = document.getElementById('theme-toggle');
        if (!toggleButton) return;
        
        const icon = toggleButton.querySelector('i[data-lucide]');
        if (!icon) return;
        
        const effectiveTheme = this.getEffectiveTheme();
        const iconName = effectiveTheme === Theme.THEMES.DARK ? 'sun' : 'moon';
        
        // Update icon
        icon.setAttribute('data-lucide', iconName);
        
        // Update aria-label
        const label = effectiveTheme === Theme.THEMES.DARK 
            ? 'Switch to light theme' 
            : 'Switch to dark theme';
        toggleButton.setAttribute('aria-label', label);
        
        // Recreate icons to reflect changes
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    /**
     * Update meta theme-color for mobile browsers
     * @param {string} theme - Current theme
     */
    updateMetaThemeColor(theme) {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        // Use CSS custom property values
        const color = theme === Theme.THEMES.DARK 
            ? getComputedStyle(document.documentElement).getPropertyValue('--background').trim()
            : getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
            
        metaThemeColor.content = color;
    }

    /**
     * Get theme-aware color
     * @param {string} colorName - CSS custom property name (without --)
     * @returns {string} Color value
     */
    getThemeColor(colorName) {
        return getComputedStyle(document.documentElement)
            .getPropertyValue(`--${colorName}`)
            .trim();
    }

    /**
     * Check if current theme is dark
     * @returns {boolean} True if dark theme
     */
    isDark() {
        return this.getEffectiveTheme() === Theme.THEMES.DARK;
    }

    /**
     * Check if current theme is light
     * @returns {boolean} True if light theme
     */
    isLight() {
        return this.getEffectiveTheme() === Theme.THEMES.LIGHT;
    }

    /**
     * Get theme-specific icon name
     * @param {string} lightIcon - Icon for light theme
     * @param {string} darkIcon - Icon for dark theme
     * @returns {string} Appropriate icon name
     */
    getThemeIcon(lightIcon, darkIcon) {
        return this.isDark() ? darkIcon : lightIcon;
    }

    /**
     * Add theme change listener
     * @param {Function} callback - Callback function
     */
    onThemeChange(callback) {
        window.addEventListener('themechange', callback);
    }

    /**
     * Remove theme change listener
     * @param {Function} callback - Callback function
     */
    offThemeChange(callback) {
        window.removeEventListener('themechange', callback);
    }

    /**
     * Get all available themes
     * @returns {Array} Array of theme objects
     */
    getAvailableThemes() {
        return [
            {
                value: Theme.THEMES.LIGHT,
                label: 'Light',
                icon: 'sun'
            },
            {
                value: Theme.THEMES.DARK,
                label: 'Dark',
                icon: 'moon'
            },
            {
                value: Theme.THEMES.SYSTEM,
                label: 'System',
                icon: 'monitor'
            }
        ];
    }

    /**
     * Create theme selector component
     * @param {Element} container - Container element
     */
    createThemeSelector(container) {
        if (!container) return;
        
        const themes = this.getAvailableThemes();
        const currentTheme = this.getCurrentTheme();
        
        const selectorHTML = `
            <div class="theme-selector">
                <label class="form-label">Theme</label>
                <div class="theme-options">
                    ${themes.map(theme => `
                        <label class="theme-option">
                            <input 
                                type="radio" 
                                name="theme" 
                                value="${theme.value}"
                                ${currentTheme === theme.value ? 'checked' : ''}
                                class="theme-radio sr-only"
                            >
                            <div class="theme-option__content">
                                <i data-lucide="${theme.icon}" class="icon icon--sm"></i>
                                <span>${theme.label}</span>
                            </div>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
        
        container.innerHTML = selectorHTML;
        
        // Add event listeners
        const radios = container.querySelectorAll('input[name="theme"]');
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.setTheme(e.target.value);
                }
            });
        });
        
        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // Add styles
        this.addThemeSelectorStyles();
    }

    /**
     * Add CSS styles for theme selector
     */
    addThemeSelectorStyles() {
        const styleId = 'theme-selector-styles';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .theme-selector {
                margin-bottom: 1rem;
            }
            
            .theme-options {
                display: flex;
                gap: 0.5rem;
                margin-top: 0.5rem;
            }
            
            .theme-option {
                flex: 1;
                cursor: pointer;
            }
            
            .theme-option__content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                padding: 1rem 0.5rem;
                border: 1px solid var(--border);
                border-radius: var(--radius);
                background: var(--card);
                transition: all 0.2s ease;
                text-align: center;
            }
            
            .theme-option:hover .theme-option__content {
                border-color: var(--primary);
                background: var(--accent);
            }
            
            .theme-radio:checked + .theme-option__content {
                border-color: var(--primary);
                background: var(--primary);
                color: var(--primary-foreground);
            }
            
            .theme-option__content span {
                font-size: 0.875rem;
                font-weight: 500;
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * Destroy theme system (cleanup)
     */
    destroy() {
        this.mediaQuery.removeEventListener('change', this.handleSystemThemeChange);
    }
}

// Create and export theme instance
const theme = new Theme();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = theme;
}

// Make available globally
window.theme = theme;