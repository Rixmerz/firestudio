// import React from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

interface SidebarSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

function SidebarSearch({ searchQuery, setSearchQuery }: SidebarSearchProps) {
  return (
    <Box sx={{ px: 1, py: 0.75, borderBottom: 1, borderColor: 'divider' }}>
      <TextField
        size="small"
        fullWidth
        placeholder="Search collections..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ p: 0.25 }}>
                <ClearIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            fontSize: '0.75rem',
            height: 28,
            '& .MuiInputBase-input': {
              py: 0.5,
            },
          },
        }}
      />
    </Box>
  );
}

export default SidebarSearch;
