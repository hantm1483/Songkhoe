---
title: "Sống Khỏe Design Migration Plan"
description: "Migrate Next.js app to match new Sống Khỏe - Quản Lý Tiểu Đường design with natural tones color theme"
status: completed
priority: P1
effort: 40h
branch: main
tags: [migration, design, ui, nextjs]
created: 2026-05-12
---

# Migration Overview

This plan migrates the existing Next.js app (GlucoCare) to match the new "Sống Khỏe - Quản Lý Tiểu Đường" design with:

- **Natural tones color theme** (from sống-khỏe---quản-lý-tiểu-đường)
- **7-page navigation** structure
- **Motion animations** with framer-motion
- **Chart visualizations** with recharts

## Scope

| Current | Target |
|---------|--------|
| 8 sidebar nav items | 7 sidebar nav items |
| Teal primary (#006262) | Natural primary (#8BA888) |
| Standard rounded corners | Large rounded (28-40px) |
| No motion animations | framer-motion animations |
| Raw charts | Styled recharts |

## Page Mapping

| Current Page | Target Page | Priority |
|--------------|------------|----------|
| /trangchu | / (Home) | P1 |
| /tracking | /blood-sugar | P1 |
| /care | /lifestyle + /nutrition combined | P2 |
| /nhatky | /health-diary | P2 |
| /bua-an | /nutrition | P2 |
| /thuoc | (integrated) | P2 |
| /xet-nghiem | /screening | P2 |
| /kien-thuc | /blog | P2 |
| /news | /blog (merged) | P3 |
| /memory | /blog (merged) | P3 |
| /troly-ai | (AI integrated in pages) | P2 |

## Status

- [x] Phase 1: Design System Update
- [x] Phase 2: Layout Components
- [x] Phase 3: Home Page Redesign
- [x] Phase 4: Blood Sugar Page
- [x] Phase 5: Nutrition Page
- [x] Phase 6: Lifestyle Page
- [x] Phase 7: Screening Page
- [x] Phase 8: Health Diary Page
- [x] Phase 9: Blog Page
- [x] Phase 10: Integration

---

## Phase Files

| Phase | Title | Status |
|-------|-------|--------|
| 01 | Design System Update | completed |
| 02 | Layout Components | completed |
| 03 | Home Page Redesign | completed |
| 04 | Blood Sugar Page | completed |
| 05 | Nutrition Page | completed |
| 06 | Lifestyle Page | completed |
| 07 | Screening Page | completed |
| 08 | Health Diary Page | completed |
| 09 | Blog Page | completed |
| 10 | Integration & Testing | completed |

---

**Reports Path:** `plans/reports/`
**Work Context:** `D:\01.Claude\worktrees\002.Tieuduong-test-homepage-designs`