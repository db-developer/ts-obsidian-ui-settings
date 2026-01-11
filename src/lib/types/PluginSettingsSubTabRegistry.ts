import type { PluginSettingsSubTab      } from "./PluginSettingsSubTab";
import type { PluginSettingsSubTabId    } from "./PluginSettingsSubTabId";
import type { PluginSettingsSubTabIdMap } from "./PluginSettingsSubTabIdMap";

/**
 * Declarative registry of settings sub-tabs.
 *
 * The keys of this registry are strongly typed sub-tab identifiers,
 * guaranteed at compile time to be unique and valid.
 *
 * The registry is purely declarative and contains no UI state.
 * Navigation, active state, and rendering orchestration are handled
 * by the hosting settings tab controller.
 *
 * @template TSettings
 * The concrete settings type used by the plugin.
 *
 * @template TTabIds
 * The compile-time map of valid sub-tab identifiers, typically
 * provided via TypeScript module augmentation.
 *
 * @example
 * ```ts
 * // 1. Declare valid sub-tab identifiers via module augmentation
 * declare module "my-plugin/subtabs" {
 *   interface PluginSettingsSubTabIdMap {
 *     "general": true;
 *     "structure": true;
 *     "ribbons": true;
 *   }
 * }
 *
 * // 2. Derive the union type of valid sub-tab identifiers
 * type SubTabId = keyof PluginSettingsSubTabIdMap;
 * //   → "general" | "structure" | "ribbons"
 *
 * // 3. Define a registry mapping each sub-tab ID to its implementation
 * const subTabs: PluginSettingsSubTabRegistry<
 *   MyPluginSettings,
 *   PluginSettingsSubTabIdMap
 * > = {
 *   general: new GeneralSettingsSubTab(),
 *   structure: new StructureSettingsSubTab(),
 *   ribbons: new RibbonSettingsSubTab(),
 * };
 *
 * // Any missing, misspelled, or duplicate key would result
 * // in a compile-time error.
 * ```
 */
export type PluginSettingsSubTabRegistry<
  TSettings,
  TTabIds extends PluginSettingsSubTabIdMap
> = {
  [K in PluginSettingsSubTabId<TTabIds>]:
    PluginSettingsSubTab<TSettings>;
};
