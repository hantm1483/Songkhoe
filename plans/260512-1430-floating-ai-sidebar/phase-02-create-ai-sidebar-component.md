# Phase 02: Create AI Sidebar Component

## Context
Creating the floating AI sidebar component with high contrast WCAG AAA UI.

## Overview
- **Priority**: P1
- **Status**: pending
- **Effort**: 3h

## Requirements

### UI Requirements (WCAG AAA 7:1 Contrast)
- Background: `#1a1a2e` (dark navy)
- Text: `#FFFFFF` (white) on dark backgrounds
- Primary accent: `#FFD700` (gold) for important elements
- Border: `#4a4a6a`
- All text must have 7:1 contrast ratio minimum

### Component Structure
```
FloatingSidebar (main container)
├── ToggleButton (floating, right edge)
├── SidebarPanel
│   ├── Header (title + close button)
│   ├── MedicalTermSection (for text selection)
│   ├── SummarizeSection (for article summary)
│   └── ChatMessages (conversation history)
```

### Props
- `isOpen: boolean`
- `onClose: () => void`
- `selectedText?: string`
- `onSummarize?: () => void`

## Implementation Steps

1. Create `src/components/ai-sidebar/floating-ai-sidebar.tsx`
2. Use Tailwind for styling with high contrast colors
3. Add framer-motion for slide-in animation
4. Implement toggle button with icon

## Related Files
- Create: `src/components/ai-sidebar/floating-ai-sidebar.tsx`
- Create: `src/components/ai-sidebar/medical-term-popup.tsx`
- Create: `src/components/ai-sidebar/summarize-button.tsx`

## Success Criteria
- Sidebar slides in from right
- All colors meet 7:1 contrast ratio
- Responsive on mobile