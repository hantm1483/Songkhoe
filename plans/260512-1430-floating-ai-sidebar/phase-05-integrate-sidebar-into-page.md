# Phase 05: Integrate Sidebar into Page

## Context
Integrating the floating AI sidebar into the trangchu page.

## Overview
- **Priority**: P1
- **Status**: pending
- **Effort**: 1h

## Requirements

### Integration Points
1. Add floating toggle button to page
2. Render sidebar when toggled
3. Text selection listener at page level
4. Pass article content to sidebar for summarization

### Position
- Toggle button: fixed, right edge, vertically centered
- Sidebar: fixed, right side, full height

## Implementation Steps

1. Import FloatingAISidebar into trangchu/page.tsx
2. Add toggle state management
3. Add text selection listener hook
4. Connect sidebar to page content

## Related Files
- Modify: `src/app/(main)/trangchu/page.tsx`

## Success Criteria
- Sidebar accessible from trangchu
- No layout conflicts
- Smooth animation