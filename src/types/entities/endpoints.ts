/**
 * Entity endpoint types
 */
export type SchemaType = {
  type?: string;
  format?: string;
  properties?: Record<string, SchemaType>;
  items?: SchemaType;
  required?: string[];
  enum?: string[];
  $ref?: string;
  additionalProperties?: boolean | SchemaType;
  oneOf?: SchemaType[];
  anyOf?: SchemaType[];
  allOf?: SchemaType[];
  not?: SchemaType;
  nullable?: boolean;
};

export type EndpointMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type EntityEndpoint = {
  path: string;
  method: EndpointMethod;
  description?: string;
  operationId?: string;
  parameters?: EndpointParameter[];
  requestBody?: {
    description?: string;
    required?: boolean;
    content: {
      [mimeType: string]: {
        schema: SchemaType;
      };
    };
  };
  responses?: {
    [statusCode: string]: {
      description: string;
      content?: {
        [mimeType: string]: {
          schema: SchemaType;
        };
      };
    };
  };
  security?: Array<{ [securityScheme: string]: string[] }>;
  tags?: string[];
};

export type EndpointParameter = {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  description?: string;
  required?: boolean;
  schema: SchemaType;
};

export type EndpointExample = {
  name: string;
  request?: unknown;
  response: {
    status: number;
    body?: unknown;
  };
};
