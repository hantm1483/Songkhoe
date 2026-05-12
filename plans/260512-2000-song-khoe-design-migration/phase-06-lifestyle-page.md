# Phase 6: Lifestyle Page

## Context

**Reports:** Phase 01-05
**Target:** New /lifestyle page for activity and workout tracking

## Overview

**Priority:** P2  
**Status:** pending

Create lifestyle page matching `sống-khỏe---quản-lý-tiểu-đường\src\pages\Lifestyle.tsx`:
- Activity schedule
- Workout suggestions
- Exercise video guide links

## Requirements

### Functional

- Display daily/weekly activity schedule
- Log workouts and exercises
- Show step count integration
- Exercise video recommendations

### UI Structure

```tsx
// Daily activity summary
- Steps today
- Active minutes
- Calories burned

// Activity schedule
- Morning routine
- Afternoon suggestions
- Evening relaxation

// Exercise videos
- Yoga sequences
- Walking routines
- Stretching guides
```

## Related Code Files

### Files to Modify

- Need create: `src/app/(main)/lifestyle/page.tsx`
- Adapt: `src/app/(main)/lifestyle/page.tsx` (existing)

### New Components

- `src/components/lifestyle/activity-summary.tsx`
- `src/components/lifestyle/schedule.tsx`
- `src/components/lifestyle/exercise-card.tsx`

## Implementation Steps

1. **Update lifestyle/page.tsx** - Redesign with new layout
2. **Create activity components**
3. **Add exercise video section**
4. **Connect to data**

## Todo List

- [ ] Update /lifestyle route
- [ ] Add activity summary
- [ ] Create schedule view
- [ ] Add exercise videos

## Next Steps

- Phase 07: Screening Page