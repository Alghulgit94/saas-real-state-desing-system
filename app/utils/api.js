/**
 * API Utility for Real Estate SaaS
 * Handles HTTP requests, authentication, and API interactions
 */

class API {
    static BASE_URL = 'https://api.realestate-saas.com/v1';
    static TIMEOUT = 30000; // 30 seconds

    /**
     * Make HTTP request
     * @param {string} url - API endpoint
     * @param {Object} options - Request options
     * @returns {Promise} Response promise
     */
    static async request(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

        try {
            const config = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...this.getAuthHeaders(),
                    ...options.headers
                },
                signal: controller.signal,
                ...options
            };

            const fullUrl = url.startsWith('http') ? url : `${this.BASE_URL}${url}`;
            const response = await fetch(fullUrl, config);

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.text();
                let errorMessage;
                
                try {
                    const parsed = JSON.parse(errorData);
                    errorMessage = parsed.message || parsed.error || 'Request failed';
                } catch {
                    errorMessage = errorData || `HTTP ${response.status}`;
                }

                throw new APIError(errorMessage, response.status, errorData);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }

            return await response.text();
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new APIError('Request timeout', 408);
            }
            
            if (error instanceof APIError) {
                throw error;
            }
            
            throw new APIError(error.message || 'Network error', 0);
        }
    }

    /**
     * GET request
     * @param {string} url - API endpoint
     * @param {Object} params - Query parameters
     * @returns {Promise} Response promise
     */
    static async get(url, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = queryString ? `${url}?${queryString}` : url;
        
        return this.request(fullUrl, { method: 'GET' });
    }

    /**
     * POST request
     * @param {string} url - API endpoint
     * @param {Object} data - Request body
     * @returns {Promise} Response promise
     */
    static async post(url, data = {}) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * PUT request
     * @param {string} url - API endpoint
     * @param {Object} data - Request body
     * @returns {Promise} Response promise
     */
    static async put(url, data = {}) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * PATCH request
     * @param {string} url - API endpoint
     * @param {Object} data - Request body
     * @returns {Promise} Response promise
     */
    static async patch(url, data = {}) {
        return this.request(url, {
            method: 'PATCH',
            body: JSON.stringify(data)
        });
    }

    /**
     * DELETE request
     * @param {string} url - API endpoint
     * @returns {Promise} Response promise
     */
    static async delete(url) {
        return this.request(url, { method: 'DELETE' });
    }

    /**
     * Upload file
     * @param {string} url - Upload endpoint
     * @param {File} file - File to upload
     * @param {Function} onProgress - Progress callback
     * @returns {Promise} Upload promise
     */
    static async uploadFile(url, file, onProgress = null) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('file', file);

            if (onProgress) {
                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const progress = (event.loaded / event.total) * 100;
                        onProgress(progress);
                    }
                });
            }

            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        resolve(response);
                    } catch {
                        resolve(xhr.responseText);
                    }
                } else {
                    reject(new APIError(`Upload failed: ${xhr.statusText}`, xhr.status));
                }
            });

            xhr.addEventListener('error', () => {
                reject(new APIError('Upload failed', 0));
            });

            xhr.addEventListener('timeout', () => {
                reject(new APIError('Upload timeout', 408));
            });

            xhr.open('POST', url.startsWith('http') ? url : `${this.BASE_URL}${url}`);
            
            // Add auth headers
            const authHeaders = this.getAuthHeaders();
            Object.keys(authHeaders).forEach(key => {
                xhr.setRequestHeader(key, authHeaders[key]);
            });

            xhr.timeout = this.TIMEOUT;
            xhr.send(formData);
        });
    }

    /**
     * Get authentication headers
     * @returns {Object} Auth headers
     */
    static getAuthHeaders() {
        const session = Storage.getSession();
        if (session && session.token) {
            return {
                'Authorization': `Bearer ${session.token}`
            };
        }
        return {};
    }

    /**
     * Set authentication token
     * @param {string} token - JWT token
     */
    static setAuthToken(token) {
        const session = Storage.getSession() || {};
        session.token = token;
        Storage.setSession(session);
    }

    /**
     * Clear authentication
     */
    static clearAuth() {
        Storage.clearSession();
    }

    // Properties API methods
    static async getProperties(filters = {}) {
        return this.get('/properties', filters);
    }

    static async getProperty(id) {
        return this.get(`/properties/${id}`);
    }

    static async createProperty(data) {
        return this.post('/properties', data);
    }

    static async updateProperty(id, data) {
        return this.put(`/properties/${id}`, data);
    }

    static async deleteProperty(id) {
        return this.delete(`/properties/${id}`);
    }

    static async uploadPropertyImages(propertyId, files, onProgress = null) {
        const results = [];
        for (const file of files) {
            const result = await this.uploadFile(
                `/properties/${propertyId}/images`,
                file,
                onProgress
            );
            results.push(result);
        }
        return results;
    }

    // Clients API methods
    static async getClients(filters = {}) {
        return this.get('/clients', filters);
    }

    static async getClient(id) {
        return this.get(`/clients/${id}`);
    }

    static async createClient(data) {
        return this.post('/clients', data);
    }

    static async updateClient(id, data) {
        return this.put(`/clients/${id}`, data);
    }

    static async deleteClient(id) {
        return this.delete(`/clients/${id}`);
    }

    // Agents API methods
    static async getAgents(filters = {}) {
        return this.get('/agents', filters);
    }

    static async getAgent(id) {
        return this.get(`/agents/${id}`);
    }

    static async createAgent(data) {
        return this.post('/agents', data);
    }

    static async updateAgent(id, data) {
        return this.put(`/agents/${id}`, data);
    }

    static async deleteAgent(id) {
        return this.delete(`/agents/${id}`);
    }

    // Authentication API methods
    static async login(email, password) {
        const response = await this.post('/auth/login', { email, password });
        if (response.token) {
            this.setAuthToken(response.token);
            Storage.setSession({
                user: response.user,
                token: response.token,
                expiresAt: response.expiresAt
            });
        }
        return response;
    }

    static async logout() {
        try {
            await this.post('/auth/logout');
        } catch (error) {
            console.warn('Logout API call failed:', error);
        } finally {
            this.clearAuth();
        }
    }

    static async register(userData) {
        return this.post('/auth/register', userData);
    }

    static async forgotPassword(email) {
        return this.post('/auth/forgot-password', { email });
    }

    static async resetPassword(token, password) {
        return this.post('/auth/reset-password', { token, password });
    }

    static async refreshToken() {
        const session = Storage.getSession();
        if (!session || !session.token) {
            throw new APIError('No session found', 401);
        }

        const response = await this.post('/auth/refresh', { 
            token: session.token 
        });
        
        if (response.token) {
            this.setAuthToken(response.token);
            Storage.setSession({
                ...session,
                token: response.token,
                expiresAt: response.expiresAt
            });
        }
        
        return response;
    }

    // Analytics API methods
    static async getDashboardStats() {
        return this.get('/analytics/dashboard');
    }

    static async getPropertyStats(period = '30d') {
        return this.get('/analytics/properties', { period });
    }

    static async getClientStats(period = '30d') {
        return this.get('/analytics/clients', { period });
    }

    static async getRevenueStats(period = '30d') {
        return this.get('/analytics/revenue', { period });
    }

    // Search API methods
    static async search(query, type = 'all', filters = {}) {
        return this.get('/search', { 
            q: query, 
            type,
            ...filters 
        });
    }

    static async getSearchSuggestions(query, type = 'all') {
        return this.get('/search/suggestions', { q: query, type });
    }

    // Notifications API methods
    static async getNotifications(page = 1, limit = 20) {
        return this.get('/notifications', { page, limit });
    }

    static async markNotificationRead(id) {
        return this.patch(`/notifications/${id}`, { read: true });
    }

    static async markAllNotificationsRead() {
        return this.patch('/notifications/mark-all-read');
    }

    // Settings API methods
    static async getUserSettings() {
        return this.get('/settings');
    }

    static async updateUserSettings(settings) {
        return this.put('/settings', settings);
    }

    static async getSystemSettings() {
        return this.get('/settings/system');
    }
}

/**
 * Custom API Error class
 */
class APIError extends Error {
    constructor(message, status = 0, data = null) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API, APIError };
}

// Make available globally
window.API = API;
window.APIError = APIError;