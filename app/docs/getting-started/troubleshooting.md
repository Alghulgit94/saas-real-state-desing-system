# 🔧 Troubleshooting Guide

Having issues with the Real Estate SaaS application? This guide covers common problems and their solutions, organized by category for easy reference.

## 🚀 Quick Fixes

Before diving into specific issues, try these quick fixes that solve most problems:

### 🔄 The Universal Fixes
1. **Hard refresh the page**: `Ctrl + F5` (Windows/Linux) or `Cmd + Shift + R` (Mac)
2. **Clear browser cache**: Go to DevTools > Application > Storage > Clear Site Data
3. **Check browser console**: Press `F12` and look for error messages in Console tab
4. **Try incognito/private mode**: Rules out extension conflicts
5. **Try a different browser**: Eliminates browser-specific issues

### 📱 Server Issues
```bash
# If local server isn't working, try:
cd app
python -m http.server 8080  # Try different port
# or
npx serve . -p 8080
```

---

## 🖥️ Application Not Loading

### Problem: Blank white page
**Symptoms**: Nothing appears when you visit the application URL

**Causes & Solutions**:

#### ✅ Server not running
```bash
# Check if server is running in terminal
# You should see something like "Serving HTTP on 0.0.0.0 port 8000"

# If not running, start the server:
cd app
python -m http.server 8000
```

#### ✅ Wrong URL
```bash
# Make sure you're visiting the correct URL:
http://localhost:8000          # ✅ Correct
http://localhost:8000/app      # ❌ Wrong (don't add /app)
file:///path/to/app/index.html # ❌ Won't work (CORS issues)
```

#### ✅ Port already in use
```bash
# If you see "Address already in use", try a different port:
python -m http.server 8080
# Then visit http://localhost:8080
```

### Problem: Partial loading (no styling)
**Symptoms**: HTML appears but no styling or functionality

**Causes & Solutions**:

#### ✅ CSS files not loading
1. Open DevTools (`F12`) → Network tab
2. Refresh the page
3. Look for failed requests (red entries)
4. Check if CSS files are loading from correct paths

#### ✅ File paths incorrect
```html
<!-- ✅ Correct paths in index.html -->
<link rel="stylesheet" href="../index.css">
<link rel="stylesheet" href="assets/css/components.css">

<!-- ❌ Wrong paths -->
<link rel="stylesheet" href="index.css">
<link rel="stylesheet" href="/assets/css/components.css">
```

#### ✅ CORS issues
If you see CORS errors in console:
- **Don't open files directly** in browser (file://)
- **Always use a local server** (http://localhost)

---

## 🎨 Styling Issues

### Problem: Design looks broken
**Symptoms**: Layout is messy, colors are wrong, or components look broken

#### ✅ Check CSS loading order
CSS files must load in this specific order:
```html
<link rel="stylesheet" href="../index.css">          <!-- 1. Design system -->
<link rel="stylesheet" href="assets/css/layout.css">  <!-- 2. Layout -->
<link rel="stylesheet" href="assets/css/components.css"> <!-- 3. Components -->
<link rel="stylesheet" href="assets/css/pages.css">   <!-- 4. Pages -->
```

#### ✅ Dark mode issues
```javascript
// Check if theme is properly initialized
console.log(theme.getCurrentTheme());

// Force light theme for testing
theme.setTheme('light');

// Check CSS custom properties
getComputedStyle(document.documentElement).getPropertyValue('--primary');
```

#### ✅ Mobile responsive issues
```css
/* Check viewport meta tag is present */
<meta name="viewport" content="width=device-width, initial-scale=1.0">

/* Test responsive breakpoints */
@media (max-width: 768px) {
    /* Mobile styles should apply here */
}
```

### Problem: Icons not showing
**Symptoms**: Empty squares or missing icons throughout the app

#### ✅ Lucide icons not loading
```javascript
// Check if Lucide is available
console.log(typeof lucide); // Should be 'object'

// Manually initialize icons
lucide.createIcons();

// Check internet connection (Lucide loads from CDN)
```

#### ✅ Icon names incorrect
```html
<!-- ✅ Correct icon usage -->
<i data-lucide="home" class="icon icon--sm"></i>

<!-- ❌ Common mistakes -->
<i data-lucide="house" class="icon icon--sm"></i>  <!-- Wrong name -->
<i class="lucide-home icon icon--sm"></i>          <!-- Wrong format -->
```

---

## ⚙️ JavaScript Errors

### Problem: Pages not loading
**Symptoms**: Clicking navigation doesn't change content

#### ✅ Check console errors
Common JavaScript errors and fixes:

```javascript
// Error: "router is not defined"
// Fix: Make sure router.js is loaded before other scripts

// Error: "Cannot read property 'addEventListener' of null"
// Fix: Make sure DOM elements exist before adding event listeners
const element = document.getElementById('my-element');
if (element) {
    element.addEventListener('click', handler);
}

// Error: "API is not defined"
// Fix: Make sure api.js is loaded before page controllers
```

#### ✅ Check script loading order
Scripts must load in dependency order:
```html
<!-- 1. Utilities first -->
<script src="utils/helpers.js"></script>
<script src="utils/storage.js"></script>
<script src="utils/api.js"></script>
<script src="utils/router.js"></script>
<script src="utils/theme.js"></script>

<!-- 2. Components -->
<script src="assets/js/components.js"></script>

<!-- 3. Controllers -->
<script src="assets/js/sidebar.js"></script>
<script src="assets/js/header.js"></script>

<!-- 4. Pages -->
<script src="pages/dashboard.js"></script>
<!-- ... other pages ... -->

<!-- 5. App initialization last -->
<script src="assets/js/app.js"></script>
```

### Problem: Forms not working
**Symptoms**: Form submissions don't work or validation fails

#### ✅ Event listeners not attached
```javascript
// Make sure DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners here
});

// Or check if element exists
const form = document.getElementById('my-form');
if (form) {
    form.addEventListener('submit', handleSubmit);
} else {
    console.error('Form element not found');
}
```

#### ✅ Form validation issues
```javascript
// Debug form validator
const validator = new FormValidator('#my-form', rules);
console.log('Validator errors:', validator.getErrors());
console.log('Form is valid:', !validator.hasErrors());
```

---

## 🔄 Navigation Issues

### Problem: Routes not working
**Symptoms**: URLs don't change or page navigation fails

#### ✅ Router configuration
```javascript
// Check if routes are properly defined
console.log('Current route:', router.getCurrentRoute());

// Test navigation manually
router.navigate('/properties');

// Check for route conflicts
// Make sure route patterns don't overlap
router.addRoute('/properties', handler1);      // ✅ Good
router.addRoute('/properties/:id', handler2);  // ✅ Good (more specific)
router.addRoute('/prop*', handler3);           // ❌ Too broad, conflicts
```

#### ✅ Hash routing issues
```javascript
// Check if hash is properly formatted
console.log('Current hash:', window.location.hash);

// Should be: #properties, #dashboard, etc.
// Not: properties, #/properties, etc.
```

### Problem: Sidebar navigation broken
**Symptoms**: Clicking sidebar links doesn't work

#### ✅ Data attributes missing
```html
<!-- ✅ Correct navigation link -->
<a href="#properties" class="nav-link" data-route="properties">
    Properties
</a>

<!-- ❌ Missing data-route attribute -->
<a href="#properties" class="nav-link">
    Properties
</a>
```

#### ✅ Event delegation issues
```javascript
// Check if event listeners are properly attached
document.addEventListener('click', (e) => {
    const navLink = e.target.closest('[data-route]');
    if (navLink) {
        console.log('Navigation clicked:', navLink.dataset.route);
    }
});
```

---

## 💾 Data Issues

### Problem: Data not persisting
**Symptoms**: Settings, favorites, or form data doesn't save between sessions

#### ✅ localStorage quota exceeded
```javascript
// Check localStorage usage
const storageInfo = Storage.getStorageInfo();
console.log('Storage usage:', storageInfo);

// Clear old data if needed
Storage.clear();

// Check if localStorage is available
try {
    localStorage.setItem('test', 'test');
    localStorage.removeItem('test');
    console.log('localStorage is working');
} catch (error) {
    console.error('localStorage not available:', error);
}
```

#### ✅ Incognito mode limitations
- localStorage may not persist in incognito/private mode
- Test in regular browser window

#### ✅ Data corruption
```javascript
// Check for corrupted data
try {
    const data = Storage.getItem('user_preferences');
    console.log('Data retrieved successfully:', data);
} catch (error) {
    console.error('Data corrupted, clearing:', error);
    Storage.removeItem('user_preferences');
}
```

### Problem: API calls failing
**Symptoms**: Data doesn't load or save

#### ✅ Network connectivity
```javascript
// Check online status
console.log('Online:', navigator.onLine);

// Test basic connectivity
fetch('https://httpbin.org/get')
    .then(response => console.log('Network OK'))
    .catch(error => console.error('Network issue:', error));
```

#### ✅ CORS issues (for real APIs)
```javascript
// For development, API calls might fail due to CORS
// This is normal - the app uses mock data

// Check console for CORS errors:
// "Access to fetch at 'API_URL' from origin 'localhost' has been blocked"

// Solutions:
// 1. Use CORS-enabled development server
// 2. Add CORS headers to your API
// 3. Use a CORS proxy for development
```

---

## 📱 Mobile Issues

### Problem: App doesn't work on mobile
**Symptoms**: Layout broken or functionality missing on phones/tablets

#### ✅ Viewport meta tag
```html
<!-- Must be present in <head> -->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

#### ✅ Touch events
```javascript
// Some mobile browsers need touch events
element.addEventListener('touchstart', handleTouch);
element.addEventListener('click', handleClick);
```

#### ✅ Mobile-specific CSS
```css
/* Test mobile styles */
@media (max-width: 768px) {
    .sidebar {
        /* Should transform off-screen on mobile */
        transform: translateX(-100%);
    }
}
```

### Problem: Sidebar doesn't work on mobile
**Symptoms**: Can't open/close sidebar on mobile devices

#### ✅ Mobile menu button
```javascript
// Check if mobile menu toggle exists and works
const mobileToggle = document.getElementById('mobile-menu-toggle');
if (mobileToggle) {
    console.log('Mobile toggle found');
    mobileToggle.click(); // Test programmatically
} else {
    console.error('Mobile toggle not found');
}
```

---

## 🔍 Debugging Tools

### Browser DevTools
#### Console Tab
```javascript
// Useful debugging commands
console.log('App info:', app.getAppInfo());
console.log('Current route:', router.getCurrentRoute());
console.log('Storage data:', Storage.getAllKeys());
console.log('Theme:', theme.getCurrentTheme());
```

#### Network Tab
- Check for failed resource requests (CSS, JS, images)
- Monitor API calls and responses
- Verify correct file paths

#### Application Tab
- Inspect localStorage data
- Clear site data if needed
- Check service worker status (if applicable)

#### Elements Tab
- Inspect generated HTML structure
- Modify CSS in real-time
- Check if elements have correct classes

### Logging and Debugging
```javascript
// Enable verbose logging
localStorage.setItem('debug', 'true');

// Add temporary debug logs
function debugLog(...args) {
    if (localStorage.getItem('debug')) {
        console.log('[DEBUG]', ...args);
    }
}

// Check component states
debugLog('Modal state:', modal.isOpen);
debugLog('Router state:', router.getCurrentRoute());
```

---

## 🆘 When All Else Fails

### Nuclear Options (Use with caution)

#### Clear everything and start fresh
```javascript
// Clear all localStorage data
Storage.clear();

// Clear browser cache
// Go to DevTools > Application > Storage > Clear Site Data

// Reset to default theme
theme.setTheme('light');
```

#### Download fresh copy
1. Backup any custom changes you made
2. Download a fresh copy of the project
3. Compare your changes with the original
4. Apply your changes gradually

### Getting Help

#### Prepare information for support
```javascript
// Gather diagnostic information
const diagnostics = {
    userAgent: navigator.userAgent,
    appInfo: app.getAppInfo(),
    currentRoute: router.getCurrentRoute(),
    storageInfo: Storage.getStorageInfo(),
    errors: Storage.getItem('app_errors', []),
    theme: theme.getCurrentTheme()
};

console.log('Diagnostic info:', JSON.stringify(diagnostics, null, 2));
```

#### Create a minimal reproduction
1. Start with a fresh copy of the app
2. Make the minimal changes needed to reproduce the issue
3. Document exact steps to reproduce
4. Include browser and system information

---

## 📋 Prevention Checklist

### Before Making Changes
- [ ] Test in multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test on different screen sizes (mobile, tablet, desktop)
- [ ] Check console for errors before and after changes
- [ ] Backup working version before major modifications

### After Making Changes
- [ ] Hard refresh to clear cache
- [ ] Test all major functionality (navigation, forms, search)
- [ ] Check that existing features still work
- [ ] Verify responsive design works
- [ ] Test in both light and dark modes

### Regular Maintenance
- [ ] Clear browser cache periodically
- [ ] Update browser to latest version
- [ ] Check for JavaScript errors in console
- [ ] Monitor localStorage usage
- [ ] Backup important customizations

---

Remember: Most issues are caused by simple problems like file paths, loading order, or browser cache. Start with the basics before diving into complex debugging!