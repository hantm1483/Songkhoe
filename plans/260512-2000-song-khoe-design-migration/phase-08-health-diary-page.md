# Phase 8: Health Diary Page

## Context

**Reports:** Phase 01-07
**Target:** New /health-diary page for health events and metrics

## Overview

**Priority:** P2  
**Status:** pending

Create health diary page matching `sống-khỏe---quản-lý-tiểu-đường\src\pages\HealthDiary.tsx`:
- Health events timeline
- Body metrics tracking (weight, BP)
- Vaccination schedule
- Notes/journal

## Requirements

### Functional

- Display chronological health events
- Track body metrics (weight, blood pressure)
- Vaccination schedule
- Personal health notes

### UI Structure

```tsx
// Timeline feed
- Date headers
- Event cards (measurements, meds, notes)

// Body metrics cards
- Weight chart
- Blood pressure log
- BMI calculator

// Quick add
- Add event button
- Event type selector
```

## Related Code Files

### Files to Modify

- Need create: `src/app/(main)/health-diary/page.tsx`
- Adapt: `src/app/(main)/nhatky/page.tsx` (existing)

### New Components

- `src/components/diary/event-card.tsx`
- `src/components/diary/metrics-card.tsx`
- `src/components/diary/timeline.tsx`

## Implementation Steps

1. **Create health-diary/page.tsx** - New route
2. **Create event components**
3. **Add timeline view**
4. **Connect to existing data**

## Todo List

- [ ] Create /health-diary route
- [ ] Create timeline component
- [ ] Add metrics tracking

## Next Steps

- Phase 09: Blog Page