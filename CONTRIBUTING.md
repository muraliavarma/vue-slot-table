# Contributing to vue-slottable

Thank you for your interest in contributing! Here's how to get started.

## Development Setup

1. **Fork and clone** the repository
2. **Install dependencies**: `npm install`
3. **Start the dev server**: `npm run dev`
4. **Run tests**: `npm test` or `npm run test:watch`
5. **Lint**: `npm run lint`

### Prerequisites

- Node.js 18+ (see `.nvmrc`)
- npm 9+

## Making Changes

1. Create a feature branch from `master`
2. Make your changes
3. Add or update tests as needed
4. Ensure all tests pass: `npm test`
5. Ensure linting passes: `npm run lint`
6. Commit with a clear message
7. Open a pull request

## Project Structure

```
src/
  components/
    SlotTable.vue           # Main table component
    SlotTableColumn.vue     # Column definition (renderless)
    SlotTableColumnGroup.vue # Column group header (renderless)
  index.js                  # Library entry point
  App.vue                   # Demo app
  main.js                   # Dev server entry
tests/
  SlotTable.spec.js
  SlotTableColumn.spec.js
  SlotTableColumnGroup.spec.js
```

## Code Style

- Follow the ESLint configuration (Vue 3 recommended rules)
- Use `<script setup>` for new components where appropriate
- Keep components focused and minimal

## Reporting Issues

- Use the [bug report template](.github/ISSUE_TEMPLATE/bug_report.md) for bugs
- Use the [feature request template](.github/ISSUE_TEMPLATE/feature_request.md) for ideas

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
