import React, { useState, useCallback, useMemo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { ApiConfigFormPanel } from './ApiConfigFormPanel.tsx';
import { JsonEditorPanel } from './JsonEditorPanel';
import { EntityDialog } from '../EntityDialog/EntityDialog';
import { debounce } from '../../utils/debounce';
import type { ApiEntity } from '../../types/entities/entity';
import type { ApiConfig } from '../../types/api.types';
import './ApiConfigEditor.css';

interface ApiConfigEditorContainerProps {
  config: ApiConfig;
  onSave: (updatedConfig: ApiConfig) => void;
  allConfigs: ApiConfig[];
}

export const ApiConfigEditorContainer: React.FC<ApiConfigEditorContainerProps> = ({ 
  config: initialConfig,
  onSave,
  allConfigs
}) => {
  const [config, setConfig] = useState<ApiConfig>(initialConfig);
  const [changes, setChanges] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [editMode, setEditMode] = useState<boolean>(false);
  const [editingEntity, setEditingEntity] = useState<ApiEntity | null>(null);
  const [isEntityDialogOpen, setIsEntityDialogOpen] = useState(false);

  const validateConfig = useCallback((currentConfig: ApiConfig) => {
    const newErrors = new Set<string>();
    const isDuplicate = allConfigs.some(c => 
      c.id !== currentConfig.id && 
      c.name === currentConfig.name && 
      c.version === currentConfig.version
    );
    
    if (isDuplicate) {
      newErrors.add('name');
      newErrors.add('version');
    }
    setErrors(newErrors);
    return newErrors.size === 0;
  }, [allConfigs]);

  const debouncedValidate = useMemo(
    () => debounce(validateConfig, 300),
    [validateConfig]
  );

  const memoizedConfig = useMemo(() => config, [JSON.stringify(config)]);

  const handleChange = (name: string, value: string) => {
    const updatedConfig = {...config, [name]: value};
    setConfig(updatedConfig);
    setChanges(prev => new Set(prev).add(name));
    debouncedValidate(updatedConfig);
    
    if (name === 'name') {
      onSave(updatedConfig);
    }
  };

  const handleEntityAction = (action: 'add'|'edit'|'delete', entity?: ApiEntity) => {
    if (action === 'add') {
      const newEntity = {
        name: `NewEntity${(config.entities?.length || 0) + 1}`,
        attributes: [],
        endpoints: []
      };
      setConfig({
        ...config,
        entities: [...(config.entities || []), newEntity]
      });
      setChanges(prev => new Set(prev).add('entities'));
    } else if (action === 'edit' && entity) {
      setEditingEntity(entity);
      setIsEntityDialogOpen(true);
    } else if (action === 'delete' && entity) {
      setConfig({
        ...config,
        entities: (config.entities || []).filter(e => e.name !== entity.name)
      });
      setChanges(prev => new Set(prev).add('entities'));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateConfig(config)) {
      onSave(config);
      setChanges(new Set());
    }
  };

  const handleEntityDialogSave = (updatedEntity: ApiEntity) => {
    setConfig({
      ...config,
      entities: (config.entities || []).map(e => 
        e.name === updatedEntity.name ? updatedEntity : e
      )
    });
    setChanges(prev => new Set(prev).add('entities'));
    setIsEntityDialogOpen(false);
    setEditingEntity(null);
  };

  return (
    <div className="api-config-editor">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={50} minSize={30}>
          <ApiConfigFormPanel
            config={config}
            changes={changes}
            errors={errors}
            onFieldChange={handleChange}
            onEntityAction={handleEntityAction}
            onSubmit={handleSubmit}
          />
        </Panel>
        <PanelResizeHandle className="resize-handle" />
        <Panel defaultSize={50} minSize={30}>
          <JsonEditorPanel
            config={memoizedConfig}
            editMode={editMode}
            onToggleEditMode={() => setEditMode(!editMode)}
            onConfigChange={(updatedConfig) => {
              setConfig(updatedConfig);
              setChanges(prev => new Set(prev).add('json'));
              validateConfig(updatedConfig);
              if ('name' in updatedConfig) {
                onSave(updatedConfig);
              }
            }}
          />
        </Panel>
      </PanelGroup>

      {editingEntity && (
        <EntityDialog
          entity={editingEntity}
          open={isEntityDialogOpen}
          onSave={handleEntityDialogSave}
          onCancel={() => {
            setIsEntityDialogOpen(false);
            setEditingEntity(null);
          }}
          onClose={() => {
            setIsEntityDialogOpen(false);
            setEditingEntity(null);
          }}
        />
      )}
    </div>
  );
};
