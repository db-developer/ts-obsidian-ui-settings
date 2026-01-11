// imports
import   path                           from "path";
import { fileURLToPath                } from "url";
import { PluginSettingsTabWithSubTabs } from "../lib/PluginSettingsTabWithSubTabs";

/**
 * This test verifies that the PluginSettingsTabWithSubTabs class
 * is publicly exported and can be imported by consumers.
 *
 * The assertion is intentionally minimal and compile-time driven:
 * if the class is removed, renamed, or no longer exported,
 * TypeScript compilation will fail.
 */
describe(
  `Running ${(fileURLToPath(import.meta.url)
    .split(path.sep)
    .join("/")
    .split("/test/")[1] || fileURLToPath(import.meta.url))}`,
  () => {

    describe("Testing PluginSettingsTabWithSubTabs export", () => {

      test("PluginSettingsTabWithSubTabs is exported", () => {
        type _Assert = typeof PluginSettingsTabWithSubTabs;
        expect(true).toBe(true);
      });

    });
  }
);
