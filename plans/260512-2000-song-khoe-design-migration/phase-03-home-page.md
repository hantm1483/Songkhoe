# Phase 3: Home Page Redesign

## Context

**Reports:** Phase 01, Phase 02
**Target:** src/app/(main)/trangchu/page.tsx matching Home.tsx

## Overview

**Priority:** P1  
**Status:** ✅ completed

Redesign Home page to match new layout from `sống-khỏe---quản-lý-tiểu-đường\src\pages\Home.tsx`:
- Stats cards (blood sugar, HbA1c, steps)
- Category grid (4 cards)
- Blog posts section
- Recent updates sidebar

## Requirements

### Functional

- Display recent glucose reading, HbA1c target, daily steps
- Show category cards (Knowledge, Nutrition, Lifestyle, News)
- Blog posts horizontal layout (thumbnail + excerpt)
- Right sidebar with latest updates

### UI Structure

```tsx
// Header
<h1>Chào bạn, Sống Khỏe mỗi ngày 👋</h1>

// Stats (3 columns)
- Đường huyết gần nhất: 6.2 mmol/L
- HBA1C mục tiêu: < 7.0 %
- Vận động hôm nay: 3,200 bước

// Categories (4 grid)
- Kiến thức: 12 BÀI VIẾT
- Dinh dưỡng: 50+ MÓN ĂN
- Lối sống: 24 BÀI HỌC
- Tin tức: CẬP NHẬT HÀNG NGÀY

// Blog Posts (2 columns)
- Post thumbnail with category badge
- Title, excerpt, author, date
- Social interactions (like, comment, share)

// Sidebar
- Latest updates feed
```

## Related Code Files

### Files to Modify

- `src/app/(main)/trangchu/page.tsx`

### New Components

- `src/components/home/stats-card.tsx`
- `src/components/home/category-card.tsx`
- `src/components/home/post-card.tsx`
- `src/components/home/update-item.tsx`

## Implementation Steps

1. **Create home components** - Stats cards, category grid, etc.
2. **Update trangchu/page.tsx** - Full redesign with new layout
3. **Add animations** - Use framer-motion for entrance
4. **Test data binding** - Connect to Supabase

## Todo List

- [ ] Create stats-card component
- [ ] Create category-card component
- [ ] Create post-card component
- [ ] Redesign trangchu page
- [ ] Add framer-motion animations
- [ ] Connect to Supabase data

## Next Steps

- Phase 04: Blood Sugar Page (new /blood-sugar route)