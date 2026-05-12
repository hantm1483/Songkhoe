"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseTextSelectionOptions {
  minLength?: number;
  maxLength?: number;
  debounceMs?: number;
}

interface UseTextSelectionReturn {
  selectedText: string | null;
  selectionPosition: { x: number; y: number } | null;
  clearSelection: () => void;
}

export function useTextSelection(options: UseTextSelectionOptions = {}): UseTextSelectionReturn {
  const {
    minLength = 2,
    maxLength = 50,
    debounceMs = 300,
  } = options;

  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearSelection = useCallback(() => {
    setSelectedText(null);
    setSelectionPosition(null);
  }, []);

  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      // Clear any pending debounce
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce the selection check
      debounceTimerRef.current = setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          return;
        }

        const text = selection.toString().trim();

        // Check if text is within acceptable length
        if (text.length < minLength || text.length > maxLength) {
          return;
        }

        // Get the bounding rect of the selection
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Set selection data
        setSelectedText(text);
        setSelectionPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + window.scrollY,
        });

        // Log for debugging
        console.log("Text selected:", text, "at", rect);
      }, debounceMs);
    };

    // Handle clicks outside selection to clear
    const handleMouseDown = (event: MouseEvent) => {
      // Don't clear if clicking on the sidebar or related UI
      const target = event.target as HTMLElement;
      if (target.closest("[data-ai-sidebar]")) {
        return;
      }

      // Small delay to allow selection to be checked first
      setTimeout(() => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
          setSelectedText(null);
          setSelectionPosition(null);
        }
      }, 10);
    };

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousedown", handleMouseDown);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousedown", handleMouseDown);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [minLength, maxLength, debounceMs]);

  return {
    selectedText,
    selectionPosition,
    clearSelection,
  };
}