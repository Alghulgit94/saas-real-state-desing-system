# 🚀 Quick Start Guide

Get the Real Estate SaaS application running in just 5 minutes! This guide is perfect for developers who want to see the application in action quickly.

## ⚡ 5-Minute Setup

### Step 1: Get the Code
You should already have the project folder. If not, download or clone it to your computer.

### Step 2: Start a Local Server
Choose the method that works for you:

#### Option A: Python (Most Common)
```bash
cd app
python -m http.server 8000
```

#### Option B: Node.js
```bash
cd app
npx serve .
```

#### Option C: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Step 3: Open in Browser
Navigate to `http://localhost:8000` (or the port shown in your terminal)

🎉 **That's it!** The application should be running.

## 🎯 What You'll See

### Dashboard
![Dashboard](../assets/dashboard-preview.png)
- Overview statistics for properties, clients, and revenue
- Recent activities feed
- Quick action buttons
- Modern, professional interface

### Navigation
- **Sidebar**: Main navigation with Dashboard, Properties, Clients, Agents, etc.
- **Header**: Global search and user actions
- **Theme Toggle**: Switch between light and dark modes

### Key Features to Try
1. **🏠 Properties Page**: Browse property listings with filters
2. **🔍 Search**: Try the global search in the header
3. **🌙 Dark Mode**: Click the theme toggle button
4. **📱 Mobile**: Resize your browser to see responsive design
5. **➕ Add Property**: Click the "Add Property" button to see modal forms

## 🎮 Interactive Demo

Try these actions to see the application in action:

### 1. Navigate Between Pages
```
Click: Dashboard → Properties → Clients → Agents
```
Notice how the URL changes and content loads without page refresh.

### 2. Filter Properties
```
Go to Properties page → Use the filter dropdowns
```
See real-time filtering with immediate results.

### 3. Search Functionality
```
Click the search bar in header → Type "oak"
```
Watch the search suggestions appear.

### 4. Add New Property
```
Click "Add Property" button → Fill out the form
```
Experience the modal system and form validation.

### 5. Toggle Theme
```
Click the moon/sun icon (bottom right) → See theme change
```
Notice how all colors and components adapt.

## 🛠️ Development Mode

If you want to make changes and see them instantly:

### Auto-Refresh Setup
```bash
# Install browser-sync globally (one time)
npm install -g browser-sync

# Start development server
cd app
browser-sync start --server --files "**/*"
```

This will:
- Start a local server
- Open your browser automatically
- Refresh the page when you save files
- Show changes across multiple devices

## 📱 Testing Responsive Design

### Quick Device Testing
1. **Desktop**: Default view (1200px+)
2. **Tablet**: Resize browser to ~768px width
3. **Mobile**: Resize browser to ~375px width

### Browser DevTools
1. Press `F12` to open DevTools
2. Click the device icon (toggle device toolbar)
3. Select different device presets
4. Test touch interactions

## 🔧 Common Quick Fixes

### Port Already in Use?
```bash
# Try a different port
python -m http.server 8080
# or
npx serve . -p 8080
```

### Browser Cache Issues?
```bash
# Hard refresh
Ctrl + F5 (Windows/Linux)
Cmd + Shift + R (Mac)
```

### CORS Errors in Console?
This is normal for local development. The app will work fine, but you might see warnings in the console.

## 🎯 Next Steps

Now that you have the app running, here's what to explore next:

### For Learning the Codebase
👉 [Understanding the Codebase](./codebase-tour.md)

### For Building Your First Feature
👉 [Your First Feature Tutorial](./first-feature.md)

### For Customizing the Design
👉 [Component Library](../components/library.md)

### For Understanding the Architecture
👉 [System Overview](../architecture/overview.md)

## 🆘 Troubleshooting

### App Not Loading?
1. ✅ Check if the server is running in the terminal
2. ✅ Verify you're visiting the correct URL
3. ✅ Try a different browser
4. ✅ Check browser console for errors (`F12` → Console tab)

### Styling Looks Broken?
1. ✅ Hard refresh the page (`Ctrl + F5`)
2. ✅ Check if CSS files are loading (Network tab in DevTools)
3. ✅ Verify you're in the `app` directory

### JavaScript Not Working?
1. ✅ Check browser console for errors
2. ✅ Ensure you're using a modern browser (Chrome, Firefox, Safari, Edge)
3. ✅ Try disabling browser extensions temporarily

## 💡 Pro Tips

### Keyboard Shortcuts
- `Ctrl + K` (or `Cmd + K`): Focus global search
- `Ctrl + /` (or `Cmd + /`): Show keyboard shortcuts help
- `Esc`: Close modals and dropdowns

### Developer Tools
- **Console**: See application logs and errors
- **Network**: Monitor API calls and asset loading
- **Application**: Inspect localStorage data
- **Elements**: Inspect and modify CSS in real-time

### Best Practices
- Keep the browser console open while developing
- Test in multiple browsers and screen sizes
- Use the network tab to understand data flow
- Experiment with different theme modes

---

## 🎉 Congratulations!

You now have a fully functional Real Estate SaaS application running locally. The app includes:

- ✅ Complete property management system
- ✅ Client and agent management
- ✅ Advanced search and filtering
- ✅ Responsive design for all devices
- ✅ Dark/light theme support
- ✅ Professional UI components

Ready to dive deeper? Continue with [Understanding the Codebase](./codebase-tour.md) to learn how everything works under the hood!