import React from 'react';
import { FieldError } from 'react-hook-form';
import './JsonEditor.css';

interface JsonEditorProps {
  value: unknown;
  onChange: (value: unknown) => void;
  label?: string;
  error?: FieldError;
  className?: string;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  label,
  error,
  className = ''
}) => {
  const [textValue, setTextValue] = React.useState(
    typeof value === 'string' ? value : JSON.stringify(value, null, 2)
  );
  const [isValid, setIsValid] = React.useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextValue(newValue);

    try {
      const parsed = JSON.parse(newValue);
      setIsValid(true);
      onChange(parsed);
    } catch (err) {
      setIsValid(false);
    }
  };

  return (
    <div className={`json-editor ${className}`}>
      {label && <label className="json-editor-label">{label}</label>}
      <textarea
        className={`json-editor-textarea ${!isValid ? 'invalid' : ''}`}
        value={textValue}
        onChange={handleChange}
        rows={10}
      />
      {!isValid && (
        <div className="json-error">Invalid JSON format</div>
      )}
      {error && (
        <div className="json-error">{error.message}</div>
      )}
    </div>
  );
};
