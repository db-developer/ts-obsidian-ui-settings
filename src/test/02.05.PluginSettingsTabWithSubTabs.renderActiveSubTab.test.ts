// mocks
import   path                                 from "path";
import { fileURLToPath                      } from "url";
import { PluginSettingsTabWithSubTabs       } from "../lib/PluginSettingsTabWithSubTabs";
import type { PluginSettingsSubTabRegistry,
              PluginSettingsSubTab          } from "../lib/types";

class MockPlugin {
  async saveSettings() {}
}

// Minimal mock for containerEl
const createMockContainer = () => {
  return {
    children: [] as HTMLElement[],
    empty() { this.children = []; },
    createEl(tag: string, options: { text?: string; cls?: string } = {}) {
      const el = document.createElement(tag);
      if (options.text) el.textContent = options.text;
      if (options.cls) el.className = options.cls;
      this.children.push(el);
      return el;
    }
  } as unknown as HTMLElement;
};

// Minimal mock sub-tab
class MockSubTab implements PluginSettingsSubTab<any> {
  header = "MockTab";
  render = vi.fn(); // track calls
}

describe(`Running ${(fileURLToPath(import.meta.url).split(path.sep).join("/").split("/test/")[1] || fileURLToPath(import.meta.url))}`, () => {
  describe("Testing PluginSettingsTabWithSubTabs::renderActiveSubTab", () => {
    test("renders the currently active sub-tab by calling its render method", () => {
      const mockPlugin = new MockPlugin();
      const subTabRegistry: PluginSettingsSubTabRegistry<any, any> = {
        mock: new MockSubTab()
      };
      const activeSubTabId = "mock" as const;

      // @ts-ignore - we don't have a real App instance
      const tab = new PluginSettingsTabWithSubTabs<any, any>({} as any, mockPlugin as any, subTabRegistry, activeSubTabId);

      const container = createMockContainer();

      tab.renderActiveSubTab(container);

      // Check that render of the active sub-tab was called with a context
      const subTab = subTabRegistry[activeSubTabId];
      expect(subTab.render).toHaveBeenCalled();
      const contextArg = (subTab.render as unknown as vi.Mock).mock.calls[0][0];
      expect(contextArg.containerEl).toBe(container);
      expect(contextArg.plugin).toBe(mockPlugin);
      expect(typeof contextArg.saveSettings).toBe("function");
    });
  });
});
