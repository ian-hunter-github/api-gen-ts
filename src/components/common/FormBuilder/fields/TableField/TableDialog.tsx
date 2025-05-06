import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FieldMetadata } from '../../../../../types/metadata/types';
import { Button } from '@mui/material';
import { Dialog } from '@mui/material';
import { TableCell } from './TableCell';

interface TableDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: unknown) => void;
  rowData?: Record<string, unknown>;
  columns: Array<{
    name: string;
    type: string;
    metadata?: FieldMetadata;
  }>;
  readOnly: boolean;
}

export const TableDialog = ({
  isOpen,
  onClose,
  onSubmit,
  rowData,
  columns,
  readOnly
}: TableDialogProps) => {
  const { handleSubmit, reset, setValue, watch } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFieldValue = (name: string) => watch(name);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      handleClose();
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
    >
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          {rowData ? 'Edit Row' : 'Add Row'}
        </h2>
        <form onSubmit={handleFormSubmit}>
        <div className="space-y-4">
          {columns.map((column) => (
            <div key={column.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {column.name}
              </label>
              <TableCell
                name={column.name}
                type={column.type}
                readOnly={readOnly}
                metadata={column.metadata}
                value={getFieldValue(column.name)}
                onChange={(value) => setValue(column.name, value)}
              />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            type="button"
            variant="outlined"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          {!readOnly && (
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
            >
              {rowData ? 'Update' : 'Add'}
            </Button>
          )}
        </div>
        </form>
      </div>
    </Dialog>
  );
};
