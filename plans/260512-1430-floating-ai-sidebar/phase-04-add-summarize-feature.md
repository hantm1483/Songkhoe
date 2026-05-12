# Phase 04: Add Summarize Feature

## Context
Adding "Tóm tắt cho người già" (Summarize for elderly) button functionality.

## Overview
- **Priority**: P1
- **Status**: pending
- **Effort**: 1h

## Requirements

### Summarize Button
- Large, high contrast button
- Icon: Sparkles or BookOpen
- Label: "Tóm tắt bài viết cho người già"

### AI Prompt
Claude 3.5 Sonnet receives full article content and outputs:
- Simple sentences (max 10 words per sentence)
- No medical jargon
- Short paragraphs (3-4 sentences max)
- Large font (18px+)
- Vietnamese language

### Output Display
- Appears in sidebar panel
- Loading spinner during generation
- Copy button for easy copying

## Implementation Steps

1. Add summarize state to sidebar
2. Create summarize prompt for Claude
3. Display simplified output
4. Add copy functionality

## Success Criteria
- Button triggers AI summarization
- Output is in simple Vietnamese
- Font size is readable for elderly