# Phase 01: Layout Components

## Context Links

- Reference: d:/01.Claude/002.Tieuduong/glucocare---diabetes-management-app/src/App.tsx (Sidebar, Header structure)
- Reference: d:/01.Claude/002.Tieuduong/glucocare---diabetes-management-app/src/layout/sidebar.tsx

## Overview

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Status** | pending |
| **Effort** | 8h |

## Requirements

### Functional Requirements

1. **Sidebar Component** (sidebar.tsx)
   - 4 nav items: Trang chủ (/), Theo dõi tiểu đường (/tracking), Chăm sóc (/care), Blog's (/memory)
   - Logo with heart icon and "GlucoCare" text (not "Sổ Tay Tiểu Đường")
   - Dark teal logo background (#008B8B)
   - User profile section at bottom
   - Responsive (collapsible on mobile)

2. **Header Component** (header.tsx)
   - Search bar with placeholder "Tìm kiếm kiến thức, thực đơn..."
   - Notification bell with badge indicator
   - User avatar section
   - Sticky positioning with backdrop blur

3. **Bottom Navigation** (bottom-nav.tsx)
   - 4 nav items matching sidebar
   - Mobile-optimized touch targets

### Design Exact Matches

From App.tsx:
```jsx
// Nav items (4 total)
const navItems = [
  { path: '/', icon: Home, label: 'Trang chủ' },
  { path: '/tracking', icon: Activity, label: 'Theo dõi tiểu đường' },
  { path: '/care', icon: Sparkles, label: 'Chăm sóc' },
  { path: '/memory', icon: PenTool, label: "Blog's" },
];

// Logo position
<Heart size={24} fill="currentColor" /> // in w-10 h-10 bg-primary rounded-xl

// Sidebar width: w-72 (288px)
```

## Architecture

### Component File Structure

```
src/components/layout/
├── sidebar.tsx      // Update existing
├── header.tsx       // Update existing  
├── bottom-nav.tsx   // Update existing
└── page-wrapper.tsx // May need update
```

### Data Flow

```
Layout (app layout.tsx)
├── Sidebar (fixed, 72 wide)
├── Header (sticky, search + avatar)
├── Main Content Area (flex-1, ml-72 on desktop)
└── BottomNav (mobile only, fixed bottom)
```

## Implementation Steps

### Step 1.1: Update Sidebar (sidebar.tsx)

1. Read current sidebar.tsx
2. Replace navItems array with 4 items from GlucoCare
3. Update logo to "GlucoCare" with heart icon
4. Add user profile mini section at bottom
5. Add mobile toggle functionality

```typescript
// Current icons needed
import { Home, Activity, Sparkles, PenTool } from 'lucide-react';
// Or use existing Icon component mapped

// Nav items:
const navItems = [
  { href: "/", label: "Trang chủ", iconName: "home" },
  { href: "/tracking", label: "Theo dõi tiểu đường", iconName: "bloodtype" },
  { href: "/care", label: "Chăm sóc", iconName: "auto_awesome" },
  { href: "/memory", label: "Blog's", iconName: "edit_note" },
];
```

### Step 1.2: Update Header (header.tsx)

1. Replace existing header with GlucoCare-style header
2. Add search bar component
3. Add notification bell
4. Add user avatar section
5. Make sticky with backdrop blur

```jsx
// Search bar style
<input 
  type="text" 
  placeholder="Tìm kiếm kiến thức, thực đơn..." 
  className="w-full bg-slate-100 border-none rounded-2xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20"
/>

// Notification bell with badge
<span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
```

### Step 1.3: Update Bottom Nav (bottom-nav.tsx)

1. Reduce nav items from 5 to 4
2. Match icons with sidebar
3. Keep mobile-optimized styling

## Related Code Files

### Files to Modify
- `src/components/layout/sidebar.tsx`
- `src/components/layout/header.tsx`
- `src/components/layout/bottom-nav.tsx`

### Files to Create
- None (all components exist)

## Todo List

- [ ] Read current sidebar.tsx
- [ ] Update sidebar.tsx with new nav items and logo
- [ ] Read current header.tsx
- [ ] Update header.tsx with search + notifications
- [ ] Read current bottom-nav.tsx
- [ ] Update bottom-nav.tsx with 4 items
- [ ] Verify layout integration

## Success Criteria

- [ ] Sidebar has exactly 4 nav items
- [ ] Header has search bar, notification bell, user avatar
- [ ] Bottom nav has 4 items on mobile
- [ ] Layout matches GlucoCare design (w-72 sidebar, sticky header)
- [ ] No compile errors

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|----------|
| Icon mapping issues | Medium | Low | Use lucide-react or fallback |
| Mobile responsiveness | Medium | Medium | Test on mobile viewport |
| User state integration | Low | High | Use existing auth hooks |

## Security Considerations

- No sensitive data in layout components
- Search input should not expose credentials
- Avatar uses authenticated user data only