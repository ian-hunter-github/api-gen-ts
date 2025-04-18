import { Model, ModelStatus } from '../../../utils/Model';
import { EntityAttribute } from '../attributes';

describe('Model<EntityAttribute>', () => {
  const testAttribute: EntityAttribute = {
    id: 'test-id',
    name: 'test',
    type: 'string',
    description: 'test description',
    required: true,
  };

  it('creates with pristine status by default', () => {
    const model = new Model<EntityAttribute>(testAttribute);
    expect(model.status).toBe(ModelStatus.Pristine);
    expect(model.original).toEqual(testAttribute);
  });

  it('tracks changes with update()', () => {
    const model = new Model<EntityAttribute>(testAttribute);
    model.update({ required: false });
    expect(model.current?.required).toBe(false);
    expect(model.status).toBe(ModelStatus.Modified);
    expect(model.canUndo).toBe(true);
  });

  it('handles delete()', () => {
    const model = new Model<EntityAttribute>(testAttribute);
    model.delete();
    expect(model.status).toBe(ModelStatus.Deleted);
  });

  it('handles restore()', () => {
    const model = new Model<EntityAttribute>(testAttribute);
    model.delete();
    model.restore();
    expect(model.status).toBe(ModelStatus.Pristine);
  });

  it('supports undo/redo', () => {
    const model = new Model<EntityAttribute>(testAttribute);
    
    // First update
    model.update({ required: false });
    expect(model.current?.required).toBe(false);
    
    // Second update
    model.update({ description: 'updatedDescription' });
    expect(model.current?.description).toBe('updatedDescription');
    
    // Undo second update
    expect(model.canUndo).toBe(true);
    model.undo();
    expect(model.current?.description).toBe('test description');
    expect(model.current?.required).toBe(false);
    
    // Redo second update
    expect(model.canRedo).toBe(true);
    model.redo();
    expect(model.current?.description).toBe('updatedDescription');
    expect(model.current?.required).toBe(false);

    // No more redo available
    expect(model.canRedo).toBe(false);

    // Undo second update again
    expect(model.canUndo).toBe(true);
    model.undo();
    expect(model.current?.description).toBe('test description');
    expect(model.current?.required).toBe(false);
  });

  it('clears redo stack after new edit following undo', () => {
    const model = new Model<EntityAttribute>(testAttribute);
    
    // Initial state
    expect(model.current?.description).toBe('test description');
    
    // First update
    model.update({ description: 'firstUpdate' });
    expect(model.current?.description).toBe('firstUpdate');
    
    // Second update
    model.update({ description: 'secondUpdate' });
    expect(model.current?.description).toBe('secondUpdate');
    
    // Undo second update
    model.undo();
    expect(model.current?.description).toBe('firstUpdate');
    
    // Make new change after undo - should clear redo stack
    model.update({ description: 'newEdit' });
    expect(model.current?.description).toBe('newEdit');
    
    // Verify redo is no longer available
    expect(model.canRedo).toBe(false);
    
    // Verify undo takes us back through history
    model.undo();
    expect(model.current?.description).toBe('firstUpdate');
    
    model.undo();
    expect(model.current?.description).toBe('test description');
    
    // Verify we can't redo after new edit
    model.redo();
    expect(model.current?.description).toBe('firstUpdate');
    
    model.redo();
    expect(model.current?.description).toBe('newEdit');
    
    // No more redos available
    expect(model.canRedo).toBe(false);
  });

  it('handles new attributes', () => {
    const model = new Model<EntityAttribute>(testAttribute, ModelStatus.New);
    expect(model.status).toBe(ModelStatus.New);
    expect(model.original).toBeUndefined();
  });
});
