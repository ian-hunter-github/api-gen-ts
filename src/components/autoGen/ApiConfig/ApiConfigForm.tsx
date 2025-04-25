import { FormBuilder } from '../common/FormBuilder/FormBuilder';
import './Form.module.css';

interface ApiConfigFormProps {
  initialValues?: any;
  onSubmit: (data: any) => void;
}

export const ApiConfigForm = ({ initialValues = {}, onSubmit }: ApiConfigFormProps) => {
  const fields = [
    {
      name: 'name',
      label: 'name',
      type: 'string',
      defaultValue: '',
      required: true,
      validation: {
        required: true,
        
        
        pattern: /@pattern ^[a-zA-Z0-9_-]+$\n   /,
      },
      placeholder: 'Type name here'
    },
    {
      name: 'description',
      label: 'description',
      type: 'string',
      defaultValue: '',
      required: false,
      validation: {
        
        
        
        
      },
      placeholder: 'Type description here'
    },
    {
      name: 'version',
      label: 'version',
      type: 'string',
      defaultValue: '',
      required: true,
      validation: {
        
        
        
        
      },
      placeholder: 'Type version here'
    },
    {
      name: 'basePath',
      label: 'basePath',
      type: 'string',
      defaultValue: '',
      required: true,
      validation: {
        
        
        
        
      },
      placeholder: 'Type basePath here'
    },
    {
      name: 'environment',
      label: 'environment',
      type: 'string',
      defaultValue: '',
      required: true,
      validation: {
        
        
        
        
      },
      options: [
        { value: 'development', label: 'development' },
        { value: 'staging', label: 'staging' },
        { value: 'production', label: 'production' },
      ],
      placeholder: 'Type environment here'
    },
    {
      name: 'entities',
      label: 'entities',
      type: 'string',
      defaultValue: '',
      required: true,
      validation: {
        
        
        
        
      },
      placeholder: 'Type entities here'
    },
    {
      name: 'deployment',
      label: 'deployment',
      type: 'string',
      defaultValue: '',
      required: true,
      validation: {
        
        
        
        
      },
      placeholder: 'Type deployment here'
    },
    {
      name: 'security',
      label: 'security',
      type: 'string',
      defaultValue: '',
      required: true,
      validation: {
        
        
        
        
      },
      placeholder: 'Type security here'
    },
    {
      name: 'createdAt',
      label: 'createdAt',
      type: 'string',
      defaultValue: '',
      required: true,
      validation: {
        
        
        
        
      },
      placeholder: 'Type createdAt here'
    },
    {
      name: 'updatedAt',
      label: 'updatedAt',
      type: 'string',
      defaultValue: '',
      required: false,
      validation: {
        
        
        
        
      },
      placeholder: 'Type updatedAt here'
    },
  ];

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
