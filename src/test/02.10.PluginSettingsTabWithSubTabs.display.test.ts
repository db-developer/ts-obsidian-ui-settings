// imports
import   path                               from "path";
import { fileURLToPath                    } from "url";
import { PluginSettingsTabWithSubTabs     } from "../lib/PluginSettingsTabWithSubTabs";
import type { PluginSettingsSubTab, 
              PluginSettingsRenderContext } from "../lib/types";
import type { PluginWithSettings          } from "ts-obsidian-plugin";

// mocks for DOM elements
function createMockElement(): any {
  return {
    children: [] as any[],
    className: "",
    createEl(tag: string, opts: any = {}) {
      const el = createMockElement();
      if (opts?.cls) el.className = opts.cls;
      this.children.push(el);
      return el;
    },
    createDiv(opts: any = {}) {
      return this.createEl("div", opts);
    },
    empty: vi.fn(function () {
      this.children = [];
    }),
    addClass(cls: string) {
      this.className = `${this.className} ${cls}`.trim();
    },
    addEventListener: vi.fn(),
    appendChild: vi.fn(),
  };
}

// mock PluginWithSettings
const plugin: PluginWithSettings<any> & Record<string, unknown> = {
  saveSettings: vi.fn(),
};

// mock App
const app = {} as any;

// minimal SubTab implementation
class TestSubTab implements PluginSettingsSubTab<any> {
  header = "tab1";
  render(context: PluginSettingsRenderContext<any>): void {
    context.containerEl.empty();
  }
}

// registry with two tabs
const subTabs = {
  tab1: new TestSubTab(),
  tab2: new TestSubTab(),
};

describe(
  `Running ${(fileURLToPath(import.meta.url).split(path.sep).join("/").split("/test/")[1] ||
    fileURLToPath(import.meta.url))}`,
  () => {
    describe("Testing PluginSettingsTabWithSubTabs::display", () => {
      // test class extending PluginSettingsTabWithSubTabs
      class TestTab extends PluginSettingsTabWithSubTabs<any, any> {
        constructor(
          app: any,
          plugin: PluginWithSettings<any>,
          subTabs: typeof subTabs,
          defaultSubTabId: keyof typeof subTabs
        ) {
          super(app, plugin, subTabs, defaultSubTabId);
        }
      }

      test("calls renderNavigation and renderActiveSubTab with correct container", () => {
        const tab = new TestTab(app, plugin as any, subTabs, "tab1");

        const container = createMockElement();
        tab.containerEl = container;

        const navSpy = vi.spyOn(tab, "renderNavigation");
        const activeSpy = vi.spyOn(tab, "renderActiveSubTab");

        tab.display();

        expect(container.empty).toHaveBeenCalledTimes(1);
        expect(navSpy).toHaveBeenCalledTimes(1);
        expect(activeSpy).toHaveBeenCalledTimes(1);
      });
    });
  }
);
