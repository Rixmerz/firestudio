/**
 * Export Service
 * Handles collection export/import file operations
 * Extracted from CollectionTab.jsx and collectionSlice.js
 */

import { FirestoreValue } from '../../../shared/utils/firestoreUtils';

interface DocumentWithData {
  id: string;
  data: Record<string, FirestoreValue>;
}

interface ImportResult {
  error?: string;
  [key: string]: unknown;
}

/**
 * Download data as a JSON file (browser-based)
 * @param data - Data to export
 * @param filename - Output filename
 */
export const downloadJsonFile = (data: unknown, filename: string): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Read and parse a JSON file from file input
 * @param file - File object from input
 * @returns Parsed JSON data
 */
export const readJsonFile = (file: File): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data: unknown = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (err) {
        const error = err as Error;
        reject(new Error(`Invalid JSON: ${error.message}`));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

/**
 * Trigger file input dialog for JSON import
 * @returns Parsed JSON data or null if cancelled
 */
export const selectAndReadJsonFile = (): Promise<unknown | ImportResult | null> => {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (!file) {
        resolve(null);
        return;
      }
      try {
        const data = await readJsonFile(file);
        resolve(data);
      } catch (err) {
        const error = err as Error;
        resolve({ error: error.message });
      }
    };
    input.click();
  });
};

/**
 * Convert documents array to export format
 * @param documents - Array of document objects { id, data }
 * @returns Object keyed by document ID
 */
export const documentsToExportFormat = (
  documents: DocumentWithData[],
): Record<string, Record<string, FirestoreValue>> => {
  const result: Record<string, Record<string, FirestoreValue>> = {};
  documents.forEach((doc) => {
    result[doc.id] = doc.data;
  });
  return result;
};

/**
 * Generate export filename for a collection
 * @param collectionPath - Collection path
 * @returns Safe filename
 */
export const getExportFilename = (collectionPath: string): string => {
  return `${collectionPath.replace(/\//g, '_')}_export.json`;
};

export const exportService = {
  downloadJsonFile,
  readJsonFile,
  selectAndReadJsonFile,
  documentsToExportFormat,
  getExportFilename,
};

export default exportService;
