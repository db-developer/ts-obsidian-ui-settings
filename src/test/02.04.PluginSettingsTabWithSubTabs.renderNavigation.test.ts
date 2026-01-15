// imports
import   path                                 from "path";
import { fileURLToPath                      } from "url";
import { PluginSettingsTabWithSubTabs       } from "../lib/PluginSettingsTabWithSubTabs";
import type { PluginSettingsSubTab, 
              PluginSettingsSubTabRegistry,
              PluginSettingsSubTabIdMap     } from "../lib/types";

// mocks
class DummySubTab implements PluginSettingsSubTab<any> {
  constructor(public header: string) {}
  render(): void {}
}

interface DummySettings { foo: string }

declare module "my-plugin/subtabs" {
  interface PluginSettingsSubTabIdMap {
    general: true;
    structure: true;
  }
}

type DummySubTabIds = PluginSettingsSubTabIdMap;

const subTabRegistry: PluginSettingsSubTabRegistry<DummySettings, DummySubTabIds> = {
  general: new DummySubTab("General"),
  structure: new DummySubTab("Structure"),
};

class DummyPlugin {
  async saveSettings() {}
}

// obsidian-like DOM mock
function createMockElement(): any {
  return {
    children: [] as any[],
    className: "",
    textContent: "",
    createEl(tag: string, options: { text?: string; cls?: string } = {}) {
      const el = createMockElement();
      if (options.text) el.textContent = options.text;
      if (options.cls) el.className = options.cls;
      this.children.push(el);
      return el;
    },
    createDiv(options: { cls?: string } = {}) {
      return this.createEl("div", options);
    },
    empty() {
      this.children = [];
    },
    addClass(cls: string) {
      this.className = `${this.className} ${cls}`.trim();
    },
    addEventListener() {},
  };
}

/**
 * Test the navigation rendering logic of PluginSettingsTabWithSubTabs.
 * Verifies that each sub-tab in the registry is represented by a button
 * and that headers match the sub-tab definitions.
 */
describe(`Running ${(fileURLToPath(import.meta.url).split(path.sep).join("/").split("/test/")[1] || fileURLToPath(import.meta.url))}`, () => {
  describe("Testing PluginSettingsTabWithSubTabs::renderNavigation", () => {

    test("renders buttons for each sub-tab with correct headers", () => {
      const container = createMockElement();

      const activeId: keyof typeof subTabRegistry = "general";
      class TestTab extends PluginSettingsTabWithSubTabs<DummySettings,DummySubTabIds> {
        constructor() {
          super(
            {} as any,
            {} as any,
            subTabRegistry,
            activeId
          );
        }
      }
      const tab = new TestTab();

      tab["renderNavigation"](container);

      const buttons = container.children;

      expect(buttons.length).toBe(2);
      expect(buttons[0].children[0].textContent).toBe("General");
      expect(buttons[1].children[0].textContent).toBe("Structure");

      expect(
        buttons[0].className.includes(
          "plugin-settings-subtab-nav-tab-active"
        )
      ).toBe(true);

      expect(
        buttons[1].className.includes(
          "plugin-settings-subtab-nav-tab-active"
        )
      ).toBe(false);
    });
  });
});
