# Phase 1: Design System Update

## Context

**Reports:** None yet
**Target:** Update tailwind.config.ts and globals.css with natural tones theme

## Overview

**Priority:** P1  
**Status:** ✅ completed

Migrate color system from Empathetic Tribute (teal-based) to Natural Tones theme matching `sống-khỏe---quản-lý-tiểu-đường\src\index.css`.

## Requirements

### Functional

- Update tailwind.config.ts colors to natural tones
- Update globals.css CSS variables
- Maintain backward compatibility with existing components
- Ensure all existing pages still work

### Non-Functional

- Must compile without errors
- Theme changes only, no logic changes

## Architecture

### Colors Migration

| Current | Target |
|---------|--------|
| primary (#006262) | natural-primary (#8BA888) |
| primary.container (#2a7b7b) | natural-primary-dark (#5C6E5A) |
| secondary (#136299) | natural-secondary (new) |
| accent (#FF7F50) | natural-accent (#BC4749) |
| bg-warm (#FDFCFB) | natural-bg (#F9F7F2) |
| surface.container.low (#f8f3ee) | natural-light (#F0F4EF) |

### New Colors to Add

```
--color-natural-bg: #F9F7F2
--color-natural-text: #4A4F41
--color-natural-primary: #8BA888
--color-natural-primary-dark: #5C6E5A
--color-natural-border: #E6E2D3
--color-natural-accent: #BC4749
--color-natural-soft: #E9EDC9
--color-natural-soft-dark: #CCD5AE
--color-natural-beige: #F2E8CF
--color-natural-light: #F0F4EF
```

## Related Code Files

### Files to Modify

- `tailwind.config.ts`
- `src/styles/globals.css`

## Implementation Steps

1. **Read current tailwind.config.ts** - Already read
2. **Update colors in tailwind.config.ts** - Add natural-* colors alongside existing
3. **Update globals.css** - Add CSS variables for natural theme
4. **Test compilation** - Run `npm run build` to verify no errors

## Todo List

- [ ] Update tailwind.config.ts colors
- [ ] Update globals.css variables
- [ ] Verify build passes
- [ ] Test existing pages still render

## Success Criteria

- [ ] Build passes without errors
- [ ] All existing pages still functional
- [ ] Natural colors available as tailwind classes

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing UI | Medium | Add new colors alongside existing |
| Build failures | Low | Test after each change |

## Next Steps

- Phase 2: Layout Components (sidebar.tsx, header.tsx, bottom-nav.tsx)