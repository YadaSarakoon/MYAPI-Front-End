import type { AccountPreferences } from '../types';

export interface SettingsService {
  getPreferences(signal?: AbortSignal): Promise<AccountPreferences>;
  savePreferences(preferences: AccountPreferences, signal?: AbortSignal): Promise<void>;
}

// Settings remain in component state until persistence behavior is confirmed.
