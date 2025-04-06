/**
 * CI/CD providers
 */
export type CICDProvider = 'github-actions' | 'gitlab-ci' | 'circleci' | 'jenkins' | 'azure-pipelines';

export type CICDConfig = {
  provider: CICDProvider;
  config: {
    branch: string;
    testCommand?: string;
    buildCommand?: string;
    deployCommand?: string;
    notifications?: {
      slack?: string;
      email?: string[];
    };
  };
};
