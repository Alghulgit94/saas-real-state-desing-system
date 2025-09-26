/**
 * Header Controller for Real Estate SaaS
 * Handles header functionality, search, notifications, and actions
 */

class HeaderController {
    constructor() {
        this.header = null;
        this.searchInput = null;
        this.searchResults = null;
        this.notificationsDropdown = null;
        this.messagesDropdown = null;
        this.isSearching = false;
        
        this.init();
    }

    async init() {
        try {
            await this.loadHeaderContent();
            this.setupEventListeners();
            this.setupSearch();
            this.setupNotifications();
            this.setupMessages();
            this.setupActions();
        } catch (error) {
            console.error('Error initializing header:', error);
        }
    }

    async loadHeaderContent() {
        const header = document.getElementById('header');
        if (!header) return;

        try {
            const response = await fetch('components/header.html');
            const content = await response.text();
            header.innerHTML = content;
            this.header = header;
            
            // Initialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } catch (error) {
            console.error('Error loading header content:', error);
            // Fallback content
            header.innerHTML = `
                <div class="header__left">
                    <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle mobile menu">
                        <i data-lucide="menu" class="icon icon--md"></i>
                    </button>
                    <div class="breadcrumb">
                        <span class="breadcrumb__item" id="current-page">Dashboard</span>
                    </div>
                </div>
                <div class="header__center">
                    <div class="search-bar">
                        <i data-lucide="search" class="icon icon--sm search-bar__icon"></i>
                        <input type="text" class="search-bar__input" placeholder="Search..." id="global-search">
                        <button class="search-bar__button" aria-label="Search">
                            <i data-lucide="search" class="icon icon--sm"></i>
                        </button>
                    </div>
                </div>
                <div class="header__right">
                    <button class="btn btn--primary" id="add-property-btn">
                        <i data-lucide="plus" class="icon icon--sm"></i>
                        Add Property
                    </button>
                </div>
            `;
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    setupEventListeners() {
        if (!this.header) return;

        // Mobile menu toggle
        const mobileToggle = this.header.querySelector('#mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                if (window.sidebarController) {
                    window.sidebarController.toggleMobile();
                }
            });
        }

        // Add property button
        const addPropertyBtn = this.header.querySelector('#add-property-btn');
        if (addPropertyBtn) {
            addPropertyBtn.addEventListener('click', () => {
                this.openAddPropertyModal();
            });
        }
    }

    setupSearch() {
        this.searchInput = this.header?.querySelector('#global-search');
        const searchButton = this.header?.querySelector('.search-bar__button');

        if (!this.searchInput) return;

        // Create search results container
        this.createSearchResults();

        // Search input events
        this.searchInput.addEventListener('input', Helpers.debounce((e) => {
            this.handleSearch(e.target.value);
        }, 300));

        this.searchInput.addEventListener('focus', () => {
            this.showSearchResults();
        });

        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.performSearch(this.searchInput.value);
            } else if (e.key === 'Escape') {
                this.hideSearchResults();
                this.searchInput.blur();
            }
        });

        // Search button click
        if (searchButton) {
            searchButton.addEventListener('click', () => {
                this.performSearch(this.searchInput.value);
            });
        }

        // Hide search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-bar') && !e.target.closest('.search-results')) {
                this.hideSearchResults();
            }
        });
    }

    createSearchResults() {
        if (this.searchResults) return;

        const searchBar = this.header?.querySelector('.search-bar');
        if (!searchBar) return;

        this.searchResults = document.createElement('div');
        this.searchResults.className = 'search-results';
        this.searchResults.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--popover);
            border: 1px solid var(--border);
            border-radius: var(--radius);
            box-shadow: var(--shadow-lg);
            max-height: 400px;
            overflow-y: auto;
            z-index: 50;
            display: none;
            margin-top: 0.5rem;
        `;

        searchBar.style.position = 'relative';
        searchBar.appendChild(this.searchResults);
    }

    async handleSearch(query) {
        if (!query.trim()) {
            this.hideSearchResults();
            return;
        }

        this.isSearching = true;
        this.showSearchLoader();

        try {
            // Get recent searches and suggestions
            const recentSearches = Storage.getRecentSearches();
            const suggestions = await this.getSearchSuggestions(query);

            this.displaySearchResults(query, suggestions, recentSearches);
        } catch (error) {
            console.error('Search error:', error);
            this.displaySearchError();
        } finally {
            this.isSearching = false;
        }
    }

    async getSearchSuggestions(query) {
        try {
            // Mock API call - replace with actual API
            await new Promise(resolve => setTimeout(resolve, 200));
            
            return {
                properties: [
                    { id: 1, title: '123 Oak Street', type: 'property', price: '$450,000' },
                    { id: 2, title: '456 Pine Avenue', type: 'property', price: '$675,000' }
                ],
                clients: [
                    { id: 1, name: 'John Smith', type: 'client', email: 'john@example.com' },
                    { id: 2, name: 'Jane Doe', type: 'client', email: 'jane@example.com' }
                ],
                agents: [
                    { id: 1, name: 'Mike Johnson', type: 'agent', role: 'Senior Agent' }
                ]
            };
        } catch (error) {
            console.error('Error fetching search suggestions:', error);
            return { properties: [], clients: [], agents: [] };
        }
    }

    displaySearchResults(query, suggestions, recentSearches) {
        if (!this.searchResults) return;

        let html = '';

        // Recent searches (if no current query results)
        if (recentSearches.length > 0 && (!suggestions.properties.length && !suggestions.clients.length && !suggestions.agents.length)) {
            html += `
                <div class="search-section">
                    <div class="search-section__header">
                        <span>Recent Searches</span>
                    </div>
                    ${recentSearches.slice(0, 5).map(search => `
                        <div class="search-item" data-query="${Helpers.escapeHtml(search.query)}">
                            <i data-lucide="clock" class="icon icon--sm"></i>
                            <span>${Helpers.escapeHtml(search.query)}</span>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Properties
        if (suggestions.properties.length > 0) {
            html += `
                <div class="search-section">
                    <div class="search-section__header">
                        <span>Properties</span>
                    </div>
                    ${suggestions.properties.map(property => `
                        <div class="search-item" data-type="property" data-id="${property.id}">
                            <i data-lucide="building" class="icon icon--sm"></i>
                            <div class="search-item__content">
                                <div class="search-item__title">${Helpers.escapeHtml(property.title)}</div>
                                <div class="search-item__subtitle">${property.price}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Clients
        if (suggestions.clients.length > 0) {
            html += `
                <div class="search-section">
                    <div class="search-section__header">
                        <span>Clients</span>
                    </div>
                    ${suggestions.clients.map(client => `
                        <div class="search-item" data-type="client" data-id="${client.id}">
                            <i data-lucide="user" class="icon icon--sm"></i>
                            <div class="search-item__content">
                                <div class="search-item__title">${Helpers.escapeHtml(client.name)}</div>
                                <div class="search-item__subtitle">${Helpers.escapeHtml(client.email)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // Agents
        if (suggestions.agents.length > 0) {
            html += `
                <div class="search-section">
                    <div class="search-section__header">
                        <span>Agents</span>
                    </div>
                    ${suggestions.agents.map(agent => `
                        <div class="search-item" data-type="agent" data-id="${agent.id}">
                            <i data-lucide="user-check" class="icon icon--sm"></i>
                            <div class="search-item__content">
                                <div class="search-item__title">${Helpers.escapeHtml(agent.name)}</div>
                                <div class="search-item__subtitle">${Helpers.escapeHtml(agent.role)}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        // No results
        if (!html) {
            html = `
                <div class="search-no-results">
                    <i data-lucide="search-x" class="icon icon--lg"></i>
                    <p>No results found for "${Helpers.escapeHtml(query)}"</p>
                </div>
            `;
        }

        this.searchResults.innerHTML = html;
        this.showSearchResults();

        // Add click handlers
        this.searchResults.querySelectorAll('.search-item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                const id = item.dataset.id;
                const query = item.dataset.query;

                if (query) {
                    // Handle recent search
                    this.searchInput.value = query;
                    this.performSearch(query);
                } else if (type && id) {
                    // Navigate to specific item
                    router.navigate(`/${type}s/${id}`);
                    this.hideSearchResults();
                }
            });
        });

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }

        this.addSearchResultsStyles();
    }

    showSearchLoader() {
        if (!this.searchResults) return;

        this.searchResults.innerHTML = `
            <div class="search-loading">
                <div class="spinner spinner--sm"></div>
                <span>Searching...</span>
            </div>
        `;
        this.showSearchResults();
    }

    displaySearchError() {
        if (!this.searchResults) return;

        this.searchResults.innerHTML = `
            <div class="search-error">
                <i data-lucide="alert-circle" class="icon icon--sm"></i>
                <span>Search failed. Please try again.</span>
            </div>
        `;
        this.showSearchResults();
    }

    showSearchResults() {
        if (this.searchResults) {
            this.searchResults.style.display = 'block';
        }
    }

    hideSearchResults() {
        if (this.searchResults) {
            this.searchResults.style.display = 'none';
        }
    }

    async performSearch(query) {
        if (!query.trim()) return;

        // Save to recent searches
        Storage.addRecentSearch(query);

        // Navigate to search results page
        router.navigate(`/search?q=${encodeURIComponent(query)}`);
        this.hideSearchResults();
    }

    addSearchResultsStyles() {
        if (document.getElementById('search-results-styles')) return;

        const style = document.createElement('style');
        style.id = 'search-results-styles';
        style.textContent = `
            .search-section {
                padding: 0.5rem 0;
            }
            
            .search-section:not(:last-child) {
                border-bottom: 1px solid var(--border);
            }
            
            .search-section__header {
                padding: 0.5rem 1rem;
                font-size: 0.75rem;
                font-weight: 600;
                color: var(--muted-foreground);
                text-transform: uppercase;
                letter-spacing: 0.025em;
            }
            
            .search-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }
            
            .search-item:hover {
                background-color: var(--accent);
            }
            
            .search-item__content {
                flex: 1;
                min-width: 0;
            }
            
            .search-item__title {
                font-weight: 500;
                color: var(--foreground);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .search-item__subtitle {
                font-size: 0.875rem;
                color: var(--muted-foreground);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .search-loading,
            .search-error,
            .search-no-results {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
                padding: 2rem 1rem;
                color: var(--muted-foreground);
                text-align: center;
            }
            
            .search-no-results {
                flex-direction: column;
                gap: 1rem;
            }
        `;
        document.head.appendChild(style);
    }

    setupNotifications() {
        const notificationsBtn = this.header?.querySelector('#notifications-btn');
        if (!notificationsBtn) return;

        this.notificationsDropdown = new Dropdown(notificationsBtn, {
            placement: 'bottom-right',
            items: [], // Will be populated dynamically
            closeOnClick: false
        });

        // Load notifications on click
        notificationsBtn.addEventListener('click', () => {
            this.loadNotifications();
        });
    }

    setupMessages() {
        const messagesBtn = this.header?.querySelector('#messages-btn');
        if (!messagesBtn) return;

        this.messagesDropdown = new Dropdown(messagesBtn, {
            placement: 'bottom-right',
            items: [], // Will be populated dynamically
            closeOnClick: false
        });

        // Load messages on click
        messagesBtn.addEventListener('click', () => {
            this.loadMessages();
        });
    }

    setupActions() {
        // Any additional header actions can be set up here
    }

    async loadNotifications() {
        try {
            // Mock API call - replace with actual API
            const notifications = [
                {
                    id: 1,
                    title: 'New Property Inquiry',
                    message: 'Someone is interested in 123 Oak Street',
                    time: '5 minutes ago',
                    unread: true
                },
                {
                    id: 2,
                    title: 'Client Meeting Reminder',
                    message: 'Meeting with John Smith at 2:00 PM',
                    time: '1 hour ago',
                    unread: true
                },
                {
                    id: 3,
                    title: 'Property Listing Approved',
                    message: '456 Pine Avenue is now live',
                    time: '2 hours ago',
                    unread: false
                }
            ];

            this.updateNotificationsDropdown(notifications);
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }

    async loadMessages() {
        try {
            // Mock API call - replace with actual API
            const messages = [
                {
                    id: 1,
                    sender: 'John Smith',
                    subject: 'Property Question',
                    preview: 'Hi, I have a question about the property...',
                    time: '10 minutes ago',
                    unread: true
                },
                {
                    id: 2,
                    sender: 'Jane Doe',
                    subject: 'Viewing Request',
                    preview: 'I would like to schedule a viewing...',
                    time: '30 minutes ago',
                    unread: true
                },
                {
                    id: 3,
                    sender: 'Mike Johnson',
                    subject: 'Contract Update',
                    preview: 'The contract has been updated...',
                    time: '1 hour ago',
                    unread: false
                }
            ];

            this.updateMessagesDropdown(messages);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    updateNotificationsDropdown(notifications) {
        // Implementation would update the dropdown with notification items
        // This is a simplified version
        console.log('Notifications loaded:', notifications);
    }

    updateMessagesDropdown(messages) {
        // Implementation would update the dropdown with message items
        // This is a simplified version
        console.log('Messages loaded:', messages);
    }

    openAddPropertyModal() {
        const modal = new Modal({
            title: 'Add New Property',
            content: `
                <form id="add-property-form">
                    <div class="form-group">
                        <label class="form-label">Property Type</label>
                        <select class="input__field" name="type" required>
                            <option value="">Select type...</option>
                            <option value="house">House</option>
                            <option value="apartment">Apartment</option>
                            <option value="condo">Condo</option>
                            <option value="land">Land</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Address</label>
                        <input type="text" class="input__field" name="address" placeholder="Enter address" required>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Price</label>
                            <input type="number" class="input__field" name="price" placeholder="0" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Bedrooms</label>
                            <input type="number" class="input__field" name="bedrooms" placeholder="0" min="0">
                        </div>
                        <div class="form-group">
                            <label class="form-label">Bathrooms</label>
                            <input type="number" class="input__field" name="bathrooms" placeholder="0" min="0" step="0.5">
                        </div>
                    </div>
                    <div class="flex" style="gap: 0.5rem; justify-content: flex-end; margin-top: 1.5rem;">
                        <button type="button" class="btn btn--outline" onclick="this.closest('.modal-container').querySelector('.modal-close').click()">Cancel</button>
                        <button type="submit" class="btn btn--primary">Add Property</button>
                    </div>
                </form>
            `,
            size: 'medium'
        });

        modal.open();

        // Handle form submission
        const form = document.getElementById('add-property-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                try {
                    const formData = new FormData(form);
                    const propertyData = Object.fromEntries(formData);
                    
                    // Mock API call
                    console.log('Creating property:', propertyData);
                    
                    Toast.success('Property added successfully!');
                    modal.close();
                    
                    // Refresh properties page if we're on it
                    if (router.getCurrentRoute()?.path === '/properties') {
                        router.refresh();
                    }
                } catch (error) {
                    console.error('Error adding property:', error);
                    Toast.error('Failed to add property. Please try again.');
                }
            });
        }
    }

    updateBreadcrumb(title) {
        const breadcrumb = this.header?.querySelector('#current-page');
        if (breadcrumb) {
            breadcrumb.textContent = title;
        }
    }

    destroy() {
        if (this.notificationsDropdown) {
            this.notificationsDropdown.destroy();
        }
        
        if (this.messagesDropdown) {
            this.messagesDropdown.destroy();
        }
    }
}

// Initialize header controller
const headerController = new HeaderController();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = headerController;
}

// Make available globally
window.headerController = headerController;