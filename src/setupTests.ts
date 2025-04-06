// Mock crypto for Jest tests
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'mock-uuid-' + Math.random().toString(36).substring(2, 9)
  },
  configurable: true,
  writable: true
});
