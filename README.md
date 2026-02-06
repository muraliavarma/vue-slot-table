# vue-slottable

[![CI](https://github.com/muraliavarma/vue-slot-table/actions/workflows/ci.yml/badge.svg)](https://github.com/muraliavarma/vue-slot-table/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/vue-slottable.svg)](https://www.npmjs.com/package/vue-slottable)
[![license](https://img.shields.io/npm/l/vue-slottable.svg)](./LICENSE.txt)

A flexible, slot-based table component for Vue 3. Define columns with scoped slots, add sticky columns, column groups, sorting, and more — with zero CSS opinions.

**[Live Examples](https://muraliavarma.github.io/vue-slot-table/)**

## Install

```bash
npm install vue-slottable
```

Requires Vue 3.4+.

## Quick Start

```vue
<script setup>
import { SlotTable, SlotTableColumn } from 'vue-slottable'

const users = [
  { name: 'Alice', role: 'Engineer' },
  { name: 'Bob', role: 'Designer' },
]
</script>

<template>
  <SlotTable :rows="users">
    <SlotTableColumn>
      <template #header>Name</template>
      <template #cell="{ row }">{{ row.name }}</template>
    </SlotTableColumn>
    <SlotTableColumn>
      <template #header>Role</template>
      <template #cell="{ row }">{{ row.role }}</template>
    </SlotTableColumn>
  </SlotTable>
</template>
```

That's it. No configuration objects, no render props — just slots.

## Features

### Custom Cell Rendering

Put anything inside a cell — HTML, components, computed values:

```vue
<SlotTableColumn>
  <template #header>Status</template>
  <template #cell="{ row }">
    <span :class="'badge-' + row.status">{{ row.status }}</span>
  </template>
</SlotTableColumn>
```

### Sticky Columns

Pin columns to the left or right edge. They stay visible when scrolling horizontally:

```vue
<SlotTableColumn sticky="left">
  <template #header>Name</template>
  <template #cell="{ row }">{{ row.name }}</template>
</SlotTableColumn>

<!-- scrollable columns in the middle -->

<SlotTableColumn sticky="right">
  <template #header>Actions</template>
  <template #cell="{ row }">
    <button @click.stop="edit(row)">Edit</button>
  </template>
</SlotTableColumn>
```

### Column Groups

Add grouped header rows that span multiple columns:

```vue
<SlotTable :rows="data">
  <SlotTableColumnGroup :colspan="2">Personal Info</SlotTableColumnGroup>
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

### Sorting (via header-click)

The component doesn't impose a sorting implementation — use `@header-click` to build your own:

```vue
<script setup>
import { ref, computed } from 'vue'

const sortCol = ref(null)
const sortDir = ref('asc')

function onHeaderClick(columnIndex) {
  if (sortCol.value === columnIndex) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortCol.value = columnIndex
    sortDir.value = 'asc'
  }
}

const sortedRows = computed(() => {
  if (sortCol.value === null) return rows
  // your sort logic here
})
</script>

<template>
  <SlotTable :rows="sortedRows" @header-click="onHeaderClick">
    <!-- columns -->
  </SlotTable>
</template>
```

### Row Events & Dynamic Styling

Handle clicks and style rows conditionally:

```vue
<SlotTable
  :rows="employees"
  hoverable
  :row-class="(row) => row.active ? '' : 'row-dimmed'"
  @row-click="(index, row) => selected = row"
>
  <!-- columns -->
</SlotTable>
```

### Striped & Bordered

Classic table styles with boolean props:

```vue
<SlotTable :rows="data" striped bordered>
  <!-- columns -->
</SlotTable>
```

### Column Width & Alignment

Control sizing and text alignment per column:

```vue
<SlotTableColumn width="80px" align="center">
  <template #header>#</template>
  <template #cell="{ rowIndex }">{{ rowIndex + 1 }}</template>
</SlotTableColumn>

<SlotTableColumn min-width="200px" align="right">
  <template #header>Price</template>
  <template #cell="{ row }">{{ formatPrice(row.price) }}</template>
</SlotTableColumn>
```

### Empty State

Show a custom message when there's no data:

```vue
<SlotTable :rows="filteredData">
  <template #empty>
    <p>No results found. Try a different search.</p>
  </template>

  <!-- columns still needed for headers -->
  <SlotTableColumn>
    <template #header>Name</template>
    <template #cell="{ row }">{{ row.name }}</template>
  </SlotTableColumn>
</SlotTable>
```

### Row Keys

For efficient rendering when rows change, provide a key:

```vue
<SlotTable :rows="data" row-key="id">
  <!-- columns -->
</SlotTable>

<!-- or use a function -->
<SlotTable :rows="data" :row-key="(row) => row.id">
  <!-- columns -->
</SlotTable>
```

---

## API Reference

### `<SlotTable>`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rows` | `Array` | *required* | Array of row data objects |
| `table-class` | `String` | `''` | CSS class on the `<table>` element |
| `row-key` | `String \| Function` | — | Key for each `<tr>` (field name or `(row, index) => key`) |
| `row-class` | `String \| Object \| Function` | — | Class for each `<tr>` (or `(row, index) => class`) |
| `striped` | `Boolean` | `false` | Alternating row backgrounds |
| `hoverable` | `Boolean` | `false` | Highlight rows on hover |
| `bordered` | `Boolean` | `false` | Add cell borders |

| Event | Payload | Description |
|-------|---------|-------------|
| `row-click` | `(rowIndex, row)` | Fired when a row is clicked |
| `header-click` | `(columnIndex)` | Fired when a header cell is clicked |

| Slot | Description |
|------|-------------|
| `default` | `<SlotTableColumn>` and `<SlotTableColumnGroup>` children |
| `empty` | Content shown when `rows` is empty |

### `<SlotTableColumn>`

Renderless component — must be a direct child of `<SlotTable>`.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sticky` | `String` | `''` | `'left'` or `'right'` |
| `align` | `String` | `''` | `'left'`, `'center'`, or `'right'` |
| `width` | `String` | `''` | CSS width (e.g. `'100px'`) |
| `min-width` | `String` | `''` | CSS min-width (e.g. `'200px'`) |

| Slot | Scope | Description |
|------|-------|-------------|
| `header` | — | Column header content (`<th>`) |
| `cell` | `{ row, rowIndex, columnIndex }` | Cell content (`<td>`) for each row |

### `<SlotTableColumnGroup>`

Renderless component for grouped header rows.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sticky` | `String` | `''` | `'left'` or `'right'` |
| `colspan` | `Number` | — | Number of columns to span |

| Slot | Description |
|------|-------------|
| `default` | Group header content |

---

## CSS Classes

The component applies these classes that you can style:

| Class | Applied when |
|-------|-------------|
| `sticky-left` | Column has `sticky="left"` |
| `sticky-right` | Column has `sticky="right"` |
| `align-left` / `align-center` / `align-right` | Column has `align` prop |
| `slot-table-striped` | Odd rows when `striped` is true |
| `slot-table-hoverable` | All rows when `hoverable` is true |
| `slot-table-bordered` | Table element when `bordered` is true |
| `slot-table-empty` | The `<td>` wrapping the empty slot |

## Development

```bash
npm install
npm run dev       # Dev server with live examples
npm test          # Run tests
npm run lint      # Lint
npm run build:lib # Build library
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE.txt)
