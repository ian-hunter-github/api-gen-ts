import React, { useState, useCallback, useMemo, memo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { MemoizedEntityList } from '../EntityList/EntityList';
import { EntityDialog } from '../EntityDialog/EntityDialog';
import type { ApiEntity } from '../../types/entities/entity';
import ReactJson, { InteractionProps } from 'react-json-view';
import type { ApiConfig } from '../../types/api.types';
import './ApiConfigEditor.css';

const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(func: F, wait: number) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), wait);
  };
};

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
  const [theme, setTheme] = useState<
    'summerfruit:inverted' | 'monokai' | 'solarized' | 'bright' | 
    'apathy:inverted' | 'ashes' | 'bespin' | 'brewer' | 'chalk' | 'codeschool' |
    'colors' | 'eighties' | 'embers' | 'flat' | 'google' | 'grayscale' | 
    'greenscreen' | 'harmonic' | 'hopscotch' | 'isotope' | 'marrakesh' | 
    'mocha' | 'ocean' | 'paraiso' | 'pop' | 'railscasts' | 
    'rjv-default' | 'shapeshifter' | 'tomorrow' | 'tube' | 'twilight'
  >('summerfruit:inverted');
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
        <Panel defaultSize={50} minSize={30}>
          <div className="form-panel">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <InputField
                  name="name"
                  value={config.name}
                  onChange={handleChange}
                  label="API Name"
                  required
                  changed={changes.has('name')}
                  error={errors.has('name')}
                  errorMessage="Name+Version must be unique"
                />

                <InputField
                  name="version"
                  value={config.version}
                  onChange={handleChange}
                  label="Version"
                  required
                  changed={changes.has('version')}
                  error={errors.has('version')}
                  errorMessage="Name+Version must be unique"
                />
              </div>

              <TextAreaField
                name="description"
                value={config.description || ''}
                onChange={handleChange}
                label="Description"
                changed={changes.has('description')}
              />

              <MemoizedEntityList
                key={`${config.id}-${config.entities?.length || 0}-${Date.now()}`}
                entities={config.entities || []}
                onSelect={(entity: ApiEntity) => console.log('Selected entity:', entity)}
                onAdd={() => {
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
                }}
                onEdit={(entity: ApiEntity) => {
                  setEditingEntity(entity);
                  setIsEntityDialogOpen(true);
                }}
                onDelete={(entityName: string) => {
                  setConfig({
                    ...config,
                    entities: (config.entities || []).filter(e => e.name !== entityName)
                  });
                  setChanges(prev => new Set(prev).add('entities'));
                }}
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
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </Panel>
        <PanelResizeHandle className="resize-handle" />
        <Panel defaultSize={50} minSize={30}>
          <div className="json-panel">
            <div className="json-controls">
              <button 
                className={`mode-toggle ${editMode ? 'edit-active' : 'view-active'}`}
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? '✏️ Editing JSON' : '👁️ Viewing JSON'}
              </button>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as typeof theme)}
                className="theme-selector"
              >
                <option value="summerfruit:inverted">Summerfruit (Default)</option>
                <option value="monokai">Monokai</option>
                <option value="solarized">Solarized</option>
                <option value="bright">Bright</option>
                <option value="apathy:inverted">Apathy</option>
                <option value="ashes">Ashes</option>
                <option value="bespin">Bespin</option>
                <option value="brewer">Brewer</option>
                <option value="chalk">Chalk</option>
                <option value="codeschool">Codeschool</option>
                <option value="colors">Colors</option>
                <option value="eighties">Eighties</option>
                <option value="embers">Embers</option>
                <option value="flat">Flat</option>
                <option value="google">Google</option>
                <option value="grayscale">Grayscale</option>
                <option value="greenscreen">Greenscreen</option>
                <option value="harmonic">Harmonic</option>
                <option value="hopscotch">Hopscotch</option>
                <option value="isotope">Isotope</option>
                <option value="marrakesh">Marrakesh</option>
                <option value="mocha">Mocha</option>
                <option value="ocean">Ocean</option>
                <option value="paraiso">Paraiso</option>
                <option value="pop">Pop</option>
                <option value="railscasts">Railscasts</option>
                <option value="rjv-default">Default</option>
                <option value="shapeshifter">Shapeshifter</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="tube">Tube</option>
                <option value="twilight">Twilight</option>
              </select>
            </div>
            <ReactJson
              src={memoizedConfig}
              name={false}
              theme={theme}
              displayDataTypes={false}
              enableClipboard={false}
              collapsed={1}
              collapseStringsAfterLength={50}
              onEdit={editMode ? debounce((edit: InteractionProps) => {
                const updatedConfig = edit.updated_src as ApiConfig;
                setConfig(updatedConfig);
                setChanges(prev => new Set(prev).add('json'));
                validateConfig(updatedConfig);
                // Update tab title if name changed in JSON editor
                if (edit.name === 'name' || (edit.name === 'root' && 'name' in updatedConfig)) {
                  onSave(updatedConfig);
                }
              }, 1000) : false}
              style={{
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontFamily: 'monospace'
              }}
            />
          </div>
        </Panel>
      </PanelGroup>

      {editingEntity && (
        <EntityDialog
          entity={editingEntity}
          open={isEntityDialogOpen}
          onSave={(updatedEntity: ApiEntity) => {
            console.log('ApiConfigEditor - EntityDialog onSave - updating entity:', updatedEntity.name);
            setConfig({
              ...config,
              entities: (config.entities || []).map(e => 
                e.name === updatedEntity.name ? updatedEntity : e
              )
            });
            setChanges(prev => new Set(prev).add('entities'));
            setIsEntityDialogOpen(false);
            setEditingEntity(null);
            console.log('ApiConfigEditor - EntityDialog onSave - updated config and closed dialog');
          }}
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
