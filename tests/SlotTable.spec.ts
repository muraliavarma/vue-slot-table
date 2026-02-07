import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { SlotTable, SlotTableColumn, SlotTableColumnGroup } from '@/index'
import type { CellSlotScope } from '@/types'

interface CreateTableOptions {
  rows?: any[]
  tableClass?: string
  columnGroups?: Array<{ label: string; sticky?: string; colspan?: number }>
  columns?: Array<{ header: string; cell: (scope: CellSlotScope) => any }>
  sticky?: Record<number, string>
  align?: Record<number, string>
  width?: Record<number, string>
  minWidth?: Record<number, string>
  visible?: Record<number, boolean>
  tdClass?: Record<number, string | Record<string, boolean>>
  thClass?: Record<number, string | Record<string, boolean>>
  footer?: Record<number, string>
  rowKey?: string | ((row: any, index: number) => string | number)
  rowClass?: string | Record<string, boolean> | ((row: any, index: number) => string | Record<string, boolean>)
  striped?: boolean
  hoverable?: boolean
  bordered?: boolean
  loading?: boolean
  stickyHeader?: boolean
  caption?: string
  emptySlot?: string
  loadingSlot?: string
}

function createTable(options: CreateTableOptions = {}) {
  const {
    rows = [
      { id: 1, name: 'Alice', age: 28 },
      { id: 2, name: 'Bob', age: 34 },
    ],
    tableClass,
    columnGroups = [],
    columns = [
      { header: 'Name', cell: ({ row }: CellSlotScope) => row.name },
      { header: 'Age', cell: ({ row }: CellSlotScope) => row.age },
    ],
    sticky = {},
    align = {},
    width = {},
    minWidth = {},
    visible = {},
    tdClass = {},
    thClass = {},
    footer = {},
    rowKey,
    rowClass,
    striped,
    hoverable,
    bordered,
    loading,
    stickyHeader,
    caption,
    emptySlot,
    loadingSlot,
  } = options

  const props: Record<string, any> = { rows }
  if (tableClass) props.tableClass = tableClass
  if (rowKey) props.rowKey = rowKey
  if (rowClass) props.rowClass = rowClass
  if (striped) props.striped = striped
  if (hoverable) props.hoverable = hoverable
  if (bordered) props.bordered = bordered
  if (loading !== undefined) props.loading = loading
  if (stickyHeader) props.stickyHeader = stickyHeader
  if (caption) props.caption = caption

  const slots: Record<string, () => any> = {
    default: () => [
      ...columnGroups.map((group) =>
        h(SlotTableColumnGroup, {
          sticky: group.sticky,
          colspan: group.colspan,
        } as any, { default: () => group.label })
      ),
      ...columns.map((col, i) => {
        const colProps: Record<string, any> = {
          sticky: sticky[i],
          align: align[i],
          width: width[i],
          minWidth: minWidth[i],
        }
        if (visible[i] !== undefined) colProps.visible = visible[i]
        if (tdClass[i]) colProps.tdClass = tdClass[i]
        if (thClass[i]) colProps.thClass = thClass[i]

        const colSlots: Record<string, Function> = {
          header: () => col.header,
          cell: (scope: CellSlotScope) => col.cell(scope),
        }
        if (footer[i]) colSlots.footer = () => footer[i]

        return h(SlotTableColumn, colProps as any, colSlots)
      }),
    ],
  }

  if (emptySlot) {
    slots.empty = () => emptySlot
  }
  if (loadingSlot) {
    slots.loading = () => loadingSlot
  }

  return mount(SlotTable, { props: props as any, slots })
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
    expect(wrapper.emitted('row-click')![0]).toEqual([1, { id: 2, name: 'Bob', age: 34 }])
  })

  it('emits header-click with column index when header is clicked', async () => {
    const wrapper = createTable()
    await wrapper.findAll('thead th')[1].trigger('click')
    expect(wrapper.emitted('header-click')).toBeTruthy()
    expect(wrapper.emitted('header-click')![0]).toEqual([1])
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
    const cellArgs: CellSlotScope[] = []
    createTable({
      rows: [{ id: 1, name: 'Test' }],
      columns: [
        {
          header: 'Col',
          cell: (scope: CellSlotScope) => {
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
      rowClass: (row: any) => row.name === 'Alice' ? 'highlighted' : '',
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

  // ── visible prop ──────────────────────────────────
  it('hides columns when visible is false', () => {
    const wrapper = createTable({
      visible: { 1: false },
    })
    expect(wrapper.findAll('thead th')).toHaveLength(1)
    expect(wrapper.findAll('thead th')[0].text()).toBe('Name')
    expect(wrapper.findAll('tbody tr:first-child td')).toHaveLength(1)
  })

  it('shows columns when visible is true (explicit)', () => {
    const wrapper = createTable({
      visible: { 0: true, 1: true },
    })
    expect(wrapper.findAll('thead th')).toHaveLength(2)
  })

  // ── footer slot ───────────────────────────────────
  it('renders tfoot when columns have footer slots', () => {
    const wrapper = createTable({
      footer: { 0: 'Total', 1: '62' },
    })
    const tfoot = wrapper.find('tfoot')
    expect(tfoot.exists()).toBe(true)
    const footerCells = tfoot.findAll('td')
    expect(footerCells).toHaveLength(2)
    expect(footerCells[0].text()).toBe('Total')
    expect(footerCells[1].text()).toBe('62')
  })

  it('does not render tfoot when no footer slots are provided', () => {
    const wrapper = createTable()
    expect(wrapper.find('tfoot').exists()).toBe(false)
  })

  // ── loading prop + slot ───────────────────────────
  it('renders loading slot when loading is true', () => {
    const wrapper = createTable({
      loading: true,
      loadingSlot: 'Loading...',
    })
    const loadingTd = wrapper.find('tbody td')
    expect(loadingTd.exists()).toBe(true)
    expect(loadingTd.text()).toBe('Loading...')
    expect(loadingTd.classes()).toContain('slot-table-loading')
    expect(loadingTd.attributes('colspan')).toBe('2')
  })

  it('renders rows normally when loading is false', () => {
    const wrapper = createTable({
      loading: false,
      loadingSlot: 'Loading...',
    })
    expect(wrapper.find('.slot-table-loading').exists()).toBe(false)
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('loading takes priority over empty', () => {
    const wrapper = createTable({
      rows: [],
      loading: true,
      loadingSlot: 'Loading...',
      emptySlot: 'No data',
    })
    expect(wrapper.find('.slot-table-loading').exists()).toBe(true)
    expect(wrapper.find('.slot-table-empty').exists()).toBe(false)
  })

  // ── stickyHeader prop ─────────────────────────────
  it('adds sticky-header class to thead when stickyHeader is true', () => {
    const wrapper = createTable({ stickyHeader: true })
    expect(wrapper.find('thead').classes()).toContain('slot-table-sticky-header')
  })

  it('does not add sticky-header class by default', () => {
    const wrapper = createTable()
    expect(wrapper.find('thead').classes()).not.toContain('slot-table-sticky-header')
  })

  // ── caption prop ──────────────────────────────────
  it('renders a caption element when caption prop is set', () => {
    const wrapper = createTable({ caption: 'Employee Directory' })
    const caption = wrapper.find('caption')
    expect(caption.exists()).toBe(true)
    expect(caption.text()).toBe('Employee Directory')
    expect(caption.classes()).toContain('slot-table-caption')
  })

  it('does not render caption when prop is empty', () => {
    const wrapper = createTable()
    expect(wrapper.find('caption').exists()).toBe(false)
  })

  // ── cell-click event ──────────────────────────────
  it('emits cell-click with rowIndex, columnIndex, and row when a cell is clicked', async () => {
    const wrapper = createTable()
    await wrapper.findAll('tbody td')[1].trigger('click')
    expect(wrapper.emitted('cell-click')).toBeTruthy()
    expect(wrapper.emitted('cell-click')![0]).toEqual([0, 1, { id: 1, name: 'Alice', age: 28 }])
  })

  // ── tdClass and thClass props ─────────────────────
  it('applies thClass to header cells', () => {
    const wrapper = createTable({
      thClass: { 0: 'custom-th' },
    })
    expect(wrapper.findAll('thead th')[0].classes()).toContain('custom-th')
    expect(wrapper.findAll('thead th')[1].classes()).not.toContain('custom-th')
  })

  it('applies tdClass to body cells', () => {
    const wrapper = createTable({
      tdClass: { 0: 'custom-td' },
    })
    const firstRowCells = wrapper.findAll('tbody tr:first-child td')
    expect(firstRowCells[0].classes()).toContain('custom-td')
    expect(firstRowCells[1].classes()).not.toContain('custom-td')
  })

  it('applies tdClass as an object to body cells', () => {
    const wrapper = createTable({
      tdClass: { 0: { 'highlight': true, 'dimmed': false } },
    })
    const firstCell = wrapper.findAll('tbody tr:first-child td')[0]
    expect(firstCell.classes()).toContain('highlight')
    expect(firstCell.classes()).not.toContain('dimmed')
  })
})
