import type { PluginSettingsRenderContext } from "./PluginSettingsRenderContext";

/**
 * Contract implemented by a single settings sub-tab.
 *
 * A sub-tab represents an isolated, self-contained rendering unit
 * within a plugin settings page. It must not manage navigation,
 * active state, or DOM cleanup outside of its assigned container.
 *
 * @template TSettings
 * The concrete settings type used by the plugin.
 */
export interface PluginSettingsSubTab<TSettings extends object> {

  /**
   * Human-readable tab header text.
   *
   * This value is typically derived from an i18n service and is
   * expected to be stable for the lifetime of the tab instance.
   */
  get header(): string;

  /**
   * Renders the complete UI for this sub-tab.
   *
   * Implementations must assume that the provided container is empty
   * and must not retain references to DOM elements beyond this call.
   *
   * @param ctx
   * Rendering context providing access to settings, persistence,
   * and plugin services.
   */
  render(ctx: PluginSettingsRenderContext<TSettings>): void;
}
