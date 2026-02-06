<script>
import { defineComponent, h } from 'vue'
import SlotTableColumn from './SlotTableColumn.vue'
import SlotTableColumnGroup from './SlotTableColumnGroup.vue'

export default defineComponent({
  name: 'SlotTable',
  props: {
    rows: {
      type: Array,
      required: true,
    },
    tableClass: {
      type: String,
      default: '',
    },
  },
  emits: ['row-click'],
  setup(props, { slots, emit }) {
    return () => {
      const children = slots.default ? slots.default() : []

      const columns = []
      const columnGroups = []

      children.forEach((vnode) => {
        if (vnode.type === SlotTableColumn) {
          columns.push(vnode)
        } else if (vnode.type === SlotTableColumnGroup) {
          columnGroups.push(vnode)
        }
      })

      // Build header cells
      const headerCells = columns.map((col) => {
        const colProps = col.props || {}
        const sticky = colProps.sticky || ''
        const classes = {
          'sticky-left': sticky === 'left',
          'sticky-right': sticky === 'right',
        }

        const headerSlot = col.children && col.children.header
        const headerContent = typeof headerSlot === 'function' ? headerSlot() : null

        return h('th', { class: classes }, headerContent)
      })

      // Build group header row
      const groupHeaderCells = columnGroups.map((group) => {
        const groupProps = group.props || {}
        const sticky = groupProps.sticky || ''
        const colspan = groupProps.colspan ? Number(groupProps.colspan) : undefined
        const classes = {
          'sticky-left': sticky === 'left',
          'sticky-right': sticky === 'right',
        }

        const defaultSlot = group.children && group.children.default
        const content = typeof defaultSlot === 'function' ? defaultSlot() : null

        return h('th', { class: classes, colspan }, content)
      })

      // Build thead
      const headerRows = []
      if (groupHeaderCells.length > 0) {
        headerRows.push(h('tr', null, groupHeaderCells))
      }
      headerRows.push(h('tr', null, headerCells))
      const thead = h('thead', null, headerRows)

      // Build tbody
      const bodyRows = props.rows.map((row, rowIndex) => {
        const cells = columns.map((col, columnIndex) => {
          const colProps = col.props || {}
          const sticky = colProps.sticky || ''
          const classes = {
            'sticky-left': sticky === 'left',
            'sticky-right': sticky === 'right',
          }

          const cellSlot = col.children && col.children.cell
          const cellContent = typeof cellSlot === 'function'
            ? cellSlot({ row, rowIndex, columnIndex })
            : null

          return h('td', { class: classes }, cellContent)
        })

        return h('tr', {
          onClick: () => emit('row-click', rowIndex),
        }, cells)
      })

      const tbody = h('tbody', null, bodyRows)

      return h('table', { class: props.tableClass }, [thead, tbody])
    }
  },
})
</script>

<style>
.sticky-left {
  position: sticky;
  left: 0;
}

.sticky-right {
  position: sticky;
  right: 0;
}
</style>
