import { DefineComponent } from 'vue'

export interface CellSlotScope<T = any> {
  row: T
  rowIndex: number
  columnIndex: number
}

export interface SlotTableProps {
  rows: any[]
  tableClass?: string
}

export interface SlotTableColumnProps {
  sticky?: '' | 'left' | 'right'
}

export interface SlotTableColumnGroupProps {
  sticky?: '' | 'left' | 'right'
  colspan?: number
}

export declare const SlotTable: DefineComponent<SlotTableProps>
export declare const SlotTableColumn: DefineComponent<SlotTableColumnProps>
export declare const SlotTableColumnGroup: DefineComponent<SlotTableColumnGroupProps>
