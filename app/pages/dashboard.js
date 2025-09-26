/**
 * Dashboard Page Controller for Real Estate SaaS
 * Handles dashboard functionality, stats, charts, and recent activities
 */

class DashboardController {
    constructor() {
        this.stats = null;
        this.chartInstances = {};
        this.refreshInterval = null;
    }

    async load(container, data = {}) {
        try {
            await this.loadStats();
            this.render(container);
            this.setupEventListeners();
            this.startAutoRefresh();
        } catch (error) {
            console.error('Error loading dashboard:', error);
            this.renderError(container);
        }
    }

    async loadStats() {
        try {
            // Mock API call - replace with actual API
            this.stats = {
                totalProperties: 245,
                activeListings: 189,
                totalClients: 156,
                monthlyRevenue: 125000,
                recentActivity: [
                    {
                        id: 1,
                        type: 'property_added',
                        title: 'New property listed',
                        description: '123 Oak Street has been added to listings',
                        time: '5 minutes ago',
                        icon: 'plus-circle'
                    },
                    {
                        id: 2,
                        type: 'client_inquiry',
                        title: 'Client inquiry received',
                        description: 'John Smith is interested in 456 Pine Avenue',
                        time: '15 minutes ago',
                        icon: 'message-circle'
                    },
                    {
                        id: 3,
                        type: 'property_sold',
                        title: 'Property sold',
                        description: '789 Maple Drive has been sold for $450,000',
                        time: '2 hours ago',
                        icon: 'check-circle'
                    },
                    {
                        id: 4,
                        type: 'meeting_scheduled',
                        title: 'Meeting scheduled',
                        description: 'Client meeting set for tomorrow at 2:00 PM',
                        time: '4 hours ago',
                        icon: 'calendar'
                    }
                ],
                chartData: {
                    sales: {
                        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                        data: [45000, 52000, 48000, 61000, 55000, 67000]
                    },
                    properties: {
                        available: 189,
                        sold: 34,
                        pending: 22
                    }
                }
            };
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            throw error;
        }
    }

    render(container) {
        const html = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Dashboard</h1>
                    <p class="page-description">Welcome back! Here's what's happening with your real estate business.</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn--outline" id="refresh-dashboard">
                        <i data-lucide="refresh-cw" class="icon icon--sm"></i>
                        Refresh
                    </button>
                    <button class="btn btn--primary" id="quick-add-property">
                        <i data-lucide="plus" class="icon icon--sm"></i>
                        Add Property
                    </button>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="dashboard-stats">
                <div class="stat-card">
                    <div class="stat-card__header">
                        <span class="stat-card__title">Total Properties</span>
                        <div class="stat-card__icon">
                            <i data-lucide="building" class="icon icon--md"></i>
                        </div>
                    </div>
                    <div class="stat-card__value">${Helpers.formatNumber(this.stats.totalProperties)}</div>
                    <div class="stat-card__change stat-card__change--positive">
                        <i data-lucide="trending-up" class="icon icon--xs"></i>
                        <span>+12% from last month</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card__header">
                        <span class="stat-card__title">Active Listings</span>
                        <div class="stat-card__icon">
                            <i data-lucide="eye" class="icon icon--md"></i>
                        </div>
                    </div>
                    <div class="stat-card__value">${Helpers.formatNumber(this.stats.activeListings)}</div>
                    <div class="stat-card__change stat-card__change--positive">
                        <i data-lucide="trending-up" class="icon icon--xs"></i>
                        <span>+8% from last month</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card__header">
                        <span class="stat-card__title">Total Clients</span>
                        <div class="stat-card__icon">
                            <i data-lucide="users" class="icon icon--md"></i>
                        </div>
                    </div>
                    <div class="stat-card__value">${Helpers.formatNumber(this.stats.totalClients)}</div>
                    <div class="stat-card__change stat-card__change--positive">
                        <i data-lucide="trending-up" class="icon icon--xs"></i>
                        <span>+15% from last month</span>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card__header">
                        <span class="stat-card__title">Monthly Revenue</span>
                        <div class="stat-card__icon">
                            <i data-lucide="dollar-sign" class="icon icon--md"></i>
                        </div>
                    </div>
                    <div class="stat-card__value">${Helpers.formatCurrency(this.stats.monthlyRevenue)}</div>
                    <div class="stat-card__change stat-card__change--positive">
                        <i data-lucide="trending-up" class="icon icon--xs"></i>
                        <span>+23% from last month</span>
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="dashboard-charts">
                <div class="chart-container">
                    <h3 class="chart-title">Sales Performance</h3>
                    <div class="chart-placeholder" id="sales-chart">
                        <i data-lucide="bar-chart-3" class="icon" style="width: 3rem; height: 3rem; margin-bottom: 1rem;"></i>
                        <p>Sales chart will be rendered here</p>
                        <p style="font-size: 0.875rem; color: var(--muted-foreground);">Integration with Chart.js or similar charting library needed</p>
                    </div>
                </div>

                <div class="chart-container">
                    <h3 class="chart-title">Property Status</h3>
                    <div class="property-status-chart">
                        <div class="status-item">
                            <div class="status-indicator" style="background-color: var(--primary);"></div>
                            <div class="status-info">
                                <span class="status-label">Available</span>
                                <span class="status-value">${this.stats.chartData.properties.available}</span>
                            </div>
                        </div>
                        <div class="status-item">
                            <div class="status-indicator" style="background-color: #f59e0b;"></div>
                            <div class="status-info">
                                <span class="status-label">Pending</span>
                                <span class="status-value">${this.stats.chartData.properties.pending}</span>
                            </div>
                        </div>
                        <div class="status-item">
                            <div class="status-indicator" style="background-color: #10b981;"></div>
                            <div class="status-info">
                                <span class="status-label">Sold</span>
                                <span class="status-value">${this.stats.chartData.properties.sold}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Recent Activities -->
            <div class="recent-activities">
                <div class="card__header">
                    <h3 class="card__title">Recent Activities</h3>
                    <div class="card__actions">
                        <button class="btn btn--ghost btn--sm">
                            <i data-lucide="more-horizontal" class="icon icon--sm"></i>
                        </button>
                    </div>
                </div>
                <div class="card__content">
                    <ul class="activity-list">
                        ${this.stats.recentActivity.map(activity => `
                            <li class="activity-item">
                                <div class="activity-icon">
                                    <i data-lucide="${activity.icon}" class="icon icon--sm"></i>
                                </div>
                                <div class="activity-content">
                                    <div class="activity-title">${Helpers.escapeHtml(activity.title)}</div>
                                    <div class="activity-description">${Helpers.escapeHtml(activity.description)}</div>
                                    <div class="activity-time">${activity.time}</div>
                                </div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                <div class="card__footer">
                    <button class="btn btn--outline btn--sm">
                        View All Activities
                    </button>
                </div>
            </div>

            <!-- Quick Actions -->
            <div class="quick-actions" style="margin-top: 2rem;">
                <h3 style="margin-bottom: 1rem; color: var(--foreground);">Quick Actions</h3>
                <div class="grid grid--cols-4 grid--gap-4">
                    <button class="quick-action-card" data-action="add-property">
                        <i data-lucide="plus-circle" class="icon icon--lg"></i>
                        <span>Add Property</span>
                    </button>
                    <button class="quick-action-card" data-action="add-client">
                        <i data-lucide="user-plus" class="icon icon--lg"></i>
                        <span>Add Client</span>
                    </button>
                    <button class="quick-action-card" data-action="schedule-meeting">
                        <i data-lucide="calendar-plus" class="icon icon--lg"></i>
                        <span>Schedule Meeting</span>
                    </button>
                    <button class="quick-action-card" data-action="generate-report">
                        <i data-lucide="file-text" class="icon icon--lg"></i>
                        <span>Generate Report</span>
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.addDashboardStyles();
    }

    addDashboardStyles() {
        if (document.getElementById('dashboard-styles')) return;

        const style = document.createElement('style');
        style.id = 'dashboard-styles';
        style.textContent = `
            .property-status-chart {
                padding: 1rem;
            }
            
            .status-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0.75rem 0;
            }
            
            .status-indicator {
                width: 1rem;
                height: 1rem;
                border-radius: 50%;
            }
            
            .status-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex: 1;
            }
            
            .status-label {
                font-size: 0.875rem;
                color: var(--foreground);
            }
            
            .status-value {
                font-weight: 600;
                color: var(--foreground);
            }
            
            .quick-action-card {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.75rem;
                padding: 1.5rem 1rem;
                background: var(--card);
                border: 1px solid var(--border);
                border-radius: var(--radius);
                cursor: pointer;
                transition: all 0.2s ease;
                color: var(--foreground);
                text-decoration: none;
            }
            
            .quick-action-card:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-md);
                border-color: var(--primary);
            }
            
            .quick-action-card span {
                font-size: 0.875rem;
                font-weight: 500;
                text-align: center;
            }
            
            @media (max-width: 768px) {
                .quick-actions .grid--cols-4 {
                    grid-template-columns: repeat(2, 1fr);
                }
            }
            
            @media (max-width: 480px) {
                .quick-actions .grid--cols-4 {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('refresh-dashboard');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refresh());
        }

        // Quick add property button
        const quickAddBtn = document.getElementById('quick-add-property');
        if (quickAddBtn) {
            quickAddBtn.addEventListener('click', () => {
                if (window.headerController) {
                    window.headerController.openAddPropertyModal();
                }
            });
        }

        // Quick action cards
        const quickActionCards = document.querySelectorAll('[data-action]');
        quickActionCards.forEach(card => {
            card.addEventListener('click', () => {
                const action = card.dataset.action;
                this.handleQuickAction(action);
            });
        });

        // Activity items (could navigate to detailed view)
        const activityItems = document.querySelectorAll('.activity-item');
        activityItems.forEach(item => {
            item.addEventListener('click', () => {
                // Navigate to detailed view of the activity
                console.log('Activity clicked:', item);
            });
        });
    }

    handleQuickAction(action) {
        switch (action) {
            case 'add-property':
                if (window.headerController) {
                    window.headerController.openAddPropertyModal();
                }
                break;
            case 'add-client':
                router.navigate('/clients/new');
                break;
            case 'schedule-meeting':
                this.openScheduleMeetingModal();
                break;
            case 'generate-report':
                router.navigate('/reports');
                break;
            default:
                console.log('Unknown action:', action);
        }
    }

    openScheduleMeetingModal() {
        const modal = new Modal({
            title: 'Schedule Meeting',
            content: `
                <form id="schedule-meeting-form">
                    <div class="form-group">
                        <label class="form-label">Client</label>
                        <select class="input__field" name="client" required>
                            <option value="">Select client...</option>
                            <option value="1">John Smith</option>
                            <option value="2">Jane Doe</option>
                            <option value="3">Mike Johnson</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Meeting Type</label>
                        <select class="input__field" name="type" required>
                            <option value="">Select type...</option>
                            <option value="property_viewing">Property Viewing</option>
                            <option value="consultation">Consultation</option>
                            <option value="contract_signing">Contract Signing</option>
                            <option value="follow_up">Follow Up</option>
                        </select>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Date</label>
                            <input type="date" class="input__field" name="date" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Time</label>
                            <input type="time" class="input__field" name="time" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Notes</label>
                        <textarea class="textarea" name="notes" placeholder="Meeting notes or agenda..." rows="3"></textarea>
                    </div>
                    <div class="flex" style="gap: 0.5rem; justify-content: flex-end; margin-top: 1.5rem;">
                        <button type="button" class="btn btn--outline" onclick="this.closest('.modal-container').querySelector('.modal-close').click()">Cancel</button>
                        <button type="submit" class="btn btn--primary">Schedule Meeting</button>
                    </div>
                </form>
            `,
            size: 'medium'
        });

        modal.open();

        // Handle form submission
        const form = document.getElementById('schedule-meeting-form');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                try {
                    const formData = new FormData(form);
                    const meetingData = Object.fromEntries(formData);
                    
                    console.log('Scheduling meeting:', meetingData);
                    
                    Toast.success('Meeting scheduled successfully!');
                    modal.close();
                    
                    // Refresh dashboard to show new activity
                    this.refresh();
                } catch (error) {
                    console.error('Error scheduling meeting:', error);
                    Toast.error('Failed to schedule meeting. Please try again.');
                }
            });
        }
    }

    async refresh() {
        try {
            Helpers.toggleLoading(true);
            await this.loadStats();
            
            // Update stat values
            this.updateStatCards();
            
            Toast.success('Dashboard refreshed');
        } catch (error) {
            console.error('Error refreshing dashboard:', error);
            Toast.error('Failed to refresh dashboard');
        } finally {
            Helpers.toggleLoading(false);
        }
    }

    updateStatCards() {
        const statCards = document.querySelectorAll('.stat-card__value');
        if (statCards.length >= 4) {
            statCards[0].textContent = Helpers.formatNumber(this.stats.totalProperties);
            statCards[1].textContent = Helpers.formatNumber(this.stats.activeListings);
            statCards[2].textContent = Helpers.formatNumber(this.stats.totalClients);
            statCards[3].textContent = Helpers.formatCurrency(this.stats.monthlyRevenue);
        }
    }

    startAutoRefresh() {
        // Refresh every 5 minutes
        this.refreshInterval = setInterval(() => {
            this.refresh();
        }, 5 * 60 * 1000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    renderError(container) {
        container.innerHTML = `
            <div class="alert alert--error">
                <div class="alert__content">
                    <div class="alert__title">Error Loading Dashboard</div>
                    <div class="alert__description">Failed to load dashboard data. Please try refreshing the page.</div>
                </div>
            </div>
        `;
    }

    destroy() {
        this.stopAutoRefresh();
        
        // Cleanup chart instances if using a charting library
        Object.values(this.chartInstances).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.chartInstances = {};
    }
}

// Create and export dashboard controller
const dashboardController = new DashboardController();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = dashboardController;
}

// Make available globally
window.dashboardController = dashboardController;