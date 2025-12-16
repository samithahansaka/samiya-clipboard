import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCopyToClipboard } from '../useCopyToClipboard';

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('should return initial state with copied false and no error', () => {
      const { result } = renderHook(() => useCopyToClipboard());

      expect(result.current.copied).toBe(false);
      expect(result.current.error).toBe(null);
      expect(typeof result.current.copy).toBe('function');
      expect(typeof result.current.reset).toBe('function');
    });
  });

  describe('copy function', () => {
    it('should copy plain text to clipboard', async () => {
      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        const success = await result.current.copy('Hello World');
        expect(success).toBe(true);
      });

      expect(result.current.copied).toBe(true);
      expect(result.current.error).toBe(null);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hello World');
    });

    it('should copy ClipboardItem with text only', async () => {
      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        const success = await result.current.copy({ text: 'Plain text' });
        expect(success).toBe(true);
      });

      expect(result.current.copied).toBe(true);
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Plain text');
    });

    it('should copy ClipboardItem with text and html using write API', async () => {
      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        const success = await result.current.copy({
          text: 'Bold text',
          html: '<b>Bold text</b>',
        });
        expect(success).toBe(true);
      });

      expect(result.current.copied).toBe(true);
      // The write API is called for rich content
      expect(navigator.clipboard.write).toHaveBeenCalled();
    });

    it('should return false and set error on clipboard failure', async () => {
      const clipboardError = new Error('Clipboard access denied');
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(
        clipboardError
      );

      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        const success = await result.current.copy('Test');
        expect(success).toBe(false);
      });

      expect(result.current.copied).toBe(false);
      expect(result.current.error).toEqual(clipboardError);
    });

    it('should wrap non-Error exceptions in Error object', async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(
        'String error'
      );

      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('Test');
      });

      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toBe('Copy failed');
    });
  });

  describe('auto-reset behavior', () => {
    it('should auto-reset copied state after default duration (2000ms)', async () => {
      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('Test');
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.copied).toBe(false);
    });

    it('should auto-reset after custom duration', async () => {
      const { result } = renderHook(() =>
        useCopyToClipboard({ successDuration: 500 })
      );

      await act(async () => {
        await result.current.copy('Test');
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        vi.advanceTimersByTime(499);
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        vi.advanceTimersByTime(1);
      });

      expect(result.current.copied).toBe(false);
    });

    it('should not auto-reset when successDuration is 0', async () => {
      const { result } = renderHook(() =>
        useCopyToClipboard({ successDuration: 0 })
      );

      await act(async () => {
        await result.current.copy('Test');
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        vi.advanceTimersByTime(10000);
      });

      expect(result.current.copied).toBe(true);
    });

    it('should clear previous timeout on new copy', async () => {
      const { result } = renderHook(() =>
        useCopyToClipboard({ successDuration: 1000 })
      );

      await act(async () => {
        await result.current.copy('First');
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      await act(async () => {
        await result.current.copy('Second');
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should still be copied because second copy reset the timer
      expect(result.current.copied).toBe(true);

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(result.current.copied).toBe(false);
    });
  });

  describe('reset function', () => {
    it('should reset copied state', async () => {
      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('Test');
      });

      expect(result.current.copied).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.copied).toBe(false);
    });

    it('should reset error state', async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(
        new Error('Failed')
      );

      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('Test');
      });

      expect(result.current.error).not.toBe(null);

      act(() => {
        result.current.reset();
      });

      expect(result.current.error).toBe(null);
    });

    it('should clear pending auto-reset timeout', async () => {
      const { result } = renderHook(() =>
        useCopyToClipboard({ successDuration: 1000 })
      );

      await act(async () => {
        await result.current.copy('Test');
      });

      act(() => {
        result.current.reset();
      });

      expect(result.current.copied).toBe(false);

      // Advance past original timeout - should stay false
      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current.copied).toBe(false);
    });
  });

  describe('callbacks', () => {
    it('should call onSuccess callback with content on successful copy', async () => {
      const onSuccess = vi.fn();
      const { result } = renderHook(() => useCopyToClipboard({ onSuccess }));

      await act(async () => {
        await result.current.copy('Success content');
      });

      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledWith('Success content');
    });

    it('should call onSuccess with ClipboardItem', async () => {
      const onSuccess = vi.fn();
      const { result } = renderHook(() => useCopyToClipboard({ onSuccess }));

      const content = { text: 'Text', html: '<b>Text</b>' };
      await act(async () => {
        await result.current.copy(content);
      });

      expect(onSuccess).toHaveBeenCalledWith(content);
    });

    it('should call onError callback on failure', async () => {
      const error = new Error('Copy failed');
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(error);

      const onError = vi.fn();
      const { result } = renderHook(() => useCopyToClipboard({ onError }));

      await act(async () => {
        await result.current.copy('Test');
      });

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(error);
    });

    it('should not call onSuccess on failure', async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(
        new Error('Failed')
      );

      const onSuccess = vi.fn();
      const { result } = renderHook(() => useCopyToClipboard({ onSuccess }));

      await act(async () => {
        await result.current.copy('Test');
      });

      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('should not call onError on success', async () => {
      const onError = vi.fn();
      const { result } = renderHook(() => useCopyToClipboard({ onError }));

      await act(async () => {
        await result.current.copy('Test');
      });

      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe('cleanup', () => {
    it('should clear timeout on unmount', async () => {
      const { result, unmount } = renderHook(() =>
        useCopyToClipboard({ successDuration: 1000 })
      );

      await act(async () => {
        await result.current.copy('Test');
      });

      unmount();

      // Should not throw or cause memory leaks
      act(() => {
        vi.advanceTimersByTime(2000);
      });
    });
  });

  describe('fallback behavior', () => {
    it('should fallback to writeText when write fails for rich content', async () => {
      // Mock write to fail, then writeText should be called as fallback
      const writeMock = vi
        .fn()
        .mockRejectedValueOnce(new Error('Not supported'));
      const writeTextMock = vi.fn().mockResolvedValueOnce(undefined);

      Object.defineProperty(navigator, 'clipboard', {
        value: {
          write: writeMock,
          writeText: writeTextMock,
        },
        writable: true,
        configurable: true,
      });

      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        const success = await result.current.copy({
          text: 'Fallback text',
          html: '<b>Fallback</b>',
        });
        expect(success).toBe(true);
      });

      expect(writeMock).toHaveBeenCalled();
      expect(writeTextMock).toHaveBeenCalledWith('Fallback text');
    });

    it('should use legacy execCommand when Clipboard API is not available', async () => {
      // Remove clipboard API
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      // Mock execCommand to succeed
      const execCommandMock = vi.fn().mockReturnValue(true);
      document.execCommand = execCommandMock;

      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        const success = await result.current.copy('Legacy copy');
        expect(success).toBe(true);
      });

      expect(execCommandMock).toHaveBeenCalledWith('copy');
      expect(result.current.copied).toBe(true);
    });

    it('should use legacy execCommand when writeText is not available', async () => {
      // Clipboard exists but without writeText
      Object.defineProperty(navigator, 'clipboard', {
        value: {},
        writable: true,
        configurable: true,
      });

      const execCommandMock = vi.fn().mockReturnValue(true);
      document.execCommand = execCommandMock;

      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        const success = await result.current.copy('Legacy fallback');
        expect(success).toBe(true);
      });

      expect(execCommandMock).toHaveBeenCalledWith('copy');
    });

    it('should handle legacy execCommand returning false', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const execCommandMock = vi.fn().mockReturnValue(false);
      document.execCommand = execCommandMock;

      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        const success = await result.current.copy('Failed copy');
        expect(success).toBe(false);
      });

      expect(result.current.error?.message).toBe('Copy command failed');
    });

    it('should handle legacy execCommand throwing an error', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const execCommandMock = vi.fn().mockImplementation(() => {
        throw new Error('execCommand not supported');
      });
      document.execCommand = execCommandMock;

      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        const success = await result.current.copy('Error copy');
        expect(success).toBe(false);
      });

      expect(result.current.error?.message).toBe('execCommand not supported');
    });

    it('should handle legacy execCommand throwing a non-Error', async () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      const execCommandMock = vi.fn().mockImplementation(() => {
        throw 'String error';
      });
      document.execCommand = execCommandMock;

      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        const success = await result.current.copy('Non-error throw');
        expect(success).toBe(false);
      });

      expect(result.current.error?.message).toBe('Copy failed');
    });
  });

  describe('state transitions', () => {
    it('should clear error on successful copy after failure', async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(
        new Error('First failure')
      );

      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('Test');
      });

      expect(result.current.error).not.toBe(null);
      expect(result.current.copied).toBe(false);

      await act(async () => {
        await result.current.copy('Test again');
      });

      expect(result.current.error).toBe(null);
      expect(result.current.copied).toBe(true);
    });

    it('should set error and clear copied on failure after success', async () => {
      const { result } = renderHook(() => useCopyToClipboard());

      await act(async () => {
        await result.current.copy('Success');
      });

      expect(result.current.copied).toBe(true);

      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(
        new Error('Failure')
      );

      await act(async () => {
        await result.current.copy('Fail');
      });

      expect(result.current.copied).toBe(false);
      expect(result.current.error).not.toBe(null);
    });
  });
});
