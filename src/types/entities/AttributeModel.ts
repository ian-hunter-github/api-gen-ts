import { Model, ModelStatus } from '../../utils/Model';
import type { EntityAttribute } from './attributes';

export class AttributeModel extends Model<EntityAttribute> {
  constructor(attribute: EntityAttribute, status?: ModelStatus) {
    super(attribute, status);
  }
}
