import { useState, useEffect } from "react";
import { ApiConfigEditor } from "./components/ApiConfigEditorNew/ApiConfigEditor";
import { ApiConfig, DeploymentProvider } from "./types/all.types";
import { useTheme } from "./contexts/ThemeContext";
import { ApiFormProvider } from "./contexts/ApiFormContext";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import "./App.css";

function AppNew() {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const [tabs, setTabs] = useState<
    Array<{
      id: number;
      title: string;
      config: ApiConfig;
    }>
  >([]);

  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    setTabs([{
      id: 1,
      title: "New Configuration",
      config: {
        id: "1234",
        name: "API Configuration",
        description: "",
        version: "1.0.0",
        basePath: "/api",
        environment: "development",
        deployment: {
          provider: "docker",
          settings: {
            host: "localhost",
            port: 8080
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        entities: [],
        security: { authentication: { type: "none" } },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDemo: false
      },
    }]);
  }, []);

  const addNewTab = () => {
    const newTabId = Math.max(...tabs.map(tab => tab.id), 0) + 1;
    setTabs([
      ...tabs,
      {
        id: newTabId,
        title: `Configuration ${newTabId}`,
        config: {
          id: "1234",
          name: "API Configuration",
          description: "",
          version: "1.0.0",
          basePath: "/api",
          environment: "development",
          deployment: {
            provider: "docker",
            settings: {},
            createdAt: new Date().toISOString()
          },
          entities: [],
          security: { authentication: { type: "none" } },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isDemo: false
        },
      },
    ]);
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
      <ThemeToggle />
      <header className="app-header">
        <h1>API Configuration Editor</h1>
      </header>

      <div className="tab-container">
        <div className="tab-header">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              onDoubleClick={() => removeTab(tab.id)}
            >
              {tab.title}
            </div>
          ))}
          <div className="tab add-tab" onClick={addNewTab}>+</div>
        </div>

        <div className="panel-content">
          {tabs.map(tab => (
            <div key={tab.id} style={{ display: activeTab === tab.id ? "block" : "none" }}>
              <ApiFormProvider>
                <ApiConfigEditor
                config={{
                  ...tab.config,
                  id: tab.config.id || "1234",
                  deployment: {
                    provider: "docker" as DeploymentProvider,
                    settings: {
                      host: "localhost",
                      port: 8080
                    }
                  },
                  security: { 
                    authentication: { type: "none" },
                    authorization: {
                      roles: [],
                      policies: []
                    },
                    cors: {
                      enabled: true,
                      origins: [],
                      methods: [],
                      headers: []
                    }
                  },
                  entities: tab.config.entities?.map(e => ({
                    ...e,
                    attributes: e.attributes.map(a => ({
                      id: a.id || `${e.name}_${a.name}`,
                      name: a.name,
                      type: (a.type && ['string','number','boolean','date','datetime','timestamp','uuid','object','array','reference','enum'].includes(a.type)) 
                        ? a.type as 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'timestamp' | 'uuid' | 'object' | 'array' | 'reference' | 'enum'
                        : "string",
                      required: a.required || false,
                      unique: a.unique || false,
                      description: a.description || "",
                      default: a.default,
                      enumValues: a.enumValues,
                      validation: a.validation,
                    })),
                    relationships: e.relationships?.map(r => ({
                      ...r,
                      source: r.source || e.name,
                      type: (r.type && ['one-to-one','one-to-many','many-to-one','many-to-many'].includes(r.type))
                        ? r.type as 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many'
                        : 'one-to-one'
                    })) || []
                  })) || [],
                }}
                onSave={updatedConfig => {
                  setTabs(tabs.map(t => 
                    t.id === tab.id ? {
                      ...t,
                      config: {
                        ...updatedConfig,
                        environment: updatedConfig.environment || "development"
                      },
                      title: updatedConfig.name
                    } : t
                  ));
                }}
                allConfigs={tabs.map(t => ({
                  ...t.config,
                  id: t.config.id || "1234",
                  deployment: {
                    provider: "docker",
                    settings: {
                      host: "localhost",
                      port: 8080
                    },
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  },
                  security: { 
                    authentication: { type: "none" },
                    authorization: undefined,
                    cors: undefined
                  },
                  entities: t.config.entities?.map(e => ({
                    ...e,
                    attributes: e.attributes.map(a => ({
                      ...a,
                      id: a.id || `${e.name}_${a.name}`,
                      type: (a.type && ['string','number','boolean','date','datetime','timestamp','uuid','object','array','reference','enum'].includes(a.type)) 
                        ? a.type as 'string' | 'number' | 'boolean' | 'date' | 'datetime' | 'timestamp' | 'uuid' | 'object' | 'array' | 'reference' | 'enum'
                        : "string",
                      required: a.required || false,
                      unique: a.unique || false
                    }))
                  })) || []
                }))}
                />
              </ApiFormProvider>
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

export default AppNew;
