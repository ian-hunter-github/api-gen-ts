import { History } from '../History';

describe('History', () => {
  interface TestState {
    value: number;
    text: string;
  }

  const initialState: TestState = {
    value: 1,
    text: 'initial'
  };

  let history: History<TestState>;

  beforeEach(() => {
    history = new History(initialState);
  });

  it('should initialize with correct state', () => {
    expect(history.current).toEqual(initialState);
    expect(history.canUndo).toBe(false);
    expect(history.canRedo).toBe(false);
  });

  it('should throw when initialized with null', () => {
    expect(() => new History(null as unknown as TestState)).toThrow();
  });

  it('should handle updates', () => {
    history.update({ value: 2 });
    expect(history.current).not.toBeNull();
    if (history.current) {
      expect(history.current.value).toBe(2);
      expect(history.current.text).toBe('initial');
    }
    expect(history.canUndo).toBe(true);
    expect(history.canRedo).toBe(false);
  });

  it('should throw when updating with null', () => {
    expect(() => history.update(null as unknown as Partial<TestState>)).toThrow();
  });

  it('should handle undo/redo', () => {
    history.update({ value: 2 });
    history.update({ text: 'updated' });

    expect(history.current).not.toBeNull();
    if (history.current) {
      expect(history.current.text).toBe('updated');
    }
    
    history.undo();
    expect(history.current).not.toBeNull();
    if (history.current) {
      expect(history.current.text).toBe('initial');
    }
    expect(history.canRedo).toBe(true);

    history.redo();
    expect(history.current).not.toBeNull();
    if (history.current) {
      expect(history.current.text).toBe('updated');
    }
  });

  it('should truncate history on update after undo', () => {
    history.update({ value: 2 });
    history.update({ value: 3 });
    history.undo();
    history.update({ value: 4 });

    expect(history.historyLength).toBe(3);
    expect(history.current).not.toBeNull();
    if (history.current) {
      expect(history.current.value).toBe(4);
    }
    expect(history.canRedo).toBe(false);
  });

  it('should return null when undo/redo not possible', () => {
    expect(history.undo()).toBeNull();
    expect(history.redo()).toBeNull();
  });

  it('should handle deletion of current entry', () => {
    history.update({ value: 2, text: 'updated' });
    const initialLength = history.historyLength;
    
    history.updateDeleted();
    
    expect(history.current).toBeNull();
    expect(history.historyLength).toBe(initialLength + 1);
    expect(history.canUndo).toBe(true);
    
    history.undo();
    expect(history.current).toEqual({ value: 2, text: 'updated' });
    
    history.redo();
    expect(history.current).toBeNull();
  });

  it('should handle multiple deletes with undo/redo', () => {
    history.update({ value: 2 });
    history.update({ text: 'updated' });
    const initialLength = history.historyLength;

    history.updateDeleted();
    expect(history.current).toBeNull();
    expect(history.historyLength).toBe(initialLength + 1);

    // Second delete should be skipped since already deleted
    history.updateDeleted();
    expect(history.current).toBeNull();
    expect(history.historyLength).toBe(initialLength + 1);

    history.undo();
    expect(history.current).toEqual({ value: 2, text: 'updated' });

    history.redo();
    expect(history.current).toBeNull();
  });

  it('should handle delete after undo operations', () => {
    history.update({ value: 2 });
    history.update({ text: 'updated' });
    const initialLength = history.historyLength;

    history.undo();
    expect(history.current).toEqual({ value: 2, text: 'initial' });

    history.updateDeleted();
    expect(history.current).toBeNull();
    expect(history.historyLength).toBe(initialLength);

    history.undo();
    expect(history.current).toEqual({ value: 2, text: 'initial' });

    history.redo();
    expect(history.current).toBeNull();
  });

  it('should handle delete at start of history', () => {
    history.updateDeleted();
    expect(history.current).toBeNull();
    expect(history.historyLength).toBe(2);

    history.undo();
    expect(history.current).toEqual(initialState);

    history.redo();
    expect(history.current).toBeNull();
  });

  it('should handle delete at end of history', () => {
    history.update({ value: 2 });
    history.update({ text: 'updated' });
    const initialLength = history.historyLength;

    history.updateDeleted();
    expect(history.current).toBeNull();
    expect(history.historyLength).toBe(initialLength + 1);

    history.undo();
    expect(history.current).toEqual({ value: 2, text: 'updated' });

    history.redo();
    expect(history.current).toBeNull();
  });

  it('should skip update when state would not change', () => {
    const initialLength = history.historyLength;
    history.update({ value: 1 }); // Same value as initial state
    expect(history.historyLength).toBe(initialLength);
    expect(history.current).toEqual(initialState);
  });

  it('should skip updateDeleted when already deleted', () => {
    history.updateDeleted();
    const currentLength = history.historyLength;
    history.updateDeleted(); // Already deleted
    expect(history.historyLength).toBe(currentLength);
    expect(history.current).toBeNull();
  });

  it('should handle deep equality checks for updates', () => {
    const initialLength = history.historyLength;
    history.update({ ...initialState }); // New object but same content
    expect(history.historyLength).toBe(initialLength);
    expect(history.current).toEqual(initialState);
  });
});
