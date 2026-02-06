import { DefineComponent } from 'vue'

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
}

export interface SlotTableColumnProps {
  sticky?: '' | 'left' | 'right'
  align?: '' | 'left' | 'center' | 'right'
  width?: string
  minWidth?: string
}

export interface SlotTableColumnGroupProps {
  sticky?: '' | 'left' | 'right'
  colspan?: number
}

export declare const SlotTable: DefineComponent<SlotTableProps>
export declare const SlotTableColumn: DefineComponent<SlotTableColumnProps>
export declare const SlotTableColumnGroup: DefineComponent<SlotTableColumnGroupProps>
