import React, { useState, useCallback, useMemo } from 'react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { JsonEditorPanel } from './JsonEditorPanel';
import type { ApiConfig, EntityEndpoint } from '../../types/all.types';

import './ApiConfigEditor.css';
import { ApiConfigFormPanel } from './ApiConfigFormPanel';

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
  const [editMode, setEditMode] = useState<boolean>(false);
  const showJsonEditor = false;

  const validateConfig = useCallback((currentConfig: ApiConfig) => {
    return !allConfigs.some(c => 
      c.id !== currentConfig.id && 
      c.name === currentConfig.name && 
      c.version === currentConfig.version
    );
  }, [allConfigs]);

  const memoizedConfig = useMemo(() => config, [JSON.stringify(config)]);

  const handleSubmit = (data: ApiConfig) => {
    if (validateConfig(data)) {
      onSave(data);
    }
  };

  return (
    <div className="api-config-editor">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={80}>
          <ApiConfigFormPanel
          config={config}
          onSubmit={handleSubmit}
          editMode={editMode}
          onEditModeToggle={() => setEditMode(!editMode)}
          />
        </Panel>
        <PanelResizeHandle className="resize-handle" />
        {showJsonEditor && (
          <Panel defaultSize={20} minSize={10}>
            <JsonEditorPanel
              config={memoizedConfig}
              editMode={editMode}
              onConfigChange={(updatedConfig: {
                id?: string;
                name?: string;
                version?: string;
                endpoints?: {
                  baseUrl?: string;
                  paths?: Record<string, Record<string, string | Partial<EntityEndpoint>>>;
                };
              }) => {
                // Convert from editor format to our ApiConfig type
                const convertedConfig: ApiConfig = {
                  ...initialConfig,
                  id: updatedConfig.id || initialConfig.id,
                  name: updatedConfig.name || initialConfig.name,
                  version: updatedConfig.version || initialConfig.version,
                  endpoints: updatedConfig.endpoints ? {
                    baseUrl: updatedConfig.endpoints.baseUrl || '',
                    paths: Object.fromEntries(
                      Object.entries(updatedConfig.endpoints.paths || {}).map(([path, pathItem]) => [
                        path,
                        {
                          path,
                          operations: Object.fromEntries(
                            Object.entries(pathItem)
                              .filter(([method]) => method !== 'path')
                              .map(([method, operation]) => [
                                method,
                                {
                                  path,
                                  method,
                                  ...(typeof operation === 'object' ? operation : { description: operation })
                                } as EntityEndpoint
                              ])
                          )
                        }
                      ])
                    )
                  } : initialConfig.endpoints
                };
                setConfig(convertedConfig);
                validateConfig(convertedConfig);
                if ('name' in convertedConfig) {
                  onSave(convertedConfig);
                }
              }}
            />
          </Panel>
        )}
      </PanelGroup>


    </div>
  );
};
