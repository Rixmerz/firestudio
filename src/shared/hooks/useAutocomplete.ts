import { useState, useCallback, useEffect } from 'react';
import { Completion } from '../utils/completions';

type MethodCallContext = {
  name: string;
  argIndex: number;
};

export interface AutocompleteContext {
  isLineEmpty: boolean;
  trigger: string;
  isInString: boolean;
  isAfterDot: boolean;
  isDbAccess: boolean;
  methodCall?: MethodCallContext;
}

const METHOD_CALL_REGEX =
  /\.(where|orderBy|select|startAt|startAfter|endAt|endBefore|limit|limitToLast|collection|collectionGroup|doc)\s*\(([^)]*)$/;
const METHOD_PRIORITY: Record<string, number> = {
  '.where': 40,
  '.orderBy': 35,
  '.limit': 30,
  '.limitToLast': 28,
  '.get': 32,
  '.doc': 28,
  '.collection': 27,
  '.collectionGroup': 26,
  '.select': 24,
  '.add': 18,
  '.set': 18,
  '.update': 18,
  '.delete': 18,
  '.count': 16,
  '.withConverter': 14,
  '.listDocuments': 12,
  '.listCollections': 12,
};

const normalizeForMatch = (value: string) => value.toLowerCase().replace(/^[\s.'"`]+/, '');

const isSubsequence = (needle: string, haystack: string) => {
  let i = 0;
  let j = 0;
  while (i < needle.length && j < haystack.length) {
    if (needle[i] === haystack[j]) {
      i += 1;
    }
    j += 1;
  }
  return i === needle.length;
};

const getStringContext = (text: string) => {
  let inString: "'" | '"' | null = null;
  let startIndex = -1;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '\\') {
      i += 1;
      continue;
    }
    if (char === '"' || char === "'") {
      if (inString === char) {
        inString = null;
        startIndex = -1;
      } else if (!inString) {
        inString = char;
        startIndex = i;
      }
    }
  }
  return { inString: Boolean(inString), quote: inString || undefined, startIndex };
};

const countCommasOutsideStrings = (text: string) => {
  let inString: "'" | '"' | null = null;
  let count = 0;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (char === '\\') {
      i += 1;
      continue;
    }
    if (char === '"' || char === "'") {
      if (inString === char) {
        inString = null;
      } else if (!inString) {
        inString = char;
      }
      continue;
    }
    if (!inString && char === ',') {
      count += 1;
    }
  }
  return count;
};

const getMethodCallContext = (text: string): MethodCallContext | undefined => {
  const match = text.match(METHOD_CALL_REGEX);
  if (!match) return undefined;
  const [, name, args] = match;
  return {
    name,
    argIndex: countCommasOutsideStrings(args || ''),
  };
};

const inferKind = (completion: Completion) => {
  if (completion.kind) return completion.kind;
  if (completion.trigger.startsWith('.')) return 'method';
  if (completion.trigger.startsWith('db')) return 'keyword';
  if (completion.trigger.startsWith('"') || completion.trigger.startsWith("'")) return 'value';
  if (completion.trigger.startsWith('FieldValue')) return 'property';
  if (completion.trigger.includes('function')) return 'snippet';
  return undefined;
};

const scoreCandidate = (trigger: string, candidate?: string, weight = 1) => {
  if (!candidate) return 0;
  const lowerTrigger = trigger.toLowerCase();
  const lowerCandidate = candidate.toLowerCase();
  let score = 0;

  if (lowerCandidate === lowerTrigger) score += 100;
  if (lowerCandidate.startsWith(lowerTrigger)) score += 80;
  if (lowerCandidate.includes(lowerTrigger)) score += 50;
  if (lowerTrigger.length >= 2 && isSubsequence(lowerTrigger, lowerCandidate)) score += 30;

  const normalizedTrigger = normalizeForMatch(lowerTrigger);
  const normalizedCandidate = normalizeForMatch(lowerCandidate);
  if (normalizedTrigger && normalizedCandidate !== lowerCandidate) {
    if (normalizedCandidate === normalizedTrigger) score += 60;
    if (normalizedCandidate.startsWith(normalizedTrigger)) score += 40;
  }

  return score * weight;
};

/**
 * Hook to manage autocomplete state and logic
 */
export function useAutocomplete(
  staticCompletions: Completion[] = [],
  getDynamicCompletions: ((context?: AutocompleteContext) => Completion[]) | null = null,
) {
  const [showAutocomplete, setShowAutocomplete] = useState<boolean>(false);
  const [completionItems, setCompletionItems] = useState<Completion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [currentTrigger, setCurrentTrigger] = useState<string>('');

  /**
   * Get the word/trigger at the current cursor position
   */
  const getWordAtCursor = useCallback((text: string, cursorPos: number): string => {
    const textBefore = text.substring(0, cursorPos);
    const lineStart = textBefore.lastIndexOf('\n') + 1;
    const lineText = textBefore.substring(lineStart);
    const sanitizedLine = lineText.replace(/\s+$/, '');

    const stringContext = getStringContext(sanitizedLine);
    if (stringContext.inString && stringContext.startIndex >= 0 && stringContext.quote) {
      const stringPrefix = sanitizedLine.substring(stringContext.startIndex + 1);
      return `${stringContext.quote}${stringPrefix}`;
    }

    if (sanitizedLine.endsWith('(') || sanitizedLine.endsWith(',')) {
      return '';
    }

    // Prefer full token before a dot (e.g. db., FieldValue.)
    const scopedMatch = sanitizedLine.match(/\b[\w$]+\.[\w$]*$/);
    if (scopedMatch) return scopedMatch[0];

    // Method chain or trailing dot
    const methodChainMatch = sanitizedLine.match(/\.[\w$]*$/);
    if (methodChainMatch) return methodChainMatch[0];

    // Fallback to word token
    const match = sanitizedLine.match(/[\w$]+$/);
    return match ? match[0] : '';
  }, []);

  /**
   * Filter completions based on the current trigger and context
   */
  const getAutocompleteContext = useCallback(
    (text: string, cursorPos: number, trigger: string): AutocompleteContext => {
      const textBefore = text.substring(0, cursorPos);
      const lineStart = textBefore.lastIndexOf('\n') + 1;
      const lineText = textBefore.substring(lineStart);
      const sanitizedLine = lineText.replace(/\s+$/, '');
      const stringContext = getStringContext(sanitizedLine);
      const recentContext = textBefore.slice(Math.max(0, textBefore.length - 220));
      const methodCall = getMethodCallContext(recentContext);
      const isAfterDot = !stringContext.inString && /\.[\w$]*$/.test(sanitizedLine);
      const isDbAccess = /\bdb\.[\w$]*$/.test(sanitizedLine);
      const isLineEmpty = sanitizedLine.trim().length === 0;

      return {
        isLineEmpty,
        trigger,
        isInString: stringContext.inString,
        isAfterDot,
        isDbAccess,
        methodCall,
      };
    },
    [],
  );

  const filterCompletions = useCallback(
    (trigger: string, context: AutocompleteContext): Completion[] => {
      const normalizedTrigger = trigger.trim();
      const hasTrigger = normalizedTrigger.length >= 1;
      const allowEmptyTrigger =
        !hasTrigger && Boolean(context.methodCall || context.isInString || context.isAfterDot || context.isLineEmpty);
      if (!hasTrigger && !allowEmptyTrigger) return [];

      const dynamicItems = getDynamicCompletions ? getDynamicCompletions(context) : [];
      const allCompletions = [...staticCompletions, ...dynamicItems];

      const expectsStringArgument = Boolean(
        context.isInString ||
        (context.methodCall &&
          ['collection', 'collectionGroup', 'doc', 'where', 'orderBy', 'select'].includes(context.methodCall.name)),
      );

      const scored = allCompletions
        .map((completion) => {
          const kind = inferKind(completion);
          const candidates = [
            completion.trigger,
            completion.fullMatch,
            completion.description,
            ...(completion.keywords || []),
          ].filter(Boolean) as string[];

          let baseScore = 0;
          if (hasTrigger) {
            baseScore = candidates.reduce((best, candidate) => {
              return Math.max(
                best,
                scoreCandidate(normalizedTrigger, candidate, candidate === completion.description ? 0.6 : 1),
              );
            }, 0);
          } else if (allowEmptyTrigger) {
            if (context.isLineEmpty && !context.methodCall && !context.isInString && !context.isAfterDot) {
              if (kind === 'snippet') baseScore = 18;
            }
            if (context.methodCall) {
              const { name, argIndex } = context.methodCall;
              if (name === 'where') {
                if (argIndex === 0 && (kind === 'field' || kind === 'collection')) baseScore = 20;
                if (argIndex === 1 && kind === 'operator') baseScore = 24;
                if (argIndex >= 2 && kind === 'value') baseScore = 16;
              }
              if (name === 'orderBy') {
                if (argIndex === 0 && kind === 'field') baseScore = 20;
                if (argIndex === 1 && kind === 'direction') baseScore = 24;
              }
              if (name === 'select' && argIndex === 0 && kind === 'field') baseScore = 18;
              if (['collection', 'collectionGroup', 'doc'].includes(name) && kind === 'collection') baseScore = 18;
            }
            if (context.isInString && (kind === 'collection' || kind === 'field')) {
              baseScore = Math.max(baseScore, 16);
            }
            if (context.isAfterDot && (kind === 'method' || completion.trigger.startsWith('.'))) {
              baseScore = Math.max(baseScore, 12);
            }
          }

          if (baseScore <= 0) {
            return { completion, score: 0 };
          }

          let score = baseScore + (completion.priority || 0);

          if (context.isAfterDot || trigger.startsWith('.')) {
            if (kind === 'method' || completion.trigger.startsWith('.')) score += 25;
            if (kind === 'keyword') score -= 8;
          }

          if (context.isDbAccess && completion.trigger.startsWith('db')) {
            score += 20;
          }

          if (!context.isAfterDot && !context.isInString && !context.methodCall && kind === 'snippet') {
            score += 18;
          }

          if ((context.isAfterDot || context.isInString) && kind === 'snippet') {
            score -= 8;
          }

          if (context.isInString) {
            if (kind === 'collection' || kind === 'field') score += 35;
            if (completion.trigger.startsWith('"') || completion.trigger.startsWith("'")) score += 18;
            if (kind === 'method' || kind === 'keyword') score -= 10;
          }

          if (!expectsStringArgument && (completion.trigger.startsWith('"') || completion.trigger.startsWith("'"))) {
            score -= 18;
          }

          if (context.methodCall) {
            const { name, argIndex } = context.methodCall;
            if (name === 'where') {
              if (argIndex === 0 && kind === 'field') score += 40;
              if (argIndex === 1 && kind === 'operator') score += 45;
            }
            if (name === 'orderBy') {
              if (argIndex === 0 && kind === 'field') score += 40;
              if (argIndex === 1 && kind === 'direction') score += 45;
            }
            if (name === 'select' && argIndex === 0 && kind === 'field') score += 35;
            if (name === 'collection' && kind === 'collection') score += 30;
            if (name === 'collectionGroup' && kind === 'collection') score += 30;
            if (name === 'doc' && kind === 'collection') score += 20;
          }

          const methodKey = completion.fullMatch || completion.trigger;
          if (METHOD_PRIORITY[methodKey]) {
            score += METHOD_PRIORITY[methodKey];
          }

          return { completion, score };
        })
        .filter((item) => item.score > 0);

      const bestByKey = new Map<string, { completion: Completion; score: number }>();
      scored.forEach(({ completion, score }) => {
        const key = completion.fullMatch || completion.trigger;
        const existing = bestByKey.get(key);
        if (!existing || score > existing.score) {
          bestByKey.set(key, { completion, score });
        }
      });

      return [...bestByKey.values()]
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return b.completion.trigger.length - a.completion.trigger.length;
        })
        .map((item) => item.completion)
        .slice(0, 14);
    },
    [staticCompletions, getDynamicCompletions],
  );

  /**
   * Handle input changes to update autocomplete state
   */
  const handleInputChange = useCallback(
    (text: string, cursorPos: number): boolean => {
      const trigger = getWordAtCursor(text, cursorPos);
      const context = getAutocompleteContext(text, cursorPos, trigger);

      const items = filterCompletions(trigger, context);
      if (items.length > 0) {
        setCompletionItems(items);
        setSelectedIndex(0);
        setCurrentTrigger(trigger);
        setShowAutocomplete(true);
        return true; // Autocomplete active
      }

      setShowAutocomplete(false);
      return false;
    },
    [getWordAtCursor, getAutocompleteContext, filterCompletions],
  );

  /**
   * Handle keyboard navigation for autocomplete
   */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent | KeyboardEvent, onApply: (item: Completion, trigger: string) => void): boolean => {
      if (!showAutocomplete) return false;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, completionItems.length - 1));
        return true;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
        return true;
      }
      if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        if (completionItems[selectedIndex]) {
          onApply(completionItems[selectedIndex], currentTrigger);
        }
        setShowAutocomplete(false);
        return true;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowAutocomplete(false);
        return true;
      }

      return false;
    },
    [showAutocomplete, completionItems, selectedIndex, currentTrigger],
  );

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = () => setShowAutocomplete(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return {
    showAutocomplete,
    setShowAutocomplete,
    completionItems,
    selectedIndex,
    position,
    setPosition,
    currentTrigger,
    handleInputChange,
    handleKeyDown,
  };
}
