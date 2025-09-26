# 🧩 Component Library

This guide covers all the UI components available in the Real Estate SaaS platform. Each component is designed to be reusable, accessible, and consistent with the design system.

## 🎯 Component Philosophy

All components follow these principles:
- **Consistent API**: Similar patterns for creation and usage
- **Accessibility First**: WCAG 2.1 AA compliance
- **Design System**: Follows established colors, spacing, and typography
- **Progressive Enhancement**: Works with and without JavaScript

## 📚 Available Components

### 🔲 Modal Component

**Purpose**: Display content in an overlay dialog

#### Basic Usage
```javascript
const modal = new Modal({
    title: 'Add New Property',
    content: '<p>Modal content goes here</p>',
    size: 'medium'
});

modal.open();
```

#### Options
```javascript
{
    title: '',              // Modal title (optional)
    content: '',            // HTML content (required)
    size: 'medium',         // 'small', 'medium', 'large'
    closable: true,         // Show close button
    backdrop: true,         // Close on backdrop click
    onOpen: () => {},       // Callback when opened
    onClose: () => {}       // Callback when closed
}
```

#### Methods
```javascript
modal.open();           // Show the modal
modal.close();          // Hide the modal
modal.setContent(html); // Update content
```

#### Examples

**Simple Confirmation Modal**
```javascript
const confirmModal = new Modal({
    title: 'Delete Property',
    content: `
        <p>Are you sure you want to delete this property? This action cannot be undone.</p>
        <div style="display: flex; gap: 0.5rem; justify-content: flex-end; margin-top: 1.5rem;">
            <button class="btn btn--outline" onclick="confirmModal.close()">Cancel</button>
            <button class="btn btn--destructive" onclick="deleteProperty(); confirmModal.close()">Delete</button>
        </div>
    `,
    size: 'small',
    closable: false
});
```

**Form Modal**
```javascript
const formModal = new Modal({
    title: 'Edit Property',
    content: `
        <form id="edit-property-form">
            <div class="form-group">
                <label class="form-label">Property Title</label>
                <input type="text" class="input__field" name="title" required>
            </div>
            <div class="form-group">
                <label class="form-label">Price</label>
                <input type="number" class="input__field" name="price" required>
            </div>
            <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button type="button" class="btn btn--outline" onclick="formModal.close()">Cancel</button>
                <button type="submit" class="btn btn--primary">Save Changes</button>
            </div>
        </form>
    `,
    size: 'large',
    onOpen: () => {
        // Handle form submission
        document.getElementById('edit-property-form').addEventListener('submit', handleFormSubmit);
    }
});
```

---

### 📋 Dropdown Component

**Purpose**: Context menus and action lists

#### Basic Usage
```javascript
const dropdown = new Dropdown(triggerElement, {
    items: [
        { icon: 'edit', label: 'Edit', action: 'edit' },
        { icon: 'eye', label: 'View', action: 'view' },
        { separator: true },
        { icon: 'trash-2', label: 'Delete', action: 'delete' }
    ],
    placement: 'bottom-right'
});
```

#### Options
```javascript
{
    items: [],              // Array of menu items
    placement: 'bottom-right', // 'bottom-left', 'bottom-right', 'top-left', 'top-right'
    offset: 4,              // Distance from trigger element
    closeOnClick: true,     // Close when item is clicked
    // Action handlers
    edit: (item) => {},     // Handler for 'edit' action
    delete: (item) => {}    // Handler for 'delete' action
}
```

#### Item Structure
```javascript
{
    icon: 'edit',           // Lucide icon name
    label: 'Edit Property', // Display text
    href: '/edit/123',      // Link URL (optional)
    action: 'edit',         // Action name for handler
    separator: true         // Show separator (no other props needed)
}
```

#### Methods
```javascript
dropdown.open();        // Show dropdown
dropdown.close();       // Hide dropdown
dropdown.toggle();      // Toggle visibility
dropdown.destroy();     // Remove event listeners
```

#### Examples

**Property Actions Menu**
```javascript
const propertyActions = new Dropdown(moreButton, {
    items: [
        { icon: 'eye', label: 'View Details', action: 'view' },
        { icon: 'edit', label: 'Edit Property', action: 'edit' },
        { icon: 'copy', label: 'Duplicate', action: 'duplicate' },
        { separator: true },
        { icon: 'archive', label: 'Archive', action: 'archive' },
        { icon: 'trash-2', label: 'Delete', action: 'delete' }
    ],
    placement: 'bottom-right',
    view: (item) => router.navigate(`/properties/${propertyId}`),
    edit: (item) => openEditModal(propertyId),
    delete: (item) => confirmDelete(propertyId)
});
```

**User Profile Menu**
```javascript
const userMenu = new Dropdown(profileButton, {
    items: [
        { icon: 'user', label: 'Profile Settings', href: '/profile' },
        { icon: 'settings', label: 'Preferences', href: '/settings' },
        { icon: 'help-circle', label: 'Help & Support', href: '/help' },
        { separator: true },
        { icon: 'log-out', label: 'Sign Out', action: 'logout' }
    ],
    logout: () => {
        if (confirm('Are you sure you want to sign out?')) {
            // Handle logout
        }
    }
});
```

---

### 🔔 Toast Component

**Purpose**: Show temporary notifications and feedback

#### Basic Usage
```javascript
Toast.success('Property saved successfully!');
Toast.error('Failed to save property');
Toast.warning('Please check your internet connection');
Toast.info('New features available');
```

#### Methods
```javascript
Toast.show(message, type, options);  // Generic method
Toast.success(message, options);     // Success notification
Toast.error(message, options);       // Error notification  
Toast.warning(message, options);     // Warning notification
Toast.info(message, options);        // Info notification
Toast.dismiss(toast);                // Close specific toast
Toast.dismissAll();                  // Close all toasts
```

#### Options
```javascript
{
    title: '',              // Toast title (optional)
    duration: 4000,         // Auto-dismiss after ms (0 = manual)
    closable: true,         // Show close button
    showProgress: false,    // Show progress bar
    position: 'top-right'   // Position on screen
}
```

#### Examples

**Success with Custom Duration**
```javascript
Toast.success('Property published successfully!', {
    title: 'Success',
    duration: 6000,
    showProgress: true
});
```

**Error with Manual Dismiss**
```javascript
Toast.error('Failed to connect to server. Please try again.', {
    title: 'Connection Error',
    duration: 0,  // Manual dismiss only
    closable: true
});
```

**Warning with Action**
```javascript
const warningToast = Toast.warning('Your session will expire in 5 minutes', {
    title: 'Session Warning',
    duration: 0,
    closable: true
});

// Add action button to the toast content
const toastContent = warningToast.querySelector('.toast__content');
toastContent.innerHTML += `
    <button class="btn btn--sm btn--outline" onclick="extendSession()">
        Extend Session
    </button>
`;
```

---

### ✅ FormValidator Component

**Purpose**: Validate forms with real-time feedback

#### Basic Usage
```javascript
const validator = new FormValidator('#contact-form', {
    name: {
        required: true,
        minLength: 2,
        messages: {
            required: 'Name is required',
            minLength: 'Name must be at least 2 characters'
        }
    },
    email: {
        required: true,
        email: true
    },
    phone: {
        phone: true
    }
});
```

#### Validation Rules
```javascript
{
    required: true,           // Field is required
    minLength: 5,            // Minimum character length
    maxLength: 100,          // Maximum character length
    pattern: /^[A-Z]+$/,     // Regular expression pattern
    email: true,             // Valid email address
    phone: true,             // Valid phone number
    custom: (value, field) => {  // Custom validation function
        if (value < 18) {
            return 'Must be 18 or older';
        }
        return true; // Valid
    },
    messages: {              // Custom error messages
        required: 'This field is required',
        email: 'Please enter a valid email address'
    }
}
```

#### Methods
```javascript
validator.validate();           // Validate entire form
validator.validateField(name);  // Validate single field
validator.getErrors();          // Get current errors
validator.hasErrors();          // Check if form has errors
```

#### Examples

**Property Form Validation**
```javascript
const propertyValidator = new FormValidator('#property-form', {
    title: {
        required: true,
        minLength: 5,
        maxLength: 100
    },
    price: {
        required: true,
        pattern: /^\d+$/,
        custom: (value) => {
            const price = parseInt(value);
            if (price < 1000) {
                return 'Price must be at least $1,000';
            }
            if (price > 10000000) {
                return 'Price cannot exceed $10,000,000';
            }
            return true;
        }
    },
    address: {
        required: true,
        minLength: 10
    },
    bedrooms: {
        required: true,
        pattern: /^[0-9]+$/,
        custom: (value) => {
            const beds = parseInt(value);
            return beds >= 0 && beds <= 20 ? true : 'Invalid number of bedrooms';
        }
    },
    description: {
        maxLength: 1000
    }
});

// Handle form submission
document.getElementById('property-form').addEventListener('submit', (e) => {
    if (!propertyValidator.validate()) {
        e.preventDefault();
        Toast.error('Please correct the errors and try again');
        return;
    }
    
    // Form is valid, proceed with submission
    submitPropertyForm();
});
```

**Real-time Validation Example**
```javascript
const validator = new FormValidator('#signup-form', {
    username: {
        required: true,
        minLength: 3,
        pattern: /^[a-zA-Z0-9_]+$/,
        custom: async (value) => {
            // Check username availability
            const available = await API.checkUsername(value);
            return available ? true : 'Username is already taken';
        }
    },
    password: {
        required: true,
        minLength: 8,
        custom: (value) => {
            const hasUpper = /[A-Z]/.test(value);
            const hasLower = /[a-z]/.test(value);
            const hasNumber = /\d/.test(value);
            
            if (!hasUpper || !hasLower || !hasNumber) {
                return 'Password must contain uppercase, lowercase, and number';
            }
            return true;
        }
    },
    confirmPassword: {
        required: true,
        custom: (value, field) => {
            const password = field.form.querySelector('[name="password"]').value;
            return value === password ? true : 'Passwords do not match';
        }
    }
});
```

---

## 🎨 Styling Components

### CSS Classes

Each component uses specific CSS classes that you can customize:

#### Modal Classes
```css
.modal-container        /* Modal overlay container */
.modal-overlay         /* Background overlay */
.modal-content         /* Modal content box */
.modal-header          /* Modal header section */
.modal-title           /* Modal title */
.modal-body            /* Modal content area */
.modal-close           /* Close button */
```

#### Dropdown Classes
```css
.dropdown             /* Dropdown container */
.dropdown__trigger    /* Trigger button */
.dropdown__menu       /* Menu container */
.dropdown__item       /* Menu item */
.dropdown__separator  /* Separator line */
```

#### Toast Classes
```css
.toast-container      /* Toast container */
.toast                /* Individual toast */
.toast__icon          /* Toast icon */
.toast__content       /* Toast content */
.toast__title         /* Toast title */
.toast__message       /* Toast message */
.toast__close         /* Close button */
.toast__progress      /* Progress bar */
```

### Customizing Styles

You can override component styles by adding CSS to your project:

```css
/* Custom modal styling */
.modal-content {
    border-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Custom toast styling */
.toast--success {
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
}

/* Custom dropdown styling */
.dropdown__menu {
    backdrop-filter: blur(10px);
    background: rgba(255, 255, 255, 0.95);
}
```

## 🔧 Advanced Usage

### Creating Custom Components

Follow this pattern to create new components:

```javascript
class CustomComponent {
    constructor(options = {}) {
        this.options = {
            // Default options
            defaultValue: 'default',
            ...options
        };
        
        this.element = null;
        this.isVisible = false;
        
        // Bind methods
        this.handleClick = this.handleClick.bind(this);
    }

    create() {
        // Create DOM elements
        this.element = document.createElement('div');
        this.element.className = 'custom-component';
        this.element.innerHTML = this.generateHTML();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Add to DOM
        document.body.appendChild(this.element);
    }

    generateHTML() {
        return `
            <div class="custom-component__content">
                ${this.options.content || ''}
            </div>
        `;
    }

    setupEventListeners() {
        this.element.addEventListener('click', this.handleClick);
    }

    handleClick(e) {
        // Handle user interaction
    }

    show() {
        if (!this.element) this.create();
        this.element.classList.add('custom-component--visible');
        this.isVisible = true;
    }

    hide() {
        if (this.element) {
            this.element.classList.remove('custom-component--visible');
            this.isVisible = false;
        }
    }

    destroy() {
        if (this.element) {
            this.element.removeEventListener('click', this.handleClick);
            this.element.remove();
            this.element = null;
        }
    }
}
```

### Component Communication

Components can communicate through custom events:

```javascript
// Component A dispatches event
window.dispatchEvent(new CustomEvent('property:selected', {
    detail: { propertyId: 123 }
}));

// Component B listens for event
window.addEventListener('property:selected', (e) => {
    console.log('Property selected:', e.detail.propertyId);
});
```

### Component Lifecycle

All components follow this lifecycle:

```
Creation → Initialization → Rendering → Event Binding → Usage → Cleanup
    ↓            ↓            ↓             ↓          ↓        ↓
new Component() → create() → render() → setupEvents() → show() → destroy()
```

## 🧪 Testing Components

### Manual Testing Checklist

For each component, test:

- ✅ **Creation**: Component creates without errors
- ✅ **Rendering**: Content displays correctly
- ✅ **Interactions**: User actions work as expected
- ✅ **Keyboard**: Tab navigation and shortcuts work
- ✅ **Responsive**: Component works on mobile devices
- ✅ **Cleanup**: Component cleans up when destroyed

### Testing Examples

```javascript
// Test modal creation
function testModal() {
    const modal = new Modal({
        title: 'Test Modal',
        content: '<p>Test content</p>'
    });
    
    console.assert(modal.options.title === 'Test Modal', 'Title not set correctly');
    
    modal.open();
    console.assert(document.querySelector('.modal-container'), 'Modal not created');
    
    modal.close();
    setTimeout(() => {
        console.assert(!document.querySelector('.modal-container:not(.hidden)'), 'Modal not hidden');
    }, 100);
}

// Test form validator
function testValidator() {
    const form = document.createElement('form');
    form.innerHTML = '<input type="email" name="email" value="invalid-email">';
    
    const validator = new FormValidator(form, {
        email: { required: true, email: true }
    });
    
    const isValid = validator.validate();
    console.assert(!isValid, 'Should be invalid');
    console.assert(validator.hasErrors(), 'Should have errors');
}
```

## 📚 Best Practices

### Component Design
- **Single Responsibility**: Each component should do one thing well
- **Consistent API**: Use similar patterns across components
- **Error Handling**: Handle edge cases gracefully
- **Performance**: Minimize DOM manipulation

### Usage Guidelines
- **Don't Override**: Avoid overriding component internals
- **Use Options**: Configure components through options
- **Clean Up**: Always destroy components when done
- **Test Thoroughly**: Test all component features

### Accessibility
- **Keyboard Support**: Ensure keyboard navigation works
- **Screen Readers**: Use proper ARIA attributes
- **Focus Management**: Handle focus appropriately
- **Color Contrast**: Ensure sufficient contrast ratios

---

This component library provides a solid foundation for building consistent, accessible user interfaces. Each component is battle-tested and ready for production use in real estate applications.