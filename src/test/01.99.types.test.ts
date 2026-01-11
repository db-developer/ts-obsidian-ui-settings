// imports
import   path                                from "path";
import { fileURLToPath                     } from "url";
import type { PluginSettingsRenderContext,
              PluginSettingsSubTab,
              PluginSettingsSubTabId,
              PluginSettingsSubTabIdMap,
              PluginSettingsSubTabRegistry } from "../lib/types";

/**
 * These tests verify that all public types are correctly re-exported
 * from the types barrel file.
 *
 * This ensures that consumers can rely on:
 *   import { ... } from "ts-obsidian-ui-settings/lib/types"
 * without needing deep import paths.
 */
describe(
  `Running ${(fileURLToPath(import.meta.url)
    .split(path.sep)
    .join("/")
    .split("/test/")[1] || fileURLToPath(import.meta.url))}`,
  () => {

    describe("Testing index.ts type re-exports", () => {

      test("PluginSettingsRenderContext is re-exported", () => {
        type _Assert = PluginSettingsRenderContext<any>;
        expect(true).toBe(true);
      });

      test("PluginSettingsSubTab is re-exported", () => {
        type _Assert = PluginSettingsSubTab<any>;
        expect(true).toBe(true);
      });

      test("PluginSettingsSubTabId is re-exported", () => {
        type _Assert = PluginSettingsSubTabId<any>;
        expect(true).toBe(true);
      });

      test("PluginSettingsSubTabIdMap is re-exported", () => {
        type _Assert = PluginSettingsSubTabIdMap;
        expect(true).toBe(true);
      });

      test("PluginSettingsSubTabRegistry is re-exported", () => {
        type _Assert =
          PluginSettingsSubTabRegistry<any, PluginSettingsSubTabIdMap>;
        expect(true).toBe(true);
      });
    });
  }
);
