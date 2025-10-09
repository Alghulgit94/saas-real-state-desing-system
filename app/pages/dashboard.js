class DashboardController {
    constructor() {
        this.reservations = [];
        this.filteredReservations = [];
        this.filters = {
            name: '',
            priceMin: '',
            priceMax: '',
            dateFrom: '',
            dateTo: '',
            status: ''
        };
        this.pagination = {
            currentPage: 1,
            itemsPerPage: 20
        };
        this.stats = null;
        this.previousStats = null;
    }

    async load(container, data = {}) {
        try {
            Helpers.toggleLoading(true);
            await this.loadReservations();
            this.calculateStats();
            this.applyFilters();
            this.render(container);
            this.setupEventListeners();
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.renderError(container);
        } finally {
            Helpers.toggleLoading(false);
        }
    }

    async loadReservations() {
        try {
            const supabase = window.SupabaseClient;

            if (!supabase || !supabase.isReady()) {
                throw new Error('Supabase client not initialized');
            }

            const { data, error } = await supabase.getClient()
                .from('reservations')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching reservations:', error);
                throw error;
            }

            this.reservations = data || [];
            console.log('Loaded reservations:', this.reservations.length);
        } catch (error) {
            console.error('Error loading reservations:', error);
            this.reservations = [];
            throw error;
        }
    }

    calculateStats() {
        const total = this.reservations.length;

        const totalIncome = this.reservations.reduce((sum, r) => {
            const price = r.lot_details?.precio_usd || 0;
            return sum + price;
        }, 0);

        const pending = this.reservations.filter(r => r.status === 'pending').length;

        const confirmed = this.reservations.filter(r => r.status === 'confirmed').length;
        const conversionRate = total > 0 ? (confirmed / total) * 100 : 0;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentReservations = this.reservations.filter(r =>
            new Date(r.created_at) >= thirtyDaysAgo
        );

        this.stats = {
            totalReservations: total,
            totalIncome: totalIncome,
            pendingReservations: pending,
            conversionRate: conversionRate,
            recentCount: recentReservations.length
        };

        const previousThirtyDays = this.reservations.filter(r => {
            const date = new Date(r.created_at);
            const sixtyDaysAgo = new Date();
            sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
            return date >= sixtyDaysAgo && date < thirtyDaysAgo;
        });

        this.previousStats = {
            totalReservations: previousThirtyDays.length
        };
    }

    calculateChange() {
        if (this.previousStats.totalReservations === 0) {
            return { value: this.stats.recentCount > 0 ? 100 : 0, isPositive: true };
        }
        const change = ((this.stats.recentCount - this.previousStats.totalReservations) / this.previousStats.totalReservations) * 100;
        return {
            value: Math.abs(change),
            isPositive: change >= 0
        };
    }

    applyFilters() {
        let filtered = [...this.reservations];

        if (this.filters.name.trim()) {
            const searchTerm = this.filters.name.toLowerCase().trim();
            filtered = filtered.filter(r => {
                const fullName = `${r.first_name} ${r.last_name}`.toLowerCase();
                return fullName.includes(searchTerm);
            });
        }

        if (this.filters.priceMin) {
            const min = parseFloat(this.filters.priceMin);
            filtered = filtered.filter(r => {
                const price = r.lot_details?.precio_usd || 0;
                return price >= min;
            });
        }

        if (this.filters.priceMax) {
            const max = parseFloat(this.filters.priceMax);
            filtered = filtered.filter(r => {
                const price = r.lot_details?.precio_usd || 0;
                return price <= max;
            });
        }

        if (this.filters.dateFrom) {
            const fromDate = new Date(this.filters.dateFrom);
            filtered = filtered.filter(r => {
                const resDate = new Date(r.reservation_date);
                return resDate >= fromDate;
            });
        }

        if (this.filters.dateTo) {
            const toDate = new Date(this.filters.dateTo);
            toDate.setHours(23, 59, 59, 999);
            filtered = filtered.filter(r => {
                const resDate = new Date(r.reservation_date);
                return resDate <= toDate;
            });
        }

        if (this.filters.status) {
            filtered = filtered.filter(r => r.status === this.filters.status);
        }

        this.filteredReservations = filtered;
        this.pagination.currentPage = 1;
    }

    getActiveFilterChips() {
        const chips = [];

        if (this.filters.name) {
            chips.push({ key: 'name', label: `Name: ${this.filters.name}` });
        }
        if (this.filters.priceMin || this.filters.priceMax) {
            const min = this.filters.priceMin ? `$${this.formatPrice(this.filters.priceMin)}` : 'Any';
            const max = this.filters.priceMax ? `$${this.formatPrice(this.filters.priceMax)}` : 'Any';
            chips.push({ key: 'price', label: `Price: ${min} - ${max}` });
        }
        if (this.filters.dateFrom || this.filters.dateTo) {
            const from = this.filters.dateFrom ? this.formatDateShort(this.filters.dateFrom) : 'Any';
            const to = this.filters.dateTo ? this.formatDateShort(this.filters.dateTo) : 'Any';
            chips.push({ key: 'date', label: `Date: ${from} - ${to}` });
        }
        if (this.filters.status) {
            chips.push({ key: 'status', label: `Status: ${this.capitalizeFirst(this.filters.status)}` });
        }

        return chips;
    }

    getPaginatedReservations() {
        const start = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
        const end = start + this.pagination.itemsPerPage;
        return this.filteredReservations.slice(start, end);
    }

    getTotalPages() {
        return Math.ceil(this.filteredReservations.length / this.pagination.itemsPerPage);
    }

    render(container) {
        const change = this.calculateChange();
        const activeFilters = this.getActiveFilterChips();
        const paginatedData = this.getPaginatedReservations();
        const totalPages = this.getTotalPages();

        const html = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Reservation Dashboard</h1>
                    <p class="page-description">Monitor and manage property reservations</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn--outline" id="refresh-dashboard">
                        <i data-lucide="refresh-cw" class="icon icon--sm"></i>
                        Refresh
                    </button>
                </div>
            </div>

            <div class="dashboard-stats">
                <div class="stat-card stat-card--dark">
                    <div class="stat-card__header">
                        <span class="stat-card__title">Total Reservations</span>
                        <div class="stat-card__icon">
                            <i data-lucide="file-text" class="icon icon--md"></i>
                        </div>
                    </div>
                    <div class="stat-card__value">${this.stats.totalReservations}</div>
                    <div class="stat-card__change ${change.isPositive ? 'stat-card__change--positive' : 'stat-card__change--negative'}">
                        <i data-lucide="${change.isPositive ? 'trending-up' : 'trending-down'}" class="icon icon--xs"></i>
                        <span>${change.isPositive ? '+' : ''}${change.value.toFixed(1)}% from last month</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card__header">
                        <span class="stat-card__title">Total Income</span>
                        <div class="stat-card__icon">
                            <i data-lucide="dollar-sign" class="icon icon--md"></i>
                        </div>
                    </div>
                    <div class="stat-card__value">$${this.formatPrice(this.stats.totalIncome)}</div>
                    <div class="stat-card__change stat-card__change--muted">
                        <span>USD</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card__header">
                        <span class="stat-card__title">Pending Reservations</span>
                        <div class="stat-card__icon">
                            <i data-lucide="clock" class="icon icon--md"></i>
                        </div>
                    </div>
                    <div class="stat-card__value">${this.stats.pendingReservations}</div>
                    <div class="stat-card__change stat-card__change--muted">
                        <span>${this.stats.totalReservations > 0 ? ((this.stats.pendingReservations / this.stats.totalReservations) * 100).toFixed(1) : 0}% of total</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card__header">
                        <span class="stat-card__title">Conversion Rate</span>
                        <div class="stat-card__icon">
                            <i data-lucide="check-circle" class="icon icon--md"></i>
                        </div>
                    </div>
                    <div class="stat-card__value">${this.stats.conversionRate.toFixed(1)}%</div>
                    <div class="stat-card__change stat-card__change--positive">
                        <i data-lucide="target" class="icon icon--xs"></i>
                        <span>Conversion metric</span>
                    </div>
                </div>
            </div>

            <div class="filters-panel">
                <div class="filters-panel__header">
                    <h3 class="filters-panel__title">
                        <i data-lucide="filter" class="icon icon--sm"></i>
                        Filter Reservations
                    </h3>
                    ${activeFilters.length > 0 ? `
                        <button class="btn btn--ghost btn--sm" id="clear-all-filters">
                            <i data-lucide="x" class="icon icon--xs"></i>
                            Clear All
                        </button>
                    ` : ''}
                </div>

                <div class="filters-panel__controls">
                    <div class="filter-group">
                        <label class="filter-label">Name</label>
                        <input
                            type="text"
                            class="input__field"
                            id="filter-name"
                            placeholder="Search by name..."
                            value="${this.filters.name}"
                        >
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Price Range (USD)</label>
                        <div class="filter-range">
                            <input
                                type="number"
                                class="input__field"
                                id="filter-price-min"
                                placeholder="Min"
                                value="${this.filters.priceMin}"
                            >
                            <span class="filter-range__separator">to</span>
                            <input
                                type="number"
                                class="input__field"
                                id="filter-price-max"
                                placeholder="Max"
                                value="${this.filters.priceMax}"
                            >
                        </div>
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Date Range</label>
                        <div class="filter-range">
                            <input
                                type="date"
                                class="input__field"
                                id="filter-date-from"
                                value="${this.filters.dateFrom}"
                            >
                            <span class="filter-range__separator">to</span>
                            <input
                                type="date"
                                class="input__field"
                                id="filter-date-to"
                                value="${this.filters.dateTo}"
                            >
                        </div>
                    </div>

                    <div class="filter-group">
                        <label class="filter-label">Status</label>
                        <select class="input__field" id="filter-status">
                            <option value="">All statuses</option>
                            <option value="pending" ${this.filters.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="confirmed" ${this.filters.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="cancelled" ${this.filters.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                </div>

                ${activeFilters.length > 0 ? `
                    <div class="filter-chips">
                        ${activeFilters.map(chip => `
                            <div class="filter-chip" data-filter-key="${chip.key}">
                                <span>${Helpers.escapeHtml(chip.label)}</span>
                                <button class="filter-chip__remove" aria-label="Remove filter">
                                    <i data-lucide="x" class="icon icon--xs"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                <div class="filters-panel__results">
                    <span>Showing ${this.filteredReservations.length} of ${this.reservations.length} reservations</span>
                </div>
            </div>

            <div class="reservations-table-container">
                <div class="table-header">
                    <h3 class="table-title">Recent Reservations</h3>
                    <button class="btn btn--ghost btn--sm">
                        <i data-lucide="settings" class="icon icon--sm"></i>
                    </button>
                </div>

                ${this.filteredReservations.length > 0 ? `
                    <div class="table-wrapper">
                        <table class="reservations-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Lot</th>
                                    <th>Price</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${paginatedData.map(reservation => this.renderReservationRow(reservation)).join('')}
                            </tbody>
                        </table>
                    </div>

                    ${totalPages > 1 ? `
                        <div class="table-pagination">
                            <button
                                class="btn btn--outline btn--sm"
                                id="prev-page"
                                ${this.pagination.currentPage === 1 ? 'disabled' : ''}
                            >
                                <i data-lucide="chevron-left" class="icon icon--sm"></i>
                                Previous
                            </button>

                            <div class="pagination-pages">
                                ${this.renderPaginationPages(totalPages)}
                            </div>

                            <button
                                class="btn btn--outline btn--sm"
                                id="next-page"
                                ${this.pagination.currentPage === totalPages ? 'disabled' : ''}
                            >
                                Next
                                <i data-lucide="chevron-right" class="icon icon--sm"></i>
                            </button>
                        </div>
                    ` : ''}
                ` : `
                    <div class="empty-state">
                        <i data-lucide="inbox" class="icon" style="width: 3rem; height: 3rem; margin-bottom: 1rem; color: var(--muted-foreground);"></i>
                        <h3>No reservations found</h3>
                        <p>Try adjusting your filters or check back later</p>
                    </div>
                `}
            </div>
        `;

        container.innerHTML = html;
        lucide.createIcons();
    }

    renderReservationRow(reservation) {
        const lotName = reservation.lot_details?.nombre || 'N/A';
        const lotPrice = reservation.lot_details?.precio_usd || 0;
        const statusClass = this.getStatusClass(reservation.status);

        return `
            <tr data-reservation-id="${reservation.id}">
                <td class="table-cell-name">
                    <div class="cell-content">
                        <span class="cell-primary">${Helpers.escapeHtml(reservation.first_name)} ${Helpers.escapeHtml(reservation.last_name)}</span>
                    </div>
                </td>
                <td>${Helpers.escapeHtml(reservation.email)}</td>
                <td>${Helpers.escapeHtml(reservation.phone || 'N/A')}</td>
                <td><span class="lot-badge">${Helpers.escapeHtml(lotName)}</span></td>
                <td class="table-cell-price">$${this.formatPrice(lotPrice)} USD</td>
                <td>${this.formatDate(reservation.reservation_date)}</td>
                <td>
                    <span class="status-badge ${statusClass}">
                        ${this.capitalizeFirst(reservation.status || 'pending')}
                    </span>
                </td>
                <td class="table-cell-actions">
                    <button class="btn btn--ghost btn--sm" data-action="options" data-id="${reservation.id}">
                        <i data-lucide="more-horizontal" class="icon icon--sm"></i>
                    </button>
                    <button class="btn btn--outline btn--sm" data-action="details" data-id="${reservation.id}">
                        Details
                    </button>
                </td>
            </tr>
        `;
    }

    renderPaginationPages(totalPages) {
        const current = this.pagination.currentPage;
        const pages = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (current <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            } else if (current >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, '...', current - 1, current, current + 1, '...', totalPages);
            }
        }

        return pages.map(page => {
            if (page === '...') {
                return '<span class="pagination-ellipsis">...</span>';
            }
            return `
                <button
                    class="pagination-page ${page === current ? 'active' : ''}"
                    data-page="${page}"
                >
                    ${page}
                </button>
            `;
        }).join('');
    }

    setupEventListeners() {
        const refreshBtn = document.getElementById('refresh-dashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refresh());
        }

        const nameInput = document.getElementById('filter-name');
        if (nameInput) {
            nameInput.addEventListener('input', Helpers.debounce((e) => {
                this.filters.name = e.target.value;
                this.applyFiltersAndRender();
            }, 300));
        }

        const priceMinInput = document.getElementById('filter-price-min');
        if (priceMinInput) {
            priceMinInput.addEventListener('input', Helpers.debounce((e) => {
                this.filters.priceMin = e.target.value;
                this.applyFiltersAndRender();
            }, 300));
        }

        const priceMaxInput = document.getElementById('filter-price-max');
        if (priceMaxInput) {
            priceMaxInput.addEventListener('input', Helpers.debounce((e) => {
                this.filters.priceMax = e.target.value;
                this.applyFiltersAndRender();
            }, 300));
        }

        const dateFromInput = document.getElementById('filter-date-from');
        if (dateFromInput) {
            dateFromInput.addEventListener('change', (e) => {
                this.filters.dateFrom = e.target.value;
                this.applyFiltersAndRender();
            });
        }

        const dateToInput = document.getElementById('filter-date-to');
        if (dateToInput) {
            dateToInput.addEventListener('change', (e) => {
                this.filters.dateTo = e.target.value;
                this.applyFiltersAndRender();
            });
        }

        const statusSelect = document.getElementById('filter-status');
        if (statusSelect) {
            statusSelect.addEventListener('change', (e) => {
                this.filters.status = e.target.value;
                this.applyFiltersAndRender();
            });
        }

        const clearAllBtn = document.getElementById('clear-all-filters');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => this.clearAllFilters());
        }

        const filterChips = document.querySelectorAll('.filter-chip__remove');
        filterChips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                const filterKey = e.currentTarget.closest('.filter-chip').dataset.filterKey;
                this.removeFilter(filterKey);
            });
        });

        const prevPageBtn = document.getElementById('prev-page');
        if (prevPageBtn) {
            prevPageBtn.addEventListener('click', () => this.changePage(this.pagination.currentPage - 1));
        }

        const nextPageBtn = document.getElementById('next-page');
        if (nextPageBtn) {
            nextPageBtn.addEventListener('click', () => this.changePage(this.pagination.currentPage + 1));
        }

        const pageButtons = document.querySelectorAll('.pagination-page');
        pageButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.currentTarget.dataset.page);
                this.changePage(page);
            });
        });

        const detailButtons = document.querySelectorAll('[data-action="details"]');
        detailButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                this.showReservationDetails(id);
            });
        });
    }

    applyFiltersAndRender() {
        this.applyFilters();
        const container = document.getElementById('page-content');
        if (container) {
            this.render(container);
            this.setupEventListeners();
        }
    }

    clearAllFilters() {
        this.filters = {
            name: '',
            priceMin: '',
            priceMax: '',
            dateFrom: '',
            dateTo: '',
            status: ''
        };
        this.applyFiltersAndRender();
    }

    removeFilter(filterKey) {
        switch (filterKey) {
            case 'name':
                this.filters.name = '';
                break;
            case 'price':
                this.filters.priceMin = '';
                this.filters.priceMax = '';
                break;
            case 'date':
                this.filters.dateFrom = '';
                this.filters.dateTo = '';
                break;
            case 'status':
                this.filters.status = '';
                break;
        }
        this.applyFiltersAndRender();
    }

    changePage(page) {
        const totalPages = this.getTotalPages();
        if (page < 1 || page > totalPages) return;

        this.pagination.currentPage = page;
        const container = document.getElementById('page-content');
        if (container) {
            this.render(container);
            this.setupEventListeners();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    showReservationDetails(id) {
        const reservation = this.reservations.find(r => r.id === id);
        if (!reservation) return;

        const lotDetails = reservation.lot_details || {};
        const modal = new Modal({
            title: 'Reservation Details',
            content: `
                <div class="reservation-details">
                    <div class="detail-section">
                        <h4 class="detail-section__title">Client Information</h4>
                        <div class="detail-row">
                            <span class="detail-label">Name:</span>
                            <span class="detail-value">${Helpers.escapeHtml(reservation.first_name)} ${Helpers.escapeHtml(reservation.last_name)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Email:</span>
                            <span class="detail-value">${Helpers.escapeHtml(reservation.email)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Phone:</span>
                            <span class="detail-value">${Helpers.escapeHtml(reservation.phone || 'N/A')}</span>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h4 class="detail-section__title">Lot Information</h4>
                        <div class="detail-row">
                            <span class="detail-label">Lot:</span>
                            <span class="detail-value">${Helpers.escapeHtml(lotDetails.nombre || 'N/A')}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Price:</span>
                            <span class="detail-value">$${this.formatPrice(lotDetails.precio_usd || 0)} USD</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Area:</span>
                            <span class="detail-value">${lotDetails.area_m2 ? `${lotDetails.area_m2} m²` : 'N/A'}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Dimensions:</span>
                            <span class="detail-value">${Helpers.escapeHtml(lotDetails.lados || 'N/A')}</span>
                        </div>
                    </div>

                    <div class="detail-section">
                        <h4 class="detail-section__title">Reservation Details</h4>
                        <div class="detail-row">
                            <span class="detail-label">Status:</span>
                            <span class="status-badge ${this.getStatusClass(reservation.status)}">
                                ${this.capitalizeFirst(reservation.status || 'pending')}
                            </span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Reservation Date:</span>
                            <span class="detail-value">${this.formatDate(reservation.reservation_date)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Created:</span>
                            <span class="detail-value">${this.formatDate(reservation.created_at)}</span>
                        </div>
                        ${reservation.additional_message ? `
                            <div class="detail-row">
                                <span class="detail-label">Message:</span>
                                <span class="detail-value">${Helpers.escapeHtml(reservation.additional_message)}</span>
                            </div>
                        ` : ''}
                    </div>

                    <div class="modal-actions">
                        <button class="btn btn--outline" onclick="this.closest('.modal-container').querySelector('.modal-close').click()">Close</button>
                        <button class="btn btn--primary">Update Status</button>
                    </div>
                </div>
            `,
            size: 'medium'
        });

        modal.open();
    }

    async refresh() {
        try {
            Helpers.toggleLoading(true);
            await this.loadReservations();
            this.calculateStats();
            this.applyFilters();
            const container = document.getElementById('page-content');
            if (container) {
                this.render(container);
                this.setupEventListeners();
            }
            Toast.success('Dashboard refreshed');
        } catch (error) {
            console.error('Error refreshing dashboard:', error);
            Toast.error('Failed to refresh dashboard');
        } finally {
            Helpers.toggleLoading(false);
        }
    }

    formatPrice(amount) {
        return amount.toLocaleString('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        });
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    formatDateShort(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        return `${day}/${month}`;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    getStatusClass(status) {
        switch (status) {
            case 'pending':
                return 'status-badge--pending';
            case 'confirmed':
                return 'status-badge--confirmed';
            case 'cancelled':
                return 'status-badge--cancelled';
            default:
                return 'status-badge--pending';
        }
    }

    renderError(container) {
        container.innerHTML = `
            <div class="alert alert--error">
                <div class="alert__content">
                    <div class="alert__title">Error Loading Dashboard</div>
                    <div class="alert__description">Failed to load reservation data. Please check your Supabase connection and try again.</div>
                </div>
            </div>
        `;
    }

    destroy() {
    }
}

const dashboardController = new DashboardController();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = dashboardController;
}

window.dashboardController = dashboardController;
