# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-02-06

### Added
- `header-click` event for implementing sorting
- `#empty` slot for custom empty state
- `striped` prop for alternating row backgrounds
- `hoverable` prop for hover highlights
- `bordered` prop for cell borders
- `rowKey` prop for efficient row rendering
- `rowClass` prop (string, object, or function) for dynamic row styling
- `align` prop on `<SlotTableColumn>` (`left`, `center`, `right`)
- `width` and `min-width` props on `<SlotTableColumn>`
- `row-click` event now also passes the row data object
- Rich demo/docs page deployed to GitHub Pages
- GitHub Pages deployment workflow

## [1.0.1] - 2026-02-06

### Fixed
- Repository URLs in package.json and README badges

## [1.0.0] - 2026-02-06

### Changed
- **BREAKING**: Migrated from Vue 2 to Vue 3
- **BREAKING**: New component API — columns are now child `<SlotTableColumn>` components with `#header` and `#cell` named slots
- Replaced Vue CLI 3 with Vite 5
- Replaced Jest with Vitest
- Rewrote all components using Vue 3 `defineComponent` and `h()`
- Removed `SlotTableRow`, `SlotTableCell`, `SlotTableHeader` (inlined into `SlotTable`)

### Added
- `row-click` event emitted from `SlotTable`
- TypeScript declarations for all components
- GitHub Actions CI/CD workflows
- Issue templates and PR template
- CONTRIBUTING.md
- Full API documentation in README

## [0.1.0] - 2019-01-01

### Added
- Initial release with Vue 2 functional components
- SlotTable, SlotTableColumn, SlotTableColumnGroup
- Sticky column support
- Scoped slots for cell rendering
