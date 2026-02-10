import { Project, GoogleAccount } from './store/projectsSlice';

export type MenuTarget =
  | (GoogleAccount & { menuType: 'account' })
  | (Project & { menuType: 'project' | 'googleProject' })
  | { menuType: 'collection'; project: Project | GoogleAccount; collection: string };

export type MenuTargetType = MenuTarget['menuType'];

export const isGoogleAccount = (item: Project | GoogleAccount): item is GoogleAccount =>
  (item as GoogleAccount).type === 'googleAccount';
