import { createContext } from 'react';

type Alignment = 'left' | 'center' | 'right';

export interface ColumnAlignment {
  header?: Alignment;
  content?: Alignment;
  vertical?: 'top' | 'middle' | 'bottom';
}

export interface RowLayout<T> {
  gridTemplate?: string;
  columnWidths?: Partial<Record<keyof T, string>>;
  responsiveBreakpoints?: Record<string, string>;
  alignments?: Partial<Record<keyof T, ColumnAlignment>>;
  defaultAlignment?: ColumnAlignment;
  appendedColumns?: number;
}

export function createRowLayoutContext<T>() {
  const TableContext = createContext<{
    gridTemplate: string;
    getAlignment: (key: keyof T) => Required<ColumnAlignment>;
    updateAppendedColumns?: (count: number) => void;
  }>({
    gridTemplate: '',
    getAlignment: () => ({
      header: 'left',
      content: 'left',
      vertical: 'middle'
    }),
    updateAppendedColumns: () => {}
  });
  return TableContext;
}

export const TableContext = createRowLayoutContext<Record<string, unknown>>();

export function inferDefaultAlignment(value: unknown): Alignment {
  if (typeof value === 'number') return 'right';
  if (typeof value === 'boolean') return 'center';
  return 'left';
}
