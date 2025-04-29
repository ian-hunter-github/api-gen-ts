import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ActionButtons } from '../ActionButtons';
import { Model, ModelStatus } from '../../../../utils/Model';

describe('ActionButtons', () => {

  class TestType {
    name : string = 'row';
    value : number = 100;
    [key: string]: unknown;
  }

  const testModel = new Model<TestType>({name: 'row', value: 100}, ModelStatus.Pristine, () => 'test-pristine');

  it('all buttons visible in all states', () => {

    for(const state of Object.values(ModelStatus)) {
      assertAllButtonsVisibleForState(state);
    }

  });

  it('calls edit and delete handlers when buttons are clicked', () => {
    const mockEdit = jest.fn();
    const mockDelete = jest.fn();

    render(
      <ActionButtons
        model={testModel}
        onEdit={mockEdit}
        onDelete={mockDelete}
      />
    );

    fireEvent.click(screen.getByTestId('action-edit-btn-test-pristine'));
    expect(mockEdit).toHaveBeenCalledWith(testModel);

    fireEvent.click(screen.getByTestId('action-delete-btn-test-pristine'));
    expect(mockDelete).toHaveBeenCalledWith(testModel);
    
  });

  it('calls undo/redo handlers when buttons are clicked and enabled', () => {
    const mockUndo = jest.fn();
    const mockRedo = jest.fn();

    // Create a model with proper history tracking
    const model = new Model({
      name: 'row',
      value: 100,
    }, ModelStatus.Pristine, () => 'test-undo-redo');
    // Make multiple updates to build history
    model.update({ value: 200 });
    model.update({ value: 300 });
    // Undo once to enable redo
    model.undo();
    // Verify model state
    expect(model.canUndo).toBe(true);
    expect(model.canRedo).toBe(true);

    render(
      <ActionButtons
        model={model}
        onUndo={mockUndo}
        onRedo={mockRedo}
      />
    );

    // Verify buttons are enabled
    expect(screen.getByTestId('action-undo-btn-test-undo-redo')).not.toBeDisabled();
    expect(screen.getByTestId('action-redo-btn-test-undo-redo')).not.toBeDisabled();

    fireEvent.click(screen.getByTestId('action-undo-btn-test-undo-redo'));
    expect(mockUndo).toHaveBeenCalledWith(model);

    fireEvent.click(screen.getByTestId('action-redo-btn-test-undo-redo'));
    expect(mockRedo).toHaveBeenCalledWith(model);
  });

  it('disables buttons when model is deleted', () => {

    const deletedModel = new Model({name: 'Deleted Item', value: 0}, ModelStatus.Deleted, () => 'test-deleted');

    render(
      <ActionButtons
        model={deletedModel}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
        onUndo={jest.fn()}
        onRedo={jest.fn()}
      />
    );

    expect(screen.getByTestId('action-edit-btn-test-deleted')).toBeDisabled();
    expect(screen.getByTestId('action-delete-btn-test-deleted')).toBeDisabled();
    expect(screen.getByTestId('action-redo-btn-test-deleted')).toBeDisabled();
  });

  it('uses custom container component when provided', () => {

    const Container = ({ children }: { children: React.ReactNode }) => (
      <div className="custom-container">{children}</div>
    );

    render(
      <ActionButtons
        model={testModel}
        onEdit={jest.fn()}
        containerComponent={Container}
      />
    );

    expect(screen.getByTestId('action-edit-btn-test-pristine').closest('.custom-container')).toBeInTheDocument();

  });

  function assertAllButtonsVisibleForState(state: ModelStatus) {
    const uniqueId = `test-${state.toLowerCase()}`;
    render(
      <ActionButtons
        model={new Model<TestType>({name: 'row', value: 100}, state, () => uniqueId)}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );
  
    expect(screen.getByTestId(`action-edit-btn-${uniqueId}`)).toBeInTheDocument();
    expect(screen.getByTestId(`action-delete-btn-${uniqueId}`)).toBeInTheDocument();
    expect(screen.queryByTestId(`action-undo-btn-${uniqueId}`)).not.toBeInTheDocument();
    expect(screen.queryByTestId(`action-redo-btn-${uniqueId}`)).not.toBeInTheDocument();
  
  }
});
