/**
 * Version control providers
 */
export type VCSProvider = 'github' | 'gitlab' | 'bitbucket' | 'azure-repos';

export type VCSConfig = {
  provider: VCSProvider;
  config: {
    repo: string;
    branch: string;
    accessToken: string;
    webhookSecret?: string;
  };
};
