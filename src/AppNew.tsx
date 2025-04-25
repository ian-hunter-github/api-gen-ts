import { useState, useEffect } from "react";
import { ApiConfigEditor } from "./components/ApiConfigEditorNew/ApiConfigEditor";

import { ApiConfig, ApiEntity } from "./types/all.types";


type AppConfig = {
  id: string;
  name: string;
  description: string;
  version: string;
  basePath: string;
  environment: string;
  createdAt: string;
  entities: ApiEntity[];
  security: {
    authentication: {
      type: "none" | "basic" | "jwt" | "oauth2" | "api-key";
    };
  };
};
//import { demoStore } from "./stores/demoStore";
import { useTheme } from "./contexts/ThemeContext";
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
      config: AppConfig & { id: string };
    }>
  >([]);

  useEffect(() => {
    // Initialize with demo data in development

    // Initialize with empty config in production
    setTabs([
      {
        id: 1,
        title: "New Configuration",
        config: {
          id: "1234",
          name: "API Configuration",
          description: "",
          version: "1.0.0",
          basePath: "/api",
          environment: "development",
          entities: [],
          security: {
                authentication: {
                  type: "none" as const,
                },
          },
          createdAt: new Date().toISOString(),
        },
      },
    ]);
  }, []);

  const [activeTab, setActiveTab] = useState(1);

  const addNewTab = () => {
    const newTabId = Math.max(...tabs.map((tab) => tab.id), 0) + 1;
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
          entities: [],
          security: {
            authentication: {
              type: "none" as const,
            },
          },
          createdAt: new Date().toISOString(),
        } as AppConfig & { id: string },
      },
    ]);
    setActiveTab(newTabId);
  };

  const removeTab = (id: number) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter((tab) => tab.id !== id);
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
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
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
          {tabs.map((tab) => (
            <div
              key={tab.id}
              style={{ display: activeTab === tab.id ? "block" : "none" }}
            >
              <ApiConfigEditor
                config={{...tab.config, id: tab.config.id || "1234"} as unknown as ApiConfig}
                onSave={(updatedConfig) => {
                  const appConfig = {
                    ...updatedConfig,
                    environment: "development",
                    deployment: updatedConfig.deployment?.map(d => ({
                      ...d,
                      environment: "development"
                    }))
                  } as AppConfig & { id: string };
                  
                  setTabs(
                    tabs.map((t) =>
                      t.id === tab.id
                        ? {
                            ...t,
                            config: appConfig,
                            title: appConfig.name,
                          }
                        : t
                    )
                  );
                }}
                allConfigs={tabs.map((t) => ({...t.config, id: t.config.id || "1234"})) as unknown as ApiConfig[]}
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

export default AppNew;
