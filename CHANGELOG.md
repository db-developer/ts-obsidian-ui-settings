[BOTTOM](#100---2026-01-11) [LICENSE](LICENSE) [ROADMAP](ROADMAP.md) [README](README.md)

# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- No additions yet

### Changed

- No changes yet

### Fixed

- No fixes yet

## [1.0.0] - 2026-01-11

- Initial version

### Features

- Type-safe, extensible framework for Obsidian plugin settings
- Support for multiple sub-tabs with compile-time enforced unique IDs
- Declarative sub-tab registry for centralized management
- Decoupled `PluginSettingsRenderContext` for isolated rendering
- Automatic navigation and active-tab state handling
- Seamless integration with `ts-obsidian-plugin` settings management
- Designed for TypeScript and Rollup bundling in Obsidian plugins
- SubTabs do not manage DOM ownership beyond their render call
- Settings persistence handled via `plugin.saveSettings()`
- No global state or side effects introduced by the framework

[TOP](#changelog) [LICENSE](LICENSE) [ROADMAP](ROADMAP.md) [README](README.md)
