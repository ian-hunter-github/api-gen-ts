/**
 * Deployment providers
 */
export type DeploymentProvider = 
  | 'aws' | 'azure' | 'gcp' 
  | 'netlify' | 'vercel' | 'firebase-hosting'
  | 'heroku' | 'digitalocean' | 'cloudflare';

export type DeploymentConfig = {
  provider: DeploymentProvider;
  settings: 
    | { region: string; lambdaMemory?: number; apiGateway?: boolean }
    | { siteName: string; functionsDir?: string }
    | Record<string, unknown>;
};
