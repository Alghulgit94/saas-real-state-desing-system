/**
 * Sidebar Controller for Real Estate SaaS
 * Handles sidebar navigation, state management, and responsive behavior
 */

class SidebarController {
    constructor() {
        this.sidebar = null;
        this.isCollapsed = false;
        this.isMobile = false;
        this.userDropdown = null;
        
        this.init();
    }

    async init() {
        try {
            await this.loadSidebarContent();
            this.setupEventListeners();
            this.setupUserDropdown();
            this.handleResponsive();
            this.restoreState();
        } catch (error) {
            console.error('Error initializing sidebar:', error);
        }
    }

    async loadSidebarContent() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        try {
            const response = await fetch('components/sidebar.html');
            const content = await response.text();
            sidebar.innerHTML = content;
            this.sidebar = sidebar;
            
            // Initialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        } catch (error) {
            console.error('Error loading sidebar content:', error);
            // Fallback content
            sidebar.innerHTML = `
                <div class="sidebar__header">
                    <h2 style="color: var(--sidebar-primary); font-weight: 700; font-size: 1.25rem; margin: 0;">
                        <i data-lucide="home" class="icon icon--lg" style="margin-right: 0.5rem;"></i>
                        RealEstate SaaS
                    </h2>
                </div>
                <nav class="sidebar__nav">
                    <ul class="nav-list">
                        <li class="nav-item">
                            <a href="#dashboard" class="nav-link" data-route="dashboard">
                                <i data-lucide="layout-dashboard" class="nav-link__icon"></i>
                                Dashboard
                            </a>
                        </li>
                    </ul>
                </nav>
            `;
            
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
    }

    setupEventListeners() {
        if (!this.sidebar) return;

        // Mobile toggle button
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => this.toggleMobile());
        }

        // Sidebar toggle button (within sidebar)
        const sidebarToggle = this.sidebar.querySelector('#sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggle());
        }

        // Navigation links
        const navLinks = this.sidebar.querySelectorAll('[data-route]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const route = link.getAttribute('data-route');
                if (route) {
                    router.navigate(`/${route}`);
                    
                    // Close mobile menu if open
                    if (this.isMobile) {
                        this.closeMobile();
                    }
                }
            });
        });

        // Close sidebar on overlay click (mobile)
        document.addEventListener('click', (e) => {
            if (this.isMobile && 
                this.sidebar.classList.contains('sidebar--open') &&
                !this.sidebar.contains(e.target) &&
                !e.target.closest('#mobile-menu-toggle')) {
                this.closeMobile();
            }
        });

        // Escape key to close mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobile && this.sidebar.classList.contains('sidebar--open')) {
                this.closeMobile();
            }
        });

        // Window resize handler
        window.addEventListener('resize', Helpers.debounce(() => {
            this.handleResponsive();
        }, 250));
    }

    setupUserDropdown() {
        const userProfile = this.sidebar?.querySelector('.user-profile');
        const dropdownTrigger = userProfile?.querySelector('.dropdown__trigger');
        
        if (dropdownTrigger) {
            this.userDropdown = new Dropdown(dropdownTrigger, {
                items: [
                    {
                        icon: 'user',
                        label: 'Profile',
                        action: 'viewProfile'
                    },
                    {
                        icon: 'settings',
                        label: 'Preferences',
                        action: 'openPreferences'
                    },
                    {
                        icon: 'help-circle',
                        label: 'Help & Support',
                        action: 'openHelp'
                    },
                    { separator: true },
                    {
                        icon: 'log-out',
                        label: 'Logout',
                        action: 'logout'
                    }
                ],
                viewProfile: () => {
                    router.navigate('/profile');
                },
                openPreferences: () => {
                    router.navigate('/settings');
                },
                openHelp: () => {
                    window.open('https://help.realestate-saas.com', '_blank');
                },
                logout: () => {
                    this.handleLogout();
                }
            });
        }
    }

    toggle() {
        if (this.isMobile) {
            this.toggleMobile();
        } else {
            this.toggleDesktop();
        }
    }

    toggleDesktop() {
        this.isCollapsed = !this.isCollapsed;
        const mainContent = document.getElementById('main-content');
        
        if (this.isCollapsed) {
            this.sidebar.classList.add('sidebar--collapsed');
            mainContent?.classList.add('main-content--expanded');
        } else {
            this.sidebar.classList.remove('sidebar--collapsed');
            mainContent?.classList.remove('main-content--expanded');
        }
        
        // Save state
        Storage.setItem('sidebar_collapsed', this.isCollapsed);
    }

    toggleMobile() {
        if (this.sidebar.classList.contains('sidebar--open')) {
            this.closeMobile();
        } else {
            this.openMobile();
        }
    }

    openMobile() {
        this.sidebar.classList.add('sidebar--open');
        document.body.style.overflow = 'hidden';
        
        // Add backdrop
        this.createMobileBackdrop();
    }

    closeMobile() {
        this.sidebar.classList.remove('sidebar--open');
        document.body.style.overflow = '';
        
        // Remove backdrop
        this.removeMobileBackdrop();
    }

    createMobileBackdrop() {
        let backdrop = document.getElementById('sidebar-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'sidebar-backdrop';
            backdrop.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 9;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            document.body.appendChild(backdrop);
            
            backdrop.addEventListener('click', () => this.closeMobile());
            
            // Fade in
            setTimeout(() => {
                backdrop.style.opacity = '1';
            }, 10);
        }
    }

    removeMobileBackdrop() {
        const backdrop = document.getElementById('sidebar-backdrop');
        if (backdrop) {
            backdrop.style.opacity = '0';
            setTimeout(() => {
                if (backdrop.parentNode) {
                    backdrop.parentNode.removeChild(backdrop);
                }
            }, 300);
        }
    }

    handleResponsive() {
        const wasDesktop = !this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        // If switching from mobile to desktop
        if (wasDesktop && this.isMobile) {
            this.closeMobile();
            this.sidebar.classList.remove('sidebar--collapsed');
            document.getElementById('main-content')?.classList.remove('main-content--expanded');
        }
        
        // If switching from desktop to mobile
        if (!wasDesktop && !this.isMobile) {
            this.removeMobileBackdrop();
            document.body.style.overflow = '';
        }
    }

    restoreState() {
        if (!this.isMobile) {
            const wasCollapsed = Storage.getItem('sidebar_collapsed', true);
            if (wasCollapsed) {
                this.isCollapsed = true;
                this.sidebar.classList.add('sidebar--collapsed');
                document.getElementById('main-content')?.classList.add('main-content--expanded');
            }
        }
    }

    updateActiveNavigation(activeRoute) {
        if (!this.sidebar) return;
        
        const navLinks = this.sidebar.querySelectorAll('[data-route]');
        navLinks.forEach(link => {
            const route = link.getAttribute('data-route');
            if (route === activeRoute) {
                link.classList.add('nav-link--active');
            } else {
                link.classList.remove('nav-link--active');
            }
        });
    }

    updateUserInfo(user) {
        if (!this.sidebar || !user) return;
        
        const userNameElement = this.sidebar.querySelector('.user-name');
        const userRoleElement = this.sidebar.querySelector('.user-role');
        const userAvatar = this.sidebar.querySelector('.user-avatar');
        
        if (userNameElement) {
            userNameElement.textContent = user.name || 'User';
        }
        
        if (userRoleElement) {
            userRoleElement.textContent = user.role || 'Member';
        }
        
        if (userAvatar && user.avatar) {
            userAvatar.innerHTML = `<img src="${user.avatar}" alt="${user.name}" style="width: 100%; height: 100%; object-fit: cover;">`;
        } else if (userAvatar && user.name) {
            // Show initials if no avatar
            const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
            userAvatar.innerHTML = initials;
        }
    }

    async handleLogout() {
        try {
            Helpers.toggleLoading(true);
            
            // Call logout API
            await API.logout();
            
            // Clear local data
            Storage.clear();
            
            // Redirect to login page or reload
            window.location.href = '/login.html';
            
        } catch (error) {
            console.error('Logout error:', error);
            Toast.error('Failed to logout. Please try again.');
        } finally {
            Helpers.toggleLoading(false);
        }
    }

    getNavigationItems() {
        return [
            {
                route: 'dashboard',
                icon: 'layout-dashboard',
                label: 'Dashboard',
                href: '/dashboard'
            }
        ];
    }

    destroy() {
        if (this.userDropdown) {
            this.userDropdown.destroy();
        }
        
        this.removeMobileBackdrop();
        document.body.style.overflow = '';
    }
}

// Initialize sidebar controller
const sidebarController = new SidebarController();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = sidebarController;
}

// Make available globally
window.sidebarController = sidebarController;