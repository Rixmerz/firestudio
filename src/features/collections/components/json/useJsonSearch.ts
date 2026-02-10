import { useState, useCallback, useRef, useEffect, RefObject } from 'react';

interface JsonSearchReturn {
  searchVisible: boolean;
  setSearchVisible: (visible: boolean) => void;
  searchText: string;
  setSearchText: (text: string) => void;
  matchCount: number;
  currentMatch: number;
  searchInputRef: RefObject<HTMLInputElement | null>;
  nextMatch: () => void;
  prevMatch: () => void;
}

/**
 * Custom hook for JSON search functionality
 * @param jsonEditData - The JSON string to search within
 * @param textareaRef - Ref to the textarea element
 * @returns Search state and handlers
 */
export const useJsonSearch = (
  jsonEditData: string,
  textareaRef: RefObject<HTMLTextAreaElement | null>,
): JsonSearchReturn => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [matchCount, setMatchCount] = useState(0);
  const [currentMatch, setCurrentMatch] = useState(0);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Find all matches
  const findMatches = useCallback(() => {
    if (!searchText || !jsonEditData) {
      setMatchCount(0);
      setCurrentMatch(0);
      return [];
    }

    const text = jsonEditData.toLowerCase();
    const search = searchText.toLowerCase();
    const matches: number[] = [];
    let index = 0;

    while ((index = text.indexOf(search, index)) !== -1) {
      matches.push(index);
      index += search.length;
    }

    setMatchCount(matches.length);
    if (matches.length > 0 && currentMatch === 0) {
      setCurrentMatch(1);
    }
    return matches;
  }, [searchText, jsonEditData, currentMatch]);

  // Navigate to specific match
  const goToMatch = useCallback(
    (matchIndex: number, focusTextarea = false) => {
      const matches = findMatches();
      if (matches.length === 0 || !textareaRef.current) return;

      const index = matches[matchIndex - 1];
      if (index !== undefined) {
        if (focusTextarea) {
          textareaRef.current.focus();
        }
        textareaRef.current.setSelectionRange(index, index + searchText.length);

        // Calculate scroll position approx
        // Using a simple ratio based on character position
        const textArea = textareaRef.current;
        const scrollRatio = index / jsonEditData.length;
        textArea.scrollTop = Math.max(0, textArea.scrollHeight * scrollRatio - 100);
      }
    },
    [findMatches, searchText, jsonEditData, textareaRef],
  );

  // Navigate to next match
  const nextMatch = useCallback(() => {
    if (matchCount === 0) return;
    const next = currentMatch >= matchCount ? 1 : currentMatch + 1;
    setCurrentMatch(next);
    goToMatch(next, false);
  }, [matchCount, currentMatch, goToMatch]);

  // Navigate to previous match
  const prevMatch = useCallback(() => {
    if (matchCount === 0) return;
    const prev = currentMatch <= 1 ? matchCount : currentMatch - 1;
    setCurrentMatch(prev);
    goToMatch(prev, false);
  }, [matchCount, currentMatch, goToMatch]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setSearchVisible(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape' && searchVisible) {
        setSearchVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchVisible]);

  // Update matches when search text changes
  useEffect(() => {
    if (searchText) {
      findMatches();
    } else {
      setMatchCount(0);
      setCurrentMatch(0);
    }
  }, [searchText, findMatches]);

  return {
    searchVisible,
    setSearchVisible,
    searchText,
    setSearchText,
    matchCount,
    currentMatch,
    searchInputRef,
    nextMatch,
    prevMatch,
  };
};
