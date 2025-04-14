import { Model, ModelStatus } from '../Model';

describe('Model ID generation', () => {
  it('should generate random UUID by default', () => {
    const mockUUID: `${string}-${string}-${string}-${string}-${string}` = '123e4567-e89b-12d3-a456-426614174000';
    const mockRandomUUID = jest.fn<typeof mockUUID, []>(() => mockUUID);
    jest.spyOn(global.crypto, 'randomUUID').mockImplementation(mockRandomUUID);

    const model = new Model({});
    expect(model.id).toBe(mockUUID);
    expect(mockRandomUUID).toHaveBeenCalledTimes(1);

    jest.restoreAllMocks();
  });

  it('should use provided ID generator function', () => {
    const fixedId = 'fixed-id-123';
    const idGenerator = () => fixedId;
    
    const model = new Model({}, ModelStatus.Pristine, idGenerator);
    expect(model.id).toBe(fixedId);
  });

  it('should generate different IDs by default', () => {
    const model1 = new Model({});
    const model2 = new Model({});
    expect(model1.id).not.toBe(model2.id);
  });
});

describe('Model operations', () => {
  it('should track state through create, edit, delete', () => {
    // Test data
    const testData = { name: 'Test', value: 42 };
    
    // 1. Create pristine model
    const model = new Model(testData, ModelStatus.Pristine);
    
    // Verify initial state
    expect(model.status).toBe(ModelStatus.Pristine);
    expect(model.current).toEqual(testData);
    expect(model.previous).toBeNull();
    expect(model.original).toEqual(testData);
    
    // 2. Perform edit
    const editData = { name: 'Updated', value: 100 };
    model.update(editData);
    
    // Verify edit state
    expect(model.status).toBe(ModelStatus.Modified);
    expect(model.current).toEqual(editData);
    expect(model.previous).toEqual(testData);
    expect(model.original).toEqual(testData);
    
    // 3. Perform delete
    model.delete();
    
    // Verify delete state
    expect(model.status).toBe(ModelStatus.Deleted);
    expect(model.current).toBeNull();
    expect(model.previous).toEqual(editData);
    expect(model.original).toEqual(testData);
  });
});
