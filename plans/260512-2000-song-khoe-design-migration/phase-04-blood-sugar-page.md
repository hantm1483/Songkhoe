# Phase 4: Blood Sugar Tracking Page

## Context

**Reports:** Phase 01-03
**Target:** New /blood-sugar page with chart and logging

## Overview

**Priority:** P1  
**Status:** ✅ completed

Create new blood sugar tracking page matching `sống-khỏe---quản-lý-tiểu-đường\src\pages\BloodSugar.tsx`:
- Interactive chart (recharts) with glucose trends
- Log entries table
- Quick add modal/form

## Requirements

### Functional

- Display glucose trend chart (7/30/90 days)
- Show recent readings in table
- Add new reading with timing (fasting, before meal, after meal, bedtime)
- Target range indicators

### UI Structure

```tsx
// Chart area
- Line chart with recharts
- Time range selector (7D, 30D, 90D)
- Target zone shading (4.0-7.0 mmol/L)
- Interactive tooltips

// Recent logs (table)
- Date/time, value, timing, notes
- Edit/delete actions

// Quick add
- Floating action button → modal
- Input: value, timing, notes
```

## Related Code Files

### Files to Modify

- Need create: `src/app/(main)/blood-sugar/page.tsx`

### New Components

- `src/components/blood-sugar/glucose-chart.tsx`
- `src/components/blood-sugar/log-table.tsx`
- `src/components/blood-sugar/add-reading-modal.tsx`

## Implementation Steps

1. **Create blood-sugar/page.tsx** - New route
2. **Create glucose-chart.tsx** - Use existing chart as base
3. **Create log-table.tsx** - Display readings
4. **Create add-reading-modal.tsx** - Quick add form
5. **Wire up Supabase** - CRUD for glucose logs

## Todo List

- [ ] Create /blood-sugar route
- [ ] Implement recharts timeline
- [ ] Create log table
- [ ] Add reading modal
- [ ] Connect to /api/glucose

## Next Steps

- Phase 05: Nutrition Page