export interface ElectronService {
  readonly api: ElectronAPI;
  openExternal: (url: string) => Promise<void>;
}

export const electronService: ElectronService = {
  get api() {
    return window.electronAPI;
  },
  openExternal(url: string) {
    if (window.electronAPI?.openExternal) {
      return window.electronAPI.openExternal(url);
    }
    window.open(url, '_blank');
    return Promise.resolve();
  },
};
