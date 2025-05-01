import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useApiFormContext } from "../../contexts/ApiFormContext";
import { ApiConfigForm } from "../../components/autoGen/ApiConfig/ApiConfigForm";
import type { ApiConfig } from "../../types/all.types";

interface ApiConfigFormPanelProps {
  config: ApiConfig;
  onSubmit: (data: ApiConfig) => void;
}

export const ApiConfigFormPanel: React.FC<ApiConfigFormPanelProps> = ({
  config,
  onSubmit,
}) => {
  console.debug('ApiConfigFormPanel mounting');
  const {readOnly} = useApiFormContext();

  React.useEffect(() => {
    console.debug('ApiConfigFormPanel: FormContext readOnly:', readOnly);
  }, [readOnly]);

  console.debug("ApiConfigFormPanel received props:", {
    config,
    onSubmit,
  });

  const methods = useForm({
    defaultValues: config,
    mode: "onChange",
  });

  return (
    <div className="form-panel">
      <div className="form-container">
        <FormProvider {...methods}>
          <ApiConfigForm initialValues={config} onSubmit={onSubmit} />
        </FormProvider>
      </div>
    </div>

  );
};
