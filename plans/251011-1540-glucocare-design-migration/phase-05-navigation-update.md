# Phase 05: Navigation Update & Integration

## Context Links

- Phase 01: Layout Components
- Phase 02: CSS Design System

## Overview

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Status** | pending |
| **Effort** | 4h |

## Requirements

### Navigation Changes Required

1. **Route Mapping** (old → new)
   ```
   /trangchu → /
   /nhatky → /tracking
   /bua-an → /nutrition (for Nutrition page access)
   /kien-thuc → /knowledge
   /lifestyle → /lifestyle
   /care → /care
   /memory → /memory (Blog's)
   /news → /news
   ```

2. **Sidebar Nav Items** (4 items)
   - Trang chủ → /
   - Theo dõi tiểu đường → /tracking
   - Chăm sóc → /care
   - Blog's → /memory

3. **Bottom Nav** (4 items, mobile only)
   - Same as sidebar

### Additional Pages to Create

For sub-navigation between tracked pages:
- `/nutrition` → maps to old /bua-an
- `/knowledge` → maps to old /kien-thuc
- `/lifestyle` → maps to old /lifestyle  
- `/news` → maps to old /news

## Architecture

### Route Structure

```
/                    → Dashboard (trangchu)
/tracking            → Tracking (nhatky in old nav)
/care                → Care
/memory              → Blog's (memory in old nav)
/nutrition           → Nutrition (bua-an)
/knowledge           → Knowledge (kien-thuc)
/lifestyle          → Lifestyle
/news               → News
```

### File Structure

```
src/app/
├── page.tsx              → Dashboard
├── tracking/page.tsx       → Tracking (create new route)
├── care/page.tsx         → Care
├── memory/page.tsx        → Blog's (Memory)
├── nutrition/page.tsx     → Nutrition (create new route)
├── knowledge/page.tsx     → Knowledge (create new route)
├── lifestyle/page.tsx    → Lifestyle (create new route)
└── news/page.tsx         → News (create new route)
```

## Implementation Steps

### Step 5.1: Create Route Mapping

1. Create /tracking route (symlink to /nhatky or redirect)
2. Create /nutrition route (symlink to /bua-an)
3. Create /knowledge route (symlink to /kien-thuc)
4. Create /lifestyle route (same as current)
5. Create /news route (same as current)

### Step 5.2: Update Sidebar Links

Ensure sidebar navigates to new routes:
- Home → /
- Tracking → /tracking
- Care → /care
- Blog's → /memory

### Step 5.3: Update Bottom Nav Links

Same mapping for mobile navigation.

## Related Code Files

### Files to Modify
- src/components/layout/sidebar.tsx
- src/components/layout/bottom-nav.tsx

### Files to Create
- src/app/tracking/page.tsx (or redirect from existing)
- src/app/nutrition/page.tsx
- src/app/knowledge/page.tsx
- src/app/news/page.tsx

## Todo List

- [ ] Map routes correctly
- [ ] Update sidebar links
- [ ] Update bottom nav links
- [ ] Verify all 4 nav items work
- [ ] Test navigation flow

## Success Criteria

- [ ] All 4 nav items navigate correctly
- [ ] Old routes redirect or work
- [ ] Mobile bottom nav works
- [ ] No broken links

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|----------|
| Route conflicts | Low | High | Use next.config.js redirects |
| SEO impact | Low | Medium | 301 redirects |