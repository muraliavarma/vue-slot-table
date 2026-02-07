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
    loading: {
      type: Boolean,
      default: false,
    },
    stickyHeader: {
      type: Boolean,
      default: false,
    },
    caption: {
      type: String,
      default: '',
    },
  },
  emits: ['row-click', 'header-click', 'cell-click'],
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

    function mergeClasses(baseClasses, extraClass) {
      if (!extraClass) return baseClasses
      if (typeof extraClass === 'string') {
        return { ...baseClasses, [extraClass]: true }
      }
      return { ...baseClasses, ...extraClass }
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

    function isColumnVisible(colProps) {
      // visible can be a boolean prop — default true
      // When using kebab-case in template, Vue normalizes to camelCase
      const vis = colProps.visible
      // If not specified, default to visible
      if (vis === undefined || vis === '' || vis === true) return true
      return !!vis
    }

    return () => {
      const children = slots.default ? slots.default() : []

      const allColumns = []
      const columnGroups = []

      children.forEach((vnode) => {
        if (vnode.type === SlotTableColumn) {
          allColumns.push(vnode)
        } else if (vnode.type === SlotTableColumnGroup) {
          columnGroups.push(vnode)
        }
      })

      // Filter to visible columns only
      const columns = allColumns.filter((col) => isColumnVisible(col.props || {}))

      // Build caption
      const captionEl = props.caption
        ? h('caption', { class: 'slot-table-caption' }, props.caption)
        : null

      // Build header cells
      const headerCells = columns.map((col, columnIndex) => {
        const colProps = col.props || {}
        const baseClasses = getColumnClasses(colProps)
        const classes = mergeClasses(baseClasses, colProps.thClass || colProps['th-class'])
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
      const theadClasses = props.stickyHeader ? { 'slot-table-sticky-header': true } : undefined
      const thead = h('thead', { class: theadClasses }, headerRows)

      // Build tbody — handle empty/loading states
      let tbody
      if (props.loading && slots.loading) {
        const loadingRow = h('tr', null, [
          h('td', { colspan: columns.length, class: 'slot-table-loading' }, slots.loading()),
        ])
        tbody = h('tbody', null, [loadingRow])
      } else if (props.rows.length === 0 && slots.empty) {
        const emptyRow = h('tr', null, [
          h('td', { colspan: columns.length, class: 'slot-table-empty' }, slots.empty()),
        ])
        tbody = h('tbody', null, [emptyRow])
      } else {
        const bodyRows = props.rows.map((row, rowIndex) => {
          const cells = columns.map((col, columnIndex) => {
            const colProps = col.props || {}
            const baseClasses = getColumnClasses(colProps)
            const classes = mergeClasses(baseClasses, colProps.tdClass || colProps['td-class'])
            const style = getColumnStyle(colProps)

            const cellSlot = col.children && col.children.cell
            const cellContent = typeof cellSlot === 'function'
              ? cellSlot({ row, rowIndex, columnIndex })
              : null

            return h('td', {
              class: classes,
              style,
              onClick: () => emit('cell-click', rowIndex, columnIndex, row),
            }, cellContent)
          })

          return h('tr', {
            key: getRowKey(row, rowIndex),
            class: getRowClass(row, rowIndex),
            onClick: () => emit('row-click', rowIndex, row),
          }, cells)
        })

        tbody = h('tbody', null, bodyRows)
      }

      // Build tfoot from column #footer slots
      const footerCells = columns.map((col, columnIndex) => {
        const colProps = col.props || {}
        const baseClasses = getColumnClasses(colProps)
        const classes = mergeClasses(baseClasses, colProps.tdClass || colProps['td-class'])
        const style = getColumnStyle(colProps)

        const footerSlot = col.children && col.children.footer
        const footerContent = typeof footerSlot === 'function' ? footerSlot() : null

        return h('td', { class: classes, style }, footerContent)
      })

      const hasFooter = footerCells.some((cell) => {
        // Check if any footer cell has content
        return cell.children !== null
      })
      const tfoot = hasFooter
        ? h('tfoot', null, [h('tr', null, footerCells)])
        : null

      const tableClasses = {
        [props.tableClass]: !!props.tableClass,
        'slot-table-bordered': props.bordered,
      }

      const tableChildren = [captionEl, thead, tbody, tfoot].filter(Boolean)
      return h('table', { class: tableClasses }, tableChildren)
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

.slot-table-sticky-header th {
  position: sticky;
  top: 0;
  z-index: 2;
}

.slot-table-sticky-header .sticky-left,
.slot-table-sticky-header .sticky-right {
  z-index: 3;
}
</style>
