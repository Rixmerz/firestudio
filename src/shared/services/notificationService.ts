/**
 * Notification Service
 * Centralized notification/modal handling - extracts SweetAlert2 from Redux thunks
 */
import Swal, { SweetAlertResult } from 'sweetalert2';

/**
 * Gets the current theme colors based on dark mode detection
 * @returns {Object} Background and text colors
 */
const getThemeColors = (): { background: string; color: string } => {
  const isDark =
    document.body.classList.contains('dark-mode') || window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
  return {
    background: isDark ? '#1e1e1e' : '#fff',
    color: isDark ? '#fff' : '#333',
  };
};

export const notificationService = {
  /**
   * Show document count modal
   * @param {string} collection - Collection name
   * @param {number} count - Document count
   */
  showDocumentCount(collection: string, count: number): Promise<SweetAlertResult> {
    const { background, color } = getThemeColors();
    return Swal.fire({
      title: 'Document Count',
      html: `<div style="font-size: 1.2em;"><strong>${collection}</strong></div>
                   <div style="font-size: 2em; margin-top: 10px; color: #4caf50;">
                       <strong>${count.toLocaleString()}</strong>
                   </div>
                   <div style="color: #888;">documents</div>`,
      icon: 'info',
      confirmButtonText: 'OK',
      background,
      color,
    });
  },

  /**
   * Show error modal
   * @param {string} message - Error message
   */
  showError(message: string): Promise<SweetAlertResult> {
    const { background, color } = getThemeColors();
    return Swal.fire({
      title: 'Error',
      text: message,
      icon: 'error',
      confirmButtonText: 'OK',
      background,
      color,
    });
  },

  /**
   * Show success toast notification
   * @param {string} message - Success message
   */
  showSuccess(message: string): Promise<SweetAlertResult> {
    const { background, color } = getThemeColors();
    return Swal.fire({
      title: 'Success',
      text: message,
      icon: 'success',
      confirmButtonText: 'OK',
      background,
      color,
      timer: 2000,
      showConfirmButton: false,
    });
  },

  /**
   * Show confirmation dialog
   * @param {string} title - Dialog title
   * @param {string} message - Confirmation message
   * @returns {Promise<boolean>} Whether user confirmed
   */
  async confirm(title: string, message: string): Promise<boolean> {
    const { background, color } = getThemeColors();
    const result = await Swal.fire({
      title,
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      background,
      color,
    });
    return result.isConfirmed;
  },
};

export default notificationService;
