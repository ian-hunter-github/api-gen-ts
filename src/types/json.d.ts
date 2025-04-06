declare module "*.json" {
  import { APIConfigSchema } from "../schema/api-config.schema";
  const value: APIConfigSchema;
  export default value;
}
