import type { PluginSettingsSubTabIdMap } from "./PluginSettingsSubTabIdMap";

/**
 * Union type of all registered plugin settings sub-tab identifiers.
 *
 * This type represents the complete set of valid sub-tab IDs that
 * may be used for navigation and persistence.
 */
export type PluginSettingsSubTabId<
  T extends PluginSettingsSubTabIdMap
> = keyof T;
