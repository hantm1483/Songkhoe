# Phase 04: Tracking Page

## Context Links

- Reference: d:/01.Claude/002.Tieuduong/glucocare---diabetes-management-app/src/pages/Tracking.tsx
- Phase 01: Layout Components

## Overview

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Status** | pending |
| **Effort** | 6h |

## Requirements

### Page Structure (from Tracking.tsx)

```
├── Sticky Header with Buttons
│   ├── Lịch sử (calendar icon)
│   ├── Lịch thuốc (medication schedule)
│   ├── Lập thực đơn (menu planning)
│   └── Thêm chỉ số (+) - primary button
│   
├── Main Content Grid (8 columns)
│   ├── Blood Sugar Chart (AreaChart with gradient)
│   │   ├── Title: "Chỉ số 7 ngày qua"
│   │   ├── Subtitle:Average 130 mg/dL
│   │   └── Select: Week/month
│   │   
│   └── Blog's List (readings history)
│       ├── Shows level, status badge, time
│       └── Color-coded by level
│       
├── Sidebar Widgets (4 columns)
│   ├── Medication Card (indigo gradient)
│   │   ├── Morning/Afternoon/Evening pills
│   │   └── "Xong" check button
│   │   
│   └── Menu Card (table format)
│       ├── Session dividers (Sáng/Trưa/Tối)
│       └── Time, meal, kcal columns
│       
└── 3 Modals
    ├── Blood Sugar Modal (date, time, level, notes)
    ├── Medication Modal (name, dose, day grid 1-31)
    └── Menu Modal (date, time, meal, kcal, emoji)
```

### Design Exact Matches

**Header Buttons**:
```jsx
// 4 buttons in header with color coding
<Calendar size={14} /> Lịch sử  // white border
<Stethoscope size={14} /> Lịch thuốc  // indigo-50
<UtensilsCrossed size={14} /> Lập thực đơn  // emerald-50
<Plus size={14} /> Thêm chỉ số  // primary bg
```

**Chart**:
```jsx
<AreaChart data={data}>
  <linearGradient id="colorLevel">  // gradient fill
    <stop offset="5%" stopColor="#008B8B" stopOpacity={0.2}/>
    <stop offset="95%" stopColor="#008B8B" stopOpacity={0}/>
  </linearGradient>
  <Area type="monotone" stroke="#008B8B" strokeWidth={2} fill="url(#colorLevel)"/>
</AreaChart>
```

**Medication Card**:
```jsx
// Indigo gradient background
<Card className="bg-gradient-to-br from-indigo-600 to-indigo-800">
```

**Day Selector Grid**:
```jsx
// 7 columns, 31 days
<div className="grid grid-cols-7 gap-1">
  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
    <button onClick={() => toggleDay(day)}>
      {day}
    </button>
  ))}
</div>
```

### Route

- Path: `/tracking` or `/nhatky` (existing route: /nhatky)

## Architecture

### Existing File to Modify
- `src/app/(main)/nhatky/page.tsx` (existing tracking page)

### Component Structure

```
tracking/
├── HeaderButtons
├── ChartSection (AreaChart)
├── ReadingsList
├── MedicationWidget
├── MenuWidget
└── 3 Modals (AnimatePresence)
```

### Data Models

```typescript
interface Reading {
  id: number;
  date: string;
  time: string;
  level: number;  // mg/dL
  status: 'Bình thường' | 'Cao' | 'Thấp';
  notes?: string;
}

interface Medication {
  id: number;
  name: string;
  dose: string;
  time: string;
  days: number[];  // 1-31
  session: 'Sáng' | 'Trưa' | 'Chiều' | 'Tối';
  taken: boolean;
}

interface MenuEntry {
  id: number;
  date: string;
  time: string;
  mealName: string;
  emoji: string;
  kcal?: string;
}
```

## Implementation Steps

### Step 4.1: Read Current File

Read current `src/app/(main)/nhatky/page.tsx`

### Step 4.2: Implement Tracking Page

1. Create header with 4 action buttons
2. Create AreaChart with gradient fill
3. Create readings list with status badges
4. Create medication sidebar widget
5. Create menu sidebar widget
6. Create 3 modals (blood sugar, medication, menu)

### Step 4.3: Add Chart

Uses recharts library already installed:
```typescript
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
```

### Step 4.4: Add Modal Logic

- Blood Sugar Modal: date picker, time picker, number input, textarea
- Medication Modal: name + dose inputs, day grid, time picker
- Menu Modal: date/time, meal name, kcal, emoji picker

## Related Code Files

### Files to Read
- src/app/(main)/nhatky/page.tsx
- src/components/charts/glucose-chart.tsx (existing)

### Files to Modify
- src/app/(main)/nhatky/page.tsx

### Dependencies
- recharts (already in package.json)
- framer-motion (already in package.json)
- lucide-react icons

## Todo List

- [ ] Read current nhatky/page.tsx
- [ ] Implement header buttons
- [ ] Implement chart section
- [ ] Implement readings list
- [ ] Implement medication widget
- [ ] Implement menu widget
- [ ] Implement modals

## Success Criteria

- [ ] Header has 4 action buttons with correct colors
- [ ] Chart uses gradient AreaChart (7 days)
- [ ] Medication card has indigo gradient
- [ ] Day selector grid works (1-31)
- [ ] All 3 modals functional
- [ ] Route is /tracking

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|----------|
| Chart data management | Medium | Low | Use local state |
| Modal complexity | Medium | Medium | Use existing dialog patterns |

## Security Considerations

- Form validation for blood sugar levels (20-600 mg/dL)
- No PII stored in local state