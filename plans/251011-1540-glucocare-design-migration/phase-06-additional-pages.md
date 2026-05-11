# Phase 06: Additional Pages

## Context Links

- Phase 01: Layout Components
- Reference: GlucoCare src/pages/*.tsx for all page designs

## Overview

| Attribute | Value |
|-----------|-------|
| **Priority** | P2 |
| **Status** | pending |
| **Effort** | 4h |

## Pages to Implement

### 1. Nutrition Page (Dinh dưỡng)

**Reference**: d:/01.Claude/002.Tieuduong/glucocare---diabetes-management-app/src/pages/Nutrition.tsx

**Structure**:
- BackButton + heading + subtitle
- Carb calculator hero: full-width rounded-[40px] primary bg with glass card
  - Daily targets: 130g carbs, 1250 kcal, 45g fiber
  - Progress bar
- Featured meals: 3-column grid with hover scale
- Expert suggestions list
- Expert consultation card: emerald-500 icon

**Route**: `/nutrition`

### 2. Knowledge Page (Kiến thức)

**Reference**: d:/01.Claude/002.Tieuduong/glucocare---diabetes-management-app/src/pages/Knowledge.tsx

**Structure**:
- BackButton + Badge "Thư viện kiến thức"
- Heading with italic primary text
- 4 category cards in row
- Video tutorials: 3-column with play overlay
- Upcoming course banner: dark bg (#1e293b), amber accents

**Route**: `/knowledge`

### 3. Lifestyle Page

**Reference**: d:/01.Claude/002.Tieuduong/glucocare---diabetes-management-app/src/pages/Lifestyle.tsx

**Structure**:
- BackButton + heading + tag badges (Yoga, Thiền, Giấc ngủ, Stress)
- Featured yoga video: full-width rounded-[40px] with play button
- Topics grid: 3 cards with hover bg color change
- Community section: tags cloud + GlucoFriends group card

**Route**: `/lifestyle`

### 4. Care Page (Chăm sóc)

**Reference**: d:/01.Claude/002.Tieuduong/glucocare---diabetes-management-app/src/pages/Care.tsx

**Structure**:
- Progress card: shows date and 65% completion
- AI Suggestion card: gradient from primary to indigo-600, animated sparkle
- Schedule grid: 4 items (Bữa sáng, Bài tập, Thuốc, Thư giãn)
- Mental health cards

**Route**: `/care` (existing)

### 5. Memory Page (Blog's)

**Reference**: d:/01.Claude/002.Tieuduong/glucocare---diabetes-management-app/src/pages/Memory.tsx

**Structure**:
- Post composer: textarea, image/location buttons, "Đăng bài" button
- Social feed: avatar, time, content, image (4:3), like/comment/share buttons

**Route**: `/memory` (existing)

### 6. News Page (Tin tức)

**Reference**: d:/01.Claude/002.Tieuduong/glucocare---diabetes-management-app/src/pages/News.tsx

**Structure**:
- BackButton + search bar + filter button
- Featured news: large rounded-[40px] with gradient overlay
- Latest list: 2-column layout
- Most viewed: numbered list with large muted numbers
- Newsletter card: amber bg

**Route**: `/news`

## Files to Modify

| Page | Existing File | Action |
|------|--------------|--------|
| Nutrition | src/app/(main)/bua-an/page.tsx | Update to match |
| Knowledge | src/app/(main)/kien-thuc/page.tsx | Update to match |
| Lifestyle | src/app/(main)/lifestyle/page.tsx | Update to match |
| Care | src/app/(main)/care/page.tsx | Update to match |
| Memory | src/app/(main)/memory/page.tsx | Update to match |
| News | src/app/(main)/news/page.tsx | Update to match |

## Implementation Priority

1. Care - already exists, needs design update
2. Memory - already exists, needs design update
3. Nutrition - already exists, needs design update
4. Knowledge - already exists, needs design update
5. Lifestyle - already exists, needs design update
6. News - already exists, needs design update

## Success Criteria

- [ ] All 6 pages match GlucoCare design
- [ ] All content matches reference exactly
- [ ] Animations work correctly
- [ ] No broken images or links

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|----------|
| Content complexity | Medium | Low | Use simple placeholders |
| Image assets | High | Low | Use external image services |