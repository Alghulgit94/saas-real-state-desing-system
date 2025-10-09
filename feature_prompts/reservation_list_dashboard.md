Task: Implement Dashboard with Reservation Stats Cards and Filterable List
Context
This is a back-office manager app for a real estate reservation system. I need to display reservation data from Supabase on the dashboard view using the existing design system.
Project Files Reference

Design System: STYLE_GUIDE.md - Follow all design patterns, colors, typography, and component styles defined here
Database Client: supabase-client.js - Adapt this client to work with the manager app architecture
Database Structure: See reservation-db.md for complete schema
Sample Data: See reservation_list.json for data structure reference
Frontend Agent: Use @agent/frontend_architech.md for frontend design patterns and methods

Visual Reference
I've provided two reference images:

Stats Cards Layout - Four card metrics in a horizontal row
Reservation List Table - Clean table with pagination and action buttons

Requirements
Part 1: Stats Cards (Top Section)
Create 4 metric cards in a horizontal row displaying aggregated reservation data:
Card 1 - Total Reservations (Dark background, first card highlighted)

Icon: Document/List icon
Main value: Total count of reservations
Secondary value: Change indicator (e.g., +X from last period)

Card 2 - Total Income (Light background)

Icon: Dollar sign icon
Main value: Sum of all lot_details.precio_usd formatted as $XXX,XXX.XX
Secondary value: Change indicator

Card 3 - Pending Reservations (Light background)

Icon: Users/Clock icon
Main value: Count where status = 'pending'
Secondary value: Change indicator

Card 4 - Conversion Rate (Light background)

Icon: Check/User icon
Main value: Percentage of confirmed reservations (confirmed/total * 100)
Secondary value: Change percentage indicator

Card Design (from STYLE_GUIDE.md):

Rounded corners
Appropriate padding and spacing
Icon positioned top-right
Main value large and bold
Secondary value smaller, muted color
First card has dark background, others light with border

Part 2: Reservations List Table
Table Structure:
Display reservations in a clean, paginated table with these columns:

Name - first_name + " " + last_name
Email - email
Phone - phone
Lot - Extract from lot_details.nombre (e.g., "Lote 1", "Lote 21")
Price - Extract from lot_details.precio_usd, format as $XX,XXX USD
Date - Format reservation_date as dd/MM/yyyy
Status - Display status with appropriate badge/pill styling
Actions - Two buttons: "Options" and "Details"

Table Features:

Header row with column titles
Clean row separation (subtle borders or alternating background)
Responsive design following STYLE_GUIDE.md
Pagination at bottom (showing page numbers: 1, 2, 3, 4, 5, ..., 20)
Settings/options icon button in top-right corner
Table title: "Recent Reservations" or "Reservations"

Data Ordering:

Sort by created_at DESC (most recent first)
Show latest reservations at top

Part 3: Multi-Filter Functionality
Implement filter controls above the table that allow filtering by multiple criteria simultaneously:
Filter Options:

Name Filter - Text input to search by first_name or last_name (case-insensitive)
Price Range Filter - Min/Max inputs or slider for lot_details.precio_usd
Date Range Filter - Date picker for reservation_date (from/to)
Status Filter - Dropdown/checkboxes for status values (pending, confirmed, cancelled)

Filter Behavior:

Filters are additive (AND logic) - all active filters must match
Example: Name="Omar" AND Price > $50,000 AND Status="pending"
Real-time filtering or "Apply Filters" button (follow STYLE_GUIDE.md patterns)
Clear/Reset filters button
Show filtered count (e.g., "Showing 5 of 9 reservations")

Filter UI Placement:

Position filter controls between stats cards and table
Horizontal layout for filters (responsive to stack on mobile if needed)
Follow spacing and styling from STYLE_GUIDE.md

Technical Implementation
Supabase Integration
javascript// Adapt supabase-client.js to manager app structure
// Fetch reservations data
const { data: reservations, error } = await supabase
  .from('reservations')
  .select('*')
  .order('created_at', { ascending: false });

// Process lot_details JSON fields
reservations.forEach(reservation => {
  const lotName = reservation.lot_details?.nombre;
  const lotPrice = reservation.lot_details?.precio_usd;
  // Use these values in display
});
Data Processing

Calculate stats from fetched reservations array
Format prices with commas and 2 decimals
Format dates using dd/MM/yyyy pattern
Extract nested JSON data from lot_details
Handle null/missing data gracefully

Styling

Use design system from STYLE_GUIDE.md exclusively
Match card styling to reference image (dark first card, light others)
Table styling with clean rows and proper spacing
Status badges with color coding (pending=yellow/orange, confirmed=green, cancelled=red/gray)
Responsive design for all screen sizes

CRITICAL - DO NOT MODIFY:

❌ DO NOT touch other dashboard components/sections
❌ DO NOT modify navigation, sidebar, or header
❌ DO NOT add features beyond specified scope
❌ DO NOT create new design patterns - use STYLE_GUIDE.md
❌ DO NOT modify database schema or supabase-client.js structure (only adapt it)
✅ ONLY implement: stats cards, reservations table, and filters

File Scope

Create/modify: Dashboard view component file
Adapt: supabase-client.js to manager app (if needed)
Reference: STYLE_GUIDE.md for all styling decisions
DO NOT create unnecessary new files

Expected Outcome

Dashboard displays 4 stat cards with reservation metrics at top
Clean, paginated table showing all reservations below cards
Multi-filter functionality working with additive logic
All data fetched from Supabase and properly formatted
Design matches reference images and STYLE_GUIDE.md
Responsive and functional UI

Use @agent/frontend_architech.md to:

Analyze current manager app structure
Determine best component architecture
Implement filtering logic efficiently
Apply design system consistently
Ensure proper data flow from Supabase


Note: Focus on clean, maintainable code. Follow the established patterns in the project. The stats calculations should be dynamic based on actual data, not hardcoded values.