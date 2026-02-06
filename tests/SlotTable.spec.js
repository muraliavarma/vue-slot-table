import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { SlotTable, SlotTableColumn, SlotTableColumnGroup } from '@/index.js'

function createTable(options = {}) {
  const {
    rows = [
      { name: 'Alice', age: 28 },
      { name: 'Bob', age: 34 },
    ],
    tableClass,
    columnGroups = [],
    columns = [
      { header: 'Name', cell: ({ row }) => row.name },
      { header: 'Age', cell: ({ row }) => row.age },
    ],
    sticky = {},
  } = options

  return mount(SlotTable, {
    props: { rows, ...(tableClass ? { tableClass } : {}) },
    slots: {
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
          }, {
            header: () => col.header,
            cell: (scope) => col.cell(scope),
          })
        ),
      ],
    },
  })
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

  it('emits row-click with row index when a row is clicked', async () => {
    const wrapper = createTable()
    await wrapper.findAll('tbody tr')[1].trigger('click')
    expect(wrapper.emitted('row-click')).toBeTruthy()
    expect(wrapper.emitted('row-click')[0]).toEqual([1])
  })

  it('handles empty rows', () => {
    const wrapper = createTable({ rows: [] })
    expect(wrapper.findAll('tbody tr')).toHaveLength(0)
    expect(wrapper.findAll('thead th')).toHaveLength(2)
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
      rows: [{ name: 'Test' }],
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
    expect(cellArgs[0]).toEqual({
      row: { name: 'Test' },
      rowIndex: 0,
      columnIndex: 0,
    })
  })
})
