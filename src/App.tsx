import { useState, useEffect } from 'react';
import { ApiConfigEditor } from './components/ApiConfigEditor/ApiConfigEditor';
import { ApiConfig } from './types/api.types';
import { demoStore } from './stores/demoStore';
import './App.css';

function App() {
  const [tabs, setTabs] = useState<Array<{
    id: number;
    title: string;
    config: ApiConfig;
  }>>([]);

  useEffect(() => {
    // Initialize with demo data in development
    if (import.meta.env.DEV) {
      setTabs(demoStore.map((config, index) => ({
        id: index + 1,
        title: config.name,
        config
      })));
    } else {
      // Initialize with empty config in production
      setTabs([{
        id: 1,
        title: 'New Configuration',
        config: {
          id: 'config-1',
          name: 'API Configuration',
          description: '',
          version: '1.0.0',
          entities: [],
          security: {
            authentication: {
              type: 'none'
            }
          }
        }
      }]);
    }
  }, []);
  const [activeTab, setActiveTab] = useState(1);

  const addNewTab = () => {
    const newTabId = Math.max(...tabs.map(tab => tab.id), 0) + 1;
    setTabs([...tabs, {
      id: newTabId,
      title: `Configuration ${newTabId}`,
      config: {
        id: `config-${newTabId}`,
        name: `API Configuration ${newTabId}`,
        description: '',
        version: '1.0.0',
        entities: [],
        security: {
          authentication: {
            type: 'none'
          }
        }
      } as ApiConfig
    }]);
    setActiveTab(newTabId);
  };

  const removeTab = (id: number) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter(tab => tab.id !== id);
    setTabs(newTabs);
    if (activeTab === id) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>API Configuration Editor</h1>
      </header>

      <div className="tab-container">
        <div className="tab-header">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              onDoubleClick={() => removeTab(tab.id)}
            >
              {tab.title}
            </div>
          ))}
          <div className="tab add-tab" onClick={addNewTab}>
            +
          </div>
        </div>

        <div className="panel-content">
          {tabs.map(tab => (
            <div
              key={tab.id}
              style={{ display: activeTab === tab.id ? 'block' : 'none' }}
            >
              <ApiConfigEditor 
                config={tab.config}
                onSave={(updatedConfig) => {
                  setTabs(tabs.map(t => 
                    t.id === tab.id 
                      ? { ...t, config: updatedConfig, title: updatedConfig.name } 
                      : t
                  ));
                }}
                allConfigs={tabs.map(t => t.config)}
              />
            </div>
          ))}
        </div>
      </div>

      <footer className="app-footer">
        <div className="copyright">
          © {new Date().getFullYear()} API Generator
        </div>
      </footer>
    </div>
  );
}

export default App;
