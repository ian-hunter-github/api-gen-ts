import React from 'react';
import ReactJson, { InteractionProps } from 'react-json-view';
import type { ApiConfig } from '../../types/api.types';

interface JsonEditorPanelProps {
  config: ApiConfig;
  editMode: boolean;
  onToggleEditMode: () => void;
  onConfigChange: (updatedConfig: ApiConfig) => void;
}

export const JsonEditorPanel: React.FC<JsonEditorPanelProps> = ({
  config,
  editMode,
  onToggleEditMode,
  onConfigChange
}) => {
  const handleEdit = (edit: InteractionProps) => {
    try {
      const updatedConfig = JSON.parse(JSON.stringify(edit.updated_src));
      onConfigChange(updatedConfig);
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };
  return (
    <div className="json-panel">
      <div className="json-controls">
        <button 
          className={`mode-toggle ${editMode ? 'edit-active' : 'view-active'}`}
          onClick={onToggleEditMode}
        >
          {editMode ? '✏️ Editing JSON' : '👁️ Viewing JSON'}
        </button>
      </div>
      <ReactJson
        src={config}
        name={false}
        theme="summerfruit:inverted"
        displayDataTypes={false}
        enableClipboard={false}
        collapsed={1}
        collapseStringsAfterLength={50}
        onEdit={editMode ? handleEdit : false}
        style={{
          backgroundColor: 'transparent',
          fontSize: '14px',
          fontFamily: 'monospace'
        }}
      />
    </div>
  );
};
