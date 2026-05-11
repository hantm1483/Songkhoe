# Phase 02: CSS Design System

## Context Links

- Reference: d:/01.Claude/002.Tieuduong/glucocare---diabetes-management-app/src/index.css
- Reference: d:/01.Claude/002.Tieuduong/glucocare---diabetes-management-app/tailwind.config.js

## Overview

| Attribute | Value |
|-----------|-------|
| **Priority** | P1 |
| **Status** | pending |
| **Effort** | 4h |

## Requirements

### Design System Colors (from tailwind.config.js)

```javascript
colors: {
  primary: "#008B8B",      // Dark teal - main brand color
  secondary: "#00A8A8",    // Lighter teal - hover states
  accent: "#FF7F50",        // Coral/orange - alerts and accents
  "bg-warm": "#FDFCFB",   // Warm off-white - background
}
```

### CSS Classes Required (from index.css)

```css
.glass-card {
  bg-white/80 backdrop-blur-md border border-white/20 shadow-sm rounded-2xl
}

.primary-button {
  bg-primary hover:bg-secondary text-white px-6 py-2 rounded-full 
  transition-all duration-300 shadow-md hover:shadow-lg active:scale-95
}

.nav-item {
  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 
  text-slate-500 hover:bg-primary/10 hover:text-primary cursor-pointer
}

.nav-item-active {
  bg-primary text-white shadow-lg shadow-primary/30
}
```

### Font

```javascript
// Font: Inter, sans-serif (from tailwind.config.js)
fontFamily: {
  sans: ['Inter', 'sans-serif'],
}
```

## Implementation Steps

### Step 2.1: Update tailwind.config.ts

Read current file and verify/update colors:

```typescript
// Current colors already match the design:
// primary: "#008B8B",
// secondary: "#00A8A8",  
// accent: "#FF7F50",
// "bg-warm": "#FDFCFB",
```

### Step 2.2: Update globals.css

Add or update these CSS classes:

1. **glass-card** - Already exists, verify exact match
2. **primary-button** - Already exists, verify exact match  
3. **nav-item** - Already exists, verify exact match
4. **nav-item-active** - Already exists, verify exact match
5. **Add new**: Body background color

```css
body {
  @apply bg-[#FDFCFB] text-slate-800 font-sans antialiased;
}
```

## Success Criteria

- [ ] Colors match GlucoCare design exactly
- [ ] glass-card class matches design
- [ ] nav-item classes work correctly
- [ ] Font is Inter
- [ ] No compile errors

## Related Code Files

### Files to Read
- src/styles/globals.css
- tailwind.config.ts

### Files to Modify
- src/styles/globals.css
- tailwind.config.ts (verify only)