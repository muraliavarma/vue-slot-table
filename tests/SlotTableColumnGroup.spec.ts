import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { SlotTable, SlotTableColumn, SlotTableColumnGroup } from '@/index'

interface GroupConfig {
  label: string
  sticky?: string
  colspan?: number
}

interface ColumnConfig {
  header: string
  cell?: (row: any) => any
}

function createTableWithGroups(groups: GroupConfig[], columns: ColumnConfig[] = [{ header: 'Col', cell: () => 'x' }]) {
  return mount(SlotTable, {
    props: {
      rows: [{ val: 'test' }],
    },
    slots: {
      default: () => [
        ...groups.map((group) =>
          h(SlotTableColumnGroup, {
            sticky: group.sticky,
            colspan: group.colspan,
          } as any, { default: () => group.label })
        ),
        ...columns.map((col) =>
          h(SlotTableColumn, {}, {
            header: () => col.header,
            cell: ({ row }: { row: any }) => (col.cell ? col.cell(row) : row.val),
          })
        ),
      ],
    },
  })
}

describe('SlotTableColumnGroup', () => {
  it('renders group header content', () => {
    const wrapper = createTableWithGroups([
      { label: 'Group A', colspan: 1 },
    ])
    const groupRow = wrapper.findAll('thead tr')[0]
    expect(groupRow.find('th').text()).toBe('Group A')
  })

  it('applies colspan attribute', () => {
    const wrapper = createTableWithGroups([
      { label: 'Wide Group', colspan: 3 },
    ])
    const groupTh = wrapper.findAll('thead tr')[0].find('th')
    expect(groupTh.attributes('colspan')).toBe('3')
  })

  it('applies sticky-left class', () => {
    const wrapper = createTableWithGroups([
      { label: 'Sticky', sticky: 'left', colspan: 1 },
    ])
    const groupTh = wrapper.findAll('thead tr')[0].find('th')
    expect(groupTh.classes()).toContain('sticky-left')
  })

  it('applies sticky-right class', () => {
    const wrapper = createTableWithGroups([
      { label: 'Sticky', sticky: 'right', colspan: 1 },
    ])
    const groupTh = wrapper.findAll('thead tr')[0].find('th')
    expect(groupTh.classes()).toContain('sticky-right')
  })

  it('applies no sticky class when sticky is not set', () => {
    const wrapper = createTableWithGroups([
      { label: 'Normal', colspan: 1 },
    ])
    const groupTh = wrapper.findAll('thead tr')[0].find('th')
    expect(groupTh.classes()).not.toContain('sticky-left')
    expect(groupTh.classes()).not.toContain('sticky-right')
  })
})
