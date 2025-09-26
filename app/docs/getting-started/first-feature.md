# 🎯 Your First Feature Tutorial

Let's build your first feature together! In this tutorial, we'll create a "Property Favorites" system that allows users to mark properties as favorites and view them in a dedicated list.

**What you'll learn:**
- How to add new functionality to existing pages
- How to use local storage for data persistence
- How to work with the component system
- How to follow the application's patterns

**Estimated time:** 30-45 minutes

## 🎯 Feature Overview

We'll build a favorites system with these capabilities:
- ⭐ Add/remove properties from favorites
- 💾 Persist favorites in local storage
- 📱 Show favorites count in the sidebar
- 📄 Create a favorites page to view all favorited properties

## 📋 Step 1: Planning the Feature

Before coding, let's understand what we need to modify:

### Files We'll Touch
```
├── components/sidebar.html          # Add favorites navigation link
├── pages/properties.js              # Add favorite buttons to property cards
├── pages/favorites.js               # Create new favorites page (NEW FILE)
├── utils/storage.js                 # Already has favorites methods
├── assets/js/sidebar.js             # Update navigation
└── utils/router.js                  # Add favorites route
```

### User Flow
```
1. User browses properties → Clicks ⭐ icon → Property added to favorites
2. User clicks "Favorites" in sidebar → Sees list of favorite properties
3. User can remove favorites from either page
```

## 📝 Step 2: Add Favorites Navigation

Let's start by adding a "Favorites" link to the sidebar.

### Update Sidebar Template

Open `components/sidebar.html` and find the navigation list. Add the favorites link after the "Properties" item:

```html
<!-- Find this section in sidebar.html -->
<nav class="sidebar__nav">
    <ul class="nav-list">
        <li class="nav-item">
            <a href="#dashboard" class="nav-link" data-route="dashboard">
                <i data-lucide="layout-dashboard" class="nav-link__icon"></i>
                Dashboard
            </a>
        </li>
        <li class="nav-item">
            <a href="#properties" class="nav-link" data-route="properties">
                <i data-lucide="building" class="nav-link__icon"></i>
                Properties
            </a>
        </li>
        <!-- ADD THIS NEW SECTION -->
        <li class="nav-item">
            <a href="#favorites" class="nav-link" data-route="favorites">
                <i data-lucide="heart" class="nav-link__icon"></i>
                Favorites
                <span class="nav-badge" id="favorites-count">0</span>
            </a>
        </li>
        <!-- END NEW SECTION -->
        <li class="nav-item">
            <a href="#clients" class="nav-link" data-route="clients">
                <i data-lucide="users" class="nav-link__icon"></i>
                Clients
            </a>
        </li>
        <!-- ... rest of navigation ... -->
    </ul>
</nav>
```

### Add Badge Styling

Add CSS for the favorites count badge. Open `assets/css/components.css` and add this at the end:

```css
/* Favorites count badge */
.nav-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.25rem;
    height: 1.25rem;
    padding: 0.125rem 0.375rem;
    margin-left: auto;
    background-color: var(--primary);
    color: var(--primary-foreground);
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 1rem;
    line-height: 1;
}

.nav-badge:empty,
.nav-badge[data-count="0"] {
    display: none;
}
```

## 🔄 Step 3: Add Route for Favorites Page

Open `utils/router.js` and add the favorites route. Find the section where routes are defined and add:

```javascript
// Find this section in router.js
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
    // ADD THIS NEW ROUTE
    .addRoute('/favorites', async (context) => {
        await loadPage('favorites');
        updateNavigation('favorites');
    })
    // Continue with existing routes...
    .addRoute('/clients', async (context) => {
        await loadPage('clients');
        updateNavigation('clients');
    });
```

## 📄 Step 4: Create the Favorites Page

Create a new file `pages/favorites.js`:

```javascript
/**
 * Favorites Page Controller for Real Estate SaaS
 * Handles displaying and managing favorite properties
 */

class FavoritesController {
    constructor() {
        this.favoriteProperties = [];
    }

    async load(container, data = {}) {
        try {
            await this.loadFavorites();
            this.render(container);
            this.setupEventListeners();
        } catch (error) {
            console.error('Error loading favorites:', error);
            this.renderError(container);
        }
    }

    async loadFavorites() {
        // Get favorite property IDs from storage
        const favorites = Storage.getFavorites('properties');
        const favoriteIds = Object.keys(favorites);

        if (favoriteIds.length === 0) {
            this.favoriteProperties = [];
            return;
        }

        // In a real app, you'd fetch these from the API
        // For now, we'll simulate by getting from properties controller
        try {
            // Get all properties data (simulated)
            const allProperties = await this.getAllProperties();
            
            // Filter to only favorites
            this.favoriteProperties = allProperties.filter(property => 
                favoriteIds.includes(property.id.toString())
            );
        } catch (error) {
            console.error('Error fetching favorite properties:', error);
            this.favoriteProperties = [];
        }
    }

    async getAllProperties() {
        // Simulate API call - in real app, this would be API.getProperties()
        // For demo, we'll use the same mock data as properties page
        return [
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
            }
        ];
    }

    render(container) {
        if (this.favoriteProperties.length === 0) {
            this.renderEmptyState(container);
            return;
        }

        const html = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Favorite Properties</h1>
                    <p class="page-description">Your saved properties for quick access</p>
                </div>
                <div class="page-actions">
                    <span class="favorites-count">${this.favoriteProperties.length} favorites</span>
                </div>
            </div>

            <!-- Properties Grid -->
            <div class="properties-grid">
                ${this.favoriteProperties.map(property => this.renderPropertyCard(property)).join('')}
            </div>
        `;

        container.innerHTML = html;
    }

    renderEmptyState(container) {
        container.innerHTML = `
            <div class="page-header">
                <div>
                    <h1 class="page-title">Favorite Properties</h1>
                    <p class="page-description">Your saved properties for quick access</p>
                </div>
            </div>

            <div class="empty-state" style="text-align: center; padding: 4rem 2rem; color: var(--muted-foreground);">
                <i data-lucide="heart" class="icon" style="width: 4rem; height: 4rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3 style="margin-bottom: 0.5rem; color: var(--foreground);">No favorite properties yet</h3>
                <p style="margin-bottom: 2rem;">Properties you mark as favorites will appear here for quick access.</p>
                <button class="btn btn--primary" onclick="router.navigate('/properties')">
                    <i data-lucide="building" class="icon icon--sm"></i>
                    Browse Properties
                </button>
            </div>
        `;
    }

    renderPropertyCard(property) {
        const statusClass = `property-card__status--${property.status}`;
        
        return `
            <div class="property-card" data-property-id="${property.id}">
                <div class="property-card__image">
                    <img src="${property.images[0]}" alt="${Helpers.escapeHtml(property.title)}" loading="lazy">
                    <div class="property-card__status ${statusClass}">
                        ${Helpers.capitalize(property.status)}
                    </div>
                    <!-- Favorite button (filled since this is favorites page) -->
                    <button class="favorite-btn favorite-btn--active" data-property-id="${property.id}" title="Remove from favorites">
                        <i data-lucide="heart" class="icon icon--sm"></i>
                    </button>
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
                    </div>
                    <div class="property-card__actions">
                        <button class="btn btn--outline btn--sm" onclick="router.navigate('/properties/${property.id}')">
                            <i data-lucide="eye" class="icon icon--xs"></i>
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Handle favorite button clicks
        document.addEventListener('click', (e) => {
            const favoriteBtn = e.target.closest('.favorite-btn');
            if (favoriteBtn) {
                e.preventDefault();
                e.stopPropagation();
                const propertyId = favoriteBtn.dataset.propertyId;
                this.toggleFavorite(propertyId);
            }
        });

        // Initialize icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    toggleFavorite(propertyId) {
        const property = this.favoriteProperties.find(p => p.id.toString() === propertyId);
        if (!property) return;

        // Remove from favorites
        Storage.removeFavorite('properties', propertyId);
        
        // Show feedback
        Toast.success(`"${property.title}" removed from favorites`);
        
        // Update UI
        this.refreshPage();
        this.updateFavoritesCount();
    }

    async refreshPage() {
        const container = document.getElementById('page-content');
        if (container) {
            await this.load(container);
        }
    }

    updateFavoritesCount() {
        // Update sidebar badge
        const badge = document.getElementById('favorites-count');
        if (badge) {
            const favorites = Storage.getFavorites('properties');
            const count = Object.keys(favorites).length;
            badge.textContent = count;
            badge.setAttribute('data-count', count);
        }
    }

    renderError(container) {
        container.innerHTML = `
            <div class="alert alert--error">
                <div class="alert__content">
                    <div class="alert__title">Error Loading Favorites</div>
                    <div class="alert__description">Failed to load favorite properties. Please try refreshing the page.</div>
                </div>
            </div>
        `;
    }

    destroy() {
        // Cleanup if needed
    }
}

// Create and export favorites controller
const favoritesController = new FavoritesController();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = favoritesController;
}

// Make available globally
window.favoritesController = favoritesController;
```

## ⭐ Step 5: Add Favorite Buttons to Properties

Now let's add favorite buttons to the properties page. Open `pages/properties.js` and modify the `renderPropertyCard` method:

### Find the `renderPropertyCard` method and update it:

```javascript
// In pages/properties.js, find the renderPropertyCard method
renderPropertyCard(property) {
    const statusClass = `property-card__status--${property.status}`;
    const featuredBadge = property.featured ? '<div class="featured-badge">Featured</div>' : '';
    
    // Check if property is favorited
    const isFavorited = Storage.isFavorite('properties', property.id.toString());
    const favoriteClass = isFavorited ? 'favorite-btn--active' : '';
    const favoriteTitle = isFavorited ? 'Remove from favorites' : 'Add to favorites';

    return `
        <div class="property-card" data-property-id="${property.id}">
            ${featuredBadge}
            <div class="property-card__image">
                <img src="${property.images[0]}" alt="${Helpers.escapeHtml(property.title)}" loading="lazy">
                <div class="property-card__status ${statusClass}">
                    ${Helpers.capitalize(property.status)}
                </div>
                <!-- ADD FAVORITE BUTTON -->
                <button class="favorite-btn ${favoriteClass}" data-property-id="${property.id}" title="${favoriteTitle}">
                    <i data-lucide="heart" class="icon icon--sm"></i>
                </button>
            </div>
            <div class="property-card__content">
                <!-- ... rest of the card content stays the same ... -->
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
```

### Add favorite functionality to the setupEventListeners method:

```javascript
// In pages/properties.js, find setupEventListeners method and add this
setupEventListeners() {
    // ... existing event listeners ...
    
    // ADD THIS: Handle favorite button clicks
    document.addEventListener('click', (e) => {
        const favoriteBtn = e.target.closest('.favorite-btn');
        if (favoriteBtn) {
            e.preventDefault();
            e.stopPropagation();
            const propertyId = favoriteBtn.dataset.propertyId;
            this.toggleFavorite(propertyId);
        }
    });
    
    // ... rest of existing code ...
}
```

### Add the toggleFavorite method to PropertiesController:

```javascript
// Add this method to the PropertiesController class in properties.js
toggleFavorite(propertyId) {
    const property = this.properties.find(p => p.id.toString() === propertyId);
    if (!property) return;

    const isCurrentlyFavorited = Storage.isFavorite('properties', propertyId);
    
    if (isCurrentlyFavorited) {
        // Remove from favorites
        Storage.removeFavorite('properties', propertyId);
        Toast.success(`"${property.title}" removed from favorites`);
    } else {
        // Add to favorites
        Storage.addFavorite('properties', propertyId, {
            title: property.title,
            price: property.price,
            type: property.type,
            address: property.address
        });
        Toast.success(`"${property.title}" added to favorites`);
    }
    
    // Update the favorite button appearance
    this.updateFavoriteButton(propertyId);
    this.updateFavoritesCount();
}

updateFavoriteButton(propertyId) {
    const favoriteBtn = document.querySelector(`[data-property-id="${propertyId}"].favorite-btn`);
    if (!favoriteBtn) return;
    
    const isFavorited = Storage.isFavorite('properties', propertyId);
    
    if (isFavorited) {
        favoriteBtn.classList.add('favorite-btn--active');
        favoriteBtn.title = 'Remove from favorites';
    } else {
        favoriteBtn.classList.remove('favorite-btn--active');
        favoriteBtn.title = 'Add to favorites';
    }
}

updateFavoritesCount() {
    // Update sidebar badge
    const badge = document.getElementById('favorites-count');
    if (badge) {
        const favorites = Storage.getFavorites('properties');
        const count = Object.keys(favorites).length;
        badge.textContent = count;
        badge.setAttribute('data-count', count);
    }
}
```

## 🎨 Step 6: Add Favorite Button Styling

Add CSS for the favorite buttons. Open `assets/css/components.css` and add:

```css
/* Favorite button styles */
.favorite-btn {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    width: 2rem;
    height: 2rem;
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    backdrop-filter: blur(4px);
    z-index: 5;
}

.favorite-btn:hover {
    background: rgba(255, 255, 255, 1);
    transform: scale(1.1);
}

.favorite-btn--active {
    background: var(--primary);
    color: var(--primary-foreground);
}

.favorite-btn--active:hover {
    background: var(--primary);
    opacity: 0.9;
}

/* Dark mode support */
.dark .favorite-btn {
    background: rgba(0, 0, 0, 0.7);
    color: var(--foreground);
}

.dark .favorite-btn:hover {
    background: rgba(0, 0, 0, 0.9);
}
```

## 🔄 Step 7: Load the Favorites Page Script

Open `index.html` and add the favorites page script after the other page scripts:

```html
<!-- Find this section in index.html -->
<!-- Page Controllers -->
<script src="pages/dashboard.js"></script>
<script src="pages/properties.js"></script>
<script src="pages/clients.js"></script>
<script src="pages/agents.js"></script>
<!-- ADD THIS LINE -->
<script src="pages/favorites.js"></script>
```

## 🎯 Step 8: Initialize Favorites Count

Update `assets/js/sidebar.js` to show the favorites count on page load. Find the `updateUserInfo` method and add favorites count initialization:

```javascript
// In assets/js/sidebar.js, find the init method and add this
async init() {
    try {
        await this.loadSidebarContent();
        this.setupEventListeners();
        this.setupUserDropdown();
        this.handleResponsive();
        this.restoreState();
        
        // ADD THIS: Initialize favorites count
        this.updateFavoritesCount();
    } catch (error) {
        console.error('Error initializing sidebar:', error);
    }
}

// ADD THIS METHOD to SidebarController class
updateFavoritesCount() {
    const badge = document.getElementById('favorites-count');
    if (badge) {
        const favorites = Storage.getFavorites('properties');
        const count = Object.keys(favorites).length;
        badge.textContent = count;
        badge.setAttribute('data-count', count);
    }
}
```

## 🧪 Step 9: Test Your Feature

Now let's test the favorites functionality:

### 1. Restart your development server
```bash
# Stop the current server (Ctrl+C)
# Restart it
cd app
python -m http.server 8000
```

### 2. Test the favorites system
1. **Navigate to Properties page**
2. **Click the heart icon** on a property card
3. **See the toast notification** confirming the action
4. **Check the sidebar** - favorites count should update
5. **Click "Favorites" in sidebar** - should see your favorited property
6. **Remove the favorite** - should see the property disappear

### 3. Test persistence
1. **Add some favorites**
2. **Refresh the page**
3. **Verify favorites are still there** (thanks to localStorage)

## 🎉 Congratulations!

You've successfully built your first feature! Here's what you accomplished:

✅ **Added navigation** - New favorites link in sidebar with count badge  
✅ **Created a new page** - Complete favorites page with empty state  
✅ **Added interactive elements** - Favorite buttons on property cards  
✅ **Implemented persistence** - Favorites saved to localStorage  
✅ **Added styling** - Professional-looking favorite buttons and badges  
✅ **Followed patterns** - Used existing architectural patterns  

## 🚀 What You Learned

### Technical Skills
- **Component Integration** - How to add new functionality to existing components
- **Page Creation** - How to create new pages following the established pattern
- **State Management** - How to use localStorage for data persistence
- **Event Handling** - How to add interactive functionality
- **CSS Architecture** - How to add styles that integrate with the design system

### Application Architecture
- **File Organization** - Where different types of code belong
- **Routing System** - How to add new routes and navigation
- **Component Communication** - How different parts of the app work together
- **Design Patterns** - How to follow established coding patterns

## 🔄 Next Steps

### Enhance Your Feature
Try these improvements to practice more:

1. **Add sorting** to the favorites page (by date added, price, etc.)
2. **Add a "Clear All Favorites"** button
3. **Show favorite status** in property detail pages
4. **Add categories** (e.g., "Potential Homes", "Investment Properties")

### Learn More
- 📖 [Building Forms Tutorial](../tutorials/forms.md) - Learn advanced form handling
- 🧩 [Component Library](../components/library.md) - Explore all available components
- 🏗️ [Architecture Deep Dive](../architecture/overview.md) - Understand the full system

### Build Another Feature
Ready for more? Try building:
- **Property comparison** system
- **Recent views** tracking
- **Property notes** functionality
- **Email sharing** for properties

## 💡 Pro Tips for Future Development

### Best Practices You Used
- ✅ **Followed existing patterns** - Your code fits seamlessly with the existing codebase
- ✅ **Used the component system** - Leveraged existing components and styling
- ✅ **Added proper error handling** - Included try/catch and error states
- ✅ **Made it responsive** - Favorites work on all screen sizes
- ✅ **Used semantic HTML** - Proper accessibility and structure

### Development Workflow
1. **Plan before coding** - Understanding what files to modify
2. **Start small** - Build one piece at a time
3. **Test frequently** - Verify each step works before moving on
4. **Follow patterns** - Use existing code as a template
5. **Add styling last** - Get functionality working, then make it pretty

---

You're now ready to build more complex features! The patterns you learned here apply to any new functionality you want to add to the Real Estate SaaS platform.