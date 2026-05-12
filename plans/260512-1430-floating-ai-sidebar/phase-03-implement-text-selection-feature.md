# Phase 03: Implement Text Selection Feature

## Context
Implementing the ability to select text on the page and get medical term explanations.

## Overview
- **Priority**: P1
- **Status**: pending
- **Effort**: 2h

## Requirements

### Text Selection Logic
- Detect `mouseup` event on page
- Capture selected text via `window.getSelection()`
- If text is between 2-50 characters, trigger API call
- Debounce to prevent spam calls

### AI Integration
- Use `@ai-sdk/react` useChat hook
- Send selected text to Claude 3.5 Sonnet
- Prompt: "Explain this medical term in simple Vietnamese for elderly patients"

### Popup Display
- Show floating popup near selection
- Display loading state while AI responds
- Show explanation with "Read more" option

## Implementation Steps

1. Create `src/hooks/use-text-selection.ts`
2. Create `src/components/ai-sidebar/medical-term-popup.tsx`
3. Integrate with floating sidebar

## Success Criteria
- Selecting text shows loading indicator
- AI response appears in popup
- Popup can be dismissed