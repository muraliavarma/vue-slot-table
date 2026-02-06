import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { SlotTable, SlotTableColumn, SlotTableColumnGroup } from '@/index.js'

function createTable(options = {}) {
  const {
    rows = [
      { id: 1, name: 'Alice', age: 28 },
      { id: 2, name: 'Bob', age: 34 },
    ],
    tableClass,
    columnGroups = [],
    columns = [
      { header: 'Name', cell: ({ row }) => row.name },
      { header: 'Age', cell: ({ row }) => row.age },
    ],
    sticky = {},
    align = {},
    width = {},
    minWidth = {},
    rowKey,
    rowClass,
    striped,
    hoverable,
    bordered,
    emptySlot,
  } = options

  const props = { rows }
  if (tableClass) props.tableClass = tableClass
  if (rowKey) props.rowKey = rowKey
  if (rowClass) props.rowClass = rowClass
  if (striped) props.striped = striped
  if (hoverable) props.hoverable = hoverable
  if (bordered) props.bordered = bordered

  const slots = {
    default: () => [
      ...columnGroups.map((group) =>
        h(SlotTableColumnGroup, {
          sticky: group.sticky,
          colspan: group.colspan,
        }, { default: () => group.label })
      ),
      ...columns.map((col, i) =>
        h(SlotTableColumn, {
          sticky: sticky[i],
          align: align[i],
          width: width[i],
          minWidth: minWidth[i],
        }, {
          header: () => col.header,
          cell: (scope) => col.cell(scope),
        })
      ),
    ],
  }

  if (emptySlot) {
    slots.empty = () => emptySlot
  }

  return mount(SlotTable, { props, slots })
}

describe('SlotTable', () => {
  it('renders correct number of rows and columns', () => {
    const wrapper = createTable()
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
    expect(rows[0].findAll('td')).toHaveLength(2)
    expect(rows[1].findAll('td')).toHaveLength(2)
  })

  it('applies tableClass to the table element', () => {
    const wrapper = createTable({ tableClass: 'my-table' })
    expect(wrapper.find('table').classes()).toContain('my-table')
  })

  it('renders header content from column #header slots', () => {
    const wrapper = createTable()
    const headers = wrapper.findAll('thead th')
    expect(headers).toHaveLength(2)
    expect(headers[0].text()).toBe('Name')
    expect(headers[1].text()).toBe('Age')
  })

  it('renders cell content using column #cell scoped slots', () => {
    const wrapper = createTable()
    const firstRowCells = wrapper.findAll('tbody tr:first-child td')
    expect(firstRowCells[0].text()).toBe('Alice')
    expect(firstRowCells[1].text()).toBe('28')
  })

  it('renders column group header row', () => {
    const wrapper = createTable({
      columnGroups: [
        { label: 'People', colspan: 2 },
      ],
    })
    const headerRows = wrapper.findAll('thead tr')
    expect(headerRows).toHaveLength(2)
    const groupTh = headerRows[0].find('th')
    expect(groupTh.text()).toBe('People')
    expect(groupTh.attributes('colspan')).toBe('2')
  })

  it('does not render group header row when no column groups', () => {
    const wrapper = createTable()
    const headerRows = wrapper.findAll('thead tr')
    expect(headerRows).toHaveLength(1)
  })

  it('emits row-click with row index and row data when clicked', async () => {
    const wrapper = createTable()
    await wrapper.findAll('tbody tr')[1].trigger('click')
    expect(wrapper.emitted('row-click')).toBeTruthy()
    expect(wrapper.emitted('row-click')[0]).toEqual([1, { id: 2, name: 'Bob', age: 34 }])
  })

  it('emits header-click with column index when header is clicked', async () => {
    const wrapper = createTable()
    await wrapper.findAll('thead th')[1].trigger('click')
    expect(wrapper.emitted('header-click')).toBeTruthy()
    expect(wrapper.emitted('header-click')[0]).toEqual([1])
  })

  it('handles empty rows with no empty slot', () => {
    const wrapper = createTable({ rows: [] })
    expect(wrapper.findAll('tbody tr')).toHaveLength(0)
    expect(wrapper.findAll('thead th')).toHaveLength(2)
  })

  it('renders empty slot when rows are empty', () => {
    const wrapper = createTable({
      rows: [],
      emptySlot: 'No data available',
    })
    const emptyTd = wrapper.find('tbody td')
    expect(emptyTd.exists()).toBe(true)
    expect(emptyTd.text()).toBe('No data available')
    expect(emptyTd.classes()).toContain('slot-table-empty')
    expect(emptyTd.attributes('colspan')).toBe('2')
  })

  it('does not render empty slot when rows exist', () => {
    const wrapper = createTable({ emptySlot: 'No data' })
    expect(wrapper.find('.slot-table-empty').exists()).toBe(false)
  })

  it('handles no column children gracefully', () => {
    const wrapper = mount(SlotTable, {
      props: { rows: [{ a: 1 }] },
      slots: { default: () => [] },
    })
    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.findAll('thead th')).toHaveLength(0)
  })

  it('passes row, rowIndex, and columnIndex to cell slot', () => {
    const cellArgs = []
    createTable({
      rows: [{ id: 1, name: 'Test' }],
      columns: [
        {
          header: 'Col',
          cell: (scope) => {
            cellArgs.push({ ...scope })
            return scope.row.name
          },
        },
      ],
    })
    expect(cellArgs).toHaveLength(1)
    expect(cellArgs[0].row).toEqual({ id: 1, name: 'Test' })
    expect(cellArgs[0].rowIndex).toBe(0)
    expect(cellArgs[0].columnIndex).toBe(0)
  })

  it('applies striped class to odd rows', () => {
    const wrapper = createTable({
      rows: [{ id: 1, name: 'A', age: 1 }, { id: 2, name: 'B', age: 2 }, { id: 3, name: 'C', age: 3 }],
      striped: true,
    })
    const rows = wrapper.findAll('tbody tr')
    expect(rows[0].classes()).not.toContain('slot-table-striped')
    expect(rows[1].classes()).toContain('slot-table-striped')
    expect(rows[2].classes()).not.toContain('slot-table-striped')
  })

  it('applies hoverable class to all rows', () => {
    const wrapper = createTable({ hoverable: true })
    const rows = wrapper.findAll('tbody tr')
    rows.forEach((row) => {
      expect(row.classes()).toContain('slot-table-hoverable')
    })
  })

  it('applies bordered class to the table', () => {
    const wrapper = createTable({ bordered: true })
    expect(wrapper.find('table').classes()).toContain('slot-table-bordered')
  })

  it('applies rowClass as a string', () => {
    const wrapper = createTable({ rowClass: 'custom-row' })
    wrapper.findAll('tbody tr').forEach((row) => {
      expect(row.classes()).toContain('custom-row')
    })
  })

  it('applies rowClass as a function', () => {
    const wrapper = createTable({
      rowClass: (row) => row.name === 'Alice' ? 'highlighted' : '',
    })
    const rows = wrapper.findAll('tbody tr')
    expect(rows[0].classes()).toContain('highlighted')
    expect(rows[1].classes()).not.toContain('highlighted')
  })

  it('applies column align classes', () => {
    const wrapper = createTable({
      align: { 1: 'right' },
    })
    expect(wrapper.findAll('thead th')[1].classes()).toContain('align-right')
    expect(wrapper.findAll('tbody td')[1].classes()).toContain('align-right')
  })

  it('applies column width and minWidth styles', () => {
    const wrapper = createTable({
      width: { 0: '100px' },
      minWidth: { 1: '200px' },
    })
    expect(wrapper.findAll('thead th')[0].attributes('style')).toContain('width: 100px')
    expect(wrapper.findAll('thead th')[1].attributes('style')).toContain('min-width: 200px')
  })
})
