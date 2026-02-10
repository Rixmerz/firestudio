/**
 * Projects Feature - Public API
 */

// Components
export { default as ProjectSidebar } from './components/ProjectSidebar';
export { default as ConnectionDialog } from './components/ConnectionDialog';

// Sidebar components
export { default as SidebarMenu } from './components/sidebar/SidebarMenu';
export { default as SidebarProjectsList } from './components/sidebar/SidebarProjectsList';
export { default as SidebarSearch } from './components/sidebar/SidebarSearch';

// Store
export {
  loadProjects,
  connectServiceAccount,
  refreshCollections,
  signInWithGoogle,
  addProject,
  removeProject,
  setSelectedProject,
  updateProject,
  addGoogleAccount,
  selectProjects,
  selectSelectedProjectId,
  selectSelectedProject,
  selectProjectsLoading,
  selectGoogleSignInLoading,
} from './store/projectsSlice';
