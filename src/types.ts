export interface CellSlotScope<T = any> {
  row: T
  rowIndex: number
  columnIndex: number
}

export interface SlotTableProps {
  rows: any[]
  tableClass?: string
  rowKey?: string | ((row: any, index: number) => string | number)
  rowClass?: string | Record<string, boolean> | ((row: any, index: number) => string | Record<string, boolean>)
  striped?: boolean
  hoverable?: boolean
  bordered?: boolean
  loading?: boolean
  stickyHeader?: boolean
  caption?: string
}

export interface SlotTableColumnProps {
  sticky?: '' | 'left' | 'right'
  align?: '' | 'left' | 'center' | 'right'
  width?: string
  minWidth?: string
  visible?: boolean
  tdClass?: string | Record<string, boolean>
  thClass?: string | Record<string, boolean>
}

export interface SlotTableColumnGroupProps {
  sticky?: '' | 'left' | 'right'
  colspan?: number
}
