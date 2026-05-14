---
title: "Mục tầm soát - Add screening catalog feature"
description: "Create screening catalog table, API endpoints, and update ScreeningList/ScreeningLog components to use catalog data"
status: pending
priority: P2
effort: 6h
branch: kai/feat/screening-catalog
tags: [screening, catalog, api, database]
created: 2026-05-14
---

## Plan Overview

- **Phase 1:** Database table + Type definitions (1h)
- **Phase 2:** API routes for CRUD (2h)
- **Phase 3:** Update ScreeningList component (2h)
- **Phase 4:** Testing and verification (1h)

## Dependencies

- Requires database table creation in Supabase
- API uses existing auth helper pattern from lab-results route

## SQL Script

- Run `sql/screening-catalog-table.sql` in Supabase SQL Editor first