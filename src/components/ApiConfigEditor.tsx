import React, { useState } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { EntityList } from './EntityList';
import { EntityDialog } from './EntityDialog';
import type { ApiEntity } from '../types/entities/entity';
import ReactJson from 'react-json-view';
import type { ApiConfig } from '../types/api.types';
import './ApiConfigEditor.css';

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

  const validateConfig = (currentConfig: ApiConfig) => {
    const newErrors = new Set<string>();
    // Check for duplicate name+version
    console.log('Validating config uniqueness:', {
      currentName: currentConfig.name,
      currentVersion: currentConfig.version,
      currentId: currentConfig.id,
      allConfigs: allConfigs.map(c => ({
        id: c.id,
        name: c.name,
        version: c.version
      }))
    });

    const isDuplicate = allConfigs.some(c => {
      const isMatch = c.id !== currentConfig.id && 
        c.name === currentConfig.name && 
        c.version === currentConfig.version;
      if (isMatch) {
        console.log('Found duplicate config:', {
          duplicateId: c.id,
          duplicateName: c.name,
          duplicateVersion: c.version
        });
      }
      return isMatch;
    });
    
    if (isDuplicate) {
      console.log('Duplicate detected - marking fields with error');
      newErrors.add('name');
      newErrors.add('version');
    }
    setErrors(newErrors);
    return newErrors.size === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedConfig = {...config, [name]: value};
    setConfig(updatedConfig);
    setChanges(prev => new Set(prev).add(name));
    validateConfig(updatedConfig);
    
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
                <div className={`form-group ${changes.has('name') ? 'changed' : ''} ${errors.has('name') ? 'error' : ''}`}>
                  <label htmlFor="name">API Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={config.name}
                    onChange={handleChange}
                    required
                  />
                  {errors.has('name') && <div className="error-message">Name+Version must be unique</div>}
                </div>

                <div className={`form-group ${changes.has('version') ? 'changed' : ''} ${errors.has('version') ? 'error' : ''}`}>
                  <label htmlFor="version">Version</label>
                  <input
                    type="text"
                    id="version"
                    name="version"
                    value={config.version}
                    onChange={handleChange}
                    required
                  />
                  {errors.has('version') && <div className="error-message">Name+Version must be unique</div>}
                </div>
              </div>

              <div className={`form-group ${changes.has('description') ? 'changed' : ''}`}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={config.description || ''}
                  onChange={handleChange}
                />
              </div>

              <EntityList 
                entities={config.entities || []}
                onSelect={(entity) => console.log('Selected entity:', entity)}
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
                onEdit={(entity) => {
                  setEditingEntity(entity);
                  setIsEntityDialogOpen(true);
                }}
                onDelete={(entityName) => {
                  setConfig({
                    ...config,
                    entities: (config.entities || []).filter(e => e.name !== entityName)
                  });
                  setChanges(prev => new Set(prev).add('entities'));
                }}
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
              src={config}
              name={false}
              theme={theme}
              displayDataTypes={false}
              enableClipboard={false}
              onEdit={editMode ? (edit) => {
                const updatedConfig = edit.updated_src as ApiConfig;
                setConfig(updatedConfig);
                setChanges(prev => new Set(prev).add('json'));
                validateConfig(updatedConfig);
                // Update tab title if name changed in JSON editor
                if (edit.name === 'name' || (edit.name === 'root' && 'name' in updatedConfig)) {
                  onSave(updatedConfig);
                }
              } : false}
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
          onSave={(updatedEntity) => {
            setConfig({
              ...config,
              entities: (config.entities || []).map(e => 
                e.name === updatedEntity.name ? updatedEntity : e
              )
            });
            setChanges(prev => new Set(prev).add('entities'));
            setIsEntityDialogOpen(false);
            setEditingEntity(null);
          }}
          onCancel={() => {
            setIsEntityDialogOpen(false);
            setEditingEntity(null);
          }}
        />
      )}
    </div>
  );
};
