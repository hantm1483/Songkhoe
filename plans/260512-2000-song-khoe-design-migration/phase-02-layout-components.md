# Phase 2: Layout Components Update

## Context

**Reports:** Phase 01 (Design System)
**Target:** Update sidebar.tsx to match new 7-item navigation and natural colors

## Overview

**Priority:** P1  
**Status:** ✅ completed

Update navigation components to match new layout from `sống-khỏe---quản-lý-tiểu-đường\src\components\Layout.tsx`:
- 7 nav items (not 8)
- Desktop sidebar with 64px left width
- Mobile header with hamburger menu
- Framer-motion animations for mobile menu

## Requirements

### Functional

- Update sidebar.tsx with 7 nav items
- Add mobile header with menu toggle
- Integrate framer-motion for mobile menu transitions
- Add footer summary component

### Nav Items Mapping

| Current (8 items) | Target (7 items) |
|-------------------|------------------|
| / (Trang chủ) | / (Trang chủ) |
| /tracking | /blood-sugar |
| /care | /nutrition |
| /memory | /blog |
| /lifestyle | /lifestyle |
| /nhatky | /health-diary |
| /bua-an | (merged into nutrition) |
| /thuoc | (merged into lifestyle) |
| (new) | /screening |
| (removed) | /xet-nghiem (merged) |
| (removed) | /kien-thuc (merged) |
| (removed) | /news (merged) |

### Target Nav Items

```typescript
const menuItems = [
  { name: 'Trang chủ', path: '/', icon: Home },
  { name: 'Theo dõi đường huyết', path: '/blood-sugar', icon: Droplets },
  { name: 'Chế độ dinh dưỡng', path: '/nutrition', icon: Utensils },
  { name: 'Chế độ sinh hoạt', path: '/lifestyle', icon: Activity },
  { name: 'Lịch tầm soát định kỳ', path: '/screening', icon: Calendar },
  { name: 'Nhật ký sức khỏe', path: '/health-diary', icon: ClipboardList },
  { name: "Blog's", path: '/blog', icon: BookOpen },
];
```

## Architecture

### File Structure

```
Layout (used by all pages)
├── DesktopSidebar (desktop only, hidden lg:block)
├── MobileHeader with hamburger menu
└── Footer Summary (sticky bottom, shows stats)
```

### Key UI Changes

- Desktop sidebar: 64px left margin on main content
- Mobile: sticky header with blur backdrop
- Mobile menu: slide-in from left with framer-motion
- Footer: Shows next screening date, today's calories, activity

## Related Code Files

### Files to Modify

- `src/components/layout/sidebar.tsx` → Update nav items + add mobile
- `src/components/layout/header.tsx` → Simplify or integrate into sidebar
- `src/components/layout/bottom-nav.tsx` → Remove (replaced by mobile header)
- Need create: `src/components/layout/footer-summary.tsx`

### Files to Create

- `src/components/layout/footer-summary.tsx`

## Implementation Steps

1. **Update sidebar.tsx** - Add new 7-item nav, desktop-only styles
2. **Create footer-summary.tsx** - Show stats (screening, calories, activity)
3. **Update header.tsx** - Simplify for mobile only
4. **Remove bottom-nav.tsx** - Not needed with new layout
5. **Test navigation** - Ensure all links work

## Todo List

- [ ] Update sidebar.tsx with 7 nav items
- [ ] Add mobile menu with framer-motion
- [ ] Create footer-summary.tsx
- [ ] Update header.tsx (mobile only)
- [ ] Remove bottom-nav.tsx references
- [ ] Test all navigation

## Success Criteria

- [ ] 7 nav items displaying correctly
- [ ] Mobile menu animates with framer-motion
- [ ] Footer shows screening/calories/activity
- [ ] All navigation links work

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Navigation breaks | High | Keep old pages as redirects |
| Mobile menu conflicts | Medium | Test responsive breakpoints |

## Next Steps

- Phase 03: Home Page Redesign (matches Home.tsx)