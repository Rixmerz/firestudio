import React, { useRef, useMemo, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { Code as CodeIcon, PlayArrow as RunIcon, Save as SaveIcon } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { selectProjects, Project, GoogleAccount, FirestoreCollection } from '../../projects/store/projectsSlice';
import { requestSaveQuery } from '../../console/store/savedQueriesSlice';
import {
  jsEditorCompletions,
  Completion,
  firestoreOperatorCompletions,
  orderDirectionCompletions,
} from '../../../shared/utils/completions';
import { MONOSPACE_FONT_FAMILY } from '../../../shared/utils/constants';
import CodeEditor from '../../../shared/ui/CodeEditor';
import { useAutocomplete, AutocompleteContext } from '../../../shared/hooks/useAutocomplete';
import { AppDispatch, RootState } from '../../../app/store';

// Generate default template with current collection
const getDefaultJsQuery = (collectionPath: string) => `// JavaScript Query Editor
// Write async queries using the Firestore Admin SDK
// Available variables: db (Firestore instance), admin (firebase-admin)
// Must return a QuerySnapshot or DocumentSnapshot

async function run() {
    const snapshot = await db
        .collection('${collectionPath || 'users'}')
        .limit(50)
        .get();
    
    return snapshot;
}`;

interface JsQueryEditorProps {
  jsQuery: string;
  setJsQuery: (query: string) => void;
  projectId?: string;
  collectionPath: string;
  fieldNames?: string[];
}

const JsQueryEditor: React.FC<JsQueryEditorProps> = ({
  jsQuery,
  setJsQuery,
  projectId,
  collectionPath,
  fieldNames = [],
}) => {
  const theme = useTheme();
  const editorColors = theme.custom.editor;
  const isDark = theme.palette.mode === 'dark';
  const dispatch = useDispatch<AppDispatch>();

  // Type guard for GoogleAccount
  const isGoogleAccount = (item: Project | GoogleAccount): item is GoogleAccount => {
    return 'type' in item && item.type === 'googleAccount';
  };

  // Get all collections from Redux for autocomplete
  const projects = useSelector((state: RootState) => selectProjects(state));
  const allCollections = useMemo(() => {
    const collections = new Set<string>();
    projects?.forEach((project: Project | GoogleAccount) => {
      // Handle Google Account projects (nested)
      if (isGoogleAccount(project) && project.projects) {
        project.projects.forEach((p: Project) => {
          p.collections?.forEach((c: FirestoreCollection) => collections.add(c.id));
        });
      } else if (!isGoogleAccount(project)) {
        // Service account projects
        project.collections?.forEach((c: FirestoreCollection) => collections.add(c.id));
      }
    });
    return [...collections];
  }, [projects]);

  // Initialize with default template if empty or when collection changes
  useEffect(() => {
    if (!jsQuery || jsQuery.trim() === '' || jsQuery.includes(".collection('users')")) {
      setJsQuery(getDefaultJsQuery(collectionPath));
    }
  }, [collectionPath, jsQuery, setJsQuery]); // Re-run when collection changes

  // Undo/Redo history
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const lastValueRef = useRef<string>(jsQuery || '');

  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Dynamic completions logic
  const getDynamicCompletions = useCallback(
    (context?: AutocompleteContext): Completion[] => {
      const completions: Completion[] = [];
      const methodName = context?.methodCall?.name;
      const argIndex = context?.methodCall?.argIndex ?? -1;
      const isInString = Boolean(context?.isInString);

      const isMethodContext = Boolean(methodName);
      const wantsField = ['where', 'orderBy', 'select'].includes(methodName || '') && argIndex === 0;
      const wantsOperator = methodName === 'where' && argIndex === 1;
      const wantsDirection = methodName === 'orderBy' && argIndex === 1;
      const expectsCollection = ['collection', 'collectionGroup', 'doc'].includes(methodName || '');
      const shouldSuggestCollections = expectsCollection || (!isMethodContext && isInString);
      const shouldSuggestFields = wantsField || (!isMethodContext && isInString);

      if (wantsOperator) {
        completions.push(...firestoreOperatorCompletions);
      }
      if (wantsDirection) {
        completions.push(...orderDirectionCompletions);
      }

      // Add db.collection with current collection name (high priority)
      if (collectionPath) {
        completions.push({
          trigger: 'db',
          suggestion: `.collection('${collectionPath}')`,
          cursorOffset: 0,
          description: `db.collection('${collectionPath}')`,
          fullMatch: `db.collection('${collectionPath}')`,
          kind: 'method',
          priority: 40,
        });
        completions.push({
          trigger: 'db.',
          suggestion: `collection('${collectionPath}')`,
          cursorOffset: 0,
          description: `collection('${collectionPath}')`,
          fullMatch: `db.collection('${collectionPath}')`,
          kind: 'method',
          priority: 40,
        });
        completions.push({
          trigger: 'db.c',
          suggestion: `ollection('${collectionPath}')`,
          cursorOffset: 0,
          description: `collection('${collectionPath}')`,
          fullMatch: `db.collection('${collectionPath}')`,
          kind: 'method',
          priority: 36,
        });
        completions.push({
          trigger: 'db.col',
          suggestion: `lection('${collectionPath}')`,
          cursorOffset: 0,
          description: `collection('${collectionPath}')`,
          fullMatch: `db.collection('${collectionPath}')`,
          kind: 'method',
          priority: 34,
        });
        completions.push({
          trigger: 'db.collection',
          suggestion: `('${collectionPath}')`,
          cursorOffset: 0,
          description: `collection('${collectionPath}')`,
          fullMatch: `db.collection('${collectionPath}')`,
          kind: 'method',
          priority: 32,
        });
      }

      // Add field name completions
      if (fieldNames.length > 0 && shouldSuggestFields) {
        fieldNames.forEach((field) => {
          completions.push({
            trigger: `'${field}`,
            suggestion: `'`,
            cursorOffset: 0,
            description: `Field: ${field}`,
            fullMatch: `'${field}'`,
            kind: 'field',
          });
          completions.push({
            trigger: `"${field}`,
            suggestion: `"`,
            cursorOffset: 0,
            description: `Field: ${field}`,
            fullMatch: `"${field}"`,
            kind: 'field',
          });
          completions.push({
            trigger: field,
            suggestion: '',
            cursorOffset: 0,
            description: `Field: ${field}`,
            fullMatch: field,
            kind: 'field',
          });
        });
      }

      // Add current collection
      if (collectionPath && shouldSuggestCollections) {
        completions.push({
          trigger: `'${collectionPath}`,
          suggestion: `'`,
          cursorOffset: 0,
          description: `Current collection`,
          fullMatch: `'${collectionPath}'`,
          kind: 'collection',
          priority: 25,
        });
        completions.push({
          trigger: `"${collectionPath}`,
          suggestion: `"`,
          cursorOffset: 0,
          description: `Current collection`,
          fullMatch: `"${collectionPath}"`,
          kind: 'collection',
          priority: 25,
        });
      }

      // Add all collection names for autocomplete
      if (shouldSuggestCollections) {
        allCollections.forEach((col) => {
          if (col !== collectionPath) {
            // Skip current collection (already added)
            completions.push({
              trigger: `'${col}`,
              suggestion: `'`,
              cursorOffset: 0,
              description: `Collection: ${col}`,
              fullMatch: `'${col}'`,
              kind: 'collection',
            });
            completions.push({
              trigger: `"${col}`,
              suggestion: `"`,
              cursorOffset: 0,
              description: `Collection: ${col}`,
              fullMatch: `"${col}"`,
              kind: 'collection',
            });
          }
        });
      }

      return completions;
    },
    [fieldNames, collectionPath, allCollections],
  );

  // Use shared autocomplete hook
  const {
    showAutocomplete,
    completionItems,
    selectedIndex,
    position,
    setPosition,
    handleInputChange: handleAutocompleteChange,
    handleKeyDown: handleAutocompleteKeyDown,
    currentTrigger,
  } = useAutocomplete(jsEditorCompletions, getDynamicCompletions);

  // Calculate position manually since CodeEditor doesn't expose it directly yet
  // We can rely on a simpler approximation or add getCursorCoordinates to CodeEditor later
  // For now, using the same logic as before, adapted
  const updateAutocompletePosition = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const textBefore = (jsQuery || '').substring(0, cursorPos);
    const lines = textBefore.split('\n');
    const currentLineIndex = lines.length - 1;
    const currentLineText = lines[currentLineIndex];

    // Approximate position (viewport-based)
    const rect = textarea.getBoundingClientRect();
    const charWidth = 7.8;
    const lineHeight = 19.5;
    const paddingTop = 8;
    const paddingLeft = 16;
    const popoverHeight = 220;
    const popoverWidth = 360;

    const baseTop = rect.top + paddingTop + currentLineIndex * lineHeight + lineHeight - textarea.scrollTop;
    const baseLeft = rect.left + paddingLeft + currentLineText.length * charWidth - textarea.scrollLeft;
    const shouldFlip = baseTop + popoverHeight > window.innerHeight;
    const top = shouldFlip ? Math.max(8, baseTop - popoverHeight - lineHeight) : baseTop;
    const maxLeft = Math.max(8, window.innerWidth - popoverWidth - 8);

    setPosition({
      top: Math.max(8, top),
      left: Math.max(8, Math.min(baseLeft, maxLeft)),
    });
  }, [jsQuery, setPosition]);

  // Push to undo stack
  const pushToUndoStack = useCallback((value: string) => {
    if (value !== lastValueRef.current) {
      setUndoStack((prev) => [...prev.slice(-50), lastValueRef.current]);
      setRedoStack([]);
      lastValueRef.current = value;
    }
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const prevValue = undoStack[undoStack.length - 1];
      setUndoStack((prev) => prev.slice(0, -1));
      setRedoStack((prev) => [...prev, jsQuery || '']);
      lastValueRef.current = prevValue;
      setJsQuery(prevValue);
    }
  }, [undoStack, jsQuery, setJsQuery]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const nextValue = redoStack[redoStack.length - 1];
      setRedoStack((prev) => prev.slice(0, -1));
      setUndoStack((prev) => [...prev, jsQuery || '']);
      lastValueRef.current = nextValue;
      setJsQuery(nextValue);
    }
  }, [redoStack, jsQuery, setJsQuery]);

  const handleChange = useCallback(
    (newValue: string) => {
      pushToUndoStack(newValue);
      setJsQuery(newValue);

      // Handle autocomplete
      setTimeout(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          const isActive = handleAutocompleteChange(newValue, textarea.selectionStart);
          if (isActive) {
            updateAutocompletePosition();
          }
        }
      }, 0);
    },
    [setJsQuery, pushToUndoStack, handleAutocompleteChange, updateAutocompletePosition],
  );

  const applyCompletion = useCallback(
    (item: Completion, trigger: string) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const cursorPos = textarea.selectionStart;
      const triggerLen = trigger.length;
      const fullText = item.insertText ?? item.trigger + item.suggestion;
      const text = jsQuery || '';

      const stripQuotes = (value: string) => {
        if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
          return value.slice(1, -1);
        }
        if (value.startsWith("'") || value.startsWith('"')) return value.slice(1);
        if (value.endsWith("'") || value.endsWith('"')) return value.slice(0, -1);
        return value;
      };

      const isEscaped = (index: number) => {
        let count = 0;
        for (let i = index - 1; i >= 0; i -= 1) {
          if (text[i] !== '\\') break;
          count += 1;
        }
        return count % 2 === 1;
      };

      const replaceInsideQuotes = (quote: "'" | '"') => {
        let start = -1;
        for (let i = cursorPos - 1; i >= 0; i -= 1) {
          if (text[i] === quote && !isEscaped(i)) {
            start = i;
            break;
          }
        }
        if (start === -1) return false;
        let end = -1;
        for (let i = cursorPos; i < text.length; i += 1) {
          if (text[i] === quote && !isEscaped(i)) {
            end = i;
            break;
          }
        }
        if (end === -1 || end < cursorPos) return false;

        const value = stripQuotes(fullText);
        const before = text.substring(0, start + 1);
        const after = text.substring(end);
        const newText = before + value + after;
        setJsQuery(newText);

        setTimeout(() => {
          const newPos = start + 1 + value.length;
          textarea.selectionStart = newPos;
          textarea.selectionEnd = newPos;
          textarea.focus();
        }, 0);
        return true;
      };

      const quoteChar = trigger.startsWith("'") ? "'" : trigger.startsWith('"') ? '"' : null;
      if (quoteChar && replaceInsideQuotes(quoteChar)) {
        return;
      }

      const before = text.substring(0, cursorPos - triggerLen);
      const after = text.substring(cursorPos);
      const newText = before + fullText + after;

      setJsQuery(newText);

      setTimeout(() => {
        const newPos = cursorPos - triggerLen + fullText.length + item.cursorOffset;
        textarea.selectionStart = newPos;
        textarea.selectionEnd = newPos;
        textarea.focus();
      }, 0);
    },
    [jsQuery, setJsQuery],
  );

  const saveQuery = useCallback(() => {
    const trimmed = jsQuery?.trim();
    if (trimmed) {
      dispatch(
        requestSaveQuery({
          code: trimmed,
          projectId,
          collectionPath,
        }),
      );
    }
  }, [dispatch, jsQuery, projectId, collectionPath]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // Cast applyCompletion to match handleAutocompleteKeyDown expectation
      if (handleAutocompleteKeyDown(e, applyCompletion as (item: Completion, trigger: string) => void)) {
        return;
      }

      // Tab indent
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (!textarea) return;
        const cursorPos = textarea.selectionStart;
        const newText = (jsQuery || '').substring(0, cursorPos) + '  ' + (jsQuery || '').substring(cursorPos);
        setJsQuery(newText);
        setTimeout(() => {
          textarea.selectionStart = cursorPos + 2;
          textarea.selectionEnd = cursorPos + 2;
        }, 0);
      }

      // Global shortcuts (Undo/Redo/Save)
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) handleRedo();
        else handleUndo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveQuery();
      }
    },
    [handleAutocompleteKeyDown, applyCompletion, jsQuery, setJsQuery, handleUndo, handleRedo, saveQuery],
  );

  const lineCount = (jsQuery || '').split('\n').length;

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: editorColors.bg,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 0.75,
          bgcolor: editorColors.gutter,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CodeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography
            sx={{
              fontSize: '0.75rem',
              color: 'text.secondary',
              fontFamily: MONOSPACE_FONT_FAMILY,
              fontWeight: 500,
            }}
          >
            Js Query Editor
          </Typography>
          <Chip
            label="JavaScript"
            size="small"
            sx={{
              height: 18,
              fontSize: '0.65rem',
              bgcolor: isDark ? '#3c3c3c' : '#e0e0e0',
              color: 'text.secondary',
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>{lineCount} lines</Typography>
          <Tooltip title="Save Query (Ctrl+S)">
            <span>
              <IconButton
                size="small"
                onClick={saveQuery}
                disabled={!jsQuery?.trim()}
                sx={{
                  p: 0.5,
                  color: 'text.secondary',
                  cursor: 'pointer',
                  '&:hover': { color: 'primary.main', bgcolor: 'action.hover' },
                }}
              >
                <SaveIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* Editor */}
      <Box sx={{ height: 160, position: 'relative' }}>
        <CodeEditor
          value={jsQuery}
          onChange={handleChange}
          language="javascript"
          textareaRef={textareaRef}
          onKeyDown={handleKeyDown}
          placeholder="// Start typing your query..."
        >
          {/* Autocomplete Popover */}
          {showAutocomplete && completionItems.length > 0 && (
            <Paper
              elevation={16}
              sx={{
                position: 'fixed',
                top: position.top,
                left: position.left,
                minWidth: 300,
                maxWidth: 450,
                maxHeight: 220,
                overflow: 'auto',
                zIndex: theme.zIndex.modal + 5,
                border: 1,
                borderColor: 'divider',
                boxShadow: 8,
              }}
            >
              <List dense sx={{ py: 0.5 }}>
                {completionItems.map((item, index) => (
                  <ListItem
                    key={`${item.trigger}-${item.suggestion}-${index}`}
                    onClick={() => applyCompletion(item, currentTrigger || item.trigger)} // Ensure we have a trigger
                    sx={{
                      py: 0.5,
                      px: 1,
                      cursor: 'pointer',
                      bgcolor: index === selectedIndex ? 'action.selected' : 'transparent',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            component="span"
                            sx={{
                              fontFamily: MONOSPACE_FONT_FAMILY,
                              fontSize: '0.8rem',
                              color: 'primary.main',
                              fontWeight: 600,
                            }}
                          >
                            {item.trigger}
                          </Typography>
                          <Typography
                            component="span"
                            sx={{
                              fontFamily: MONOSPACE_FONT_FAMILY,
                              fontSize: '0.75rem',
                              color: 'text.disabled',
                            }}
                          >
                            {item.suggestion}
                          </Typography>
                        </Box>
                      }
                      secondary={item.description}
                      secondaryTypographyProps={{
                        sx: { fontSize: '0.7rem', color: 'text.secondary' },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </CodeEditor>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 0.75,
          bgcolor: editorColors.gutter,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <RunIcon sx={{ fontSize: 14, color: theme.palette.success.main }} />
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>F5 Run</Typography>
          </Box>
          <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>|</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SaveIcon sx={{ fontSize: 14, color: theme.palette.primary.main }} />
            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>Ctrl+S Save</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: theme.palette.success.main }} />
          <Typography sx={{ fontSize: '0.65rem', color: theme.palette.success.main }}>Tab/Enter to complete</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default JsQueryEditor;
