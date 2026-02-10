/**
 * Collections Feature - Public API
 */

// Components
export { default as CollectionTab } from './components/CollectionTab';
export { default as TableView } from './components/TableView';
export { default as TreeView } from './components/TreeView';
export { default as JsonView } from './components/JsonView';
export { default as QueryBar } from './components/QueryBar';
export { default as FilterSortToolbar } from './components/FilterSortToolbar';
export { default as ViewTabs } from './components/ViewTabs';
export { default as JsQueryEditor } from './components/JsQueryEditor';
export { default as CreateDocumentDialog } from './components/CreateDocumentDialog';
export { default as CollectionList } from './components/CollectionList';

// Store
export {
  fetchDocuments,
  updateDocument,
  addDocument,
  deleteDocument,
  createCollection,
  renameCollection,
  deleteCollection,
  importCollection,
  exportCollection,
  estimateDocCount,
  initCollectionState,
  setCollectionLimit,
  setCollectionQueryMode,
  setCollectionJsQuery,
  setCollectionFilters,
  setCollectionSort,
  selectCollectionData,
} from './store/collectionSlice';

// Services
export { documentService } from './services/documentService';
export { exportService } from './services/exportService';
