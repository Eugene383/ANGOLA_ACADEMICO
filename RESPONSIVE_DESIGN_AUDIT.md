# Responsive Design Audit - AngolaAcadémico

**Date:** 2026-06-14  
**Total Files Analyzed:** 35 (.tsx files)  
**Components:** 10 | **Pages/Layouts:** 25

---

## CRITICAL ISSUES (Must Fix)

### 1. **Fixed Sidebar Width - BLOCKS MOBILE LAYOUT**
- **File:** [src/components/dashboard/Sidebar.tsx](src/components/dashboard/Sidebar.tsx)
- **Issue:** `w-60` (240px fixed width)
- **Impact:** Sidebar consumes entire mobile screen, content not visible
- **Affects:** All dashboard pages through [src/components/dashboard/DashboardWrapper.tsx](src/components/dashboard/DashboardWrapper.tsx)
- **Solution:** Add responsive classes: `hidden lg:flex lg:w-60` + mobile hamburger menu

### 2. **Dashboard Layout Not Responsive**
- **File:** [src/components/dashboard/DashboardWrapper.tsx](src/components/dashboard/DashboardWrapper.tsx)
- **Issue:** Flexbox layout with fixed sidebar - `<div className="flex h-screen">`
- **Problem:** No mobile breakpoints, sidebar forces horizontal layout on small screens
- **Solution:** Wrap in conditional: mobile shows stacked layout, desktop shows sidebar layout

### 3. **Form Fields Not Stacking on Mobile**
- **File:** [src/app/(dashboard)/admin/ies/nova/page.tsx](src/app/(dashboard)/admin/ies/nova/page.tsx#L57)
- **Issue:** `grid grid-cols-2 gap-4` on form fields - no mobile breakpoint
- **Impact:** Form fields cramped on mobile screens
- **Fix:** Change to `grid grid-cols-1 md:grid-cols-2 gap-4`

---

## HIGH PRIORITY ISSUES (Should Fix)

### 4. **Header Component - Static Padding**
- **File:** [src/components/dashboard/Header.tsx](src/components/dashboard/Header.tsx)
- **Issue:** Fixed `px-6` padding (24px on all screen sizes)
- **Problem:** Header crowded on mobile devices
- **Fix:** Add responsive padding: `px-4 sm:px-6 lg:px-8`

### 5. **Filter Section - 2 Column Grid on Mobile**
- **File:** [src/app/(dashboard)/admin/ies/page.tsx](src/app/(dashboard)/admin/ies/page.tsx#L71)
- **Issue:** `grid grid-cols-2 gap-4` for province/nature filters
- **Problem:** Filters cramped on small screens
- **Fix:** `grid grid-cols-1 md:grid-cols-2 gap-4`

### 6. **Mobile Menu Implementation Incomplete**
- **File:** [src/components/Navbar.tsx](src/components/Navbar.tsx)
- **Issue:** Mobile menu button exists but full implementation not visible (likely cut off in file)
- **Problem:** `mobileOpen` state tracked but modal/menu not shown in visible code
- **Fix:** Verify mobile menu dropdown is properly implemented with fixed/absolute positioning

### 7. **Data Tables Not Horizontally Scrollable on All Mobile**
- **Files:**
  - [src/components/dashboard/TabelaUtilizadores.tsx](src/components/dashboard/TabelaUtilizadores.tsx#L60)
  - [src/app/(public)/explorar/ies/page.tsx](src/app/(public)/explorar/ies/page.tsx#L71)
  - [src/app/(public)/explorar/cursos/page.tsx](src/app/(public)/explorar/cursos/page.tsx#L67)
  - [src/app/(dashboard)/admin/ies/page.tsx](src/app/(dashboard)/admin/ies/page.tsx#L123)
  - [src/app/(public)/explorar/provincia/[id]/page.tsx](src/app/(public)/explorar/provincia/[id]/page.tsx#L148)
- **Issue:** Tables use `overflow-x-auto` but have many columns with small text
- **Problem:** Text becomes unreadable on mobile even with scroll
- **Fix:** 
  - Option 1: Hide non-critical columns on mobile using `hidden md:table-cell`
  - Option 2: Convert to card layout on mobile (`md:table`)
  - Option 3: Implement horizontal scroll with better UX indicators

### 8. **Chart Height Fixed**
- **File:** [src/components/dashboard/GraficoProvincias.tsx](src/components/dashboard/GraficoProvincias.tsx#L38)
- **Issue:** `height={280}` - hardcoded pixel value
- **Problem:** Chart might be too tall on mobile or too short on desktop
- **Fix:** Use responsive height: `height={width < 768 ? 200 : 280}` or responsive container

---

## MEDIUM PRIORITY ISSUES (Nice to Have)

### 9. **Province Grid Too Wide on Small Screens**
- **File:** [src/app/(public)/explorar/page.tsx](src/app/(public)/explorar/page.tsx#L148)
- **Issue:** `grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2`
- **Problem:** 3 columns on mobile = each item ~93px width, text cramped
- **Fix:** `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6` or add responsive text sizing

### 10. **Hero Section Padding Inconsistency**
- **File:** [src/app/(public)/explorar/page.tsx](src/app/(public)/explorar/page.tsx#L82)
- **Issue:** `py-12` (48px) on small screens might be excessive
- **Fix:** `py-6 sm:py-12` for better mobile spacing

### 11. **Search Input Not Responsive Width**
- **File:** [src/app/(public)/explorar/page.tsx](src/app/(public)/explorar/page.tsx#L95)
- **Issue:** Form uses `max-w-2xl` which is good, but on very small screens (< 320px) could overflow
- **Fix:** Add minimum padding: `px-4 sm:px-6 lg:px-8` wrapper

### 12. **Stats Grid - 4 Columns on All Sizes**
- **Files:**
  - [src/app/(dashboard)/admin/page.tsx](src/app/(dashboard)/admin/page.tsx#L90)
  - [src/app/(public)/explorar/page.tsx](src/app/(public)/explorar/page.tsx#L128)
  - [src/app/(public)/explorar/provincia/[id]/page.tsx](src/app/(public)/explorar/provincia/[id]/page.tsx#L118)
- **Current:** Some use `grid-cols-2 lg:grid-cols-4` ✓ (good)
- **Issue:** Others use `grid-cols-1 sm:grid-cols-2 xl:grid-cols-3` (less optimal breakpoints)
- **Fix:** Standardize to `grid-cols-2 lg:grid-cols-4` for consistency

### 13. **Hardcoded Sizes in TabelaIES Component**
- **File:** [src/components/dashboard/TabelaIES.tsx](src/components/dashboard/TabelaIES.tsx)
- **Issue:** `max-h-80` (320px) on scrollable container
- **Problem:** On mobile, this constraint might force unnecessary scrolling
- **Fix:** `max-h-60 sm:max-h-80` responsive max-height

### 14. **Logo Text Might Overflow**
- **Files:**
  - [src/components/Navbar.tsx](src/components/Navbar.tsx#L74)
  - [src/components/dashboard/Sidebar.tsx](src/components/dashboard/Sidebar.tsx#L55)
- **Issue:** Logo text "AngolaAcadémico" is long
- **Problem:** Could wrap or overflow on very narrow screens (< 280px)
- **Fix:** Add responsive text sizing: `text-base sm:text-lg` or use abbreviated version on mobile

### 15. **IES Dashboard Header Layout**
- **File:** [src/app/ies/dashboard/layout.tsx](src/app/ies/dashboard/layout.tsx#L4)
- **Issue:** `flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between` is good
- **Problem:** On tablet (sm), text + 2 buttons might wrap awkwardly
- **Fix:** Might need additional `md:` breakpoint or allow button wrapping

### 16. **Form Input Padding Consistency**
- **Files:**
  - [src/app/(auth)/login/page.tsx](src/app/(auth)/login/page.tsx#L58)
  - [src/app/(auth)/register/page.tsx](src/app/(auth)/register/page.tsx#L64)
  - [src/app/(dashboard)/admin/ies/nova/page.tsx](src/app/(dashboard)/admin/ies/nova/page.tsx#L130)
- **Issue:** All use `px-4 py-2.5` which is good, but check mobile hit targets
- **Problem:** Input height should be >= 44px for mobile accessibility (current is ~36px with padding)
- **Fix:** Increase height on mobile: `py-2.5 sm:py-2.5` or use `min-h-[44px]`

---

## RESPONSIVE DESIGN PATTERNS - ISSUES BY CATEGORY

### Navigation Issues
1. **Navbar** - No full mobile menu visible in code
2. **Sidebar** - Fixed width blocks mobile entirely
3. **IES Dashboard Tabs** - May wrap on tablet sizes

### Layout Issues
1. **Main Dashboard** - Sidebar + content not responsive
2. **Forms** - 2-column grids without mobile breakpoints
3. **Filters** - Multi-column selects don't stack on mobile

### Table/Data Issues
1. All data tables rely on `overflow-x-auto` without column hiding
2. Text in tables too small on mobile scrolling
3. No card-based mobile alternative layouts

### Typography Issues
1. Logo text potential overflow
2. Long content strings not considered for mobile
3. Fixed font sizes in some places

### Spacing Issues
1. Fixed px-6 padding in Header
2. Fixed py-12 in hero sections
3. Fixed gap values in some grids

---

## FILES SUMMARY TABLE

| File Path | Issue Type | Severity | Responsive Classes | Problem |
|-----------|-----------|----------|-------------------|---------|
| [src/components/dashboard/Sidebar.tsx](src/components/dashboard/Sidebar.tsx) | Layout | 🔴 Critical | `w-60` (fixed) | No mobile support |
| [src/components/dashboard/DashboardWrapper.tsx](src/components/dashboard/DashboardWrapper.tsx) | Layout | 🔴 Critical | `flex h-screen` | Sidebar layout breaks mobile |
| [src/app/(dashboard)/admin/ies/nova/page.tsx](src/app/(dashboard)/admin/ies/nova/page.tsx) | Form | 🔴 Critical | `grid-cols-2` (no mobile) | 2-col on mobile |
| [src/components/dashboard/Header.tsx](src/components/dashboard/Header.tsx) | Spacing | 🟠 High | `px-6` (fixed) | No mobile padding |
| [src/app/(dashboard)/admin/ies/page.tsx](src/app/(dashboard)/admin/ies/page.tsx) | Filter | 🟠 High | `grid-cols-2` (no mobile) | Filter cramped |
| [src/components/Navbar.tsx](src/components/Navbar.tsx) | Navigation | 🟠 High | Hidden menu | Mobile menu incomplete |
| [src/components/dashboard/TabelaUtilizadores.tsx](src/components/dashboard/TabelaUtilizadores.tsx) | Table | 🟠 High | `overflow-x-auto` | Mobile text unreadable |
| [src/app/(public)/explorar/ies/page.tsx](src/app/(public)/explorar/ies/page.tsx) | Table | 🟠 High | `overflow-x-auto` | Mobile table unreadable |
| [src/app/(public)/explorar/cursos/page.tsx](src/app/(public)/explorar/cursos/page.tsx) | Table | 🟠 High | `overflow-x-auto` | Mobile table unreadable |
| [src/app/(public)/explorar/provincia/[id]/page.tsx](src/app/(public)/explorar/provincia/[id]/page.tsx) | Table | 🟠 High | `overflow-x-auto` | Mobile table unreadable |
| [src/components/dashboard/GraficoProvincias.tsx](src/components/dashboard/GraficoProvincias.tsx) | Chart | 🟠 High | `height={280}` (fixed) | Height not responsive |
| [src/app/(public)/explorar/page.tsx](src/app/(public)/explorar/page.tsx) | Grid | 🟡 Medium | `grid-cols-3` (small) | Text cramped on mobile |
| [src/components/dashboard/TabelaIES.tsx](src/components/dashboard/TabelaIES.tsx) | Container | 🟡 Medium | `max-h-80` (fixed) | Fixed height constraint |
| [src/components/Navbar.tsx](src/components/Navbar.tsx) | Typography | 🟡 Medium | Fixed width text | Logo overflow risk |
| [src/components/dashboard/Sidebar.tsx](src/components/dashboard/Sidebar.tsx) | Typography | 🟡 Medium | Fixed width text | Logo/text overflow risk |
| [src/app/(dashboard)/admin/page.tsx](src/app/(dashboard)/admin/page.tsx) | Grid | 🟢 Low | `grid-cols-2 lg:grid-cols-4` | ✓ Good pattern |
| [src/app/(auth)/login/page.tsx](src/app/(auth)/login/page.tsx) | Form | 🟢 Low | `max-w-md px-4` | ✓ Good pattern |
| [src/app/(auth)/register/page.tsx](src/app/(auth)/register/page.tsx) | Form | 🟢 Low | `max-w-md px-4` | ✓ Good pattern |

---

## RECOMMENDED FIX PRIORITY ORDER

### Phase 1 (Immediately - Breaks Mobile UX)
1. Fix Sidebar width to be responsive
2. Fix DashboardWrapper layout for mobile
3. Fix form fields grid on admin/ies/nova
4. Fix mobile navigation menu

### Phase 2 (High Priority - Major UX Issues)
5. Fix Header padding responsiveness
6. Fix filter grid responsiveness
7. Implement card-based table layouts for mobile
8. Make chart height responsive

### Phase 3 (Medium Priority - Polish)
9. Standardize stats grid breakpoints
10. Fix logo text overflow
11. Optimize province grid columns
12. Fix form input hit targets

### Phase 4 (Low Priority - Future)
13. Refactor all tables to consistent mobile pattern
14. Optimize spacing across all pages
15. Add dark mode responsiveness if planned

---

## BEST PRACTICES ALREADY IMPLEMENTED ✓

- Max-width containers with responsive padding (max-w-7xl, px-4 sm:px-6 lg:px-8)
- Flexbox for navigation and layout
- Grid with responsive column counts for stats
- Hidden elements on mobile (lg:hidden, hidden md:flex)
- Form inputs with proper responsive widths
- Mobile-first breakpoints (sm:, md:, lg:)
- Responsive text sizing in some components

---

## NEXT STEPS

1. **Priority 1 Files to Fix:** Sidebar, DashboardWrapper, nova/page, Navbar
2. **Create Responsive Component Templates:** For tables, forms, navigation
3. **Test on Real Devices:** iPhone SE (375px), iPhone 12 (390px), iPad (768px)
4. **Update Tailwind Config:** Consider adding custom breakpoints if needed
5. **Create Responsive Design Guidelines:** For team consistency

