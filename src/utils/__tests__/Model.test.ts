import { Model } from '../Model';

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
    
    const model = new Model({}, 'pristine', idGenerator);
    expect(model.id).toBe(fixedId);
  });

  it('should generate different IDs by default', () => {
    const model1 = new Model({});
    const model2 = new Model({});
    expect(model1.id).not.toBe(model2.id);
  });
});
