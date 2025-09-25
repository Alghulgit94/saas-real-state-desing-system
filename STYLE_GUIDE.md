# Real Estate SaaS Design System Style Guide

## Overview

This design system is built for a modern real estate SaaS platform, emphasizing professionalism, trust, and clarity. The system uses a carefully curated hex color palette optimized for real estate applications and maintains excellent accessibility standards.

## Color System

### Color Philosophy
Our color palette uses carefully selected hex colors optimized for real estate applications, emphasizing trust, growth, and professionalism. The palette features vibrant greens suggesting prosperity and growth, complemented by clean blues and neutral grays for excellent readability and accessibility across all interfaces.

### Semantic Color Tokens

#### Primary Theme Colors
- **Background**: `#f0f8ff` - Light blue background for clean, professional appearance
- **Foreground**: `#374151` - Dark gray for primary text content
- **Primary**: `#22c55e` - Vibrant green conveying growth and prosperity
- **Primary Foreground**: `#ffffff` - Pure white for optimal contrast on primary

#### Secondary & Accent Colors
- **Secondary**: `#e0f2fe` - Light blue for secondary actions and backgrounds
- **Secondary Foreground**: `#4b5563` - Medium gray for text on secondary backgrounds
- **Accent**: `#d1fae5` - Light green for highlights and call-to-action elements
- **Accent Foreground**: `#374151` - Dark gray for text on accent backgrounds

#### UI Component Colors
- **Card**: `#ffffff` - Pure white for content cards and panels
- **Card Foreground**: `#374151` - Dark gray for text on card backgrounds
- **Popover**: `#ffffff` - White for dropdown and popover backgrounds
- **Popover Foreground**: `#374151` - Dark gray for popover text
- **Muted**: `#f3f4f6` - Light gray for subtle backgrounds
- **Muted Foreground**: `#6b7280` - Medium gray for secondary text

#### Utility & Form Colors
- **Border**: `#e5e7eb` - Light gray for borders and separators
- **Input**: `#e5e7eb` - Input field border color
- **Ring**: `#22c55e` - Focus ring color (matches primary)

#### Status & Feedback Colors
- **Destructive**: `#ef4444` - Red for error states and destructive actions
- **Destructive Foreground**: `#ffffff` - White text on destructive backgrounds

### Dark Mode Colors

Our dark mode maintains the same semantic meaning while providing a sophisticated, professional appearance suitable for extended use in low-light environments.

#### Dark Primary Theme Colors
- **Background**: `#0f172a` - Deep slate background for reduced eye strain
- **Foreground**: `#d1d5db` - Light gray for excellent readability
- **Primary**: `#34d399` - Brighter emerald green for visibility on dark backgrounds
- **Primary Foreground**: `#0f172a` - Dark text on primary elements

#### Dark Secondary & Accent Colors
- **Secondary**: `#2d3748` - Medium dark gray for secondary elements
- **Secondary Foreground**: `#a1a1aa` - Light gray for secondary text
- **Accent**: `#374151` - Dark accent for subtle highlights
- **Accent Foreground**: `#a1a1aa` - Light gray for accent text

#### Dark UI Component Colors
- **Card**: `#1e293b` - Elevated dark surface for content cards
- **Card Foreground**: `#d1d5db` - Light text on card backgrounds
- **Popover**: `#1e293b` - Dark popover and dropdown backgrounds
- **Popover Foreground**: `#d1d5db` - Light text for popovers
- **Muted**: `#1e293b` - Muted dark backgrounds
- **Muted Foreground**: `#6b7280` - Medium gray for secondary text

#### Dark Utility & Form Colors
- **Border**: `#4b5563` - Medium gray borders for dark mode
- **Input**: `#4b5563` - Input field borders in dark mode
- **Ring**: `#34d399` - Bright green focus ring

#### Dark Status & Feedback Colors
- **Destructive**: `#ef4444` - Red for errors (consistent across modes)
- **Destructive Foreground**: `#0f172a` - Dark text on destructive backgrounds

#### Dark Chart & Visualization Colors
- **Chart 1**: `#34d399` - Bright emerald for primary data
- **Chart 2**: `#2dd4bf` - Teal for secondary data
- **Chart 3**: `#22c55e` - Green for tertiary data
- **Chart 4**: `#10b981` - Darker green for quaternary data
- **Chart 5**: `#059669` - Deep green for additional series

#### Dark Sidebar & Navigation Colors
- **Sidebar Background**: `#1e293b` - Dark navigation background
- **Sidebar Foreground**: `#d1d5db` - Light navigation text
- **Sidebar Primary**: `#34d399` - Bright green for active states
- **Sidebar Primary Foreground**: `#0f172a` - Dark text on active elements
- **Sidebar Accent**: `#374151` - Dark accent for hover states
- **Sidebar Accent Foreground**: `#a1a1aa` - Light text on hover
- **Sidebar Border**: `#4b5563` - Medium gray for navigation borders
- **Sidebar Ring**: `#34d399` - Green focus ring for navigation

### Chart & Visualization Colors

Five-color palette optimized for charts and data representation:
- **Chart 1**: `#22c55e` - Primary green for main data series
- **Chart 2**: `#10b981` - Emerald green for secondary data
- **Chart 3**: `#059669` - Medium green for tertiary data
- **Chart 4**: `#047857` - Dark green for quaternary data
- **Chart 5**: `#065f46` - Deep green for additional data series

### Sidebar & Navigation Colors

Dedicated color tokens for navigation and sidebar components:
- **Sidebar Background**: `#e0f2fe` - Light blue background for navigation areas
- **Sidebar Foreground**: `#374151` - Dark gray for navigation text
- **Sidebar Primary**: `#22c55e` - Green for active navigation states
- **Sidebar Primary Foreground**: `#ffffff` - White text on active states
- **Sidebar Accent**: `#d1fae5` - Light green for hover and focus states
- **Sidebar Accent Foreground**: `#374151` - Dark gray text on hover states
- **Sidebar Border**: `#e5e7eb` - Light gray for sidebar borders
- **Sidebar Ring**: `#22c55e` - Green focus ring for navigation elements

## Typography

### Font Families
- **Sans-serif**: `DM Sans` - Modern, friendly, and highly legible
- **Serif**: `Lora` - Elegant serif for headings and emphasis
- **Monospace**: `IBM Plex Mono` - Technical content and code

### Type Scale
Our typography system follows a modular scale approach:

```css
/* Headings */
.text-4xl { font-size: 2.25rem; line-height: 2.5rem; }  /* 36px */
.text-3xl { font-size: 1.875rem; line-height: 2.25rem; } /* 30px */
.text-2xl { font-size: 1.5rem; line-height: 2rem; }     /* 24px */
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }  /* 20px */
.text-lg { font-size: 1.125rem; line-height: 1.75rem; } /* 18px */

/* Body */
.text-base { font-size: 1rem; line-height: 1.5rem; }    /* 16px */
.text-sm { font-size: 0.875rem; line-height: 1.25rem; } /* 14px */
.text-xs { font-size: 0.75rem; line-height: 1rem; }     /* 12px */
```

### Font Weights
- **Light**: 300 - Subtle text, large headings
- **Normal**: 400 - Body text, standard content
- **Medium**: 500 - Emphasis, button text
- **Semibold**: 600 - Headings, important content
- **Bold**: 700 - Strong emphasis

## Spacing System

Based on a 4px base unit (`--spacing: 0.25rem`):

```css
/* Spacing Scale */
.space-1 { /* 4px */ }
.space-2 { /* 8px */ }
.space-3 { /* 12px */ }
.space-4 { /* 16px */ }
.space-6 { /* 24px */ }
.space-8 { /* 32px */ }
.space-12 { /* 48px */ }
.space-16 { /* 64px */ }
.space-20 { /* 80px */ }
.space-24 { /* 96px */ }
```

## Border Radius System

Clean radius system with 0.5rem base for consistent, professional aesthetics:

- **Base Radius**: `var(--radius)` = `0.5rem` (8px at 16px base font size)
- **Small**: `var(--radius-sm)` = `calc(var(--radius) - 0.125rem)` = `0.375rem` (6px) - Badges, small elements
- **Medium**: `var(--radius-md)` = `var(--radius)` = `0.5rem` (8px) - Option elements, inner components  
- **Large**: `var(--radius-lg)` = `var(--radius)` = `0.5rem` (8px) - Cards, buttons, inputs (primary radius)
- **Extra Large**: `var(--radius-xl)` = `calc(var(--radius) + 0.25rem)` = `0.75rem` (12px) - Large containers

**Current Implementation**: All major components (buttons, cards, inputs, dropdowns, search bars, navigation links) consistently use `var(--radius)` = `0.5rem`.

The rem-based radius system provides:
- **Scalability**: Radius scales with user's font size preferences
- **Accessibility**: Respects user system settings for better accessibility
- **Consistency**: Unified 0.5rem radius across all interactive elements
- **Professional appearance**: Clean, modern aesthetic suitable for real estate platforms

## Shadow System

Seven-level elevation system using consistent shadow tokens:

- **2xs**: `0px 4px 8px -1px hsl(0 0% 0% / 0.05)` - Subtle lift
- **xs**: `0px 4px 8px -1px hsl(0 0% 0% / 0.05)` - Light elevation
- **sm**: `0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 1px 2px -2px hsl(0 0% 0% / 0.10)` - Card elevation
- **default**: `0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 1px 2px -2px hsl(0 0% 0% / 0.10)` - Standard elevation
- **md**: `0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 2px 4px -2px hsl(0 0% 0% / 0.10)` - Raised elements
- **lg**: `0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 4px 6px -2px hsl(0 0% 0% / 0.10)` - Floating elements
- **xl**: `0px 4px 8px -1px hsl(0 0% 0% / 0.10), 0px 8px 10px -2px hsl(0 0% 0% / 0.10)` - Modals, dropdowns
- **2xl**: `0px 4px 8px -1px hsl(0 0% 0% / 0.25)` - Maximum elevation

## Icon System

### Lucide Icons Integration
The design system uses **Lucide Icons** (ISC License - commercial-friendly) for all iconography:

- **Consistent style**: Outlined icons with 2px stroke width
- **Four size variants**: 
  - `icon--sm`: 0.875rem (14px) - Inline text icons
  - `icon--md`: 1rem (16px) - Default size
  - `icon--lg`: 1.25rem (20px) - Emphasis icons
  - `icon--xl`: 1.5rem (24px) - Large display icons
- **Semantic usage**: Icons should enhance, not replace, text labels
- **Accessibility**: Icons include appropriate ARIA labels when needed

### Real Estate Specific Icons
Common icons for real estate applications:
- **Properties**: `home`, `building`, `map-pin`, `key`
- **Features**: `bed`, `bath`, `car`, `square` (for sq ft)
- **Actions**: `edit`, `eye`, `trash-2`, `plus`, `check-circle`
- **Navigation**: `layout-dashboard`, `users`, `bar-chart`, `settings`
- **Interface**: `search`, `chevron-down`, `more-horizontal`, `calendar`

### Usage Guidelines
```html
<!-- Basic icon usage -->
<i data-lucide="home" class="icon icon--sm"></i>

<!-- Icon with text -->
<button class="btn btn--primary">
  <i data-lucide="plus" class="icon icon--sm" style="margin-right: 0.5rem;"></i>
  Add Property
</button>

<!-- Icon in cards -->
<div class="property-card__location">
  <i data-lucide="map-pin" class="icon icon--sm" style="margin-right: 0.25rem;"></i>
  123 Oak Street, Downtown
</div>
```

## Component Guidelines

### Buttons
All buttons use consistent 0.5rem border radius (`var(--radius)`):
- **Primary**: Main actions with Lucide icons for clarity
- **Secondary**: Supporting actions with consistent iconography
- **Destructive**: Delete/remove actions with warning icons
- **Ghost**: Minimal footprint actions with subtle icons
- **Outline**: Alternative actions with clear icon/text pairing
- **Size variants**: Small (2rem), Default (2.5rem), Large (3rem) heights

### Cards
Professional card system with clean aesthetics:
- **Background**: Pure white with subtle shadows
- **Border radius**: 0.5rem (`var(--radius)`) for consistent, professional appearance
- **Structure**: Header, content, footer with consistent spacing
- **Icons**: Lucide icons for visual hierarchy and context
- **Property cards**: Real estate specific with price, features, and location icons

### Forms
Comprehensive form system with enhanced UX:
- **Input fields**: 0.5rem border radius with icon integration
- **Custom select**: JavaScript-powered with Lucide chevron icons
- **Focus states**: Consistent ring color and smooth transitions
- **Icon placement**: Left-aligned icons for context (mail, dollar-sign, map-pin)
- **Labels**: Clear hierarchy with proper spacing

### Navigation
Professional sidebar navigation system:
- **Sidebar tokens**: Dedicated color system for navigation
- **Active states**: Clear visual feedback with background changes
- **Hover effects**: Smooth transitions with accent colors
- **Icons**: Lucide icons for all navigation items
- **Typography**: Consistent sizing and spacing
- **Border radius**: 0.5rem (`var(--radius)`) for navigation links

## Accessibility Standards

### Contrast Ratios
All color combinations meet WCAG 2.1 AA standards:
- Normal text: minimum 4.5:1
- Large text: minimum 3:1
- Interactive elements: minimum 3:1

### Focus Management
- Visible focus indicators using ring color
- Keyboard navigation support
- Skip links for screen readers

### Color Independence
- Never rely solely on color to convey information
- Include icons, text, or patterns as alternatives
- Ensure dark mode maintains accessibility

## Usage Guidelines

### Do's
- Use semantic color tokens, not hard-coded values
- Maintain consistent spacing using the spacing scale
- Apply shadows purposefully for elevation hierarchy
- Test components in both light and dark modes

### Don'ts
- Don't create new colors outside the system
- Don't mix different corner radius values arbitrarily
- Don't use shadows for decoration only
- Don't compromise accessibility for aesthetics
- Don't use icons without text labels in critical interfaces
- Don't override the consistent 0.5rem radius without system justification

## Interactive Components

### Custom Select Component
JavaScript-powered select component with enhanced UX:
- **Trigger**: Styled to match input fields with chevron icon
- **Options**: Dropdown with hover states and selection feedback
- **Keyboard support**: Enter, Space, and Escape key handling
- **Accessibility**: ARIA attributes for screen readers
- **Styling**: Consistent with design system radius and colors

### Dropdown Menus
Flexible dropdown system for actions and navigation:
- **Positioning**: Absolute positioning with proper z-index
- **Animation**: Smooth show/hide transitions
- **Click handling**: Outside click to close functionality
- **Content**: Support for icons, text, and separator lines
- **Variants**: Property actions, user menus, filter options

### Search Components
Professional search interface:
- **Input**: Integrated icon with transparent background
- **Button**: Primary colored action button with search icon
- **Container**: Card-like styling with subtle shadows
- **Placeholder**: Clear instructional text for context

### Theme Toggle
Dark/light mode switching:
- **Persistence**: localStorage for user preference
- **Icons**: Dynamic Lucide icons (moon/sun) based on state
- **Positioning**: Fixed positioning for easy access
- **Integration**: Seamless switching between color modes

## Real Estate SaaS Specific Considerations

### Trust and Professionalism
- **Green primary color** suggests growth and financial success
- **Consistent 0.5rem border radius** creates clean, professional appearance that scales with accessibility preferences
- **Clean iconography** with Lucide icons reduces visual noise
- **Consistent typography** builds familiarity and trust

### Property-Focused Components
- **Property cards**: Dedicated layouts with pricing, features, and location
- **Feature icons**: Bed, bath, car, square footage with consistent styling
- **Location integration**: Map pin icons with address information
- **Price highlighting**: Primary color for price emphasis

### Data Visualization
- **Five-color chart palette** provides clear data distinction
- **OKLCH colors** ensure consistent visual weight
- **Dark mode support** for extended data analysis sessions
- **Icon integration** for chart legends and data points

### User Experience Enhancements
- **Sidebar system** for complex real estate navigation
- **Card-based layouts** for property and client listings
- **Interactive components** with smooth animations and feedback
- **Search functionality** with contextual icons and clear actions
- **Mobile-first approach** with responsive grid systems

### Professional Interface Elements
- **Avatar system** for client and agent representation
- **Badge system** for property status (For Sale, Pending, Sold)
- **Action dropdowns** for property management tasks
- **Form validation** with clear error states and guidance
- **Loading states** with appropriate feedback mechanisms

---

*This style guide should be treated as a living document, updated as the design system evolves.*