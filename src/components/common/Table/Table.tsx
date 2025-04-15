import React, { useState } from 'react';
import { Model } from '../../../utils/Model';
import { AttributeDialog } from '../../AttributeDialog/AttributeDialog';
import { Row } from '../Row/Row';
import type { EntityAttribute } from '../../../types/entities/attributes';
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
  existingNames = [],
  showAttributeDialog = false,
}: TableProps<T>) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = (model: Model<T>) => {
    setIsDialogOpen(false);
    onEdit?.(model);
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
  };

  if (models.length === 0) {
    return <div className="table-empty">No data available</div>;
  }

  // Get headers from metadata or all models' combined keys
  const headers = metadata?.visibleColumns || 
    Array.from(
      new Set(
        models.flatMap(model => 
          Object.keys(model.current || {})
            .filter(key => key !== 'id')
        )
      )
    );


  return (
    <div 
      className="table-container" 
      role="table" 
      aria-label="Data table" 
      data-testid="attribute-table"
      key={models.length + models.filter(m => m.status === 'deleted').length} // Force re-render when models or deletions change
    >
      <div className="table-header" role="rowgroup">
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
      <div className="table-body" role="rowgroup">
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
          />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {isDialogOpen && showAttributeDialog && (
        <AttributeDialog
          attribute={{} as Model<EntityAttribute>}
          existingNames={existingNames}
          onSave={handleSave as unknown as (model: Model<EntityAttribute>) => void}
          onCancel={handleCancel}
          open={isDialogOpen}
        />
      )}
    </>
  );
}
