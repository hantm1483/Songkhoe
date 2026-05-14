# Phase 3: Update ScreeningList Component

## Overview
- **Status:** pending
- **Priority:** P2
- **Effort:** 2h
- Replace static items array with catalog data, add "Thêm mục" functionality

## Key Insights
- ScreeningList shows catalog info with reminders
- Static items array currently: items (line 21-27)
- Need Add button + Modal Dialog to create new catalog items

## Requirements
### Functional
- Fetch catalog data on mount
- Display catalog items in table instead of static array
- Add "Thêm mục tầm soát" button
- Open modal with form: content, target, frequency, meaning
- Save to catalog via POST /api/screening-catalog

### Non-Functional
- Handle loading/error states gracefully
- Demo mode: allow adding items to pseudo-catalog

## Data Flow
```
User clicks "Thêm mục" ->
  Modal opens with form ->
    User fills content, target, frequency, meaning ->
    POST /api/screening-catalog ->
      On success: refresh catalog list, close modal
```

## Related Code Files
- `src/components/screening/screening-list.tsx` - modify ScreeningList function

## Implementation Steps
1. Add useState for catalog, showModal, formData
2. Add useEffect to fetch catalog on mount
3. Add handleAddItem, handleSaveNewItem functions
4. Add modal dialog with form
5. Replace items.map with catalog.map
6. Add "Thêm mục tầm soát" button

## Success Criteria
- Table shows catalog data (or static fallback if empty)
- Modal opens/closes properly
- New items saved and displayed

## Risk Assessment
- **Risk:** Demo users can't save to real table
  - **Mitigation:** Allow local pseudo-catalog for demo
- **Risk:** Unique constraint error
  - **Mitigation:** Show friendly "Đã tồn tại" error

## Next Steps
- Phase 4: Testing depends on complete component