import React, { useMemo } from 'react';
import { Model } from '../../../utils/Model';
import { Row } from '../Row/Row';
import './Table.css';

export interface TableMetadata<T> {
  visibleColumns: Array<keyof T>;
  columnWidths?: Partial<Record<keyof T, string>>;
  columnFormatters?: Partial<Record<keyof T, (value: unknown) => React.ReactNode>> & {
    [key: string]: (value: unknown) => React.ReactNode;
  };
}

export interface TableProps<T extends Record<string, unknown>> {
  showAttributeDialog?: boolean;
  models: Array<Model<T>>;
  metadata?: TableMetadata<T>;
  onEdit?: (model: Model<T>) => void;
  onDelete?: (model: Model<T>) => void;
  onUndo?: (model: Model<T>) => void;
  onRedo?: (model: Model<T>) => void;
  renderCellContent?: (value: T | null) => React.ReactNode[];
  existingNames?: string[];
}

export function Table<T extends Record<string, unknown>>({
  models,
  metadata,
  onEdit,
  onDelete,
  onUndo,
  onRedo,
  renderCellContent,
}: TableProps<T>) {

  // Calculate visible columns and grid template in one pass
  const { visibleColumns, headerGridTemplate, bodyGridTemplate } = useMemo(() => {
    if (models.length === 0) {
      return { visibleColumns: [], gridTemplateColumns: '' };
    }

    const visibleColumns = metadata?.visibleColumns || 
      Array.from(
        new Set(
          models.flatMap(model => 
            Object.keys(model.current || {})
              .filter(key => key !== 'id')
          )
        )
      );
    
    // Header uses fixed 182px width, data rows use 1fr
    const headerGridTemplate = [
      ...visibleColumns.map(() => '1fr'), // '182px'),
      '1fr' //'182px'
    ].join(' ');
    
    const bodyGridTemplate = [
      ...visibleColumns.map(() => '1fr'),
      '1fr'
    ].join(' ');

    return { 
      visibleColumns, 
      headerGridTemplate, 
      bodyGridTemplate 
    };
  }, [models, metadata]);

  if (models.length === 0) {
    return <div className="table-empty">No data available</div>;
  }

  const headers = visibleColumns;


  return (
    <div 
      className="table-container" 
      role="table" 
      aria-label="Data table" 
      data-testid="attribute-table"
      key={models.length + models.filter(m => m.status === 'deleted').length} // Force re-render when models or deletions change
    >
      <div 
        className="table-header" 
        role="rowgroup"
        style={{ gridTemplateColumns: headerGridTemplate }}
      >
        {headers.map((header) => {
          const headerStr = String(header);
          return (
            <div className="table-header-cell" key={headerStr} role="columnheader">
              {headerStr.charAt(0).toUpperCase() + headerStr.slice(1)}
            </div>
          );
        })}
        {(onEdit || onDelete || onUndo || onRedo) && (
          <div className="table-header-cell" role="columnheader"></div>
        )}
      </div>
      <div 
        className="table-body" 
        role="rowgroup"
        style={{ gridTemplateColumns: bodyGridTemplate }}
      >
        {models.map((model) => (
            <Row
              key={model.id}
              model={model}
              onEdit={onEdit}
              onDelete={onDelete}
              onUndo={onUndo}
              onRedo={onRedo}
              renderCellContent={renderCellContent}
              metadata={metadata}
              data-testid="attribute-row"
              gridTemplateColumns={bodyGridTemplate}
            />
        ))}
      </div>
    </div>
  );
}
