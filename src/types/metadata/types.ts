/**
 * Type metadata definitions
 */

export type FieldType = 
  | { kind: 'primitive', type: 'string' | 'number' | 'boolean' | 'date' | 'datetime' }
  | { kind: 'array', itemType: FieldType, meta?: string }
  | { kind: 'enum', values: string[] }
  | { kind: 'complex', type: 'DeploymentConfig' | 'ApiEntity' | 'ApiConfig' | 'ApiSecurity' | 'AwsConfig' | 'AzureConfig' | 'GcpConfig' | 'DockerConfig' | 'ScalingConfig' | 'MonitoringConfig' | 'AuthenticationConfig' | 'AuthorizationConfig' | 'CorsConfig' | 'JwtConfig' | 'OAuth2Config' | 'ApiKeyConfig' | 'PolicyCondition' | 'SecurityRole' | 'SecurityPolicy' | 'MonitoringAlert' | 'EntityAttribute' | 'EntityRelationship' | 'EntityEndpoint' | 'OAuth2Scopes', meta?: string }
  ;

export interface FieldValidation {
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
}

export interface FieldLayout {
  colSpan?: 3 | 6 | 9 | 12;
  rows?: number;
}

export interface FieldMetadata {
  type: FieldType;
  displayName?: string;
  description?: string;
  validation?: FieldValidation;
  defaultValue?: unknown;
  enumValues?: string[];
  format?: 'date-time' | 'uri' | 'email' | string;
  component?: 'text' | 'textarea' | 'select' | 'checkbox' | 'table' | 'json' | 'accordion';
  isArray?: boolean;
  isComplex?: boolean;
  layout?: FieldLayout;
  likelyWidthChars?: number;
  hidden?: boolean;
}
