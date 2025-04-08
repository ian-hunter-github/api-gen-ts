import React, { useState, memo } from 'react';
import type { ApiEntity } from '../types/entities/entity';
import './EntityList.css';

interface EntityListProps {
  entities: ApiEntity[];
  onSelect: (entity: ApiEntity) => void;
  onAdd: () => void;
  onEdit: (entity: ApiEntity) => void;
  onDelete: (entityName: string) => void;
  selectedEntity?: ApiEntity;
  changedEntities: Set<string>;
}

const EntityListComponent: React.FC<EntityListProps> = ({
  entities,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  selectedEntity,
  changedEntities
}) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortedEntities = [...entities].sort((a, b) => {
    if (a.name < b.name) return sortDirection === 'asc' ? -1 : 1;
    if (a.name > b.name) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="entity-list">
      <div className="entity-list-header">
        <h3>Entities</h3>
        <button 
          className="add-button" 
          onClick={onAdd}
        >
          +
        </button>
      </div>
      
      <div className="entity-table-container">
        <table className="entity-table">
          <thead>
            <tr>
              <th>
                Name
                <button 
                  className="sort-button"
                  onClick={toggleSort}
                  aria-label={`Sort ${sortDirection === 'asc' ? 'descending' : 'ascending'}`}
                >
                  {sortDirection === 'asc' ? '↑' : '↓'}
                </button>
              </th>
              <th>Description</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {sortedEntities.map((entity) => (
              <tr 
                key={entity.name} 
                onClick={() => onSelect(entity)}
                className={`${selectedEntity?.name === entity.name ? 'selected' : ''} ${
                  changedEntities.has(entity.name) ? 'changed' : ''
                }`}
              >
                <td data-testid="entity-name">{entity.name}</td>
                <td>{entity.description || '-'}</td>
                <td>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    onEdit(entity);
                  }}>Edit</button>
                </td>
                <td>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(entity.name);
                    }}
                    aria-label="Delete"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const areEqual = (prevProps: EntityListProps, nextProps: EntityListProps) => {
  return (
    prevProps.entities.length === nextProps.entities.length &&
    prevProps.entities.every((entity, i) => 
      entity.name === nextProps.entities[i].name
    )
  );
};

export const EntityList = memo(EntityListComponent, areEqual);
export const MemoizedEntityList = EntityList;
