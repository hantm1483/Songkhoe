# Phase 5: Nutrition Page

## Context

**Reports:** Phase 01-04
**Target:** New /nutrition page for meal tracking and AI suggestions

## Overview

**Priority:** P2  
**Status:** pending

Create nutrition page matching `sống-khỏe---quản-lý-tiểu-đường\src\pages\Nutrition.tsx`:
- Meal logging (breakfast, lunch, dinner, snacks)
- Calorie tracking
- Carb calculator
- AI nutrition suggestions (via Gemini)

## Requirements

### Functional

- Log meals with food items and portions
- Calculate total calories and carbs
- Display daily/weekly summaries
- AI suggestions for meals

### UI Structure

```tsx
// Daily summary card
- Calories consumed / target
- Carbs consumed / target

// Meal sections (4)
- Bữa sáng, Bữa trưa, Bữa tối, Ăn vặt
- Add food item button
- List of logged foods

// Quick add
- Food search
- Portion size selector (gram)
- GI level indicator
```

## Related Code Files

### Files to Modify

- Need create: `src/app/(main)/nutrition/page.tsx`
- Adapt: `src/app/api/meals/route.ts` (existing)

### New Components

- `src/components/nutrition/daily-summary.tsx`
- `src/components/nutrition/meal-section.tsx`
- `src/components/nutrition/food-item.tsx`
- `src/components/nutrition/food-search.tsx`
- `src/components/nutrition/ai-suggestions.tsx`

## Implementation Steps

1. **Create nutrition/page.tsx** - New route
2. **Create meal logging components**
3. **Add calorie/carb calculator**
4. **Integrate AI suggestions** (reuse existing gemini service)
5. **Wire up /api/meals**

## Todo List

- [ ] Create /nutrition route
- [ ] Implement meal logging
- [ ] Add calorie/carb tracking
- [ ] Integrate AI suggestions

## Next Steps

- Phase 06: Lifestyle Page