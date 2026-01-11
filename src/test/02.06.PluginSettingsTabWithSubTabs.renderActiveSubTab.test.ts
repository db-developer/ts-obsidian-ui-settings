// mocks
import   path                                 from "path";
import { fileURLToPath                      } from "url";
import { PluginSettingsTabWithSubTabs       } from "../lib/PluginSettingsTabWithSubTabs";
import type { PluginWithSettings            } from "ts-obsidian-plugin";
import type { PluginSettingsSubTab,
              PluginSettingsSubTabRegistry  } from "../lib/types";


/**
 * Test the navigation rendering and button click behavior of PluginSettingsTabWithSubTabs.
 */
describe(`Running ${(fileURLToPath(import.meta.url).split(path.sep).join("/").split("/test/")[1] || fileURLToPath(import.meta.url))}`, () => {
  describe("Testing PluginSettingsTabWithSubTabs::renderNavigation", () => {
    type TestSettings = { value: string };

    class DummyPlugin implements PluginWithSettings<TestSettings> {
      settings = { value: "initial" };
      async saveSettings(): Promise<void> {}
    }

    class TestSubTab implements PluginSettingsSubTab<TestSettings> {
      header: string;
      lastContext!: any; // will store the context for testing

      constructor(header: string) {
        this.header = header;
      }

      render(context: any): void {
        // Store the context so we can access it in the test
        this.lastContext = context;
      }
    }
    
    class TestTab extends PluginSettingsTabWithSubTabs<TestSettings, Record<string, true>> {
      constructor(
        plugin: PluginWithSettings<TestSettings>,
        subTabs: PluginSettingsSubTabRegistry<TestSettings, Record<string, true>>,
        defaultSubTabId: "tab1" | "tab2"
      ) {
        // @ts-expect-error mocking App not needed
        super(undefined, plugin, subTabs, defaultSubTabId);
      }

      // override display so we can spy on it
      override display() {}
    }

    test("renders buttons for each sub-tab with correct headers and handles click", () => {
      const plugin = new DummyPlugin();
      const subTabs: PluginSettingsSubTabRegistry<TestSettings, Record<string, true>> = {
        tab1: new TestSubTab("Tab One"),
        tab2: new TestSubTab("Tab Two"),
      };

      const tab = new TestTab(plugin, subTabs, "tab1");

      // Mock containerEl
      const container: any = {
        createEl: vi.fn((tag: string, opts: any) => {
          const el: any = { ...opts, addEventListener: vi.fn() };
          return el;
        }),
      };
      tab.containerEl = container;

      tab.renderNavigation(container);

      // Check createEl called twice (once per tab)
      expect(container.createEl).toHaveBeenCalledTimes(2);

      // Check button headers
      expect(container.createEl.mock.calls[0][1].text).toBe("Tab One");
      expect(container.createEl.mock.calls[1][1].text).toBe("Tab Two");

      // Extract the mocked buttons
      const button1 = container.createEl.mock.results[0].value;
      const button2 = container.createEl.mock.results[1].value;

      // Spy on display
      const displaySpy = vi.spyOn(tab, "display");

      // Simulate click on inactive tab
      button2.addEventListener.mock.calls[0][1](); // call click callback
      expect(tab.activeSubTabId).toBe("tab2");
      expect(displaySpy).toHaveBeenCalled();

      // Simulate click on already active tab
      displaySpy.mockClear();
      button2.addEventListener.mock.calls[0][1]();
      expect(tab.activeSubTabId).toBe("tab2"); // unchanged
      expect(displaySpy).not.toHaveBeenCalled();
    });

    test("context.saveSettings triggers plugin.saveSettings", async () => {
      const plugin = new DummyPlugin();
      const saveSpy = vi.spyOn(plugin, "saveSettings");

      const subTab1 = new TestSubTab("Tab One");
      const subTab2 = new TestSubTab("Tab Two");

      const subTabs: PluginSettingsSubTabRegistry<TestSettings, Record<string, true>> = {
        tab1: subTab1,
        tab2: subTab2,
      };

      const tab = new TestTab(plugin, subTabs, "tab1");

      // Mock containerEl
      const container: any = { empty: vi.fn() };
      tab.containerEl = container;

      // Render active sub-tab
      tab.renderActiveSubTab(container);

      // Grab the context passed to the sub-tab
      const context = subTab1.lastContext;

      // Call the saveSettings function from context
      await context.saveSettings();

      // Expect plugin.saveSettings to have been called
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });
});