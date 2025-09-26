/**
 * Reusable UI Components for Real Estate SaaS
 * JavaScript classes for interactive components
 */

/**
 * Modal Component
 */
class Modal {
    constructor(options = {}) {
        this.options = {
            title: '',
            content: '',
            size: 'medium', // small, medium, large
            closable: true,
            backdrop: true,
            ...options
        };
        
        this.element = null;
        this.isOpen = false;
        this.onClose = options.onClose || null;
        this.onOpen = options.onOpen || null;
    }

    create() {
        const sizeClass = `modal--${this.options.size}`;
        const closableAttr = this.options.closable ? 'data-closable="true"' : '';
        
        const modalHTML = `
            <div class="modal-overlay" ${this.options.backdrop ? 'data-backdrop="true"' : ''}></div>
            <div class="modal-content ${sizeClass}" ${closableAttr}>
                ${this.options.closable ? `
                    <button class="modal-close" aria-label="Close modal">
                        <i data-lucide="x" class="icon icon--sm"></i>
                    </button>
                ` : ''}
                ${this.options.title ? `
                    <div class="modal-header">
                        <h3 class="modal-title">${Helpers.escapeHtml(this.options.title)}</h3>
                    </div>
                ` : ''}
                <div class="modal-body">
                    ${this.options.content}
                </div>
            </div>
        `;

        const container = document.getElementById('modal-container');
        if (container) {
            container.innerHTML = modalHTML;
            this.element = container;
            this.setupEventListeners();
            this.addModalStyles();
        }
    }

    setupEventListeners() {
        if (!this.element) return;

        // Close button
        const closeBtn = this.element.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Backdrop click
        const overlay = this.element.querySelector('.modal-overlay');
        if (overlay && this.options.backdrop) {
            overlay.addEventListener('click', () => this.close());
        }

        // Escape key
        this.handleEscapeKey = (e) => {
            if (e.key === 'Escape' && this.options.closable) {
                this.close();
            }
        };
        document.addEventListener('keydown', this.handleEscapeKey);
    }

    addModalStyles() {
        if (document.getElementById('modal-component-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'modal-component-styles';
        style.textContent = `
            .modal-content {
                max-width: 500px;
                padding: 1.5rem;
                position: relative;
            }
            
            .modal--small { max-width: 400px; }
            .modal--medium { max-width: 600px; }
            .modal--large { max-width: 800px; }
            
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                color: var(--muted-foreground);
                cursor: pointer;
                padding: 0.5rem;
                border-radius: var(--radius);
                transition: all 0.2s ease;
            }
            
            .modal-close:hover {
                background: var(--accent);
                color: var(--accent-foreground);
            }
            
            .modal-header {
                margin-bottom: 1rem;
                padding-right: 2rem;
            }
            
            .modal-title {
                margin: 0;
                font-size: 1.25rem;
                font-weight: 600;
                color: var(--foreground);
            }
            
            .modal-body {
                color: var(--foreground);
            }
        `;
        document.head.appendChild(style);
    }

    open() {
        if (this.isOpen) return;
        
        this.create();
        
        if (this.element) {
            this.element.classList.remove('hidden');
            this.isOpen = true;
            
            // Trigger animation
            setTimeout(() => {
                const content = this.element.querySelector('.modal-content');
                if (content) {
                    content.classList.add('modal-content--open');
                }
            }, 10);
            
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
            
            // Initialize icons
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            if (this.onOpen) this.onOpen();
        }
    }

    close() {
        if (!this.isOpen || !this.element) return;
        
        const content = this.element.querySelector('.modal-content');
        if (content) {
            content.classList.remove('modal-content--open');
        }
        
        setTimeout(() => {
            this.element.classList.add('hidden');
            this.isOpen = false;
            document.body.style.overflow = '';
            
            if (this.onClose) this.onClose();
        }, 300);
        
        // Remove event listener
        document.removeEventListener('keydown', this.handleEscapeKey);
    }

    setContent(content) {
        if (this.element) {
            const body = this.element.querySelector('.modal-body');
            if (body) {
                body.innerHTML = content;
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            }
        }
    }
}

/**
 * Dropdown Component
 */
class Dropdown {
    constructor(trigger, options = {}) {
        this.trigger = typeof trigger === 'string' ? document.querySelector(trigger) : trigger;
        this.options = {
            placement: 'bottom-right', // bottom-left, bottom-right, top-left, top-right
            offset: 4,
            closeOnClick: true,
            ...options
        };
        
        this.menu = null;
        this.isOpen = false;
        this.items = options.items || [];
        
        if (this.trigger) {
            this.init();
        }
    }

    init() {
        this.createMenu();
        this.setupEventListeners();
    }

    createMenu() {
        if (!this.items.length) return;
        
        const menuHTML = `
            <div class="dropdown__menu" data-placement="${this.options.placement}">
                ${this.items.map(item => {
                    if (item.separator) {
                        return '<div class="dropdown__separator"></div>';
                    }
                    return `
                        <a href="${item.href || '#'}" class="dropdown__item" data-action="${item.action || ''}">
                            ${item.icon ? `<i data-lucide="${item.icon}" class="icon icon--sm"></i>` : ''}
                            ${Helpers.escapeHtml(item.label)}
                        </a>
                    `;
                }).join('')}
            </div>
        `;

        this.trigger.insertAdjacentHTML('afterend', menuHTML);
        this.menu = this.trigger.nextElementSibling;
    }

    setupEventListeners() {
        // Trigger click
        this.trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggle();
        });

        // Menu item clicks
        if (this.menu) {
            this.menu.addEventListener('click', (e) => {
                const item = e.target.closest('.dropdown__item');
                if (item) {
                    const action = item.dataset.action;
                    if (action && this.options[action]) {
                        e.preventDefault();
                        this.options[action](item);
                    }
                    
                    if (this.options.closeOnClick) {
                        this.close();
                    }
                }
            });
        }

        // Close on outside click
        this.handleOutsideClick = (e) => {
            if (!this.trigger.contains(e.target) && (!this.menu || !this.menu.contains(e.target))) {
                this.close();
            }
        };
        document.addEventListener('click', this.handleOutsideClick);

        // Close on escape
        this.handleEscapeKey = (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        };
        document.addEventListener('keydown', this.handleEscapeKey);
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        if (this.isOpen || !this.menu) return;
        
        this.menu.classList.add('dropdown__menu--open');
        this.isOpen = true;
        
        // Position menu
        this.position();
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    close() {
        if (!this.isOpen || !this.menu) return;
        
        this.menu.classList.remove('dropdown__menu--open');
        this.isOpen = false;
    }

    position() {
        if (!this.menu) return;
        
        const triggerRect = this.trigger.getBoundingClientRect();
        const menuRect = this.menu.getBoundingClientRect();
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        let top, left;
        
        switch (this.options.placement) {
            case 'bottom-left':
                top = triggerRect.bottom + this.options.offset;
                left = triggerRect.left;
                break;
            case 'bottom-right':
                top = triggerRect.bottom + this.options.offset;
                left = triggerRect.right - menuRect.width;
                break;
            case 'top-left':
                top = triggerRect.top - menuRect.height - this.options.offset;
                left = triggerRect.left;
                break;
            case 'top-right':
                top = triggerRect.top - menuRect.height - this.options.offset;
                left = triggerRect.right - menuRect.width;
                break;
        }
        
        // Adjust if menu goes off screen
        if (left + menuRect.width > viewport.width) {
            left = viewport.width - menuRect.width - 10;
        }
        if (left < 10) {
            left = 10;
        }
        if (top + menuRect.height > viewport.height) {
            top = triggerRect.top - menuRect.height - this.options.offset;
        }
        if (top < 10) {
            top = triggerRect.bottom + this.options.offset;
        }
        
        this.menu.style.top = `${top}px`;
        this.menu.style.left = `${left}px`;
    }

    destroy() {
        document.removeEventListener('click', this.handleOutsideClick);
        document.removeEventListener('keydown', this.handleEscapeKey);
        if (this.menu) {
            this.menu.remove();
        }
    }
}

/**
 * Toast Notification Component
 */
class Toast {
    static container = null;
    static toasts = [];

    static init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
            
            this.addToastStyles();
        }
    }

    static addToastStyles() {
        if (document.getElementById('toast-component-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'toast-component-styles';
        style.textContent = `
            .toast-container {
                position: fixed;
                top: 1rem;
                right: 1rem;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
                pointer-events: none;
                max-width: 400px;
            }
            
            .toast {
                pointer-events: auto;
                min-width: 300px;
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease;
                border-radius: var(--radius);
                box-shadow: var(--shadow-lg);
                border: 1px solid;
                display: flex;
                align-items: flex-start;
                gap: 0.75rem;
                padding: 1rem;
                position: relative;
            }
            
            .toast--show {
                opacity: 1;
                transform: translateX(0);
            }
            
            .toast--success {
                background: #f0fdf4;
                border-color: #10b981;
                color: #065f46;
            }
            
            .toast--error {
                background: #fef2f2;
                border-color: var(--destructive);
                color: #991b1b;
            }
            
            .toast--warning {
                background: #fffbeb;
                border-color: #f59e0b;
                color: #92400e;
            }
            
            .toast--info {
                background: #eff6ff;
                border-color: #3b82f6;
                color: #1e40af;
            }
            
            .toast__icon {
                flex-shrink: 0;
                margin-top: 0.125rem;
            }
            
            .toast__content {
                flex: 1;
                min-width: 0;
            }
            
            .toast__title {
                font-weight: 600;
                margin-bottom: 0.25rem;
                font-size: 0.875rem;
            }
            
            .toast__message {
                font-size: 0.875rem;
                opacity: 0.9;
            }
            
            .toast__close {
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                background: none;
                border: none;
                color: currentColor;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: var(--radius-sm);
                opacity: 0.7;
                transition: opacity 0.2s ease;
            }
            
            .toast__close:hover {
                opacity: 1;
            }
            
            .toast__progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: currentColor;
                opacity: 0.3;
                transition: width linear;
            }
            
            @media (max-width: 480px) {
                .toast-container {
                    left: 1rem;
                    right: 1rem;
                    max-width: none;
                }
                
                .toast {
                    min-width: auto;
                }
            }
        `;
        document.head.appendChild(style);
    }

    static show(message, type = 'info', options = {}) {
        this.init();
        
        const config = {
            title: '',
            duration: 4000,
            closable: true,
            showProgress: false,
            ...options
        };
        
        const toast = this.create(message, type, config);
        this.container.appendChild(toast);
        this.toasts.push(toast);
        
        // Show animation
        setTimeout(() => {
            toast.classList.add('toast--show');
        }, 10);
        
        // Progress bar
        if (config.showProgress && config.duration > 0) {
            const progress = toast.querySelector('.toast__progress');
            if (progress) {
                progress.style.width = '100%';
                progress.style.transitionDuration = `${config.duration}ms`;
                setTimeout(() => {
                    progress.style.width = '0%';
                }, 10);
            }
        }
        
        // Auto dismiss
        if (config.duration > 0) {
            setTimeout(() => {
                this.dismiss(toast);
            }, config.duration);
        }
        
        return toast;
    }

    static create(message, type, config) {
        const iconMap = {
            success: 'check-circle',
            error: 'alert-circle',
            warning: 'alert-triangle',
            info: 'info'
        };
        
        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        
        toast.innerHTML = `
            ${iconMap[type] ? `<i data-lucide="${iconMap[type]}" class="icon icon--sm toast__icon"></i>` : ''}
            <div class="toast__content">
                ${config.title ? `<div class="toast__title">${Helpers.escapeHtml(config.title)}</div>` : ''}
                <div class="toast__message">${Helpers.escapeHtml(message)}</div>
            </div>
            ${config.closable ? `
                <button class="toast__close" aria-label="Close notification">
                    <i data-lucide="x" class="icon icon--xs"></i>
                </button>
            ` : ''}
            ${config.showProgress ? '<div class="toast__progress"></div>' : ''}
        `;
        
        // Close button event
        if (config.closable) {
            const closeBtn = toast.querySelector('.toast__close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => this.dismiss(toast));
            }
        }
        
        return toast;
    }

    static dismiss(toast) {
        if (!toast || !toast.parentNode) return;
        
        toast.classList.remove('toast--show');
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
            
            // Remove from tracking array
            const index = this.toasts.indexOf(toast);
            if (index > -1) {
                this.toasts.splice(index, 1);
            }
        }, 300);
    }

    static dismissAll() {
        this.toasts.forEach(toast => this.dismiss(toast));
    }

    // Convenience methods
    static success(message, options = {}) {
        return this.show(message, 'success', options);
    }

    static error(message, options = {}) {
        return this.show(message, 'error', options);
    }

    static warning(message, options = {}) {
        return this.show(message, 'warning', options);
    }

    static info(message, options = {}) {
        return this.show(message, 'info', options);
    }
}

/**
 * Form Validator Component
 */
class FormValidator {
    constructor(form, rules = {}) {
        this.form = typeof form === 'string' ? document.querySelector(form) : form;
        this.rules = rules;
        this.errors = {};
        
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            if (!this.validate()) {
                e.preventDefault();
            }
        });
        
        // Real-time validation
        Object.keys(this.rules).forEach(fieldName => {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                field.addEventListener('blur', () => this.validateField(fieldName));
                field.addEventListener('input', Helpers.debounce(() => {
                    this.validateField(fieldName);
                }, 500));
            }
        });
    }

    validate() {
        this.errors = {};
        let isValid = true;
        
        Object.keys(this.rules).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    validateField(fieldName) {
        const field = this.form.querySelector(`[name="${fieldName}"]`);
        const rules = this.rules[fieldName];
        
        if (!field || !rules) return true;
        
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // Required validation
        if (rules.required && !value) {
            isValid = false;
            errorMessage = rules.messages?.required || `${fieldName} is required`;
        }
        
        // Length validation
        if (isValid && value && rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = rules.messages?.minLength || `Minimum ${rules.minLength} characters required`;
        }
        
        if (isValid && value && rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = rules.messages?.maxLength || `Maximum ${rules.maxLength} characters allowed`;
        }
        
        // Pattern validation
        if (isValid && value && rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.messages?.pattern || 'Invalid format';
        }
        
        // Email validation
        if (isValid && value && rules.email && !Helpers.isValidEmail(value)) {
            isValid = false;
            errorMessage = rules.messages?.email || 'Invalid email address';
        }
        
        // Phone validation
        if (isValid && value && rules.phone && !Helpers.isValidPhone(value)) {
            isValid = false;
            errorMessage = rules.messages?.phone || 'Invalid phone number';
        }
        
        // Custom validation
        if (isValid && value && rules.custom) {
            const customResult = rules.custom(value, field);
            if (customResult !== true) {
                isValid = false;
                errorMessage = customResult || 'Invalid value';
            }
        }
        
        // Update UI
        if (isValid) {
            this.clearFieldError(field);
            delete this.errors[fieldName];
        } else {
            this.showFieldError(field, errorMessage);
            this.errors[fieldName] = errorMessage;
        }
        
        return isValid;
    }

    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }

    clearFieldError(field) {
        field.classList.remove('error');
        
        const existingError = field.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
    }

    getErrors() {
        return this.errors;
    }

    hasErrors() {
        return Object.keys(this.errors).length > 0;
    }
}

// Export components
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Modal, Dropdown, Toast, FormValidator };
}

// Make available globally
window.Modal = Modal;
window.Dropdown = Dropdown;
window.Toast = Toast;
window.FormValidator = FormValidator;