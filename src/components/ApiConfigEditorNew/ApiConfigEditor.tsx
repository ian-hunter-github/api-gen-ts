import React, { useState, useCallback, useMemo, memo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { JsonEditorPanel } from './JsonEditorPanel';
import { debounce } from '../../utils/debounce';
import type { ApiEntity } from '../../types.ORIG/entities/entity';
import type { ApiConfig } from '../../types.ORIG/api.types';
import './ApiConfigEditor.css';
import { ApiConfigFormPanel } from './ApiConfigFormPanel';

const InputField = memo(({
  name,
  value,
  onChange,
  label,
  type = 'text',
  required = false,
  changed = false,
  error = false,
  errorMessage = ''
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  type?: string;
  required?: boolean;
  changed?: boolean;
  error?: boolean;
  errorMessage?: string;
}) => (
  <div className={`form-group ${changed ? 'changed' : ''} ${error ? 'error' : ''}`}>
    <label htmlFor={name}>{label}</label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    />
    {error && <div className="error-message">{errorMessage}</div>}
  </div>
));

const TextAreaField = memo(({
  name,
  value,
  onChange,
  label,
  changed = false
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
  changed?: boolean;
}) => (
  <div className={`form-group ${changed ? 'changed' : ''}`}>
    <label htmlFor={name}>{label}</label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
    />
  </div>
));

interface ApiConfigEditorProps {
  config: ApiConfig;
  onSave: (updatedConfig: ApiConfig) => void;
  allConfigs: ApiConfig[];
}

export const ApiConfigEditor: React.FC<ApiConfigEditorProps> = ({ 
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedConfig = {...config, [name]: value};
    setConfig(updatedConfig);
    setChanges(prev => new Set(prev).add(name));
    debouncedValidate(updatedConfig);
    
    // Update tab title immediately when name changes
    if (name === 'name') {
      onSave(updatedConfig);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateConfig(config)) {
      onSave(config);
      setChanges(new Set());
    }
  };

  return (
    <div className="api-config-editor">
      <PanelGroup direction="horizontal">
        <ApiConfigFormPanel
          config={}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onToggleEditMode={() => setEditMode(!editMode)}
          onEntityAction={handleEntityAction}
          onEntityDialogOpen={() => setIsEntityDialogOpen(true)}
          onEntityDialogClose={() => setIsEntityDialogOpen(false)}
          onEntityEdit={setEditingEntity}
          onEntityDelete={setEditingEntity}
        />
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


    </div>
  );
};
