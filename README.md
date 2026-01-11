[![npm version](https://img.shields.io/npm/v/ts-obsidian-ui-settings?color=blue)](https://www.npmjs.com/package/ts-obsidian-ui-settings)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![jsdoc](https://img.shields.io/static/v1?label=jsdoc&message=%20api%20&color=blue)](https://jsdoc.app/)
![Build & Test](https://github.com/db-developer/ts-obsidian-ui-settings/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/db-developer/ts-obsidian-ui-settings/branch/master/graph/badge.svg)](https://codecov.io/gh/db-developer/ts-obsidian-ui-settings)

[BOTTOM](#pluginsettingssubtabidmap--pluginsettingssubtabidttabids) [CHANGELOG](CHANGELOG.md) [LICENSE](LICENSE) [ROADMAP](ROADMAP.md)

# ts-obsidian-ui-settings

This module provides a **type-safe, extensible, and declarative framework** for building plugin settings in Obsidian with multiple sub-tabs. It allows separating rendering, state, and navigation responsibilities while keeping each sub-tab isolated and reusable.

---

## Motivation

Obsidian plugins run in a constrained environment:

- External runtime dependencies are discouraged
- `node_modules` are typically not shipped with plugins
- All code should be bundled into the final plugin file

This module is therefore designed to:

- Provide centralized navigation and active tab management
- SubTabs are **isolated** and **reusable** across plugins
- Full type safety with compile-time enforcement of SubTabIDs
- Easy to extend by adding new SubTab classes and updating the registry
- Integrate cleanly with Obsidian’s plugin environment
- Be **bundled (e.g. via Rollup)** directly into the plugin output

---

## Features

- Strongly typed sub-tab identifiers
- Compile-time enforcement of unique IDs
- Declarative sub-tab registry
- Decoupled render context for each sub-tab
- Automatic navigation and active-state management
- Seamlessly works with [ts-obsidian-ui-settings](https://github.com/db-developer/ts-obsidian-ui-settings) settings management
- Designed for **TypeScript** and **Rollup bundling** in Obsidian plugins
- SubTabs **do not manage DOM ownership** beyond the render call
- Settings persistence is always handled via `plugin.saveSettings()`
- No global state or side effects are introduced by this framework

[Details on AI assistance during development](AI.md)

---

## Usage

### 1. Define SubTab IDs

Use module augmentation to declare all valid sub-tab IDs:

```ts
// In a plugin-specific module (e.g., "my-plugin/subtabs")
declare module 'my-plugin/subtabs' {
  interface PluginSettingsSubTabIdMap {
    'general': true;
    'structure': true;
    'ribbons': true;
  }
}
```

### 2. Implement SubTabs

Each sub-tab must implement the `PluginSettingsSubTab<TSettings>` interface:

```ts
import type { PluginSettingsSubTab, PluginSettingsRenderContext } from "ts-obsidian-ui-settings";

export class GeneralSubTab implements PluginSettingsSubTab<MySettings> {
  header = 'General';

  render(context: PluginSettingsRenderContext<MySettings>) {
    const { containerEl, settings, saveSettings } = context;
    containerEl.empty();
    const el = containerEl.createEl('div', { text: `Current value: ${settings.someOption}` });

    // Example input
    const input = el.createEl('input', { type: 'text', value: settings.someOption });
    input.addEventListener('change', (e) => {
      settings.someOption = (e.target as HTMLInputElement).value;
      saveSettings();
    });
  }
}
```

### 3. Create the SubTab Registry

```ts
import type { PluginSettingsSubTabRegistry } from "ts-obsidian-ui-settings";

const subTabRegistry: PluginSettingsSubTabRegistry<MySettings, MyPluginSubTabIdMap> = {
  general: new GeneralSubTab(),
  structure: new StructureSubTab(),
  ribbons: new RibbonsSubTab(),
};
```

### 4. Implement the Settings Tab Controller

```ts
import { PluginSettingsTabWithSubTabs } from "ts-obsidian-ui-settings";

export class MyPluginSettingsTab extends PluginSettingsTabWithSubTabs<
  MySettings,
  MyPluginSubTabIdMap
> {
  constructor(app: App, plugin: PluginWithSettings<MySettings>) {
    super(app, plugin, subTabRegistry, 'general');
  }
}
```

### 5. Register the Settings Tab in Obsidian

```ts
this.addSettingTab(new MyPluginSettingsTab(this.app, this));
```

---

## Build & Test

The package uses **Rollup** for bundling and Vitest for testing.

```bash
# Build
npm run build

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## Bundling (Required)

Obsidian does not support loading external npm modules at runtime.
All dependencies must be bundled.

### Rollup Example

```js
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "src/main.ts",
  output: {
    file: "dist/main.js",
    format: "cjs",
  },
  plugins: [
    resolve(),
    typescript(),
  ],
  external: ["obsidian"],
};
```

---

## API Reference

### `PluginSettingsTabWithSubTabs<TSettings, TTabIds>`

Abstract controller class that manages multiple sub-tabs in a plugin settings tab.

**Constructor:**
```ts
// using import { App } from 'obsidian'
// using import { PluginWithSettings, PluginSettingsSubTabRegistry, PluginSettingsSubTabId} from 'ts-obsidian-ui-settings'
constructor(
  app: App,
  plugin: PluginWithSettings<TSettings>,
  subTabs: PluginSettingsSubTabRegistry<TSettings, TTabIds>,
  defaultSubTabId: PluginSettingsSubTabId<TTabIds>
)
```

**Properties:**
- `subTabs` – registry of all available sub-tabs
- `activeSubTabId` – currently active sub-tab identifier

**Methods:**
- `display()` – renders the navigation and the active sub-tab
- `renderNavigation(containerEl: HTMLElement)` – renders tab buttons
- `renderActiveSubTab(containerEl: HTMLElement)` – renders the currently active sub-tab

### `PluginSettingsSubTab<TSettings>`

Interface that each sub-tab must implement.

**Properties:**
- `header: string` – the title displayed in the navigation

**Methods:**
- `render(context: PluginSettingsRenderContext<TSettings>): void` – renders the sub-tab content into the given container

### `PluginSettingsRenderContext<TSettings>`

Provides a decoupled rendering context for sub-tabs.

**Properties:**
- `containerEl: HTMLElement` – DOM container for rendering
- `settings: TSettings` – plugin settings object
- `saveSettings(): Promise<void>` – triggers settings persistence
- `plugin: PluginWithSettings<TSettings>` – plugin reference

### `PluginSettingsSubTabRegistry<TSettings, TTabIds>`

A declarative mapping from sub-tab IDs to sub-tab instances.

```ts
type PluginSettingsSubTabRegistry<TSettings, TTabIds extends PluginSettingsSubTabIdMap> = {
  [K in PluginSettingsSubTabId<TTabIds>]: PluginSettingsSubTab<TSettings>;
};
```

### `PluginSettingsSubTabIdMap` / `PluginSettingsSubTabId<TTabIds>`

Compile-time registry and union type of valid sub-tab identifiers using module augmentation.

[TOP](#ts-obsidian-ui-settings) [CHANGELOG](CHANGELOG.md) [LICENSE](LICENSE) [ROADMAP](ROADMAP.md)