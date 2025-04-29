import React from 'react';
import { ActionButtons } from '../common/ActionButtons/ActionButtons';
import { Model } from '../../utils/Model';
import { MemoizedEntityList } from '../EntityList/EntityList';
import type { ApiConfig } from '../../types/api.types';
import type { ApiEntity } from '../../types/entities/entity';

interface ApiConfigFormProps {
  config: ApiConfig;
  changes: Set<string>;
  errors: Set<string>;
  onFieldChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onEntityAction: (action: 'add'|'edit'|'delete', entity?: ApiEntity) => void;
}

export const ApiConfigForm: React.FC<ApiConfigFormProps> = ({
  config,
  changes,
  errors,
  onFieldChange,
  onSubmit,
  onEntityAction
}) => {
  const model = new Model(config);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFieldChange(name, value);
  };

  return (
    <div className="api-config-form">
      <div className="form-group">
        <label htmlFor="name">API Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={config.name || ''}
          onChange={handleChange}
          className={errors.has('name') ? 'error' : ''}
        />
        {errors.has('name') && (
          <span className="error-message">
            API with this name and version already exists
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="version">Version</label>
        <input
          type="text"
          id="version"
          name="version"
          value={config.version || ''}
          onChange={handleChange}
          className={errors.has('version') ? 'error' : ''}
        />
        {errors.has('version') && (
          <span className="error-message">
            API with this name and version already exists
          </span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          name="description"
          value={config.description || ''}
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="baseUrl">Base URL</label>
        <input
          type="text"
          id="baseUrl"
          name="endpoints.baseUrl"
          value={config.endpoints?.baseUrl || ''}
          onChange={handleChange}
        />
      </div>

      <ActionButtons
        model={model}
        onEdit={() => {
          if (changes.size > 0) {
            // Save changes
            model.update(config);
          }
        }}
        onDelete={() => {
          if (confirm('Are you sure you want to delete this API configuration?')) {
            model.delete();
          }
        }}
        onUndo={model.canUndo ? () => model.undo() : undefined}
        onRedo={model.canRedo ? () => model.redo() : undefined}
      />

      <MemoizedEntityList
        key={`${config.id}-${config.entities?.length || 0}-${Date.now()}`}
        entities={config.entities || []}
        onSelect={(entity: ApiEntity) => console.log('Selected entity:', entity)}
        onAdd={() => onEntityAction('add')}
        onEdit={(entity: ApiEntity) => onEntityAction('edit', entity)}
        onDelete={(entityName: string) => onEntityAction('delete', {name: entityName} as ApiEntity)}
        changedEntities={new Set(
          changes.has('entities') 
            ? config.entities?.map(e => e.name) || []
            : []
        )}
      />

      <div className="editor-actions">
        <button
          type="submit"
          className="primary-button"
          disabled={changes.size === 0 || errors.size > 0}
          onClick={onSubmit}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};
