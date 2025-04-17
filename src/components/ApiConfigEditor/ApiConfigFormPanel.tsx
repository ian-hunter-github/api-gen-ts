import React from 'react';
import { ApiConfigForm } from './ApiConfigForm';
import type { ApiEntity } from '../../types/entities/entity';
import type { ApiConfig } from '../../types/api.types';

interface ApiConfigFormPanelProps {
  config: ApiConfig;
  changes: Set<string>;
  errors: Set<string>;
  onFieldChange: (name: string, value: string) => void;
  onEntityAction: (action: 'add'|'edit'|'delete', entity?: ApiEntity) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ApiConfigFormPanel: React.FC<ApiConfigFormPanelProps> = ({
  config,
  changes,
  errors,
  onFieldChange,
  onEntityAction,
  onSubmit
}) => {
  return (
    <div className="form-panel">
      <form onSubmit={onSubmit}>
        <ApiConfigForm
          config={config}
          changes={changes}
          errors={errors}
          onFieldChange={onFieldChange}
          onSubmit={onSubmit}
          onEntityAction={onEntityAction}
        />
      </form>
    </div>
  );
};
