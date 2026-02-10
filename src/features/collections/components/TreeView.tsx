import React from 'react';
import {
  Box,
  IconButton,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Storage as CollectionIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';
import { FirestoreValue } from '../../../shared/utils/firestoreUtils';
import { Document } from '../store/collectionSlice';

interface TreeViewProps {
  collectionPath: string;
  documents: Document[];
  expandedNodes: Record<string, boolean>;
  toggleNode: (path: string) => void;
  editingCell: { docId: string; field: string } | null;
  editValue: string;
  setEditValue: (value: string) => void;
  onCellEdit: (docId: string | null, field: string | null, value: FirestoreValue) => void;
  onCellSave: () => void;
  onCellKeyDown: (e: React.KeyboardEvent) => void;
  getType: (value: FirestoreValue) => string;
  getTypeColor: (type: string, isDark: boolean) => string;
  formatValue: (value: FirestoreValue, type: string) => string;
}

const TreeView: React.FC<TreeViewProps> = ({
  collectionPath,
  documents,
  expandedNodes,
  toggleNode,
  editingCell,
  editValue,
  setEditValue,
  onCellEdit,
  onCellSave,
  onCellKeyDown,
  getType,
  getTypeColor,
  formatValue,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  interface TreeRowProps {
    nodeKey: string;
    value: FirestoreValue;
    path: string;
    docId?: string;
    depth?: number;
    isDoc?: boolean;
    isCollection?: boolean;
  }

  const TreeRow: React.FC<TreeRowProps> = ({
    nodeKey,
    value,
    path,
    docId,
    depth = 0,
    isDoc = false,
    isCollection = false,
  }) => {
    const nodeType = isCollection ? 'Collection' : isDoc ? 'Document' : getType(value);
    const isExpandable = isCollection || isDoc || nodeType === 'Array' || nodeType === 'Map';
    const isExpanded = expandedNodes[path];
    const displayValue = isExpandable ? '' : formatValue(value, nodeType);
    const isEditing =
      !isCollection && !isDoc && !isExpandable && editingCell?.docId === docId && editingCell?.field === nodeKey;

    return (
      <>
        <TableRow sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
          <TableCell
            sx={{
              py: 0.25,
              pl: depth * 2 + 1,
              borderBottom: 1,
              borderColor: 'divider',
              cursor: isExpandable ? 'pointer' : 'default',
              color: 'text.primary',
              width: '40%',
            }}
            onClick={() => isExpandable && toggleNode(path)}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {isExpandable ? (
                <IconButton size="small" sx={{ p: 0, mr: 0.5, color: 'text.secondary' }}>
                  {isExpanded ? <ExpandMoreIcon sx={{ fontSize: 16 }} /> : <ChevronRightIcon sx={{ fontSize: 16 }} />}
                </IconButton>
              ) : (
                <Box sx={{ width: 20, mr: 0.5 }} />
              )}
              {isCollection && <CollectionIcon sx={{ fontSize: 14, color: '#1976d2', mr: 0.5 }} />}
              {isDoc && <DocumentIcon sx={{ fontSize: 14, color: '#ff9800', mr: 0.5 }} />}
              <Typography sx={{ fontSize: '0.8rem', color: 'text.primary' }}>{nodeKey}</Typography>
            </Box>
          </TableCell>
          <TableCell sx={{ py: 0.25, borderBottom: 1, borderColor: 'divider', width: '40%' }}>
            {!isCollection && !isDoc && !isExpandable ? (
              isEditing ? (
                <TextField
                  size="small"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={onCellSave}
                  onKeyDown={onCellKeyDown}
                  autoFocus
                  sx={{
                    '& .MuiInputBase-input': {
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      py: 0.5,
                    },
                  }}
                />
              ) : (
                <Typography
                  onClick={() => docId && onCellEdit(docId, nodeKey, value)}
                  sx={{
                    fontSize: '0.8rem',
                    color: getTypeColor(nodeType, isDark),
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover', borderRadius: 0.5 },
                    p: 0.5,
                  }}
                >
                  {displayValue}
                </Typography>
              )
            ) : (
              <Typography sx={{ fontSize: '0.8rem', color: 'text.primary' }}>{displayValue}</Typography>
            )}
          </TableCell>
          <TableCell sx={{ py: 0.25, borderBottom: 1, borderColor: 'divider', width: '20%' }}>
            <Typography sx={{ fontSize: '0.75rem', color: getTypeColor(nodeType, isDark) }}>{nodeType}</Typography>
          </TableCell>
        </TableRow>
        {/* Recursively render children if expanded */}
        {isExpanded && (
          <>
            {/* For Collection: render Documents */}
            {isCollection &&
              documents.map((doc) => (
                <TreeRow
                  key={doc.id}
                  nodeKey={doc.id}
                  value={doc.data}
                  path={`${collectionPath}/${doc.id}`}
                  docId={doc.id}
                  isDoc
                  depth={depth + 1}
                />
              ))}

            {/* For Document or Recursive Objects: render keys */}
            {!isCollection && !isDoc && isExpandable && value && typeof value === 'object'
              ? Object.entries(value as Record<string, FirestoreValue>).map(([k, v]) => (
                  <TreeRow
                    key={`${path}.${k}`}
                    nodeKey={k}
                    value={v}
                    path={`${path}.${k}`}
                    docId={docId}
                    depth={depth + 1}
                  />
                ))
              : null}

            {/* For Document: render fields (handled slightly differently in original but let's align) */}
            {isDoc &&
              value &&
              typeof value === 'object' &&
              Object.entries(value as Record<string, FirestoreValue>).map(([k, v]) => (
                <TreeRow
                  key={`${path}.${k}`}
                  nodeKey={k}
                  value={v}
                  path={`${path}.${k}`}
                  docId={docId}
                  depth={depth + 1}
                />
              ))}
          </>
        )}
      </>
    );
  };

  return (
    <TableContainer sx={{ flexGrow: 1, overflow: 'auto' }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default', width: '40%', color: 'text.primary' }}>
              Key
            </TableCell>
            <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default', width: '40%', color: 'text.primary' }}>
              Value
            </TableCell>
            <TableCell sx={{ fontWeight: 600, bgcolor: 'background.default', width: '20%', color: 'text.primary' }}>
              Type
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TreeRow nodeKey={collectionPath} value={null} path={collectionPath} isCollection depth={0} />
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TreeView;
