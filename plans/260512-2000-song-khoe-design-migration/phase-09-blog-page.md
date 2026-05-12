# Phase 9: Blog Page

## Context

**Reports:** Phase 01-08
**Target:** New /blog page (merges kien-thuc, memory, news)

## Overview

**Priority:** P2  
**Status:** pending

Create blog page matching `sống-khỏe---quản-lý-tiểu-đường\src\pages\Blog.tsx`:
- Personal blog posts
- Category filters
- Create/edit posts (authenticated users)
- Social interactions (like, comment, share)

## Requirements

### Functional

- Display blog posts list
- Category filtering
- Create new posts (authenticated)
- Social interactions

### UI Structure

```tsx
// Header
- Title + description
- New post button (if authenticated)

// Filters
- Category tabs
- Search input

// Posts grid
- Post cards (image, title, excerpt, date)
- Pagination

// Post detail (separate page)
- Full content
- Author info
- Comments
```

## Related Code Files

### Files to Modify

- Need create: `src/app/(main)/blog/page.tsx`
- Need create: `src/app/(main)/blog/[id]/page.tsx`
- Adapt: `/api/articles` (existing)

### New Components

- `src/components/blog/post-card.tsx`
- `src/components/blog/post-detail.tsx`
- `src/components/blog/create-post-form.tsx`

## Implementation Steps

1. **Create blog/page.tsx** - New route
2. **Create blog/[id]/page.tsx** - Detail view
3. **Create components**
4. **Wire to articles API**

## Todo List

- [ ] Create /blog route
- [ ] Create post detail view
- [ ] Add create form
- [ ] Connect to articles API

## Next Steps

- Phase 10: Integration & Testing