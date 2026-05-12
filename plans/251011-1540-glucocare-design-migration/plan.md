---
title: "GlucoCare Design Migration - Rebuild Next.js App"
description: "Rebuild the Next.js app to match the GlucoCare React/Vite design exactly in layout, colors, fonts, and all pages"
status: complete
priority: P1
effort: 32h
branch: glucocare-design-migration
tags: [design-migration, nextjs, tailwind, layout-update]
created: 2026-05-11
---

## Overview

Migrate the existing Next.js app from d:/01.Claude/002.Tieuduong/002.Tieuduong/ to match the GlucoCare React/Vite design at d:/01.Claude/002.Tieuduong/glucocare---diabetes-management-app/ exactly.

### Current State
- App has 8 nav items in sidebar, 5 in bottom nav
- Design uses custom colors from tailwind.config.ts
- Pages: trangchu, nhatky, bua-an, thuoc, xet-nghiem, kien-thuc, lifestyle, care, news, memory, troly-ai

### Target State
- 4 nav items: Trang chủ, Theo dõi tiểu đường, Chăm sóc, Blog's
- Header with search bar, notification bell, user avatar
- All pages redesigned to match GlucoCare design exactly

## Phases

| Phase | Status | Effort | Priority |
|-------|--------|--------|----------|
| [Phase 01: Layout Components](./phase-01-layout-components.md) | ✅ complete | 8h | P1 |
| [Phase 02: CSS Design System](./phase-02-css-design-system.md) | ✅ complete | 4h | P1 |
| [Phase 03: Dashboard Page](./phase-03-dashboard-page.md) | ✅ complete | 6h | P1 |
| [Phase 04: Tracking Page](./phase-04-tracking-page.md) | ✅ complete | 6h | P1 |
| [Phase 05: Navigation Update](./phase-05-navigation-update.md) | ✅ complete | 4h | P1 |
| [Phase 06: Additional Pages](./phase-06-additional-pages.md) | ✅ complete | 4h | P2 |

## Key Dependencies

1. Update sidebar.tsx (4 nav items instead of 8)
2. Update bottom-nav.tsx (4 items)
3. Update header.tsx (add search, notifications, avatar)
4. Update globals.css (glass-card, nav-item classes)
5. Update tailwind.config.ts (colors from design)

## Risks

- **High**: Breaking existing routes - maintain backward compatibility
- **Medium**: Some components may need to be recreated from scratch
- **Low**: Data structures remain unchanged

## Success Criteria

- All 4 sidebar nav items working
- All pages match design exactly in layout, colors, spacing
- No compile errors
- All animations working (framer-motion equivalent)