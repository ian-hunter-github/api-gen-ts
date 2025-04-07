import { useState } from 'react';
import { EntityAttribute } from '../types/entities/attributes';
import './AttributeList.css';

interface AttributeListProps {
  attributes: EntityAttribute[];
  onAdd: (attribute: EntityAttribute) => void;
  onEdit: (attribute: EntityAttribute) => void;
  onDelete: (attributeName: string) => void;
}

export const AttributeList = ({ 
  attributes, 
  onAdd, 
  onEdit, 
  onDelete 
}: AttributeListProps) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const sortedAttributes = [...attributes].sort((a, b) => {
    if (a.name < b.name) return sortDirection === 'asc' ? -1 : 1;
    if (a.name > b.name) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="attribute-list">
      <div className="attribute-list-header">
        <h3>Attributes</h3>
        <button 
          className="add-button" 
          onClick={() => onAdd({
            name: '',
            type: 'string',
            required: false
          })}
        >
          +
        </button>
      </div>
      
      <div className="attribute-table-container">
        <table className="attribute-table">
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
              <th>Type</th>
              <th>Required</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {sortedAttributes.map((attr) => (
              <tr key={attr.name}>
                <td data-testid="attribute-name">{attr.name}</td>
                <td>{attr.type}</td>
                <td>{attr.required ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => onEdit(attr)}>Edit</button>
                </td>
                <td>
                  <button 
                    onClick={() => onDelete(attr.name)}
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
