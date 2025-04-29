import React from 'react';
import { ApiConfigForm } from '../../components/autoGen/ApiConfig/ApiConfigForm';
import type { ApiConfig } from '../../types/all.types';

interface ApiConfigFormPanelProps {
  config: ApiConfig;
  onSubmit: (data: ApiConfig) => void;
  editMode: boolean;
  onEditModeToggle: () => void;
}

export const ApiConfigFormPanel: React.FC<ApiConfigFormPanelProps> = ({
  config,
  onSubmit,
  editMode,
  onEditModeToggle
}) => {
  return (
    <div className="form-panel">
      <button 
        type="button" 
        onClick={onEditModeToggle}
        className={`edit-mode-toggle ${editMode ? 'active' : ''}`}
      >
        {editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
      </button>
      <div className="form-container">
        <ApiConfigForm
          initialValues={config}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
};
