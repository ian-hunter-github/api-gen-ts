import { FormBuilder } from '../../common/FormBuilder/FormBuilder';
import './Form.module.css';
import { ApiConfig, getDefaultApiConfig } from '../../../types/all.types';
import { generateUUID } from '../../../utils/uuid';
import { ApiConfigMetadata } from '../../../types/metadata/api-config.meta';
import { generateFieldConfig } from '../../../utils/generateFieldConfig';

interface ApiConfigFormProps {
  initialValues?: ApiConfig;
  onSubmit: (data: ApiConfig) => void;
}

export const ApiConfigForm = ({ initialValues = getDefaultApiConfig(), onSubmit }: ApiConfigFormProps) => {
  const fields = generateFieldConfig(ApiConfigMetadata).map(field => {
    // Special handling for ID field
    if (field.name === 'id') {
      return {
        ...field,
        defaultValue: generateUUID(),
        hidden: true
      };
    }
    
    // Special handling for createdAt field
    if (field.name === 'createdAt') {
      return {
        ...field,
        defaultValue: new Date().toISOString()
      };
    }
    
    return field;
  });

  return (
    <div className="apiconfig-form">
      <FormBuilder
        fields={fields}
        initialValues={initialValues}
        onSubmit={onSubmit}
      />
    </div>
  );
};
