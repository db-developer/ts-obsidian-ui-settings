export class Plugin {
  app: any;
  manifest: any;

  async loadData(): Promise<any> {
    return null;
  }

  async saveData(): Promise<void> {
    return;
  }
}

export class PluginSettingTab {
  app: any;
  plugin: Plugin;

  constructor(app: any, plugin: Plugin) {
    this.app = app;
    this.plugin = plugin;
  }

  display(): void {
    /* noop */
  }
}
