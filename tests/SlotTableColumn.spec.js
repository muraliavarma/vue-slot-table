import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import { SlotTable, SlotTableColumn } from '@/index.js'

function createTableWithColumns(columnConfigs) {
  return mount(SlotTable, {
    props: {
      rows: [{ val: 'test' }],
    },
    slots: {
      default: () =>
        columnConfigs.map((col) =>
          h(SlotTableColumn, {
            sticky: col.sticky,
            align: col.align,
            width: col.width,
            minWidth: col.minWidth,
          }, {
            header: () => col.header,
            cell: ({ row }) => row.val,
          })
        ),
    },
  })
}

describe('SlotTableColumn', () => {
  it('passes header slot content through to the table header', () => {
    const wrapper = createTableWithColumns([
      { header: 'My Header' },
    ])
    expect(wrapper.find('thead th').text()).toBe('My Header')
  })

  it('passes cell slot content through to the table cells', () => {
    const wrapper = createTableWithColumns([
      { header: 'Col' },
    ])
    expect(wrapper.find('tbody td').text()).toBe('test')
  })

  it('applies sticky-left class when sticky="left"', () => {
    const wrapper = createTableWithColumns([
      { header: 'Sticky', sticky: 'left' },
    ])
    expect(wrapper.find('thead th').classes()).toContain('sticky-left')
    expect(wrapper.find('tbody td').classes()).toContain('sticky-left')
  })

  it('applies sticky-right class when sticky="right"', () => {
    const wrapper = createTableWithColumns([
      { header: 'Sticky', sticky: 'right' },
    ])
    expect(wrapper.find('thead th').classes()).toContain('sticky-right')
    expect(wrapper.find('tbody td').classes()).toContain('sticky-right')
  })

  it('applies no sticky class when sticky is not set', () => {
    const wrapper = createTableWithColumns([
      { header: 'Normal' },
    ])
    const th = wrapper.find('thead th')
    expect(th.classes()).not.toContain('sticky-left')
    expect(th.classes()).not.toContain('sticky-right')
  })

  it('applies align-center class', () => {
    const wrapper = createTableWithColumns([
      { header: 'Centered', align: 'center' },
    ])
    expect(wrapper.find('thead th').classes()).toContain('align-center')
    expect(wrapper.find('tbody td').classes()).toContain('align-center')
  })

  it('applies width style', () => {
    const wrapper = createTableWithColumns([
      { header: 'Fixed', width: '150px' },
    ])
    expect(wrapper.find('thead th').attributes('style')).toContain('width: 150px')
  })

  it('applies minWidth style', () => {
    const wrapper = createTableWithColumns([
      { header: 'Min', minWidth: '200px' },
    ])
    expect(wrapper.find('thead th').attributes('style')).toContain('min-width: 200px')
  })
})
