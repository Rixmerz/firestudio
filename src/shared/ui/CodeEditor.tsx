import React, { useRef, useMemo, useEffect, useCallback } from 'react';
import { Box, useTheme } from '@mui/material';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import { MONOSPACE_FONT_FAMILY, EDITOR_FONT_FAMILY } from '../utils/constants';

// Register languages
hljs.registerLanguage('javascript', javascript);

/**
 * Shared CodeEditor component with line numbers and syntax highlighting
 */
interface CodeEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  language?: string;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  textareaRef?: React.RefObject<HTMLTextAreaElement | null>;
  scrollRef?: React.MutableRefObject<{ scrollTop: (top: number) => void } | null>;
  searchText?: string;
  currentMatchIndex?: number;
  children?: React.ReactNode;
}

function CodeEditor({
  value,
  onChange,
  language = 'text',
  placeholder,
  className,
  readOnly = false,
  onKeyDown,
  textareaRef: externalRef,
  scrollRef: externalScrollRef,
  searchText = '',
  currentMatchIndex = 0,
  children,
}: CodeEditorProps) {
  const theme = useTheme();
  const internalRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const editorColors = theme.custom.editor;
  const syntaxColors = theme.custom.syntax;

  // Use external ref if provided, otherwise internal
  const textareaRef = externalRef || internalRef;

  // Count lines
  const lineCount = (value || '').split('\n').length;
  const lineNumbers = Array.from({ length: Math.max(lineCount, 8) }, (_, i) => i + 1);

  // Highlighted code with search matches
  const highlightedCode = useMemo(() => {
    if (!value) return '';
    try {
      const result = hljs.highlight(value, { language });
      let html = result.value;

      // Add search highlighting if searchText exists
      if (searchText) {
        const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const escapedSearch = escapeRegex(searchText);
        const searchRegex = new RegExp(`(${escapedSearch})`, 'gi');

        // Count matches to find current one
        let matchIndex = 0;
        html = html.replace(searchRegex, (match: string) => {
          matchIndex++;
          const isCurrent = matchIndex === currentMatchIndex;
          return `<mark class="search-match${isCurrent ? ' current-match' : ''}">${match}</mark>`;
        });
      }

      return html;
    } catch {
      return value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
  }, [value, language, searchText, currentMatchIndex]);

  // Sync scroll
  const syncScroll = useCallback((target: HTMLTextAreaElement) => {
    const { scrollTop, scrollLeft } = target;
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollTop;
    }
    if (highlightRef.current) {
      highlightRef.current.scrollTop = scrollTop;
      highlightRef.current.scrollLeft = scrollLeft;
    }
  }, []);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLTextAreaElement>) => {
      syncScroll(e.currentTarget);
    },
    [syncScroll],
  );

  // Expose scroll handler
  useEffect(() => {
    if (externalScrollRef) {
      externalScrollRef.current = {
        scrollTop: (top: number) => {
          if (textareaRef.current) {
            textareaRef.current.scrollTop = top;
            syncScroll(textareaRef.current);
          }
        },
      };
    }
  }, [externalScrollRef, syncScroll, textareaRef]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        bgcolor: editorColors.bg,
      }}
      className={className}
    >
      {/* Styles for syntax highlighting */}
      <style>{`
                .shared-editor-highlight span.hljs-keyword { color: ${syntaxColors.keyword}; }
                .shared-editor-highlight span.hljs-string { color: ${syntaxColors.string}; }
                .shared-editor-highlight span.hljs-number { color: ${syntaxColors.number}; }
                .shared-editor-highlight span.hljs-function { color: ${syntaxColors.function}; }
                .shared-editor-highlight span.hljs-title { color: ${syntaxColors.function}; }
                .shared-editor-highlight span.hljs-comment { color: ${syntaxColors.comment}; font-style: italic; }
                .shared-editor-highlight span.hljs-operator { color: ${syntaxColors.operator}; }
                .shared-editor-highlight span.hljs-variable { color: ${syntaxColors.variable}; }
                .shared-editor-highlight span.hljs-property { color: ${syntaxColors.property}; }
                .shared-editor-highlight span.hljs-built_in { color: ${syntaxColors.builtin}; }
                .shared-editor-highlight span.hljs-params { color: ${syntaxColors.variable}; }
                .shared-editor-highlight span.hljs-literal { color: ${syntaxColors.keyword}; }
                .shared-editor-highlight span.hljs-attr { color: ${syntaxColors.property}; }
                .shared-editor-highlight span.hljs-punctuation { color: ${syntaxColors.bracket}; }
                .shared-editor-highlight mark.search-match { background-color: rgba(255, 235, 59, 0.4); color: inherit; border-radius: 2px; }
                .shared-editor-highlight mark.search-match.current-match { background-color: rgba(255, 152, 0, 0.6); outline: 1px solid #ff9800; }
            `}</style>

      {/* Line Numbers */}
      <Box
        ref={lineNumbersRef}
        sx={{
          width: 45,
          minWidth: 45,
          bgcolor: editorColors.gutter,
          borderRight: 1,
          borderColor: 'divider',
          overflow: 'hidden',
          pt: 1,
          userSelect: 'none',
        }}
      >
        {lineNumbers.map((num) => (
          <Box
            key={num}
            sx={{
              height: '1.5em',
              lineHeight: '1.5em',
              textAlign: 'right',
              pr: 1.5,
              fontSize: '13px',
              fontFamily: MONOSPACE_FONT_FAMILY,
              color: editorColors.lineNumber,
            }}
          >
            {num}
          </Box>
        ))}
      </Box>

      {/* Editor Area */}
      <Box
        sx={{
          position: 'relative',
          flexGrow: 1,
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        {/* Highlight Overlay (Background) */}
        <pre
          ref={highlightRef}
          className="shared-editor-highlight"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            margin: 0,
            padding: '8px 16px',
            fontFamily: EDITOR_FONT_FAMILY,
            fontSize: '13px',
            lineHeight: '1.5em',
            backgroundColor: editorColors.bg,
            color: theme.palette.text.primary,
            overflow: 'auto',
            whiteSpace: 'pre',
            pointerEvents: 'none',
          }}
          dangerouslySetInnerHTML={{ __html: highlightedCode || '&nbsp;' }}
        />

        {/* Textarea (Foreground) */}
        <textarea
          ref={textareaRef}
          value={value || ''}
          onChange={(e) => onChange && onChange(e.target.value)}
          onScroll={handleScroll}
          onKeyDown={onKeyDown}
          spellCheck={false}
          readOnly={readOnly}
          placeholder={placeholder}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100%',
            height: '100%',
            fontFamily: EDITOR_FONT_FAMILY,
            fontSize: '13px',
            lineHeight: '1.5em',
            border: 'none',
            outline: 'none',
            padding: '8px 16px',
            resize: 'none',
            backgroundColor: 'transparent',
            color: 'transparent',
            caretColor: theme.palette.primary.main,
            tabSize: 2,
            whiteSpace: 'pre',
            overflow: 'auto',
          }}
        />

        {children}
      </Box>
    </Box>
  );
}

export default CodeEditor;
