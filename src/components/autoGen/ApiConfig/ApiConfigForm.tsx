import { useState } from 'react';
import Switch from '@mui/material/Switch';
import { FormBuilder } from '../../common/FormBuilder/FormBuilder';
import { useApiFormContext } from '../../../contexts/ApiFormContext';
import { ApiConfig } from '../../../types/all.types';
import { getDefaultApiConfig } from '../../../types/defaults';
import { generateUUID } from '../../../utils/uuid';
import { ApiConfigMetadata } from '../../../types/metadata/api-config.meta';
import { generateFieldConfig } from '../../../utils/generateFieldConfig';

interface ApiConfigFormProps {
  initialValues?: ApiConfig;
  onSubmit: (data: ApiConfig) => void;
}

export const ApiConfigForm = ({ initialValues = getDefaultApiConfig(), onSubmit }: ApiConfigFormProps) => {
  const { readOnly, setReadOnly, hasChanges, setHasChanges, hasErrors, setHasErrors } = useApiFormContext();
  const [shadowCopy, setShadowCopy] = useState<ApiConfig>(initialValues);

  const handleEdit = () => {
    setShadowCopy(JSON.parse(JSON.stringify(initialValues))); // Deep copy
    setReadOnly(false);
    setHasChanges(false);
    setHasErrors(false);
  };

  const handleSave = (data: ApiConfig) => {
    onSubmit(data);
    setReadOnly(true);
  };

  const fields = generateFieldConfig(ApiConfigMetadata, new Set(), readOnly).map(field => {
    // Special handling for ID field
    if (field.name === 'id') {
      return {
        ...field,
        defaultValue: generateUUID(),
        hidden: true,
        readOnly: true
      };
    }
    
    // Special handling for createdAt field
    if (field.name === 'createdAt') {
      return {
        ...field,
        defaultValue: new Date().toISOString(),
        readOnly: true
      };
    }
    
    return {
      ...field,
      readOnly: readOnly
    };
  });

  console.debug('Generated fields:', fields);
  
  return (
    <div className="apiconfig-form" style={{ backgroundColor: 'var(--form-bg-level-0)' }}>
      <div className="form-actions" style={{ marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
        <span style={{ marginRight: '8px' }}>
          {readOnly ? 'Edit' : 'Read'}
        </span>
        <Switch 
          checked={!readOnly}
          onChange={() => {
            const newState = !readOnly;
            console.debug('Toggle pressed - new state:', newState);
            if (newState === false) {
              handleEdit();
            } else {
              setReadOnly(newState, 'toggle');
            }
          }}
          inputProps={{ 'aria-label': 'Toggle edit mode' }}
        />
        {!readOnly && hasChanges && !hasErrors && (
          <button 
            type="button" 
            onClick={() => handleSave(shadowCopy)}
            className="btn btn-primary"
          >
            Save
          </button>
        )}
      </div>
      <FormBuilder
        fields={fields}
        initialValues={!readOnly ? shadowCopy : initialValues}
        onSubmit={handleSave}
      />
    </div>
  );
};
