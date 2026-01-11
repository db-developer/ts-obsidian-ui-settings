import { App,
         Plugin,
         PluginSettingTab                   } from "obsidian";
import type { PluginWithSettings            } from "ts-obsidian-plugin";

import type { PluginSettingsRenderContext,
              /*PluginSettingsSubTab,*/
              PluginSettingsSubTabRegistry,
              PluginSettingsSubTabIdMap,
              PluginSettingsSubTabId        } from "./types";

/**
 * Abstract settings tab controller with support for strongly typed sub-tabs.
 *
 * This class implements a declarative, extensible, and type-safe mechanism
 * for rendering plugin settings using multiple sub-tabs.
 *
 * Responsibilities:
 * - Rendering the navigation UI for sub-tabs
 * - Managing the active sub-tab state
 * - Providing a stable render context to sub-tabs
 * - Orchestrating re-rendering on tab switches
 *
 * Non-responsibilities:
 * - Rendering individual settings controls
 * - Owning sub-tab DOM elements beyond the active container
 * - Persisting settings directly (delegated to the plugin)
 *
 * @template TSettings
 * The concrete settings object type used by the plugin.
 *
 * @template TTabIds
 * The compile-time registry of valid sub-tab identifiers.
 */
export abstract class PluginSettingsTabWithSubTabs<
  TSettings extends object,
  TTabIds extends PluginSettingsSubTabIdMap
> extends PluginSettingTab {

  /**
   * Declarative registry of all available sub-tabs.
   *
   * The keys of this registry are compile-time validated sub-tab
   * identifiers, ensuring correctness and uniqueness.
   */
  protected readonly subTabs:
    PluginSettingsSubTabRegistry<TSettings, TTabIds>;

  /**
   * The currently active sub-tab identifier.
   *
   * This state is fully owned by the controller and never exposed
   * to individual sub-tabs.
   */
  protected activeSubTabId:
    PluginSettingsSubTabId<TTabIds>;

  /**
   * Protected constructor for a settings tab with multiple sub-tabs.
   *
   * This constructor initializes the navigation and active tab state.
   *
   * @template TSettings The concrete plugin settings type.
   * @template TTabIds The compile-time map of valid sub-tab identifiers.
   *
   * @param app The Obsidian application instance.
   * @param plugin The hosting plugin instance, implementing both
   *               `Plugin` and `PluginWithSettings<TSettings>`.
   * @param subTabs A declarative registry of all sub-tabs.
   * @param defaultSubTabId The default sub-tab to activate on display.
   */
  protected constructor(
    app: App,
    protected readonly plugin: Plugin & PluginWithSettings<TSettings>,
    subTabs: PluginSettingsSubTabRegistry<TSettings, TTabIds>,
    defaultSubTabId: PluginSettingsSubTabId<TTabIds>
  ) {
    super(app, plugin);

    this.subTabs = subTabs;
    this.activeSubTabId = defaultSubTabId;
  }

  /**
   * Called by Obsidian when the settings tab should be rendered.
   *
   * This method is final and must not be overridden by subclasses.
   * Customization is achieved exclusively through sub-tab registration.
   */
  override display(): void {
    this.containerEl.empty();

    const navigationEl = this.containerEl.createDiv({
      cls: "plugin-settings-subtab-nav",
    });

    const contentEl = this.containerEl.createDiv({
      cls: "plugin-settings-subtab-content",
    });

    this.renderNavigation(navigationEl);
    this.renderActiveSubTab(contentEl);
  }

  /**
   * Renders the navigation UI for all registered sub-tabs.
   *
   * @param containerEl
   * The container element used to host the navigation controls.
   */
  protected renderNavigation(containerEl: HTMLElement): void {
    (Object.keys(this.subTabs) as Array<
      PluginSettingsSubTabId<TTabIds>
    >).forEach((tabId) => {

      const subTab = this.subTabs[tabId];

      const button = containerEl.createEl("button", {
        text: subTab.header,
        cls: tabId === this.activeSubTabId
          ? "is-active"
          : undefined,
      });

      button.addEventListener("click", () => {
        if (this.activeSubTabId !== tabId) {
          this.activeSubTabId = tabId;
          this.display();
        }
      });
    });
  }

  /**
   * Renders the currently active sub-tab.
   *
   * @param containerEl
   * The container element dedicated to sub-tab content.
   */
  protected renderActiveSubTab(containerEl: HTMLElement): void {
    const subTab = this.subTabs[this.activeSubTabId];

    const context: PluginSettingsRenderContext<TSettings> = {
      containerEl,
      settings: this.plugin.settings,
      saveSettings: () => this.plugin.saveSettings(),
      plugin: this.plugin,
    };

    subTab.render(context);
  }
}
