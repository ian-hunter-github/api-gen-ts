import React, { useMemo } from 'react';
import { Model } from '../../../utils/Model';
import { Header } from '../Header/Header';
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

  // Calculate grid templates for header and body
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

  interface HeaderData extends Record<string, unknown> {
    id: string;
    [key: `header${number}`]: string; // Replace ColumnType with actual type
  }
  
  const headerData: HeaderData = {id: "header-row"};
  visibleColumns.forEach((col, index) => {
    const colName = `header${index + 1}` as const;
    headerData[colName] = String(col).charAt(0).toUpperCase() + String(col).slice(1);
  });

  // Add empty action column header if action handlers exist
  if (onEdit || onDelete || onUndo || onRedo) {
    const actionColName = `header${visibleColumns.length + 1}` as const;
    headerData[actionColName] = "";
  }

  const headerModel = new Model<HeaderData>(headerData);

  return (
    <div 
      className="table-container" 
      role="table" 
      aria-label="Data table" 
      data-testid="attribute-table"
      key={models.length + models.filter(m => m.status === 'deleted').length}
    >
      <div role="rowgroup" aria-label="Table header">
        <Header
          key={headerModel.id}
          model={headerModel}
          gridTemplateColumns={headerGridTemplate}
          actionButtonsContent={"Actions"}
          data-testid="attribute-row-header"
        />
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
