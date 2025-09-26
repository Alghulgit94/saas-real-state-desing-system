/**
 * Properties Page Controller for Real Estate SaaS
 * Handles property listing, filtering, searching, and management
 */

class PropertiesController {
    constructor() {
        this.properties = [];
        this.filteredProperties = [];
        this.currentFilters = {};
        this.currentView = 'grid'; // grid or list
        this.currentSort = { field: 'updated', order: 'desc' };
        this.currentPage = 1;
        this.pageSize = 20;
        this.isLoading = false;
    }

    async load(container, data = {}) {
        try {
            this.isLoading = true;
            await this.loadProperties();
            this.render(container);
            this.setupEventListeners();
            this.applyFilters();
        } catch (error) {
            console.error('Error loading properties:', error);
            this.renderError(container);
        } finally {
            this.isLoading = false;
        }
    }

    async loadProperties() {
        try {
            // Mock API call - replace with actual API
            this.properties = [
                {
                    id: 1,
                    title: '123 Oak Street',
                    address: '123 Oak Street, Downtown, NY 10001',
                    price: 450000,
                    type: 'house',
                    status: 'active',
                    bedrooms: 3,
                    bathrooms: 2,
                    sqft: 1850,
                    lotSize: 0.25,
                    yearBuilt: 2018,
                    images: ['https://via.placeholder.com/400x300'],
                    agent: 'John Smith',
                    updated: new Date('2024-01-15'),
                    featured: true
                },
                {
                    id: 2,
                    title: '456 Pine Avenue',
                    address: '456 Pine Avenue, Midtown, NY 10002',
                    price: 675000,
                    type: 'condo',
                    status: 'active',
                    bedrooms: 2,
                    bathrooms: 2,
                    sqft: 1200,
                    lotSize: null,
                    yearBuilt: 2020,
                    images: ['https://via.placeholder.com/400x300'],
                    agent: 'Jane Doe',
                    updated: new Date('2024-01-14'),
                    featured: false
                },
                {
                    id: 3,
                    title: '789 Maple Drive',
                    address: '789 Maple Drive, Uptown, NY 10003',
                    price: 320000,
                    type: 'apartment',
                    status: 'pending',
                    bedrooms: 1,
                    bathrooms: 1,
                    sqft: 800,
                    lotSize: null,
                    yearBuilt: 2015,
                    images: ['https://via.placeholder.com/400x300'],
                    agent: 'Mike Johnson',
                    updated: new Date('2024-01-13'),
                    featured: false
                },
                {
                    id: 4,
                    title: '321 Elm Street',
                    address: '321 Elm Street, Suburbs, NY 10004',
                    price: 580000,
                    type: 'house',
                    status: 'sold',
                    bedrooms: 4,
                    bathrooms: 3,
                    sqft: 2100,
                    lotSize: 0.5,
                    yearBuilt: 2010,
                    images: ['https://via.placeholder.com/400x300'],
                    agent: 'Sarah Wilson',
                    updated: new Date('2024-01-12'),
                    featured: false
                }
            ];

            this.filteredProperties = [...this.properties];
        } catch (error) {
            console.error('Error fetching properties:', error);
            throw error;
        }
    }

    render(container) {
        const html = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Properties</h1>
                    <p class="page-description">Manage your property listings and inventory</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn--outline" id="import-properties">
                        <i data-lucide="upload" class="icon icon--sm"></i>
                        Import
                    </button>
                    <button class="btn btn--primary" id="add-property">
                        <i data-lucide="plus" class="icon icon--sm"></i>
                        Add Property
                    </button>
                </div>
            </div>

            <!-- Filters Section -->
            <div class="properties-filters">
                <div class="filters-row">
                    <div class="filter-group">
                        <label class="filter-label">Property Type</label>
                        <select class="input__field" id="filter-type">
                            <option value="">All Types</option>
                            <option value="house">House</option>
                            <option value="condo">Condo</option>
                            <option value="apartment">Apartment</option>
                            <option value="land">Land</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Status</label>
                        <select class="input__field" id="filter-status">
                            <option value="">All Status</option>
                            <option value="active">Active</option>
                            <option value="pending">Pending</option>
                            <option value="sold">Sold</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Price Range</label>
                        <div class="price-range">
                            <input type="number" class="input__field" id="filter-min-price" placeholder="Min">
                            <span class="price-range__separator">to</span>
                            <input type="number" class="input__field" id="filter-max-price" placeholder="Max">
                        </div>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Bedrooms</label>
                        <select class="input__field" id="filter-bedrooms">
                            <option value="">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                        </select>
                    </div>
                </div>
                <div class="filters-row">
                    <div class="filter-group">
                        <label class="filter-label">Search</label>
                        <div class="input">
                            <i data-lucide="search" class="input__icon"></i>
                            <input type="text" class="input__field" id="search-properties" placeholder="Search by address, agent, or features...">
                        </div>
                    </div>
                    <div class="filter-group" style="align-self: flex-end;">
                        <button class="btn btn--outline" id="clear-filters">
                            <i data-lucide="x" class="icon icon--sm"></i>
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            <!-- Filter Chips -->
            <div class="filter-chips" id="active-filters"></div>

            <!-- Toolbar -->
            <div class="properties-toolbar">
                <div class="toolbar-left">
                    <span class="results-count" id="results-count">0 properties</span>
                </div>
                <div class="toolbar-right">
                    <div class="sort-select">
                        <label style="font-size: 0.875rem; color: var(--muted-foreground);">Sort by:</label>
                        <select class="input__field" id="sort-properties" style="width: auto;">
                            <option value="updated-desc">Recently Updated</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="address-asc">Address A-Z</option>
                            <option value="sqft-desc">Largest First</option>
                        </select>
                    </div>
                    <div class="view-toggles">
                        <button class="view-toggle view-toggle--active" data-view="grid" id="view-grid">
                            <i data-lucide="grid-3x3" class="icon icon--sm"></i>
                        </button>
                        <button class="view-toggle" data-view="list" id="view-list">
                            <i data-lucide="list" class="icon icon--sm"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Properties Grid/List -->
            <div class="properties-container" id="properties-container">
                <div class="properties-grid" id="properties-grid">
                    <!-- Properties will be rendered here -->
                </div>
            </div>

            <!-- Pagination -->
            <div class="pagination" id="pagination">
                <!-- Pagination will be rendered here -->
            </div>
        `;

        container.innerHTML = html;
        this.renderProperties();
        this.updateResultsCount();
    }

    renderProperties() {
        const container = document.getElementById('properties-grid');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const paginatedProperties = this.filteredProperties.slice(startIndex, endIndex);

        if (paginatedProperties.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 4rem 2rem; color: var(--muted-foreground);">
                    <i data-lucide="building" class="icon" style="width: 4rem; height: 4rem; margin-bottom: 1rem;"></i>
                    <h3 style="margin-bottom: 0.5rem; color: var(--foreground);">No properties found</h3>
                    <p>Try adjusting your filters or add a new property to get started.</p>
                </div>
            `;
            return;
        }

        const propertiesHTML = paginatedProperties.map(property => this.renderPropertyCard(property)).join('');
        container.innerHTML = propertiesHTML;

        // Update pagination
        this.renderPagination();

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    renderPropertyCard(property) {
        const statusClass = `property-card__status--${property.status}`;
        const featuredBadge = property.featured ? '<div class="featured-badge">Featured</div>' : '';

        return `
            <div class="property-card" data-property-id="${property.id}">
                ${featuredBadge}
                <div class="property-card__image">
                    <img src="${property.images[0]}" alt="${Helpers.escapeHtml(property.title)}" loading="lazy">
                    <div class="property-card__status ${statusClass}">
                        ${Helpers.capitalize(property.status)}
                    </div>
                </div>
                <div class="property-card__content">
                    <div class="property-card__price">
                        ${Helpers.formatCurrency(property.price)}
                    </div>
                    <h3 class="property-card__title">${Helpers.escapeHtml(property.title)}</h3>
                    <div class="property-card__location">
                        <i data-lucide="map-pin" class="icon icon--xs"></i>
                        ${Helpers.escapeHtml(property.address)}
                    </div>
                    <div class="property-card__features">
                        <div class="property-feature">
                            <i data-lucide="bed" class="icon icon--xs"></i>
                            ${property.bedrooms} bed
                        </div>
                        <div class="property-feature">
                            <i data-lucide="bath" class="icon icon--xs"></i>
                            ${property.bathrooms} bath
                        </div>
                        <div class="property-feature">
                            <i data-lucide="square" class="icon icon--xs"></i>
                            ${Helpers.formatNumber(property.sqft)} sqft
                        </div>
                        ${property.lotSize ? `
                            <div class="property-feature">
                                <i data-lucide="map" class="icon icon--xs"></i>
                                ${property.lotSize} acre
                            </div>
                        ` : ''}
                    </div>
                    <div class="property-card__meta">
                        <span class="property-agent">Agent: ${Helpers.escapeHtml(property.agent)}</span>
                        <span class="property-updated">Updated ${Helpers.getRelativeTime(property.updated)}</span>
                    </div>
                    <div class="property-card__actions">
                        <button class="btn btn--outline btn--sm" data-action="edit" data-property-id="${property.id}">
                            <i data-lucide="edit" class="icon icon--xs"></i>
                            Edit
                        </button>
                        <button class="btn btn--ghost btn--sm" data-action="view" data-property-id="${property.id}">
                            <i data-lucide="eye" class="icon icon--xs"></i>
                            View
                        </button>
                        <div class="dropdown">
                            <button class="btn btn--ghost btn--sm dropdown__trigger">
                                <i data-lucide="more-horizontal" class="icon icon--xs"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Filter inputs
        document.getElementById('filter-type')?.addEventListener('change', (e) => {
            this.updateFilter('type', e.target.value);
        });

        document.getElementById('filter-status')?.addEventListener('change', (e) => {
            this.updateFilter('status', e.target.value);
        });

        document.getElementById('filter-bedrooms')?.addEventListener('change', (e) => {
            this.updateFilter('bedrooms', e.target.value);
        });

        document.getElementById('filter-min-price')?.addEventListener('input', Helpers.debounce((e) => {
            this.updateFilter('minPrice', e.target.value);
        }, 500));

        document.getElementById('filter-max-price')?.addEventListener('input', Helpers.debounce((e) => {
            this.updateFilter('maxPrice', e.target.value);
        }, 500));

        document.getElementById('search-properties')?.addEventListener('input', Helpers.debounce((e) => {
            this.updateFilter('search', e.target.value);
        }, 300));

        // Clear filters
        document.getElementById('clear-filters')?.addEventListener('click', () => {
            this.clearFilters();
        });

        // Sort
        document.getElementById('sort-properties')?.addEventListener('change', (e) => {
            const [field, order] = e.target.value.split('-');
            this.updateSort(field, order);
        });

        // View toggles
        document.getElementById('view-grid')?.addEventListener('click', () => {
            this.setView('grid');
        });

        document.getElementById('view-list')?.addEventListener('click', () => {
            this.setView('list');
        });

        // Add property button
        document.getElementById('add-property')?.addEventListener('click', () => {
            if (window.headerController) {
                window.headerController.openAddPropertyModal();
            }
        });

        // Property actions
        document.addEventListener('click', (e) => {
            const action = e.target.closest('[data-action]');
            if (action) {
                const actionType = action.dataset.action;
                const propertyId = action.dataset.propertyId;
                this.handlePropertyAction(actionType, propertyId);
            }
        });

        // Property card clicks (for navigation)
        document.addEventListener('click', (e) => {
            const propertyCard = e.target.closest('.property-card');
            if (propertyCard && !e.target.closest('.property-card__actions')) {
                const propertyId = propertyCard.dataset.propertyId;
                router.navigate(`/properties/${propertyId}`);
            }
        });
    }

    updateFilter(key, value) {
        if (value) {
            this.currentFilters[key] = value;
        } else {
            delete this.currentFilters[key];
        }

        this.currentPage = 1; // Reset to first page
        this.applyFilters();
        this.updateFilterChips();
    }

    applyFilters() {
        this.filteredProperties = this.properties.filter(property => {
            // Type filter
            if (this.currentFilters.type && property.type !== this.currentFilters.type) {
                return false;
            }

            // Status filter
            if (this.currentFilters.status && property.status !== this.currentFilters.status) {
                return false;
            }

            // Bedrooms filter
            if (this.currentFilters.bedrooms) {
                const minBedrooms = parseInt(this.currentFilters.bedrooms);
                if (property.bedrooms < minBedrooms) {
                    return false;
                }
            }

            // Price range
            if (this.currentFilters.minPrice) {
                const minPrice = parseFloat(this.currentFilters.minPrice);
                if (property.price < minPrice) {
                    return false;
                }
            }

            if (this.currentFilters.maxPrice) {
                const maxPrice = parseFloat(this.currentFilters.maxPrice);
                if (property.price > maxPrice) {
                    return false;
                }
            }

            // Search filter
            if (this.currentFilters.search) {
                const query = this.currentFilters.search.toLowerCase();
                const searchableText = [
                    property.title,
                    property.address,
                    property.agent,
                    property.type
                ].join(' ').toLowerCase();

                if (!searchableText.includes(query)) {
                    return false;
                }
            }

            return true;
        });

        // Apply sorting
        this.applySorting();
        this.renderProperties();
        this.updateResultsCount();
    }

    applySorting() {
        const { field, order } = this.currentSort;

        this.filteredProperties.sort((a, b) => {
            let valueA = a[field];
            let valueB = b[field];

            // Handle different data types
            if (field === 'price' || field === 'sqft') {
                valueA = parseFloat(valueA) || 0;
                valueB = parseFloat(valueB) || 0;
            } else if (field === 'updated') {
                valueA = new Date(valueA);
                valueB = new Date(valueB);
            } else if (typeof valueA === 'string') {
                valueA = valueA.toLowerCase();
                valueB = valueB.toLowerCase();
            }

            let comparison = 0;
            if (valueA > valueB) comparison = 1;
            if (valueA < valueB) comparison = -1;

            return order === 'desc' ? comparison * -1 : comparison;
        });
    }

    updateSort(field, order) {
        this.currentSort = { field, order };
        this.applySorting();
        this.renderProperties();
    }

    setView(viewType) {
        this.currentView = viewType;
        
        // Update toggle buttons
        document.querySelectorAll('.view-toggle').forEach(btn => {
            btn.classList.toggle('view-toggle--active', btn.dataset.view === viewType);
        });

        // Update container class
        const container = document.getElementById('properties-container');
        if (container) {
            container.className = `properties-container properties-container--${viewType}`;
        }

        // Save preference
        Storage.setViewState('properties', { view: viewType });
    }

    clearFilters() {
        this.currentFilters = {};
        this.currentPage = 1;

        // Reset form inputs
        document.getElementById('filter-type').value = '';
        document.getElementById('filter-status').value = '';
        document.getElementById('filter-bedrooms').value = '';
        document.getElementById('filter-min-price').value = '';
        document.getElementById('filter-max-price').value = '';
        document.getElementById('search-properties').value = '';

        this.applyFilters();
        this.updateFilterChips();
    }

    updateFilterChips() {
        const container = document.getElementById('active-filters');
        if (!container) return;

        const chips = [];

        Object.entries(this.currentFilters).forEach(([key, value]) => {
            if (!value) return;

            let label = '';
            switch (key) {
                case 'type':
                    label = `Type: ${Helpers.capitalize(value)}`;
                    break;
                case 'status':
                    label = `Status: ${Helpers.capitalize(value)}`;
                    break;
                case 'bedrooms':
                    label = `${value}+ Bedrooms`;
                    break;
                case 'minPrice':
                    label = `Min: ${Helpers.formatCurrency(value)}`;
                    break;
                case 'maxPrice':
                    label = `Max: ${Helpers.formatCurrency(value)}`;
                    break;
                case 'search':
                    label = `Search: "${value}"`;
                    break;
            }

            if (label) {
                chips.push(`
                    <button class="filter-chip" data-filter="${key}">
                        ${Helpers.escapeHtml(label)}
                        <button class="filter-chip__remove" aria-label="Remove filter">
                            <i data-lucide="x" class="icon icon--xs"></i>
                        </button>
                    </button>
                `);
            }
        });

        container.innerHTML = chips.join('');

        // Add event listeners to remove buttons
        container.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                if (e.target.closest('.filter-chip__remove')) {
                    const filterKey = chip.dataset.filter;
                    this.updateFilter(filterKey, '');
                    
                    // Clear corresponding form input
                    const input = document.getElementById(`filter-${filterKey}`) || 
                                  document.getElementById(`search-properties`);
                    if (input) {
                        input.value = '';
                    }
                }
            });
        });

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    updateResultsCount() {
        const counter = document.getElementById('results-count');
        if (counter) {
            const count = this.filteredProperties.length;
            counter.textContent = `${count} ${count === 1 ? 'property' : 'properties'}`;
        }
    }

    renderPagination() {
        const container = document.getElementById('pagination');
        if (!container) return;

        const totalPages = Math.ceil(this.filteredProperties.length / this.pageSize);
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        const pagination = [];
        
        // Previous button
        pagination.push(`
            <button class="pagination__item ${this.currentPage === 1 ? 'pagination__item--disabled' : ''}" 
                    data-page="${this.currentPage - 1}" ${this.currentPage === 1 ? 'disabled' : ''}>
                <i data-lucide="chevron-left" class="icon icon--xs"></i>
            </button>
        `);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                pagination.push(`
                    <button class="pagination__item ${i === this.currentPage ? 'pagination__item--active' : ''}" 
                            data-page="${i}">
                        ${i}
                    </button>
                `);
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                pagination.push('<span class="pagination__ellipsis">...</span>');
            }
        }

        // Next button
        pagination.push(`
            <button class="pagination__item ${this.currentPage === totalPages ? 'pagination__item--disabled' : ''}" 
                    data-page="${this.currentPage + 1}" ${this.currentPage === totalPages ? 'disabled' : ''}>
                <i data-lucide="chevron-right" class="icon icon--xs"></i>
            </button>
        `);

        container.innerHTML = pagination.join('');

        // Add event listeners
        container.querySelectorAll('[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                if (page && page !== this.currentPage) {
                    this.currentPage = page;
                    this.renderProperties();
                    Helpers.scrollToElement('#properties-container', 100);
                }
            });
        });

        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    handlePropertyAction(action, propertyId) {
        switch (action) {
            case 'view':
                router.navigate(`/properties/${propertyId}`);
                break;
            case 'edit':
                this.openEditPropertyModal(propertyId);
                break;
            case 'delete':
                this.deleteProperty(propertyId);
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    openEditPropertyModal(propertyId) {
        const property = this.properties.find(p => p.id.toString() === propertyId);
        if (!property) return;

        // This would open an edit modal with the property data
        console.log('Edit property:', property);
        Toast.info('Edit property functionality would be implemented here');
    }

    async deleteProperty(propertyId) {
        if (!confirm('Are you sure you want to delete this property?')) {
            return;
        }

        try {
            // Mock API call
            console.log('Deleting property:', propertyId);
            
            // Remove from local array
            this.properties = this.properties.filter(p => p.id.toString() !== propertyId);
            this.applyFilters();
            
            Toast.success('Property deleted successfully');
        } catch (error) {
            console.error('Error deleting property:', error);
            Toast.error('Failed to delete property');
        }
    }

    renderError(container) {
        container.innerHTML = `
            <div class="alert alert--error">
                <div class="alert__content">
                    <div class="alert__title">Error Loading Properties</div>
                    <div class="alert__description">Failed to load property data. Please try refreshing the page.</div>
                </div>
            </div>
        `;
    }

    destroy() {
        // Cleanup any event listeners or intervals
    }
}

// Create and export properties controller
const propertiesController = new PropertiesController();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = propertiesController;
}

// Make available globally
window.propertiesController = propertiesController;