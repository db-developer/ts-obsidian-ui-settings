import { Plugin                  } from "obsidian";
import type { PluginWithSettings } from "ts-obsidian-plugin";

/**
 * Provides all dependencies required by a plugin settings sub-tab
 * to render itself without owning navigation, lifecycle, or state
 * management responsibilities.
 *
 * This context intentionally decouples rendering logic from the
 * concrete PluginSettingTab implementation and avoids implicit
 * access to global plugin state.
 *
 * @template TSettings
 * The concrete settings type used by the plugin.
 */
export interface PluginSettingsRenderContext<TSettings extends object> {

  /**
   * The DOM element into which the sub-tab must render its UI.
   *
   * This container is guaranteed to be empty before rendering
   * and is owned by the parent settings tab controller.
   */
  readonly containerEl: HTMLElement;

  /**
   * The current plugin settings instance.
   *
   * This object is mutable; however, persistence must be triggered
   * explicitly via {@link saveSettings}.
   */
  readonly settings: TSettings;

  /**
   * Persists the current settings state.
   *
   * Sub-tabs must call this method after mutating settings in order
   * to ensure durability across reloads.
   */
  saveSettings(): Promise<void>;

  /**
   * Reference to the hosting plugin instance.
   *
   * The exposed type is intentionally restricted to
   * {@link PluginWithSettings} in order to prevent sub-tabs
   * from relying on concrete plugin implementations.
   */
  readonly plugin: Plugin & PluginWithSettings<TSettings>;
}
