import React from 'react';
import type { EntityAttribute } from '../../types/entities/attributes';
import { Model } from '../../utils/Model';
import { Row } from './Row';
import './AttributeRowView.css';

interface AttributeRowViewProps {
  model: Model<EntityAttribute>;
  onEdit: (model: Model<EntityAttribute>) => void;
  onDelete: (model: Model<EntityAttribute>) => void;
  onUndo: (model: Model<EntityAttribute>) => void;
  onRedo: (model: Model<EntityAttribute>) => void;
  deleted: boolean;
  changed: boolean;
}

const renderText = (text: string | boolean | undefined) => {
  if (text === undefined || text === null) return '';
  return typeof text === 'boolean' ? (text ? 'Yes' : 'No') : text;
};

const renderAttributeCells = (attr: EntityAttribute | null) => {
  if (!attr) {
    return [
      <div key="name">-</div>,
      <div key="type">-</div>,
      <div key="required">-</div>
    ];
  }

  return [
    <div key="name" data-testid={`attribute-name-${attr.name}`}>
      {renderText(attr.name)}
    </div>,
    <div key="type">{renderText(attr.type)}</div>,
    <div key="required">{renderText(attr.required)}</div>
  ];
};

export const AttributeRowView: React.FC<AttributeRowViewProps> = ({
  model,
  onEdit,
  onDelete,
  onUndo,
  onRedo,
  deleted,
  changed,
}) => {
  return (
    <Row
      model={model}
      onEdit={onEdit}
      onDelete={onDelete}
      onUndo={onUndo}
      onRedo={onRedo}
      deleted={deleted}
      changed={changed}
      renderCellContent={renderAttributeCells}
    />
  );
};
