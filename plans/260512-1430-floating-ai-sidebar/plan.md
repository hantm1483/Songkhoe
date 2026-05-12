---
title: "Floating AI Sidebar - Medical Terms & Summarization"
description: "Build a floating sidebar with Vercel AI SDK + Claude 3.5 Sonnet for explaining medical terms and summarizing articles for elderly"
status: completed
priority: P1
effort: 8h
tags: [ai-sidebar, vercel-ai-sdk, claude, accessibility]
created: 2026-05-12
---

## Overview

Build a floating sidebar (right side) on trangchu page with Vercel AI SDK connecting to Claude 3.5 Sonnet. Features:
1. Explain medical terms when user highlights text
2. Summarize article for elderly users
3. WCAG AAA contrast (7:1) for visual impairment

### Current State
- No AI sidebar exists
- Existing trangchu page at `src/app/(main)/trangchu/page.tsx`

### Target State
- Floating sidebar on right edge, toggleable
- Text selection triggers medical term explanation
- "Summarize for elderly" button with simple language output
- High contrast UI (7:1 ratio)

## Phases

| Phase | Status | Effort |
|-------|--------|--------|
| [Phase 01: Install Dependencies](./phase-01-install-dependencies.md) | ⏳ pending | 1h |
| [Phase 02: Create AI Sidebar Component](./phase-02-create-ai-sidebar-component.md) | ⏳ pending | 3h |
| [Phase 03: Implement Text Selection Feature](./phase-03-implement-text-selection-feature.md) | ⏳ pending | 2h |
| [Phase 04: Add Summarize Feature](./phase-04-add-summarize-feature.md) | ⏳ pending | 1h |
| [Phase 05: Integrate Sidebar into Page](./phase-05-integrate-sidebar-into-page.md) | ⏳ pending | 1h |

## Key Dependencies

1. `@ai-sdk/react` - Vercel AI SDK for React
2. `ai` - Core Vercel AI SDK
3. `@anthropic-ai/sdk` - Anthropic Claude SDK
4. Environment: `ANTHROPIC_API_KEY` in .env.local

## Risks

- **Medium**: Client-side API key exposure (acceptable for demo)
- **Low**: Text selection API browser compatibility

## Success Criteria

- Sidebar appears on toggle button click
- Highlighting text shows medical term popup
- Summarize button produces simple elderly-friendly output
- All text meets WCAG AAA 7:1 contrast ratio