// imports
import   path                                from "path";
import { fileURLToPath                     } from "url";

import { describe, test, expect }           from "vitest";

import type { App, Plugin }                 from "obsidian";
import type { PluginWithSettings }          from "ts-obsidian-plugin";

import {
  PluginSettingsTabWithSubTabs,
} from "../lib/PluginSettingsTabWithSubTabs";

import type {
  PluginSettingsSubTabRegistry,
  PluginSettingsSubTab,
  PluginSettingsSubTabIdMap,
} from "../lib/types";

/**
 * These tests verify the constructor behavior of
 * PluginSettingsTabWithSubTabs.
 *
 * The constructor is responsible for wiring structural dependencies
 * only:
 * - assigning the sub-tab registry
 * - setting the initial active sub-tab
 *
 * No rendering, DOM interaction, or side effects must occur here.
 */
describe(
  `Running ${(fileURLToPath(import.meta.url)
    .split(path.sep)
    .join("/")
    .split("/test/")[1] || fileURLToPath(import.meta.url))}`,
  () => {

    describe("Testing PluginSettingsTabWithSubTabs::constructor", () => {

      test("assigns subTabs registry and default activeSubTabId", () => {

        interface TestSettings {
          foo: string;
        }

        interface TestSubTabIdMap extends PluginSettingsSubTabIdMap {
          general: true;
        }

        const mockSubTab: PluginSettingsSubTab<TestSettings> = {
          header: "General",
          render() {
            /* noop */
          },
        };

        const registry: PluginSettingsSubTabRegistry<
          TestSettings,
          TestSubTabIdMap
        > = {
          general: mockSubTab,
        };

        const app = {} as App;

        const plugin = {} as Plugin & PluginWithSettings<TestSettings>;

        const tab = new (class extends PluginSettingsTabWithSubTabs<
          TestSettings,
          TestSubTabIdMap
        > {
          constructor() {
            super(app, plugin, registry, "general");
          }
        })();

        expect(tab.subTabs).toBe(registry);
        expect(tab.activeSubTabId).toBe("general");
      });

    });
  }
);
