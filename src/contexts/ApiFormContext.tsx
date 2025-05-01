import { createContext, useContext, ReactNode, useState, useRef } from 'react';

interface ApiFormContextType {
  readOnly: boolean;
  hasChanges: boolean;
  hasErrors: boolean;
  setReadOnly: (readOnly: boolean, source?: string) => void;
  setHasChanges: (hasChanges: boolean) => void;
  setHasErrors: (hasErrors: boolean) => void;
  isTableOperation: boolean;
  setIsTableOperation: (isTableOp: boolean) => void;
}

const ApiFormContext = createContext<ApiFormContextType>({
  readOnly: true,
  hasChanges: false,
  hasErrors: false,
  setReadOnly: () => {},
  setHasChanges: () => {},
  setHasErrors: () => {},
  isTableOperation: false,
  setIsTableOperation: () => {},
});

export const useApiFormContext = () => useContext(ApiFormContext);

interface ApiFormProviderProps {
  children: ReactNode;
  initialReadOnly?: boolean;
}

export const ApiFormProvider = ({ 
  children,
  initialReadOnly = false
}: ApiFormProviderProps) => {
  console.debug('Creating new ApiFormProvider instance with initialReadOnly:', initialReadOnly);
  const initialReadOnlyRef = useRef(initialReadOnly);
  const [readOnly, _setReadOnly] = useState(initialReadOnlyRef.current);
  const [isTableOperation, setIsTableOperation] = useState(false);
  
  const setReadOnly = (newReadOnly: boolean, source?: string) => {
    if (isTableOperation) {
      console.debug('Blocking readOnly change during table operation from source:', source);
      return;
    }
    
    // Allow readOnly changes from toggle UI or explicit requests
    const allowedSources = ['toggle', 'explicit'];
    if (newReadOnly === true && !allowedSources.includes(source || '')) {
      console.debug('Preventing automatic readOnly change to true from source:', source);
      return;
    }

    console.debug('FormContext readOnly state changed to:', newReadOnly, 'from:', source, 
      'current provider instance:', initialReadOnlyRef.current);
    _setReadOnly(newReadOnly);
  };

  const [hasChanges, setHasChanges] = useState(false);
  const [hasErrors, setHasErrors] = useState(false);

  return (
    <ApiFormContext.Provider
      value={{
        readOnly,
        hasChanges,
        hasErrors,
        setReadOnly,
        setHasChanges,
        setHasErrors,
        isTableOperation,
        setIsTableOperation
      }}
    >
      {children}
    </ApiFormContext.Provider>
  );
};
