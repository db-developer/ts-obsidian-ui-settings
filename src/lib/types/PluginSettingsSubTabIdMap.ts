/**
 * Compile-time registry for all valid plugin settings sub-tab identifiers.
 *
 * This interface is intentionally empty and must be augmented via
 * TypeScript module augmentation by consumers.
 *
 * The registry has no runtime representation and exists solely
 * to enforce compile-time correctness and uniqueness of sub-tab IDs.
 *
 * @example
 * ```ts
 * // In a plugin-specific module (e.g. "my-plugin/subtabs")
 * declare module "my-plugin/subtabs" {
 *   interface PluginSettingsSubTabIdMap {
 *     "general": true;
 *     "structure": true;
 *     "ribbons": true;
 *   }
 * }
 *
 * type SubTabId = keyof PluginSettingsSubTabIdMap;
 * // "general" | "structure" | "ribbons"
 * ```
 */
export interface PluginSettingsSubTabIdMap {}
