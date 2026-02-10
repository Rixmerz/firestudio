import React, { RefObject } from 'react';
import { Box, TextField, IconButton, Typography, Tooltip } from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  KeyboardArrowUp as PrevIcon,
  KeyboardArrowDown as NextIcon,
} from '@mui/icons-material';

interface JsonSearchBarProps {
  visible: boolean;
  searchText: string;
  setSearchText: (text: string) => void;
  matchCount: number;
  currentMatch: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
}

/**
 * JsonSearchBar Component
 * Floating search bar for JSON editor
 */
const JsonSearchBar: React.FC<JsonSearchBarProps> = ({
  visible,
  searchText,
  setSearchText,
  matchCount,
  currentMatch,
  onNext,
  onPrev,
  onClose,
  inputRef,
}) => {
  if (!visible) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        onPrev();
      } else {
        onNext();
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 8,
        right: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        bgcolor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        px: 1,
        py: 0.5,
        boxShadow: 3,
        zIndex: 10,
      }}
    >
      <SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
      <TextField
        inputRef={inputRef}
        size="small"
        placeholder="Find..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onKeyDown={handleKeyDown}
        sx={{
          width: 200,
          '& .MuiInputBase-root': {
            height: 28,
            fontSize: '0.8rem',
          },
          '& .MuiInputBase-input': {
            py: 0.5,
            px: 1,
          },
        }}
      />
      {matchCount > 0 && (
        <Typography
          sx={{
            fontSize: '0.75rem',
            color: 'text.secondary',
            minWidth: 45,
            textAlign: 'center',
          }}
        >
          {currentMatch}/{matchCount}
        </Typography>
      )}
      <Tooltip title="Previous (Shift+Enter)">
        <span>
          <IconButton size="small" onClick={onPrev} disabled={matchCount === 0} sx={{ p: 0.5 }}>
            <PrevIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Next (Enter)">
        <span>
          <IconButton size="small" onClick={onNext} disabled={matchCount === 0} sx={{ p: 0.5 }}>
            <NextIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Close (Escape)">
        <IconButton size="small" onClick={onClose} sx={{ p: 0.5 }}>
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default JsonSearchBar;
