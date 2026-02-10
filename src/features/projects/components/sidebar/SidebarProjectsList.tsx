import React from 'react';
import { Box, Typography, IconButton, Collapse, Tooltip, Button, CircularProgress } from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  ChevronRight as ChevronRightIcon,
  Layers as CollectionIcon,
  Folder as ProjectIcon,
  MoreVert as MoreVertIcon,
  Warning as WarningIcon,
  Google as GoogleIcon,
  Key as KeyIcon,
  CloudQueue as StorageIcon,
  PeopleAlt as AuthIcon,
  LinkOff as LinkOffIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { setSidebarItemExpanded, Tab } from '../../../../app/store/slices/uiSlice';
import { Project, GoogleAccount, FirestoreCollection } from '../../store/projectsSlice';
import { MenuTarget, MenuTargetType } from '../../types';

interface SidebarProjectsListProps {
  googleAccounts: GoogleAccount[];
  serviceAccountProjects: Project[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  expandedItems: Record<string, boolean>;
  toggleExpanded: (itemId: string, isExpanded: boolean) => void;
  selectedProject: Project | GoogleAccount | null;
  activeTab?: Tab | null;
  onOpenCollection: (project: Project | GoogleAccount, collectionId: string) => void;
  onAddCollection: (project: Project | GoogleAccount) => void;
  onOpenStorage: (project: Project | GoogleAccount) => void;
  onOpenAuth: (project: Project | GoogleAccount) => void;
  handleReconnect: (accountId: string, e?: React.MouseEvent) => void;
  reconnecting: string | null;
  handleMenu: (
    e: React.MouseEvent<HTMLButtonElement>,
    target: Project | GoogleAccount,
    type: 'account' | 'project',
  ) => void;
  handleProjectMenu: (e: React.MouseEvent<HTMLButtonElement>, project: Project) => void;
  handleContextMenu: (
    e: React.MouseEvent,
    target: Project | { project: Project | GoogleAccount; collection: string },
    type: Exclude<MenuTargetType, 'account'>,
  ) => void;
  isMenuOpen: boolean;
  menuTarget: MenuTarget | null;
}

function SidebarProjectsList({
  googleAccounts,
  serviceAccountProjects,
  searchQuery,
  setSearchQuery,
  expandedItems,
  toggleExpanded,
  selectedProject,
  activeTab,
  onOpenCollection,
  onAddCollection,
  onOpenStorage,
  onOpenAuth,
  handleReconnect,
  reconnecting,
  handleMenu,
  handleProjectMenu,
  handleContextMenu,
  isMenuOpen,
  menuTarget,
}: SidebarProjectsListProps) {
  const dispatch = useDispatch();

  const collectionMatchesQuery = (collection: FirestoreCollection, query: string) => {
    const normalized = query.toLowerCase();
    return collection.id.toLowerCase().includes(normalized) || collection.path.toLowerCase().includes(normalized);
  };

  const getCollectionPath = (collection: FirestoreCollection) => collection.path || collection.id;
  const getCollectionLabel = (collection: FirestoreCollection) => collection.id || collection.path;

  return (
    <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
      {googleAccounts.length === 0 && serviceAccountProjects.length === 0 ? (
        <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
          <Typography variant="caption">No projects connected</Typography>
        </Box>
      ) : (
        <>
          {/* Google Accounts */}
          {googleAccounts.map((account) => {
            // Check if any project or collection matches the search
            const hasMatchingContent =
              !searchQuery ||
              account.projects?.some(
                (project) =>
                  project.projectId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  project.collections?.some((c) => collectionMatchesQuery(c, searchQuery)),
              );

            // Skip this account if nothing matches
            if (!hasMatchingContent) return null;

            const isAccountExpanded = expandedItems[account.id] !== false || !!searchQuery;

            return (
              <Box key={account.id}>
                {/* Google Account Header */}
                <Box
                  onClick={() => toggleExpanded(account.id, isAccountExpanded)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    px: 1,
                    py: 0.5,
                    cursor: 'pointer',
                    bgcolor: 'background.default',
                    borderBottom: 1,
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <IconButton size="small" sx={{ p: 0, mr: 0.5, color: 'text.secondary', cursor: 'pointer' }}>
                    {isAccountExpanded ? (
                      <ExpandMoreIcon sx={{ fontSize: 18 }} />
                    ) : (
                      <ChevronRightIcon sx={{ fontSize: 18 }} />
                    )}
                  </IconButton>
                  <GoogleIcon
                    sx={{
                      fontSize: 16,
                      color: account.needsReauth ? '#f44336' : '#4285f4',
                      mr: 0.5,
                    }}
                  />
                  {account.needsReauth && (
                    <Tooltip title="Session expired - reconnect required">
                      <LinkOffIcon sx={{ fontSize: 14, color: '#f44336', mr: 0.5 }} />
                    </Tooltip>
                  )}
                  <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <Typography
                      sx={{
                        fontSize: '0.75rem',
                        color: account.needsReauth ? 'error.main' : 'text.primary',
                        fontWeight: 500,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {account.email}
                    </Typography>
                    {account.needsReauth ? (
                      <Button
                        size="small"
                        variant="outlined"
                        color="warning"
                        onClick={(e) => handleReconnect(account.id, e)}
                        disabled={reconnecting === account.id}
                        sx={{
                          fontSize: '0.6rem',
                          py: 0,
                          px: 0.5,
                          minWidth: 'auto',
                          height: 18,
                          textTransform: 'none',
                        }}
                      >
                        {reconnecting === account.id ? <CircularProgress size={10} sx={{ mr: 0.5 }} /> : null}
                        Reconnect
                      </Button>
                    ) : (
                      <Typography
                        sx={{
                          fontSize: '0.65rem',
                          color: 'text.secondary',
                        }}
                      >
                        {account.projects?.length || 0} project
                        {account.projects?.length !== 1 ? 's' : ''}
                      </Typography>
                    )}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenu(e, account, 'account')}
                    sx={{
                      p: 0.25,
                      opacity: 0.5,
                      '&:hover': {
                        opacity: 1,
                        bgcolor: 'action.hover',
                      },
                      color: 'text.secondary',
                      borderRadius: 1,
                    }}
                  >
                    <MoreVertIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>

                {/* Projects under this account */}
                <Collapse in={isAccountExpanded}>
                  {account.projects
                    ?.filter((project) => {
                      // Filter projects by search query
                      if (!searchQuery) return true;
                      const query = searchQuery.toLowerCase();
                      return (
                        project.projectId.toLowerCase().includes(query) ||
                        project.collections?.some((c) => collectionMatchesQuery(c, query))
                      );
                    })
                    .map((project, projectIndex) => {
                      // Default: only first project in first account is expanded
                      const isFirstProject = googleAccounts.indexOf(account) === 0 && projectIndex === 0;
                      const isProjectExpanded =
                        expandedItems[project.id] !== undefined
                          ? expandedItems[project.id]
                          : isFirstProject || !!searchQuery;

                      return (
                        <Box key={project.id}>
                          {/* Project Header */}
                          <Box
                            onClick={() => toggleExpanded(project.id, isProjectExpanded)}
                            onContextMenu={(e) => handleContextMenu(e, project, 'googleProject')}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              pl: 3,
                              pr: 1,
                              py: 0.4,
                              cursor: 'pointer',
                              bgcolor: selectedProject?.id === project.id ? 'action.selected' : 'transparent',
                              '&:hover': { bgcolor: 'action.hover' },
                            }}
                          >
                            <IconButton
                              size="small"
                              sx={{
                                p: 0,
                                mr: 0.5,
                                color: 'text.secondary',
                                cursor: 'pointer',
                              }}
                            >
                              {isProjectExpanded ? (
                                <ExpandMoreIcon sx={{ fontSize: 16 }} />
                              ) : (
                                <ChevronRightIcon sx={{ fontSize: 16 }} />
                              )}
                            </IconButton>
                            <ProjectIcon sx={{ fontSize: 14, color: 'warning.main', mr: 0.5 }} />
                            <Typography
                              sx={{
                                fontSize: '0.75rem',
                                flexGrow: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                color: 'text.primary',
                              }}
                            >
                              {project.projectId}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={(e) => handleProjectMenu(e, project)}
                              sx={{
                                p: 0.25,
                                opacity: 0.5,
                                '&:hover': {
                                  opacity: 1,
                                  bgcolor: 'action.hover',
                                },
                                color: 'text.secondary',
                                borderRadius: 1,
                              }}
                            >
                              <MoreVertIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>

                          {/* Collections */}
                          <Collapse in={isProjectExpanded}>
                            <Box sx={{ pl: 5 }}>
                              {project.collections
                                ?.filter(
                                  (collection) => !searchQuery || collectionMatchesQuery(collection, searchQuery),
                                )
                                .map((collection, collectionIndex) => {
                                  const collectionPath =
                                    getCollectionPath(collection) || getCollectionLabel(collection);
                                  const collectionLabel = getCollectionLabel(collection);
                                  const collectionKey = collectionPath
                                    ? `${project.id}:${collectionPath}`
                                    : `${project.id}:collection:${collectionIndex}`;
                                  const isActive =
                                    activeTab?.type === 'collection' &&
                                    activeTab?.projectId === project.id &&
                                    activeTab?.collectionPath === collectionPath;
                                  const isMenuTarget =
                                    isMenuOpen &&
                                    menuTarget?.menuType === 'collection' &&
                                    menuTarget?.project?.id === project.id &&
                                    menuTarget?.collection === collectionPath;
                                  return (
                                    <Box
                                      key={collectionKey}
                                      onClick={() => {
                                        onOpenCollection(project, collectionPath);
                                        // Expand the project and account when selecting from search
                                        dispatch(
                                          setSidebarItemExpanded({
                                            id: account.id,
                                            expanded: true,
                                          }),
                                        );
                                        dispatch(
                                          setSidebarItemExpanded({
                                            id: project.id,
                                            expanded: true,
                                          }),
                                        );
                                        setSearchQuery('');
                                      }}
                                      onContextMenu={(e) =>
                                        handleContextMenu(
                                          e,
                                          {
                                            project,
                                            collection: collectionPath,
                                          },
                                          'collection',
                                        )
                                      }
                                      sx={{
                                        display: 'flex',
                                        px: 1,
                                        py: 0.5,
                                        cursor: 'pointer',
                                        bgcolor: isMenuTarget
                                          ? 'action.hover'
                                          : isActive
                                            ? 'action.selected'
                                            : 'transparent',
                                        borderLeft: isActive ? '2px solid' : '2px solid transparent',
                                        borderColor: isActive ? 'primary.main' : 'transparent',
                                        '&:hover': {
                                          bgcolor: isActive ? 'action.selected' : 'action.hover',
                                        },
                                      }}
                                    >
                                      <CollectionIcon
                                        sx={{
                                          fontSize: 14,
                                          color: isActive ? 'primary.main' : 'text.secondary',
                                          mr: 0.75,
                                        }}
                                      />
                                      <Typography
                                        sx={{
                                          fontSize: '0.75rem',
                                          color: isActive ? 'primary.main' : 'text.primary',
                                          fontWeight: isActive ? 600 : 400,
                                        }}
                                      >
                                        {collectionLabel}
                                      </Typography>
                                    </Box>
                                  );
                                })}
                              {(!project.collections || project.collections.length === 0) && (
                                <Typography
                                  sx={{
                                    fontSize: '0.7rem',
                                    color: 'text.secondary',
                                    px: 1,
                                    py: 0.3,
                                  }}
                                >
                                  No collections
                                </Typography>
                              )}
                              {/* Add Collection */}
                              <Box
                                onClick={(e) => {
                                  e.stopPropagation();
                                  console.log('Add collection clicked for:', project);
                                  onAddCollection?.(project);
                                }}
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  px: 1,
                                  py: 0.5,
                                  cursor: 'pointer',
                                  color: 'primary.main',
                                  '&:hover': { bgcolor: 'action.hover' },
                                }}
                              >
                                <AddIcon sx={{ fontSize: 14, mr: 0.75 }} />
                                <Typography sx={{ fontSize: '0.75rem' }}>Add collection</Typography>
                              </Box>
                              {/* Storage */}
                              {(() => {
                                const isStorageActive =
                                  activeTab?.type === 'storage' && activeTab?.projectId === project.id;
                                return (
                                  <Box
                                    onClick={() => onOpenStorage?.(project)}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      px: 1,
                                      py: 0.5,
                                      mt: 0.5,
                                      cursor: 'pointer',
                                      borderTop: 1,
                                      borderColor: isStorageActive ? 'primary.main' : 'divider',
                                      bgcolor: isStorageActive ? 'action.selected' : 'transparent',
                                      borderLeft: isStorageActive ? '2px solid' : '2px solid transparent',
                                      borderLeftColor: isStorageActive ? 'primary.main' : 'transparent',
                                      '&:hover': {
                                        bgcolor: isStorageActive ? 'action.selected' : 'action.hover',
                                      },
                                    }}
                                  >
                                    <StorageIcon
                                      sx={{
                                        fontSize: 14,
                                        color: 'primary.main',
                                        mr: 0.75,
                                      }}
                                    />
                                    <Typography
                                      sx={{
                                        fontSize: '0.75rem',
                                        color: isStorageActive ? 'primary.main' : 'text.primary',
                                        fontWeight: isStorageActive ? 600 : 500,
                                      }}
                                    >
                                      Storage
                                    </Typography>
                                  </Box>
                                );
                              })()}
                              {/* Authentication */}
                              {(() => {
                                const isAuthActive = activeTab?.type === 'auth' && activeTab?.projectId === project.id;
                                return (
                                  <Box
                                    onClick={() => onOpenAuth?.(project)}
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      px: 1,
                                      py: 0.5,
                                      cursor: 'pointer',
                                      bgcolor: isAuthActive ? 'action.selected' : 'transparent',
                                      borderLeft: isAuthActive ? '2px solid' : '2px solid transparent',
                                      borderColor: isAuthActive ? 'secondary.main' : 'transparent',
                                      '&:hover': {
                                        bgcolor: isAuthActive ? 'action.selected' : 'action.hover',
                                      },
                                    }}
                                  >
                                    <AuthIcon
                                      sx={{
                                        fontSize: 14,
                                        color: 'secondary.main',
                                        mr: 0.75,
                                      }}
                                    />
                                    <Typography
                                      sx={{
                                        fontSize: '0.75rem',
                                        color: isAuthActive ? 'secondary.main' : 'text.primary',
                                        fontWeight: isAuthActive ? 600 : 500,
                                      }}
                                    >
                                      Authentication
                                    </Typography>
                                  </Box>
                                );
                              })()}
                            </Box>
                          </Collapse>
                        </Box>
                      );
                    })}
                </Collapse>
              </Box>
            );
          })}

          {/* Service Account Projects */}
          {serviceAccountProjects
            .filter((project) => {
              // Filter service account projects by search query
              if (!searchQuery) return true;
              const query = searchQuery.toLowerCase();
              return (
                project.projectId.toLowerCase().includes(query) ||
                project.collections?.some((c) => collectionMatchesQuery(c, query))
              );
            })
            .map((project, index) => {
              // Service account projects: only first one expanded if no google accounts
              const isFirstServiceAccount = googleAccounts.length === 0 && index === 0;
              const isExpanded =
                expandedItems[project.id] !== undefined
                  ? expandedItems[project.id]
                  : isFirstServiceAccount || !!searchQuery;

              return (
                <Box key={project.id}>
                  {/* Project Header */}
                  <Box
                    onClick={() => toggleExpanded(project.id, isExpanded)}
                    onContextMenu={(e) => handleContextMenu(e, project, 'project')}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      px: 1,
                      py: 0.5,
                      cursor: 'pointer',
                      bgcolor: selectedProject?.id === project.id ? 'action.selected' : 'transparent',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <IconButton size="small" sx={{ p: 0, mr: 0.5, color: 'text.secondary', cursor: 'pointer' }}>
                      {isExpanded ? (
                        <ExpandMoreIcon sx={{ fontSize: 18 }} />
                      ) : (
                        <ChevronRightIcon sx={{ fontSize: 18 }} />
                      )}
                    </IconButton>
                    <KeyIcon
                      sx={{
                        fontSize: 16,
                        color: project.connected === false ? '#f44336' : '#ff9800',
                        mr: 0.5,
                      }}
                    />
                    {project.connected === false && (
                      <Tooltip title="Connection failed">
                        <WarningIcon sx={{ fontSize: 14, color: '#f44336', mr: 0.5 }} />
                      </Tooltip>
                    )}
                    <Typography
                      sx={{
                        fontSize: '0.8rem',
                        flexGrow: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        color: 'text.primary',
                      }}
                    >
                      {project.projectId}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenu(e, project, 'project')}
                      sx={{
                        p: 0.25,
                        opacity: 0.5,
                        '&:hover': {
                          opacity: 1,
                          backgroundColor: 'action.hover',
                        },
                        color: 'text.secondary',
                        borderRadius: 1,
                      }}
                    >
                      <MoreVertIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>

                  {/* Collections and Storage */}
                  <Collapse in={isExpanded}>
                    <Box sx={{ pl: 2 }}>
                      {/* Collections */}
                      {project.collections
                        ?.filter((collection) => !searchQuery || collectionMatchesQuery(collection, searchQuery))
                        .map((collection, collectionIndex) => {
                          const collectionPath = getCollectionPath(collection) || getCollectionLabel(collection);
                          const collectionLabel = getCollectionLabel(collection);
                          const collectionKey = collectionPath
                            ? `${project.id}:${collectionPath}`
                            : `${project.id}:collection:${collectionIndex}`;
                          const isActive =
                            activeTab?.type === 'collection' &&
                            activeTab?.projectId === project.id &&
                            activeTab?.collectionPath === collectionPath;
                          const isMenuTarget =
                            isMenuOpen &&
                            menuTarget?.menuType === 'collection' &&
                            menuTarget?.project?.id === project.id &&
                            menuTarget?.collection === collectionPath;
                          return (
                            <Box
                              key={collectionKey}
                              onClick={() => {
                                onOpenCollection(project, collectionPath);
                                // Expand the project when selecting from search
                                dispatch(
                                  setSidebarItemExpanded({
                                    id: project.id,
                                    expanded: true,
                                  }),
                                );
                                setSearchQuery('');
                              }}
                              onContextMenu={(e) =>
                                handleContextMenu(e, { project, collection: collectionPath }, 'collection')
                              }
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                px: 1,
                                py: 0.4,
                                cursor: 'pointer',
                                bgcolor: isMenuTarget ? 'action.hover' : isActive ? 'action.selected' : 'transparent',
                                borderLeft: isActive ? '2px solid' : '2px solid transparent',
                                borderColor: isActive ? 'primary.main' : 'transparent',
                                '&:hover': {
                                  bgcolor: isActive ? 'action.selected' : 'action.hover',
                                },
                              }}
                            >
                              <CollectionIcon
                                sx={{
                                  fontSize: 14,
                                  color: isActive ? 'primary.main' : 'text.secondary',
                                  mr: 0.5,
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: '0.75rem',
                                  color: isActive ? 'primary.main' : 'text.primary',
                                  fontWeight: isActive ? 600 : 400,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {collectionLabel}
                              </Typography>
                            </Box>
                          );
                        })}
                      {(!project.collections || project.collections.length === 0) && (
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', px: 1, py: 0.5 }}>
                          No collections
                        </Typography>
                      )}

                      {/* Add Collection */}
                      <Box
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Add collection clicked for service account:', project);
                          onAddCollection?.(project);
                        }}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          px: 1,
                          py: 0.4,
                          cursor: 'pointer',
                          color: 'primary.main',
                          '&:hover': { bgcolor: 'action.hover' },
                        }}
                      >
                        <AddIcon sx={{ fontSize: 14, mr: 0.5 }} />
                        <Typography sx={{ fontSize: '0.75rem' }}>Add collection</Typography>
                      </Box>

                      {/* Storage */}
                      {(() => {
                        const isStorageActive = activeTab?.type === 'storage' && activeTab?.projectId === project.id;
                        return (
                          <Box
                            onClick={() => onOpenStorage?.(project)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              px: 1,
                              py: 0.5,
                              mt: 0.5,
                              cursor: 'pointer',
                              borderTop: 1,
                              borderTopColor: 'divider',
                              bgcolor: isStorageActive ? 'action.selected' : 'transparent',
                              borderLeft: isStorageActive ? '2px solid' : '2px solid transparent',
                              borderLeftColor: isStorageActive ? 'primary.main' : 'transparent',
                              '&:hover': {
                                bgcolor: isStorageActive ? 'action.selected' : 'action.hover',
                              },
                            }}
                          >
                            <StorageIcon sx={{ fontSize: 14, color: 'primary.main', mr: 0.75 }} />
                            <Typography
                              sx={{
                                fontSize: '0.75rem',
                                color: isStorageActive ? 'primary.main' : 'text.primary',
                                fontWeight: isStorageActive ? 600 : 500,
                              }}
                            >
                              Storage
                            </Typography>
                          </Box>
                        );
                      })()}

                      {/* Authentication */}
                      {(() => {
                        const isAuthActive = activeTab?.type === 'auth' && activeTab?.projectId === project.id;
                        return (
                          <Box
                            onClick={() => onOpenAuth?.(project)}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              px: 1,
                              py: 0.5,
                              cursor: 'pointer',
                              bgcolor: isAuthActive ? 'action.selected' : 'transparent',
                              borderLeft: isAuthActive ? '2px solid' : '2px solid transparent',
                              borderColor: isAuthActive ? 'secondary.main' : 'transparent',
                              '&:hover': {
                                bgcolor: isAuthActive ? 'action.selected' : 'action.hover',
                              },
                            }}
                          >
                            <AuthIcon sx={{ fontSize: 14, color: 'secondary.main', mr: 0.75 }} />
                            <Typography
                              sx={{
                                fontSize: '0.75rem',
                                color: isAuthActive ? 'secondary.main' : 'text.primary',
                                fontWeight: isAuthActive ? 600 : 500,
                              }}
                            >
                              Authentication
                            </Typography>
                          </Box>
                        );
                      })()}
                    </Box>
                  </Collapse>
                </Box>
              );
            })}
        </>
      )}
    </Box>
  );
}

export default SidebarProjectsList;
