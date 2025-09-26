# 📄 Adding a New Page Tutorial

Learn how to add a complete new page to the Real Estate SaaS platform. In this tutorial, we'll create a "Reports" page that displays various business analytics and reports.

**What you'll learn:**
- Complete page creation workflow
- How to integrate with the routing system
- How to add navigation links
- How to structure page data and UI
- How to follow established patterns

**Estimated time:** 45-60 minutes

## 🎯 Tutorial Overview

We'll build a Reports page with these features:
- 📊 Multiple report types (Sales, Properties, Clients)
- 📅 Date range filtering
- 📱 Responsive design
- 🎨 Professional charts and data visualization
- 📥 Export functionality

## 📋 Step 1: Planning the Page

Before we start coding, let's plan what we need:

### Files to Create/Modify
```
├── pages/reports.js              # Main page controller (NEW)
├── components/sidebar.html       # Add reports navigation link
├── utils/router.js              # Add reports route
├── index.html                   # Include reports script
└── assets/css/pages.css         # Add report-specific styles
```

### Page Structure
```
Reports Page
├── Header (title, description, actions)
├── Filters (date range, report type)
├── Summary Cards (key metrics)
├── Chart Section (visual data)
├── Data Table (detailed information)
└── Export Options
```

## 🧭 Step 2: Add Navigation Link

Let's start by adding the Reports link to the sidebar navigation.

### Update Sidebar Template

Open `components/sidebar.html` and add the reports link:

```html
<!-- Find the navigation section and add this after "Analytics" -->
<li class="nav-item">
    <a href="#analytics" class="nav-link" data-route="analytics">
        <i data-lucide="bar-chart-3" class="nav-link__icon"></i>
        Analytics
    </a>
</li>
<!-- ADD THIS NEW ITEM -->
<li class="nav-item">
    <a href="#reports" class="nav-link" data-route="reports">
        <i data-lucide="file-text" class="nav-link__icon"></i>
        Reports
    </a>
</li>
<!-- Continue with existing items -->
<li class="nav-item">
    <a href="#settings" class="nav-link" data-route="settings">
        <i data-lucide="settings" class="nav-link__icon"></i>
        Settings
    </a>
</li>
```

## 🔄 Step 3: Add Route Configuration

Open `utils/router.js` and add the reports route:

```javascript
// Find the route definitions and add this route
router
    .addRoute('/analytics', async (context) => {
        await loadPage('analytics');
        updateNavigation('analytics');
    })
    // ADD THIS NEW ROUTE
    .addRoute('/reports', async (context) => {
        await loadPage('reports');
        updateNavigation('reports');
    })
    .addRoute('/settings', async (context) => {
        await loadPage('settings');
        updateNavigation('settings');
    });
```

## 📄 Step 4: Create the Reports Page Controller

Create a new file `pages/reports.js`:

```javascript
/**
 * Reports Page Controller for Real Estate SaaS
 * Handles business analytics and reporting functionality
 */

class ReportsController {
    constructor() {
        this.reportData = null;
        this.currentFilters = {
            dateRange: '30d',
            reportType: 'overview'
        };
        this.isLoading = false;
    }

    async load(container, data = {}) {
        try {
            this.isLoading = true;
            await this.loadReportData();
            this.render(container);
            this.setupEventListeners();
        } catch (error) {
            console.error('Error loading reports:', error);
            this.renderError(container);
        } finally {
            this.isLoading = false;
        }
    }

    async loadReportData() {
        try {
            // Simulate API call - replace with actual API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            this.reportData = {
                summary: {
                    totalSales: 2450000,
                    totalProperties: 245,
                    totalClients: 156,
                    avgDealSize: 485000,
                    salesGrowth: 12.5,
                    propertyGrowth: 8.3,
                    clientGrowth: 15.7
                },
                salesByMonth: [
                    { month: 'Jan', sales: 185000, deals: 4 },
                    { month: 'Feb', sales: 220000, deals: 5 },
                    { month: 'Mar', sales: 195000, deals: 4 },
                    { month: 'Apr', sales: 285000, deals: 6 },
                    { month: 'May', sales: 325000, deals: 7 },
                    { month: 'Jun', sales: 410000, deals: 8 }
                ],
                topPerformers: [
                    { name: 'John Smith', sales: 850000, deals: 18 },
                    { name: 'Jane Doe', sales: 720000, deals: 15 },
                    { name: 'Mike Johnson', sales: 680000, deals: 14 },
                    { name: 'Sarah Wilson', sales: 610000, deals: 12 }
                ],
                propertyTypes: [
                    { type: 'House', count: 125, percentage: 51 },
                    { type: 'Condo', count: 65, percentage: 27 },
                    { type: 'Apartment', count: 35, percentage: 14 },
                    { type: 'Land', count: 20, percentage: 8 }
                ]
            };
        } catch (error) {
            console.error('Error fetching report data:', error);
            throw error;
        }
    }

    render(container) {
        const html = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Reports & Analytics</h1>
                    <p class="page-description">Comprehensive business insights and performance analytics</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn--outline" id="export-report">
                        <i data-lucide="download" class="icon icon--sm"></i>
                        Export Report
                    </button>
                    <button class="btn btn--primary" id="schedule-report">
                        <i data-lucide="calendar" class="icon icon--sm"></i>
                        Schedule Report
                    </button>
                </div>
            </div>

            <!-- Report Filters -->
            <div class="report-filters">
                <div class="filter-row">
                    <div class="filter-group">
                        <label class="filter-label">Report Type</label>
                        <select class="input__field" id="report-type-filter">
                            <option value="overview">Business Overview</option>
                            <option value="sales">Sales Performance</option>
                            <option value="properties">Property Analytics</option>
                            <option value="agents">Agent Performance</option>
                            <option value="clients">Client Insights</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Date Range</label>
                        <select class="input__field" id="date-range-filter">
                            <option value="7d">Last 7 Days</option>
                            <option value="30d" selected>Last 30 Days</option>
                            <option value="90d">Last 3 Months</option>
                            <option value="1y">Last Year</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label class="filter-label">Compare To</label>
                        <select class="input__field" id="compare-filter">
                            <option value="none">No Comparison</option>
                            <option value="previous">Previous Period</option>
                            <option value="last-year">Same Period Last Year</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Summary Cards -->
            <div class="report-summary">
                <div class="summary-card">
                    <div class="summary-card__header">
                        <h3 class="summary-card__title">Total Sales</h3>
                        <i data-lucide="dollar-sign" class="summary-card__icon"></i>
                    </div>
                    <div class="summary-card__value">${Helpers.formatCurrency(this.reportData.summary.totalSales)}</div>
                    <div class="summary-card__change summary-card__change--positive">
                        <i data-lucide="trending-up" class="icon icon--xs"></i>
                        +${this.reportData.summary.salesGrowth}% vs last period
                    </div>
                </div>

                <div class="summary-card">
                    <div class="summary-card__header">
                        <h3 class="summary-card__title">Properties Sold</h3>
                        <i data-lucide="home" class="summary-card__icon"></i>
                    </div>
                    <div class="summary-card__value">${Helpers.formatNumber(this.reportData.summary.totalProperties)}</div>
                    <div class="summary-card__change summary-card__change--positive">
                        <i data-lucide="trending-up" class="icon icon--xs"></i>
                        +${this.reportData.summary.propertyGrowth}% vs last period
                    </div>
                </div>

                <div class="summary-card">
                    <div class="summary-card__header">
                        <h3 class="summary-card__title">Active Clients</h3>
                        <i data-lucide="users" class="summary-card__icon"></i>
                    </div>
                    <div class="summary-card__value">${Helpers.formatNumber(this.reportData.summary.totalClients)}</div>
                    <div class="summary-card__change summary-card__change--positive">
                        <i data-lucide="trending-up" class="icon icon--xs"></i>
                        +${this.reportData.summary.clientGrowth}% vs last period
                    </div>
                </div>

                <div class="summary-card">
                    <div class="summary-card__header">
                        <h3 class="summary-card__title">Avg Deal Size</h3>
                        <i data-lucide="trending-up" class="summary-card__icon"></i>
                    </div>
                    <div class="summary-card__value">${Helpers.formatCurrency(this.reportData.summary.avgDealSize)}</div>
                    <div class="summary-card__change summary-card__change--positive">
                        <i data-lucide="trending-up" class="icon icon--xs"></i>
                        +8.2% vs last period
                    </div>
                </div>
            </div>

            <!-- Charts Section -->
            <div class="report-charts">
                <div class="chart-container chart-container--large">
                    <div class="chart-header">
                        <h3 class="chart-title">Sales Performance</h3>
                        <div class="chart-actions">
                            <button class="btn btn--ghost btn--sm">
                                <i data-lucide="download" class="icon icon--xs"></i>
                            </button>
                        </div>
                    </div>
                    <div class="chart-content">
                        ${this.renderSalesChart()}
                    </div>
                </div>

                <div class="chart-container">
                    <div class="chart-header">
                        <h3 class="chart-title">Property Types</h3>
                    </div>
                    <div class="chart-content">
                        ${this.renderPropertyTypesChart()}
                    </div>
                </div>
            </div>

            <!-- Data Tables -->
            <div class="report-tables">
                <div class="table-container">
                    <div class="table-header">
                        <h3 class="table-title">Top Performing Agents</h3>
                        <button class="btn btn--outline btn--sm">
                            <i data-lucide="external-link" class="icon icon--xs"></i>
                            View All
                        </button>
                    </div>
                    <div class="table-content">
                        ${this.renderTopPerformersTable()}
                    </div>
                </div>
            </div>

            <!-- Export Options Modal Placeholder -->
            <div id="export-modal-placeholder"></div>
        `;

        container.innerHTML = html;
    }

    renderSalesChart() {
        // Simple bar chart representation - in a real app, you'd use Chart.js or similar
        const maxSales = Math.max(...this.reportData.salesByMonth.map(item => item.sales));
        
        return `
            <div class="simple-chart">
                ${this.reportData.salesByMonth.map(item => {
                    const height = (item.sales / maxSales) * 200;
                    return `
                        <div class="chart-bar-group">
                            <div class="chart-bar" style="height: ${height}px;" title="${item.month}: ${Helpers.formatCurrency(item.sales)}">
                                <div class="chart-bar-value">${Helpers.formatCurrency(item.sales)}</div>
                            </div>
                            <div class="chart-bar-label">${item.month}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderPropertyTypesChart() {
        return `
            <div class="pie-chart-legend">
                ${this.reportData.propertyTypes.map(type => `
                    <div class="legend-item">
                        <div class="legend-color" style="background-color: var(--chart-${this.reportData.propertyTypes.indexOf(type) + 1});"></div>
                        <div class="legend-label">
                            <span class="legend-name">${type.type}</span>
                            <span class="legend-value">${type.count} (${type.percentage}%)</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderTopPerformersTable() {
        return `
            <table class="table">
                <thead class="table__header">
                    <tr>
                        <th class="table__header-cell">Agent</th>
                        <th class="table__header-cell">Total Sales</th>
                        <th class="table__header-cell">Deals Closed</th>
                        <th class="table__header-cell">Avg Deal Size</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.reportData.topPerformers.map(agent => `
                        <tr class="table__row">
                            <td class="table__cell">
                                <div class="agent-info">
                                    <div class="agent-avatar">
                                        ${agent.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <span class="agent-name">${agent.name}</span>
                                </div>
                            </td>
                            <td class="table__cell">${Helpers.formatCurrency(agent.sales)}</td>
                            <td class="table__cell">${agent.deals}</td>
                            <td class="table__cell">${Helpers.formatCurrency(agent.sales / agent.deals)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    setupEventListeners() {
        // Filter change handlers
        document.getElementById('report-type-filter')?.addEventListener('change', (e) => {
            this.updateFilter('reportType', e.target.value);
        });

        document.getElementById('date-range-filter')?.addEventListener('change', (e) => {
            this.updateFilter('dateRange', e.target.value);
        });

        // Export report button
        document.getElementById('export-report')?.addEventListener('click', () => {
            this.showExportModal();
        });

        // Schedule report button
        document.getElementById('schedule-report')?.addEventListener('click', () => {
            this.showScheduleModal();
        });

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    updateFilter(filterType, value) {
        this.currentFilters[filterType] = value;
        console.log('Filter updated:', filterType, value);
        
        // In a real app, you would:
        // 1. Show loading state
        // 2. Fetch new data based on filters
        // 3. Re-render the page content
        
        Toast.info(`Report updated for ${filterType}: ${value}`);
    }

    showExportModal() {
        const modal = new Modal({
            title: 'Export Report',
            content: `
                <form id="export-form">
                    <div class="form-group">
                        <label class="form-label">Export Format</label>
                        <select class="input__field" name="format" required>
                            <option value="pdf">PDF Document</option>
                            <option value="excel">Excel Spreadsheet</option>
                            <option value="csv">CSV Data</option>
                            <option value="powerpoint">PowerPoint Presentation</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Include Sections</label>
                        <div class="checkbox-group">
                            <label class="checkbox-item">
                                <input type="checkbox" name="sections" value="summary" checked>
                                <span>Summary Cards</span>
                            </label>
                            <label class="checkbox-item">
                                <input type="checkbox" name="sections" value="charts" checked>
                                <span>Charts & Graphs</span>
                            </label>
                            <label class="checkbox-item">
                                <input type="checkbox" name="sections" value="tables" checked>
                                <span>Data Tables</span>
                            </label>
                            <label class="checkbox-item">
                                <input type="checkbox" name="sections" value="raw-data">
                                <span>Raw Data</span>
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email To (Optional)</label>
                        <input type="email" class="input__field" name="email" placeholder="Send report via email">
                    </div>
                    <div class="flex" style="gap: 0.5rem; justify-content: flex-end; margin-top: 1.5rem;">
                        <button type="button" class="btn btn--outline" onclick="this.closest('.modal-container').querySelector('.modal-close').click()">Cancel</button>
                        <button type="submit" class="btn btn--primary">Export Report</button>
                    </div>
                </form>
            `,
            size: 'medium'
        });

        modal.open();

        // Handle export form submission
        document.getElementById('export-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const exportData = Object.fromEntries(formData);
            
            console.log('Exporting report:', exportData);
            Toast.success('Report export started! You will receive an email when ready.');
            modal.close();
        });
    }

    showScheduleModal() {
        const modal = new Modal({
            title: 'Schedule Report',
            content: `
                <form id="schedule-form">
                    <div class="form-group">
                        <label class="form-label">Report Frequency</label>
                        <select class="input__field" name="frequency" required>
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Email Recipients</label>
                        <textarea class="textarea" name="recipients" placeholder="Enter email addresses, separated by commas" rows="3"></textarea>
                        <div class="form-help">Add multiple email addresses separated by commas</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Start Date</label>
                        <input type="date" class="input__field" name="startDate" required>
                    </div>
                    <div class="flex" style="gap: 0.5rem; justify-content: flex-end; margin-top: 1.5rem;">
                        <button type="button" class="btn btn--outline" onclick="this.closest('.modal-container').querySelector('.modal-close').click()">Cancel</button>
                        <button type="submit" class="btn btn--primary">Schedule Report</button>
                    </div>
                </form>
            `,
            size: 'medium'
        });

        modal.open();

        // Handle schedule form submission
        document.getElementById('schedule-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const scheduleData = Object.fromEntries(formData);
            
            console.log('Scheduling report:', scheduleData);
            Toast.success('Report scheduled successfully!');
            modal.close();
        });
    }

    renderError(container) {
        container.innerHTML = `
            <div class="alert alert--error">
                <div class="alert__content">
                    <div class="alert__title">Error Loading Reports</div>
                    <div class="alert__description">Failed to load report data. Please try refreshing the page.</div>
                </div>
            </div>
        `;
    }

    destroy() {
        // Cleanup any intervals or event listeners
    }
}

// Create and export reports controller
const reportsController = new ReportsController();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = reportsController;
}

// Make available globally
window.reportsController = reportsController;
```

## 🎨 Step 5: Add Report-Specific Styles

Open `assets/css/pages.css` and add the report styles at the end:

```css
/* Reports Page Styles */
.report-filters {
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: var(--shadow-sm);
}

.filter-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.filter-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--foreground);
}

/* Summary Cards */
.report-summary {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.summary-card {
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.5rem;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
}

.summary-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.summary-card__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.summary-card__title {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--muted-foreground);
    text-transform: uppercase;
    letter-spacing: 0.025em;
    margin: 0;
}

.summary-card__icon {
    width: 2rem;
    height: 2rem;
    padding: 0.5rem;
    background-color: var(--primary);
    color: var(--primary-foreground);
    border-radius: var(--radius);
}

.summary-card__value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--foreground);
    margin-bottom: 0.5rem;
    line-height: 1;
}

.summary-card__change {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
}

.summary-card__change--positive {
    color: #10b981;
}

.summary-card__change--negative {
    color: var(--destructive);
}

/* Charts Section */
.report-charts {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.chart-container {
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 1.5rem;
    box-shadow: var(--shadow-sm);
}

.chart-container--large {
    grid-column: span 1;
}

.chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
}

.chart-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    color: var(--foreground);
}

.chart-actions {
    display: flex;
    gap: 0.5rem;
}

/* Simple Chart Styles */
.simple-chart {
    display: flex;
    align-items: flex-end;
    gap: 1rem;
    height: 300px;
    padding: 1rem 0;
}

.chart-bar-group {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.chart-bar {
    width: 100%;
    max-width: 60px;
    background: linear-gradient(135deg, var(--primary), var(--chart-2));
    border-radius: var(--radius-sm) var(--radius-sm) 0 0;
    position: relative;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
}

.chart-bar:hover {
    opacity: 0.8;
    transform: translateY(-2px);
}

.chart-bar-value {
    color: var(--primary-foreground);
    font-size: 0.75rem;
    font-weight: 600;
    text-align: center;
    transform: rotate(-45deg);
    white-space: nowrap;
}

.chart-bar-label {
    font-size: 0.875rem;
    color: var(--muted-foreground);
    text-align: center;
}

/* Pie Chart Legend */
.pie-chart-legend {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 0;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.legend-color {
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    flex-shrink: 0;
}

.legend-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
}

.legend-name {
    font-weight: 500;
    color: var(--foreground);
}

.legend-value {
    font-size: 0.875rem;
    color: var(--muted-foreground);
}

/* Data Tables */
.report-tables {
    display: grid;
    gap: 2rem;
}

.table-container {
    background-color: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
}

.table-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border);
    background-color: var(--muted);
}

.table-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin: 0;
    color: var(--foreground);
}

.table-content {
    overflow-x: auto;
}

.agent-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.agent-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background-color: var(--primary);
    color: var(--primary-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    flex-shrink: 0;
}

.agent-name {
    font-weight: 500;
    color: var(--foreground);
}

/* Form Styles for Modals */
.checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.checkbox-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.checkbox-item input[type="checkbox"] {
    width: 1rem;
    height: 1rem;
    accent-color: var(--primary);
}

/* Responsive Design */
@media (max-width: 1024px) {
    .report-charts {
        grid-template-columns: 1fr;
    }
    
    .chart-container--large {
        grid-column: span 1;
    }
}

@media (max-width: 768px) {
    .report-summary {
        grid-template-columns: repeat(2, 1fr);
    }
    
    .filter-row {
        grid-template-columns: 1fr;
    }
    
    .simple-chart {
        height: 200px;
        gap: 0.5rem;
    }
    
    .chart-bar-value {
        font-size: 0.625rem;
    }
    
    .summary-card__value {
        font-size: 1.5rem;
    }
}

@media (max-width: 480px) {
    .report-summary {
        grid-template-columns: 1fr;
    }
    
    .summary-card {
        padding: 1rem;
    }
    
    .chart-container {
        padding: 1rem;
    }
}
```

## 📜 Step 6: Include the Reports Script

Open `index.html` and add the reports script after the other page scripts:

```html
<!-- Find this section in index.html -->
<!-- Page Controllers -->
<script src="pages/dashboard.js"></script>
<script src="pages/properties.js"></script>
<script src="pages/clients.js"></script>
<script src="pages/agents.js"></script>
<script src="pages/favorites.js"></script>
<!-- ADD THIS LINE -->
<script src="pages/reports.js"></script>
```

## 🧪 Step 7: Test Your New Page

### 1. Restart Your Development Server
```bash
# Stop the current server (Ctrl+C)
# Restart it
cd app
python -m http.server 8000
```

### 2. Test Navigation
1. **Click "Reports" in the sidebar** - Should navigate to the reports page
2. **Check the URL** - Should show `#reports`
3. **Verify page loads** - Should see report content and charts

### 3. Test Functionality
1. **Try filter dropdowns** - Should show toast notifications
2. **Click "Export Report"** - Should open export modal
3. **Click "Schedule Report"** - Should open schedule modal
4. **Test responsive design** - Resize browser window

### 4. Verify Integration
1. **Navigation highlighting** - Reports link should be active
2. **Icons display** - All Lucide icons should render
3. **Responsive behavior** - Should work on mobile sizes

## 🎉 Congratulations!

You've successfully created a complete new page! Here's what you accomplished:

✅ **Added navigation** - Reports link in sidebar with proper routing  
✅ **Created page controller** - Complete reports page with data and interactions  
✅ **Added professional styling** - Charts, cards, and responsive design  
✅ **Implemented modals** - Export and schedule functionality  
✅ **Followed patterns** - Used established architectural patterns  
✅ **Added responsive design** - Works on all screen sizes  

## 🚀 What You Learned

### Page Creation Workflow
1. **Plan the page structure** - Define layout and features
2. **Add navigation link** - Update sidebar template
3. **Add route configuration** - Update router system
4. **Create page controller** - Build main functionality
5. **Add page-specific styles** - Create beautiful UI
6. **Include script** - Add to main HTML file
7. **Test thoroughly** - Verify all functionality

### Advanced Patterns Used
- **Data visualization** - Simple charts and graphs
- **Modal integration** - Export and scheduling modals
- **Filter systems** - Dynamic content filtering
- **Responsive design** - Mobile-first approach
- **Error handling** - Graceful error states

## 🔄 Next Steps

### Enhance Your Page
Try these improvements:

1. **Real chart integration** - Add Chart.js or D3.js for interactive charts
2. **Advanced filtering** - Add date pickers and custom ranges
3. **Real-time updates** - Add WebSocket integration for live data
4. **Print styles** - Add CSS for printing reports

### Add More Pages
Apply what you learned to create:
- **Settings page** - User preferences and configuration
- **Help/Support page** - Documentation and contact forms
- **Profile page** - User account management
- **Notifications page** - System alerts and messages

### Advanced Features
- **Data export** - Implement real CSV/PDF export
- **Email integration** - Send reports via email
- **Scheduled tasks** - Background report generation
- **Real-time dashboard** - Live updating charts

## 💡 Pro Tips for Page Development

### Best Practices You Used
- ✅ **Consistent structure** - Followed established page controller pattern
- ✅ **Modular CSS** - Added styles to the appropriate CSS file
- ✅ **Responsive design** - Works on all screen sizes
- ✅ **Accessibility** - Proper semantic HTML and ARIA labels
- ✅ **Error handling** - Included error states and validation

### Performance Considerations
- **Lazy loading** - Load data only when page is active
- **Debounced filtering** - Prevent excessive API calls
- **Efficient rendering** - Minimize DOM manipulation
- **Caching** - Store frequently accessed data

### Maintainability
- **Clear code structure** - Easy to understand and modify
- **Consistent naming** - Follows project conventions
- **Documentation** - Comments explain complex logic
- **Testable code** - Functions are small and focused

## 🔍 Troubleshooting

### Common Issues

**Page not loading?**
- ✅ Check console for JavaScript errors
- ✅ Verify the script is included in `index.html`
- ✅ Ensure the route is properly configured

**Styling issues?**
- ✅ Check CSS syntax and selectors
- ✅ Verify CSS is added to `pages.css`
- ✅ Test in different browsers

**Navigation not working?**
- ✅ Check sidebar HTML is properly formatted
- ✅ Verify the route path matches the navigation link
- ✅ Ensure router is properly configured

**Icons not showing?**
- ✅ Verify Lucide icon names are correct
- ✅ Check that `lucide.createIcons()` is called
- ✅ Ensure icons are spelled correctly

---

You now know how to create complete, professional pages for the Real Estate SaaS platform! This workflow can be applied to any new page you want to add to the application.