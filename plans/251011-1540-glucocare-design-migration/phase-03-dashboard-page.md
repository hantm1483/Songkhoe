# Phase 03: Dashboard Page (Trang chủ)

## Context Links

- Reference: d:/01.Claude/002.Tieuduong/glucocare---diabetes-management-app/src/pages/Dashboard.tsx
- Phase 01: Layout Components

## Overview

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Status** | pending |
| **Effort** | 6h |

## Requirements

### Page Structure (from Dashboard.tsx)

```
├── Hero Section (full-width rounded-3xl primary bg)
│   ├── Badge: "Giới thiệu"
│   ├── Heading: "Chào mừng đến với Sổ Tay Sức Khỏe"
│   ├── Subtitle text
│   └── Link to knowledge
│   
├── Categories Grid (4 columns on lg)
│   ├── Kiến thức (blue-500 icon)
│   ├── Dinh dưỡng (emerald-500 icon)
│   ├── Lối sống (rose-500 icon)
│   └── Tin tức (amber-500 icon)
│   
├── Featured Section (2-column on lg)
│   ├── Featured Video (large rounded-3xl with gradient overlay)
│   │   ├── Badge: "Nổi bật"
│   │   ├── "Phát sóng trực tiếp" label
│   │   ├── Title: "Tọa đàm: Bí quyết sống khỏe..."
│   │   └── Play button
│   │   
│   └── Sidebar: "Mới nhất" articles list
│       └── 3 article cards with thumbnails
```

### Design Exact Matches

**Hero Section**:
```jsx
// Full-width rounded-3xl primary bg
<section className="relative overflow-hidden rounded-3xl bg-primary h-[320px] flex items-center px-10 text-white shadow-2xl shadow-primary/30">
```

**Categories Grid**:
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
```

**Featured Card**:
```jsx
// Large rounded-3xl with aspect-video
<div className="group relative rounded-3xl overflow-hidden aspect-video bg-slate-200">
```

### Route

- Path: `/` or `/trangchu`

## Architecture

### Existing File to Modify
- `src/app/(main)/trangchu/page.tsx`

### Component Structure

```
trangchu/
├── HeroSection
├── CategoriesGrid (4 items)
├── FeaturedVideo
└── LatestArticles (sidebar)
```

### Data Flow

```typescript
// Categories data
const categories = [
  { name: 'Kiến thức', icon: BookOpen, color: 'bg-blue-500', count: '12 bài viết', path: '/knowledge' },
  { name: 'Dinh dưỡng', icon: Utensils, color: 'bg-emerald-500', count: '50+ món ăn', path: '/nutrition' },
  { name: 'Lối sống', icon: Heart, color: 'bg-rose-500', count: '24 bài học', path: '/lifestyle' },
  { name: 'Tin tức', icon: Newspaper, color: 'bg-amber-500', count: 'Cập nhật hàng ngày', path: '/news' },
];

// Latest articles data
const articles = [
  { title: '...', category: 'Y khoa', time: '10 phút trước', image: '...' },
  // ...
];
```

## Implementation Steps

### Step 3.1: Read Current File

Read `src/app/(main)/trangchu/page.tsx`

### Step 3.2: Replace Content with GlucoCare Design

1. Create Hero section with primary background
2. Create Categories grid (4 columns)
3. Create Featured video section
4. Create Latest articles sidebar
5. Add motion animations using framer-motion

### Step 3.3: Update Imports

```typescript
// Use lucide-react icons or existing Icon component
import { BookOpen, Utensils, Heart, Newspaper, Star, ArrowRight, Play } from 'lucide-react';
import { motion } from 'framer-motion';
```

## Related Code Files

### Files to Read
- src/app/(main)/trangchu/page.tsx
- src/components/layout/sidebar.tsx (for nav links)

### Files to Modify
- src/app/(main)/trangchu/page.tsx

### Dependencies
- src/components/ui/icon.tsx (existing)
- src/components/ui/badge.tsx (existing)
- src/components/ui/card.tsx (existing)

## Todo List

- [ ] Read current trangchu/page.tsx
- [ ] Implement hero section
- [ ] Implement categories grid
- [ ] Implement featured section
- [ ] Implement latest articles sidebar
- [ ] Add framer-motion animations

## Success Criteria

- [ ] Hero has primary (#008B8B) rounded-3xl background
- [ ] Hero height is exactly 320px
- [ ] 4 category cards matching design colors
- [ ] Featured video has gradient overlay
- [ ] Latest articles have thumbnails
- [ ] Route is `/` or matches existing

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|----------|
| Image placeholders | Low | Low | Use placeholder service |
| Animation complexity | Medium | Low | Use simple transitions |

## Security Considerations

- Static content, no security concerns
- External images use HTTPS