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
    rowKey: {
      type: [String, Function],
      default: undefined,
    },
    rowClass: {
      type: [String, Object, Function],
      default: undefined,
    },
    striped: {
      type: Boolean,
      default: false,
    },
    hoverable: {
      type: Boolean,
      default: false,
    },
    bordered: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['row-click', 'header-click'],
  setup(props, { slots, emit }) {
    function getColumnStyle(colProps) {
      const style = {}
      if (colProps.width) style.width = colProps.width
      if (colProps['min-width'] || colProps.minWidth) {
        style.minWidth = colProps['min-width'] || colProps.minWidth
      }
      return Object.keys(style).length > 0 ? style : undefined
    }

    function getColumnClasses(colProps) {
      const sticky = colProps.sticky || ''
      const align = colProps.align || ''
      return {
        'sticky-left': sticky === 'left',
        'sticky-right': sticky === 'right',
        'align-left': align === 'left',
        'align-center': align === 'center',
        'align-right': align === 'right',
      }
    }

    function getRowKey(row, rowIndex) {
      if (!props.rowKey) return rowIndex
      if (typeof props.rowKey === 'function') return props.rowKey(row, rowIndex)
      return row[props.rowKey]
    }

    function getRowClass(row, rowIndex) {
      const classes = {}
      if (props.striped && rowIndex % 2 === 1) {
        classes['slot-table-striped'] = true
      }
      if (props.hoverable) {
        classes['slot-table-hoverable'] = true
      }
      if (!props.rowClass) return classes
      if (typeof props.rowClass === 'function') {
        const result = props.rowClass(row, rowIndex)
        if (typeof result === 'string') {
          classes[result] = true
        } else if (typeof result === 'object') {
          Object.assign(classes, result)
        }
      } else if (typeof props.rowClass === 'string') {
        classes[props.rowClass] = true
      } else {
        Object.assign(classes, props.rowClass)
      }
      return classes
    }

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
      const headerCells = columns.map((col, columnIndex) => {
        const colProps = col.props || {}
        const classes = getColumnClasses(colProps)
        const style = getColumnStyle(colProps)

        const headerSlot = col.children && col.children.header
        const headerContent = typeof headerSlot === 'function' ? headerSlot() : null

        return h('th', {
          class: classes,
          style,
          onClick: () => emit('header-click', columnIndex),
        }, headerContent)
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

      // Build tbody — handle empty state
      let tbody
      if (props.rows.length === 0 && slots.empty) {
        const emptyRow = h('tr', null, [
          h('td', { colspan: columns.length, class: 'slot-table-empty' }, slots.empty()),
        ])
        tbody = h('tbody', null, [emptyRow])
      } else {
        const bodyRows = props.rows.map((row, rowIndex) => {
          const cells = columns.map((col, columnIndex) => {
            const colProps = col.props || {}
            const classes = getColumnClasses(colProps)
            const style = getColumnStyle(colProps)

            const cellSlot = col.children && col.children.cell
            const cellContent = typeof cellSlot === 'function'
              ? cellSlot({ row, rowIndex, columnIndex })
              : null

            return h('td', { class: classes, style }, cellContent)
          })

          return h('tr', {
            key: getRowKey(row, rowIndex),
            class: getRowClass(row, rowIndex),
            onClick: () => emit('row-click', rowIndex, row),
          }, cells)
        })

        tbody = h('tbody', null, bodyRows)
      }

      const tableClasses = {
        [props.tableClass]: !!props.tableClass,
        'slot-table-bordered': props.bordered,
      }

      return h('table', { class: tableClasses }, [thead, tbody])
    }
  },
})
</script>

<style>
.sticky-left {
  position: sticky;
  left: 0;
  z-index: 1;
}

.sticky-right {
  position: sticky;
  right: 0;
  z-index: 1;
}

.align-left { text-align: left; }
.align-center { text-align: center; }
.align-right { text-align: right; }
</style>
