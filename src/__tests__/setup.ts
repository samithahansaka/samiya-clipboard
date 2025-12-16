import { vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Create fresh mock clipboard for each test
const createMockClipboard = () => ({
  writeText: vi.fn().mockResolvedValue(undefined),
  write: vi.fn().mockResolvedValue(undefined),
  readText: vi.fn().mockResolvedValue(''),
  read: vi.fn().mockResolvedValue([]),
});

// Mock ClipboardItem
(globalThis as typeof globalThis & { ClipboardItem: unknown }).ClipboardItem =
  class MockClipboardItem {
    types: string[];
    constructor(items: Record<string, Blob>) {
      this.types = Object.keys(items);
    }
    getType() {
      return Promise.resolve(new Blob());
    }
  } as unknown as typeof ClipboardItem;

// Reset clipboard mock before each test
beforeEach(() => {
  const mockClipboard = createMockClipboard();
  Object.defineProperty(navigator, 'clipboard', {
    value: mockClipboard,
    writable: true,
    configurable: true,
  });
});
