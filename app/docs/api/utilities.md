# 🛠️ Utility Functions API Reference

Complete reference for all utility functions available in the Real Estate SaaS platform. These functions provide common functionality used throughout the application.

## 📚 Overview

The utility functions are organized into several modules:

- **`utils/helpers.js`** - General utility functions and formatters
- **`utils/storage.js`** - Local storage management and persistence
- **`utils/api.js`** - HTTP client and API communication
- **`utils/router.js`** - Client-side routing and navigation
- **`utils/theme.js`** - Theme management and dark/light mode

---

## 🔧 Helpers (`utils/helpers.js`)

### Currency and Number Formatting

#### `Helpers.formatCurrency(amount, currency)`
Formats numbers as currency with proper symbols and commas.

**Parameters:**
- `amount` (number) - The amount to format
- `currency` (string, optional) - Currency code, defaults to 'USD'

**Returns:** `string` - Formatted currency string

**Examples:**
```javascript
Helpers.formatCurrency(450000);           // "$450,000"
Helpers.formatCurrency(1250.50);          // "$1,251"
Helpers.formatCurrency(450000, 'EUR');    // "€450,000"
Helpers.formatCurrency(0);                // "$0"
Helpers.formatCurrency(null);             // "$0"
```

#### `Helpers.formatNumber(num)`
Formats numbers with thousand separators.

**Parameters:**
- `num` (number) - Number to format

**Returns:** `string` - Formatted number string

**Examples:**
```javascript
Helpers.formatNumber(1234567);    // "1,234,567"
Helpers.formatNumber(1000);       // "1,000"
Helpers.formatNumber(0);          // "0"
```

### Date and Time Formatting

#### `Helpers.formatDate(date, options)`
Formats dates in human-readable format.

**Parameters:**
- `date` (Date|string) - Date to format
- `options` (Object, optional) - Formatting options

**Returns:** `string` - Formatted date string

**Examples:**
```javascript
const date = new Date('2024-01-15');

Helpers.formatDate(date);                           // "Jan 15, 2024"
Helpers.formatDate(date, { month: 'long' });       // "January 15, 2024"
Helpers.formatDate(date, { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});                                                 // "Monday, January 15, 2024"

Helpers.formatDate('2024-01-15');                   // "Jan 15, 2024"
Helpers.formatDate(null);                          // ""
```

#### `Helpers.getRelativeTime(date)`
Gets relative time (e.g., "2 hours ago").

**Parameters:**
- `date` (Date|string) - Date to compare against now

**Returns:** `string` - Relative time string

**Examples:**
```javascript
const now = new Date();
const oneHourAgo = new Date(now - 60 * 60 * 1000);
const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000);

Helpers.getRelativeTime(oneHourAgo);     // "1 hour ago"
Helpers.getRelativeTime(twoDaysAgo);     // "2 days ago"
Helpers.getRelativeTime(now);            // "Just now"
```

### Function Utilities

#### `Helpers.debounce(func, wait)`
Debounces function calls to prevent excessive execution.

**Parameters:**
- `func` (Function) - Function to debounce
- `wait` (number) - Delay in milliseconds

**Returns:** `Function` - Debounced function

**Examples:**
```javascript
// Debounce search input
const searchInput = document.getElementById('search');
const debouncedSearch = Helpers.debounce((query) => {
    console.log('Searching for:', query);
    // Perform search API call
}, 300);

searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});

// Debounce window resize
const debouncedResize = Helpers.debounce(() => {
    console.log('Window resized');
    // Handle resize logic
}, 250);

window.addEventListener('resize', debouncedResize);
```

#### `Helpers.throttle(func, limit)`
Throttles function calls to limit execution frequency.

**Parameters:**
- `func` (Function) - Function to throttle
- `limit` (number) - Time limit in milliseconds

**Returns:** `Function` - Throttled function

**Examples:**
```javascript
// Throttle scroll events
const throttledScroll = Helpers.throttle(() => {
    console.log('Scroll event');
    // Handle scroll logic
}, 100);

window.addEventListener('scroll', throttledScroll);

// Throttle button clicks
const throttledClick = Helpers.throttle(() => {
    console.log('Button clicked');
    // Handle click logic
}, 1000);

button.addEventListener('click', throttledClick);
```

### Validation Functions

#### `Helpers.isValidEmail(email)`
Validates email addresses.

**Parameters:**
- `email` (string) - Email to validate

**Returns:** `boolean` - True if valid email

**Examples:**
```javascript
Helpers.isValidEmail('user@example.com');     // true
Helpers.isValidEmail('invalid-email');        // false
Helpers.isValidEmail('user@domain');          // false
Helpers.isValidEmail('');                     // false
```

#### `Helpers.isValidPhone(phone)`
Validates phone numbers (US format).

**Parameters:**
- `phone` (string) - Phone number to validate

**Returns:** `boolean` - True if valid phone number

**Examples:**
```javascript
Helpers.isValidPhone('(555) 123-4567');      // true
Helpers.isValidPhone('555-123-4567');        // true
Helpers.isValidPhone('5551234567');          // true
Helpers.isValidPhone('+1 555 123 4567');     // true
Helpers.isValidPhone('invalid');             // false
```

### String Utilities

#### `Helpers.escapeHtml(text)`
Escapes HTML to prevent XSS attacks.

**Parameters:**
- `text` (string) - Text to escape

**Returns:** `string` - Escaped HTML string

**Examples:**
```javascript
Helpers.escapeHtml('<script>alert("xss")</script>');
// "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;"

Helpers.escapeHtml('Safe text');              // "Safe text"
Helpers.escapeHtml('Text with "quotes"');     // "Text with &quot;quotes&quot;"
```

#### `Helpers.capitalize(str)`
Capitalizes first letter of each word.

**Parameters:**
- `str` (string) - String to capitalize

**Returns:** `string` - Capitalized string

**Examples:**
```javascript
Helpers.capitalize('hello world');           // "Hello World"
Helpers.capitalize('HELLO WORLD');           // "Hello World"
Helpers.capitalize('mixed CaSe TEXT');       // "Mixed Case Text"
```

#### `Helpers.truncate(text, maxLength)`
Truncates text with ellipsis.

**Parameters:**
- `text` (string) - Text to truncate
- `maxLength` (number, optional) - Maximum length, defaults to 50

**Returns:** `string` - Truncated text

**Examples:**
```javascript
const longText = "This is a very long text that needs to be truncated";

Helpers.truncate(longText);                   // "This is a very long text that needs to be trunca..."
Helpers.truncate(longText, 20);              // "This is a very long..."
Helpers.truncate("Short text");              // "Short text"
```

#### `Helpers.createSlug(text)`
Converts text to URL-friendly slug.

**Parameters:**
- `text` (string) - Text to convert

**Returns:** `string` - URL slug

**Examples:**
```javascript
Helpers.createSlug('Hello World!');          // "hello-world"
Helpers.createSlug('Property #123');         // "property-123"
Helpers.createSlug('  Multiple   Spaces  '); // "multiple-spaces"
```

### DOM and UI Utilities

#### `Helpers.generateId()`
Generates unique ID string.

**Returns:** `string` - Unique ID string

**Examples:**
```javascript
Helpers.generateId();                         // "abc123def456"
Helpers.generateId();                         // "xyz789ghi012"

// Usage in components
const modalId = Helpers.generateId();
const modal = document.createElement('div');
modal.id = modalId;
```

#### `Helpers.isInViewport(element)`
Checks if element is visible in viewport.

**Parameters:**
- `element` (Element) - DOM element to check

**Returns:** `boolean` - True if element is visible

**Examples:**
```javascript
const element = document.getElementById('target');

if (Helpers.isInViewport(element)) {
    console.log('Element is visible');
    // Trigger animations or load content
}

// Lazy loading example
const images = document.querySelectorAll('img[data-src]');
window.addEventListener('scroll', () => {
    images.forEach(img => {
        if (Helpers.isInViewport(img)) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        }
    });
});
```

#### `Helpers.scrollToElement(target, offset)`
Smoothly scrolls to element.

**Parameters:**
- `target` (Element|string) - Element or selector to scroll to
- `offset` (number, optional) - Offset from top in pixels, defaults to 0

**Returns:** `void`

**Examples:**
```javascript
// Scroll to element
const targetElement = document.getElementById('section-2');
Helpers.scrollToElement(targetElement);

// Scroll to element with offset (for fixed headers)
Helpers.scrollToElement('#section-3', 80);

// Scroll to element by selector
Helpers.scrollToElement('.property-card:first-child', 100);
```

### UI Feedback

#### `Helpers.toggleLoading(show)`
Shows or hides global loading overlay.

**Parameters:**
- `show` (boolean, optional) - Whether to show loading, defaults to true

**Returns:** `void`

**Examples:**
```javascript
// Show loading
Helpers.toggleLoading(true);

// Hide loading
Helpers.toggleLoading(false);

// Usage with async operations
async function saveProperty() {
    try {
        Helpers.toggleLoading(true);
        await API.createProperty(propertyData);
        Toast.success('Property saved successfully!');
    } catch (error) {
        Toast.error('Failed to save property');
    } finally {
        Helpers.toggleLoading(false);
    }
}
```

#### `Helpers.showToast(message, type, duration)`
Shows toast notification.

**Parameters:**
- `message` (string) - Message to display
- `type` (string, optional) - Type of notification ('success', 'error', 'warning', 'info'), defaults to 'info'
- `duration` (number, optional) - Duration in milliseconds, defaults to 3000

**Returns:** `void`

**Examples:**
```javascript
// Basic notifications
Helpers.showToast('Operation completed successfully!', 'success');
Helpers.showToast('Something went wrong', 'error');
Helpers.showToast('Please check your input', 'warning');
Helpers.showToast('Information message', 'info');

// Custom duration
Helpers.showToast('This will stay longer', 'info', 5000);
Helpers.showToast('Quick message', 'success', 1000);
```

### File and Data Utilities

#### `Helpers.formatFileSize(bytes)`
Converts file size to human readable format.

**Parameters:**
- `bytes` (number) - File size in bytes

**Returns:** `string` - Formatted file size

**Examples:**
```javascript
Helpers.formatFileSize(1024);                // "1 KB"
Helpers.formatFileSize(1048576);             // "1 MB"
Helpers.formatFileSize(0);                   // "0 Bytes"
Helpers.formatFileSize(1536);               // "1.5 KB"
```

#### `Helpers.deepClone(obj)`
Deep clones an object.

**Parameters:**
- `obj` (Object) - Object to clone

**Returns:** `Object` - Cloned object

**Examples:**
```javascript
const original = {
    name: 'Property 1',
    details: {
        price: 450000,
        features: ['garage', 'pool']
    }
};

const cloned = Helpers.deepClone(original);
cloned.details.price = 500000;

console.log(original.details.price);        // 450000 (unchanged)
console.log(cloned.details.price);          // 500000
```

### Color Utilities

#### `Helpers.getContrastColor(hexColor)`
Gets contrast color (black or white) for a background color.

**Parameters:**
- `hexColor` (string) - Hex color code

**Returns:** `string` - 'black' or 'white'

**Examples:**
```javascript
Helpers.getContrastColor('#ffffff');        // "black"
Helpers.getContrastColor('#000000');        // "white"
Helpers.getContrastColor('#22c55e');        // "white"
Helpers.getContrastColor('#fbbf24');        // "black"

// Usage for dynamic text color
const backgroundColor = '#22c55e';
const textColor = Helpers.getContrastColor(backgroundColor);
element.style.color = textColor;
```

---

## 🔍 Usage Examples

### Form Validation
```javascript
function validatePropertyForm(formData) {
    const errors = [];
    
    if (!formData.email || !Helpers.isValidEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (!formData.phone || !Helpers.isValidPhone(formData.phone)) {
        errors.push('Please enter a valid phone number');
    }
    
    if (!formData.title || formData.title.length < 5) {
        errors.push('Property title must be at least 5 characters');
    }
    
    return errors;
}
```

### Search with Debouncing
```javascript
const searchInput = document.getElementById('search');
const resultsContainer = document.getElementById('results');

const performSearch = Helpers.debounce(async (query) => {
    if (!query.trim()) {
        resultsContainer.innerHTML = '';
        return;
    }
    
    try {
        Helpers.toggleLoading(true);
        const results = await API.search(query);
        displayResults(results);
    } catch (error) {
        Helpers.showToast('Search failed', 'error');
    } finally {
        Helpers.toggleLoading(false);
    }
}, 300);

searchInput.addEventListener('input', (e) => {
    performSearch(e.target.value);
});
```

### Dynamic Content Display
```javascript
function renderPropertyCard(property) {
    const truncatedDescription = Helpers.truncate(property.description, 100);
    const formattedPrice = Helpers.formatCurrency(property.price);
    const relativeTime = Helpers.getRelativeTime(property.updatedAt);
    
    return `
        <div class="property-card">
            <div class="property-price">${formattedPrice}</div>
            <h3 class="property-title">${Helpers.escapeHtml(property.title)}</h3>
            <p class="property-description">${Helpers.escapeHtml(truncatedDescription)}</p>
            <span class="property-updated">Updated ${relativeTime}</span>
        </div>
    `;
}
```

### Responsive Image Loading
```javascript
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const loadImage = (img) => {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.classList.add('loaded');
    };
    
    const checkImages = Helpers.throttle(() => {
        images.forEach(img => {
            if (img.dataset.src && Helpers.isInViewport(img)) {
                loadImage(img);
            }
        });
    }, 100);
    
    window.addEventListener('scroll', checkImages);
    window.addEventListener('resize', checkImages);
    checkImages(); // Check on initial load
}
```

---

## 🎯 Best Practices

### Performance
- **Use debounce** for search inputs and filter changes
- **Use throttle** for scroll and resize events
- **Validate input** before making API calls
- **Cache expensive calculations** when possible

### Security
- **Always escape HTML** when displaying user input
- **Validate data** on both client and server
- **Sanitize URLs** before navigation
- **Use HTTPS** for all API calls

### User Experience
- **Show loading states** for async operations
- **Provide feedback** with toast notifications
- **Handle errors gracefully** with user-friendly messages
- **Implement proper accessibility** features

### Code Quality
- **Use consistent naming** throughout the application
- **Handle edge cases** (null, undefined, empty values)
- **Add error handling** for all utility functions
- **Document complex logic** with comments

---

This utility library provides a comprehensive set of functions that handle common tasks in web applications. All functions are tested, optimized, and follow modern JavaScript best practices.