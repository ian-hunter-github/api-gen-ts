/**
 * API security configuration
 */
export type ApiSecurity = {
  authentication: {
    type: 'none' | 'basic' | 'jwt' | 'oauth2' | 'api-key';
    jwt?: {
      secret: string;
      expiresIn: string;
      issuer?: string;
      audience?: string;
      refreshToken?: {
        expiresIn: string;
      };
    };
    oauth2?: {
      authorizationUrl: string;
      tokenUrl: string;
      scopes: Record<string, string>;
    };
    apiKey?: {
      header?: string;
      queryParam?: string;
    };
  };
  authorization?: {
    roles?: Array<{
      name: string;
      description: string;
      permissions: string[];
    }>;
    policies?: Array<{
      name: string;
      description?: string;
      rules?: Array<{
        resource: string;
        action: string[];
        condition?: string;
      }>;
      effect?: 'allow' | 'deny';
      actions?: string[];
      resources?: string[];
      conditions?: Record<string, unknown>;
    }>;
  };
  cors?: {
    enabled?: boolean;
    origins?: string[];
    methods?: string[];
    headers?: string[];
  };
};
