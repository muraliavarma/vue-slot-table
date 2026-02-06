# vue-slottable

[![CI](https://github.com/nickvdyck/vue-slot-table/actions/workflows/ci.yml/badge.svg)](https://github.com/nickvdyck/vue-slot-table/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/vue-slottable.svg)](https://www.npmjs.com/package/vue-slottable)
[![license](https://img.shields.io/npm/l/vue-slottable.svg)](./LICENSE.txt)

A flexible, slot-based Vue 3 table component with sticky columns, column groups, and scoped slots for custom cell rendering.

## Features

- **Slot-based columns** — define headers and cells with named slots
- **Sticky columns** — pin columns to the left or right edge
- **Column groups** — add grouped header rows with colspan
- **Row click events** — handle row interactions
- **Zero CSS opinions** — bring your own styles
- **Lightweight** — no dependencies beyond Vue 3
- **TypeScript declarations** included

## Installation

```bash
npm install vue-slottable
```

Requires Vue 3.4+.

## Quick Start

```vue
<script setup>
import { SlotTable, SlotTableColumn } from 'vue-slottable'

const rows = [
  { name: 'Alice', age: 28 },
  { name: 'Bob', age: 34 },
]
</script>

<template>
  <SlotTable :rows="rows" table-class="my-table">
    <SlotTableColumn>
      <template #header>Name</template>
      <template #cell="{ row }">{{ row.name }}</template>
    </SlotTableColumn>

    <SlotTableColumn>
      <template #header>Age</template>
      <template #cell="{ row }">{{ row.age }}</template>
    </SlotTableColumn>
  </SlotTable>
</template>
```

## API Reference

### `<SlotTable>`

The main table component. Renders a `<table>` element.

#### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `rows` | `Array` | Yes | — | Array of row data objects |
| `table-class` | `String` | No | `''` | CSS class applied to the `<table>` element |

#### Events

| Event | Payload | Description |
|-------|---------|-------------|
| `row-click` | `rowIndex: number` | Emitted when a table row is clicked |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Accepts `<SlotTableColumn>` and `<SlotTableColumnGroup>` children |

---

### `<SlotTableColumn>`

Defines a single table column. This is a renderless component — it must be a direct child of `<SlotTable>`.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sticky` | `String` | `''` | Set to `'left'` or `'right'` to make the column sticky |

#### Slots

| Slot | Scope | Description |
|------|-------|-------------|
| `header` | — | Content for the column's `<th>` |
| `cell` | `{ row, rowIndex, columnIndex }` | Content for each `<td>` in this column |

---

### `<SlotTableColumnGroup>`

Defines a grouped header row entry. Must be a direct child of `<SlotTable>`.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sticky` | `String` | `''` | Set to `'left'` or `'right'` for sticky positioning |
| `colspan` | `Number` | — | Number of columns this group header spans |

#### Slots

| Slot | Description |
|------|-------------|
| `default` | Content for the group `<th>` |

## Examples

### Sticky Columns

```vue
<SlotTable :rows="rows">
  <SlotTableColumn sticky="left">
    <template #header>ID</template>
    <template #cell="{ row }">{{ row.id }}</template>
  </SlotTableColumn>

  <SlotTableColumn>
    <template #header>Description</template>
    <template #cell="{ row }">{{ row.description }}</template>
  </SlotTableColumn>

  <SlotTableColumn sticky="right">
    <template #header>Actions</template>
    <template #cell="{ row }">
      <button @click.stop="edit(row)">Edit</button>
    </template>
  </SlotTableColumn>
</SlotTable>
```

### Column Groups

```vue
<SlotTable :rows="rows">
  <SlotTableColumnGroup :colspan="2">Personal</SlotTableColumnGroup>
  <SlotTableColumnGroup :colspan="1">Work</SlotTableColumnGroup>

  <SlotTableColumn>
    <template #header>Name</template>
    <template #cell="{ row }">{{ row.name }}</template>
  </SlotTableColumn>

  <SlotTableColumn>
    <template #header>Age</template>
    <template #cell="{ row }">{{ row.age }}</template>
  </SlotTableColumn>

  <SlotTableColumn>
    <template #header>Role</template>
    <template #cell="{ row }">{{ row.role }}</template>
  </SlotTableColumn>
</SlotTable>
```

### Row Click Events

```vue
<script setup>
function onRowClick(rowIndex) {
  console.log('Clicked row:', rowIndex)
}
</script>

<template>
  <SlotTable :rows="rows" @row-click="onRowClick">
    <!-- columns... -->
  </SlotTable>
</template>
```

### Custom Cell Rendering

```vue
<SlotTableColumn>
  <template #header>Status</template>
  <template #cell="{ row }">
    <span :class="'badge-' + row.status">{{ row.status }}</span>
  </template>
</SlotTableColumn>
```

## Development

```bash
npm install
npm run dev       # Start dev server with demo app
npm test          # Run tests
npm run lint      # Lint
npm run build:lib # Build library bundles
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE.txt)
