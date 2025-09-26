/**
 * Storage Utility for Real Estate SaaS
 * Handles localStorage operations with JSON serialization and error handling
 */

class Storage {
    static PREFIX = 'real_estate_saas_';

    /**
     * Set item in localStorage
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     * @returns {boolean} True if successful
     */
    static setItem(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(this.PREFIX + key, serializedValue);
            return true;
        } catch (error) {
            console.error('Storage.setItem error:', error);
            return false;
        }
    }

    /**
     * Get item from localStorage
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if not found
     * @returns {*} Stored value or default
     */
    static getItem(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.PREFIX + key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Storage.getItem error:', error);
            return defaultValue;
        }
    }

    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} True if successful
     */
    static removeItem(key) {
        try {
            localStorage.removeItem(this.PREFIX + key);
            return true;
        } catch (error) {
            console.error('Storage.removeItem error:', error);
            return false;
        }
    }

    /**
     * Clear all app data from localStorage
     */
    static clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Storage.clear error:', error);
        }
    }

    /**
     * Check if key exists in localStorage
     * @param {string} key - Storage key
     * @returns {boolean} True if key exists
     */
    static hasItem(key) {
        return localStorage.getItem(this.PREFIX + key) !== null;
    }

    /**
     * Get all keys with app prefix
     * @returns {Array} Array of keys
     */
    static getAllKeys() {
        try {
            const keys = Object.keys(localStorage);
            return keys
                .filter(key => key.startsWith(this.PREFIX))
                .map(key => key.replace(this.PREFIX, ''));
        } catch (error) {
            console.error('Storage.getAllKeys error:', error);
            return [];
        }
    }

    /**
     * Get storage usage information
     * @returns {Object} Storage usage stats
     */
    static getStorageInfo() {
        try {
            let totalSize = 0;
            let appSize = 0;
            const keys = Object.keys(localStorage);
            
            keys.forEach(key => {
                const item = localStorage.getItem(key);
                const size = new Blob([item]).size;
                totalSize += size;
                
                if (key.startsWith(this.PREFIX)) {
                    appSize += size;
                }
            });

            return {
                totalSize: Helpers.formatFileSize(totalSize),
                appSize: Helpers.formatFileSize(appSize),
                totalKeys: keys.length,
                appKeys: keys.filter(key => key.startsWith(this.PREFIX)).length
            };
        } catch (error) {
            console.error('Storage.getStorageInfo error:', error);
            return {
                totalSize: '0 Bytes',
                appSize: '0 Bytes',
                totalKeys: 0,
                appKeys: 0
            };
        }
    }

    // Specific storage methods for common app data

    /**
     * Store user preferences
     * @param {Object} preferences - User preferences object
     */
    static setUserPreferences(preferences) {
        return this.setItem('user_preferences', preferences);
    }

    /**
     * Get user preferences
     * @returns {Object} User preferences
     */
    static getUserPreferences() {
        return this.getItem('user_preferences', {
            theme: 'light',
            language: 'en',
            notifications: true,
            autoSave: true,
            gridView: true
        });
    }

    /**
     * Store current user session
     * @param {Object} session - Session data
     */
    static setSession(session) {
        return this.setItem('session', {
            ...session,
            timestamp: Date.now()
        });
    }

    /**
     * Get current session
     * @returns {Object|null} Session data or null
     */
    static getSession() {
        const session = this.getItem('session');
        if (!session) return null;

        // Check if session is expired (24 hours)
        const isExpired = Date.now() - session.timestamp > 24 * 60 * 60 * 1000;
        if (isExpired) {
            this.removeItem('session');
            return null;
        }

        return session;
    }

    /**
     * Clear user session
     */
    static clearSession() {
        return this.removeItem('session');
    }

    /**
     * Store search filters
     * @param {string} pageType - Type of page (properties, clients, etc.)
     * @param {Object} filters - Filter object
     */
    static setFilters(pageType, filters) {
        return this.setItem(`filters_${pageType}`, filters);
    }

    /**
     * Get search filters
     * @param {string} pageType - Type of page
     * @returns {Object} Filter object
     */
    static getFilters(pageType) {
        return this.getItem(`filters_${pageType}`, {});
    }

    /**
     * Store form draft
     * @param {string} formId - Form identifier
     * @param {Object} data - Form data
     */
    static setFormDraft(formId, data) {
        return this.setItem(`draft_${formId}`, {
            data: data,
            timestamp: Date.now()
        });
    }

    /**
     * Get form draft
     * @param {string} formId - Form identifier
     * @returns {Object|null} Form data or null
     */
    static getFormDraft(formId) {
        const draft = this.getItem(`draft_${formId}`);
        if (!draft) return null;

        // Check if draft is too old (7 days)
        const isOld = Date.now() - draft.timestamp > 7 * 24 * 60 * 60 * 1000;
        if (isOld) {
            this.removeItem(`draft_${formId}`);
            return null;
        }

        return draft.data;
    }

    /**
     * Clear form draft
     * @param {string} formId - Form identifier
     */
    static clearFormDraft(formId) {
        return this.removeItem(`draft_${formId}`);
    }

    /**
     * Store recent searches
     * @param {string} query - Search query
     * @param {string} type - Search type (properties, clients, etc.)
     */
    static addRecentSearch(query, type = 'general') {
        if (!query || !query.trim()) return;

        const key = `recent_searches_${type}`;
        const searches = this.getItem(key, []);
        
        // Remove if already exists
        const filtered = searches.filter(item => item.query !== query);
        
        // Add to beginning
        filtered.unshift({
            query: query.trim(),
            timestamp: Date.now()
        });

        // Keep only last 10 searches
        const limited = filtered.slice(0, 10);
        
        return this.setItem(key, limited);
    }

    /**
     * Get recent searches
     * @param {string} type - Search type
     * @returns {Array} Array of recent searches
     */
    static getRecentSearches(type = 'general') {
        const searches = this.getItem(`recent_searches_${type}`, []);
        
        // Filter out old searches (30 days)
        const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
        return searches.filter(item => item.timestamp > cutoff);
    }

    /**
     * Clear recent searches
     * @param {string} type - Search type
     */
    static clearRecentSearches(type = 'general') {
        return this.removeItem(`recent_searches_${type}`);
    }

    /**
     * Store favorite items
     * @param {string} type - Type of item (properties, clients, etc.)
     * @param {string} id - Item ID
     * @param {Object} data - Item data
     */
    static addFavorite(type, id, data) {
        const key = `favorites_${type}`;
        const favorites = this.getItem(key, {});
        
        favorites[id] = {
            ...data,
            timestamp: Date.now()
        };
        
        return this.setItem(key, favorites);
    }

    /**
     * Remove favorite item
     * @param {string} type - Type of item
     * @param {string} id - Item ID
     */
    static removeFavorite(type, id) {
        const key = `favorites_${type}`;
        const favorites = this.getItem(key, {});
        
        delete favorites[id];
        
        return this.setItem(key, favorites);
    }

    /**
     * Get favorite items
     * @param {string} type - Type of item
     * @returns {Object} Favorites object
     */
    static getFavorites(type) {
        return this.getItem(`favorites_${type}`, {});
    }

    /**
     * Check if item is favorite
     * @param {string} type - Type of item
     * @param {string} id - Item ID
     * @returns {boolean} True if favorite
     */
    static isFavorite(type, id) {
        const favorites = this.getFavorites(type);
        return favorites.hasOwnProperty(id);
    }

    /**
     * Store view state (grid/list view, sort order, etc.)
     * @param {string} page - Page identifier
     * @param {Object} state - View state
     */
    static setViewState(page, state) {
        return this.setItem(`view_state_${page}`, state);
    }

    /**
     * Get view state
     * @param {string} page - Page identifier
     * @returns {Object} View state
     */
    static getViewState(page) {
        return this.getItem(`view_state_${page}`, {
            view: 'grid',
            sortBy: 'updated',
            sortOrder: 'desc',
            pageSize: 20
        });
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}

// Make available globally
window.Storage = Storage;