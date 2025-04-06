/**
 * API component schemas
 */
export type ApiComponents = {
  schemas: Record<string, {
    type: string;
    properties: Record<string, unknown>;
    required?: string[];
  }>;
};
