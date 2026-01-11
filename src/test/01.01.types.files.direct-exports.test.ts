// imports
import   path                                from "path";
import { fileURLToPath                     } from "url";
import type { PluginSettingsRenderContext  } from "../lib/types/PluginSettingsRenderContext";
import type { PluginSettingsSubTab         } from "../lib/types/PluginSettingsSubTab";
import type { PluginSettingsSubTabId       } from "../lib/types/PluginSettingsSubTabId";
import type { PluginSettingsSubTabIdMap    } from "../lib/types/PluginSettingsSubTabIdMap";
import type { PluginSettingsSubTabRegistry } from "../lib/types/PluginSettingsSubTabRegistry";


/**
 * These tests verify that each type module explicitly exports
 * its intended public type.
 *
 * The goal is to ensure that:
 * - Each file acts as a stable, independently consumable module
 * - Accidental removal or renaming of exports is caught at compile time
 */
describe(
  `Running ${(fileURLToPath(import.meta.url)
    .split(path.sep)
    .join("/")
    .split("/test/")[1] || fileURLToPath(import.meta.url))}`,
  () => {

    describe("Testing direct type exports", () => {

      test("PluginSettingsRenderContext is exported", () => {
        type _Assert = PluginSettingsRenderContext<any>;
        expect(true).toBe(true);
      });

      test("PluginSettingsSubTab is exported", () => {
        type _Assert = PluginSettingsSubTab<any>;
        expect(true).toBe(true);
      });

      test("PluginSettingsSubTabId is exported", () => {
        type _Assert = PluginSettingsSubTabId<any>;
        expect(true).toBe(true);
      });

      test("PluginSettingsSubTabIdMap is exported", () => {
        type _Assert = PluginSettingsSubTabIdMap;
        expect(true).toBe(true);
      });

      test("PluginSettingsSubTabRegistry is exported", () => {
        type _Assert =
          PluginSettingsSubTabRegistry<any, PluginSettingsSubTabIdMap>;
        expect(true).toBe(true);
      });
    });
  }
);
