# Phase 7: Screening Page

## Context

**Reports:** Phase 01-06
**Target:** New /screening page for scheduled health checkups

## Overview

**Priority:** P2  
**Status:** pending

Create screening page matching `sống-khỏe---quản-lý-tiểu-đường\src\pages\Screening.tsx`:
- Screening schedule list
- Target due dates
- Log entries for completed screenings
- Reminders

## Requirements

### Functional

- Display list of recommended screenings
- Show next screening dates
- Mark screenings as completed
- Historical log

### UI Structure

```tsx
// Upcoming screenings
- HbA1c: every 3 months
- Eye exam: yearly
- Foot exam: every year
- Kidney function: yearly
- Cholesterol: yearly

// Each item
- Screening type
- Last result/date
- Next due date
- Action button (log result)
```

## Related Code Files

### Files to Modify

- Need create: `src/app/(main)/screening/page.tsx`
- Adapt: `/api/lab-results` (reuse)

### New Components

- `src/components/screening/screening-card.tsx`
- `src/components/screening/log-modal.tsx`

## Implementation Steps

1. **Create screening/page.tsx** - New route
2. **Create screening-card components**
3. **Add log entry modal**
4. **Wire to lab-results API**

## Todo List

- [ ] Create /screening route
- [ ] Create screening cards
- [ ] Add completion tracking

## Next Steps

- Phase 08: Health Diary Page