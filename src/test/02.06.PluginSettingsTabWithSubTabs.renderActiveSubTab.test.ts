// mocks
import   path                                 from "path";
import { fileURLToPath                      } from "url";
import { PluginSettingsTabWithSubTabs       } from "../lib/PluginSettingsTabWithSubTabs";
import type { PluginWithSettings            } from "ts-obsidian-plugin";
import type { PluginSettingsSubTab,
              PluginSettingsSubTabRegistry  } from "../lib/types";

function createMockElement(): any {
  return {
    children: [] as any[],
    className: "",
    textContent: "",
    createEl(tag: string, opts: any = {}) {
      const el = createMockElement();
      if (opts.text) el.textContent = opts.text;
      if (opts.cls) el.className = opts.cls;
      this.children.push(el);
      return el;
    },
    createDiv(opts: any = {}) {
      return this.createEl("div", opts);
    },
    empty() {
      this.children = [];
    },
    addClass(cls: string) {
      this.className = `${this.className} ${cls}`.trim();
    },
    addEventListener(_evt: string, fn: Function) {
      this._listener = fn;
    },
    _listener: undefined as undefined | Function,
  };
}              

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
    
    class TestTab extends PluginSettingsTabWithSubTabs<
      TestSettings, Record<string, true>
    > {
      constructor(
        plugin: PluginWithSettings<TestSettings>,
        subTabs: PluginSettingsSubTabRegistry<
          TestSettings,
          Record<string, true>
        >,
        defaultSubTabId: "tab1" | "tab2"
      ) {
        // @ts-expect-error App not required for test
        super(undefined, plugin, subTabs, defaultSubTabId);
      }

      override display() {}
    }


    test("renders buttons for each sub-tab with correct headers and handles click", () => {
      const plugin = new DummyPlugin();

      const subTabs: PluginSettingsSubTabRegistry<
        TestSettings,
        Record<string, true>
      > = {
        tab1: new TestSubTab("Tab One"),
        tab2: new TestSubTab("Tab Two"),
      };

      const tab = new TestTab(plugin, subTabs, "tab1");

      const container = createMockElement();
      tab.containerEl = container;

      const displaySpy = vi.spyOn(tab, "display");

      tab.renderNavigation(container);

      const buttons = container.children;
      expect(buttons.length).toBe(2);

      expect(buttons[0].children[0].textContent).toBe("Tab One");
      expect(buttons[1].children[0].textContent).toBe("Tab Two");

      buttons[1]._listener();
      expect(tab.activeSubTabId).toBe("tab2");
      expect(displaySpy).toHaveBeenCalledTimes(1);

      displaySpy.mockClear();
      buttons[1]._listener();
      expect(tab.activeSubTabId).toBe("tab2");
      expect(displaySpy).not.toHaveBeenCalled();
    });

    test("context.saveSettings triggers plugin.saveSettings", async () => {
      const plugin = new DummyPlugin();
      const saveSpy = vi.spyOn(plugin, "saveSettings");

      const subTab1 = new TestSubTab("Tab One");
      const subTab2 = new TestSubTab("Tab Two");

      const subTabs: PluginSettingsSubTabRegistry<
        TestSettings,
        Record<string, true>
      > = {
        tab1: subTab1,
        tab2: subTab2,
      };

      const tab = new TestTab(plugin, subTabs, "tab1");

      const container = createMockElement();
      tab.containerEl = container;

      tab.renderActiveSubTab(container);

      await subTab1.lastContext.saveSettings();
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });
  });
});