import { useState, useCallback, useRef, useEffect } from 'react';
import type {
  CopyContent,
  UseCopyToClipboardOptions,
  UseCopyToClipboardReturn,
  ClipboardItem,
} from './types';

/**
 * Check if content is a ClipboardItem object
 */
function isClipboardItem(content: CopyContent): content is ClipboardItem {
  return typeof content === 'object' && 'text' in content;
}

/**
 * Get plain text from content
 */
function getText(content: CopyContent): string {
  return isClipboardItem(content) ? content.text : content;
}

/**
 * Modern clipboard write using Clipboard API
 */
async function writeToClipboard(content: CopyContent): Promise<void> {
  const text = getText(content);

  // Try modern Clipboard API with rich content support
  if (isClipboardItem(content) && content.html && navigator.clipboard?.write) {
    try {
      const clipboardItem = new window.ClipboardItem({
        'text/plain': new Blob([text], { type: 'text/plain' }),
        'text/html': new Blob([content.html], { type: 'text/html' }),
      });
      await navigator.clipboard.write([clipboardItem]);
      return;
    } catch {
      // Fall through to text-only copy
    }
  }

  // Try modern Clipboard API for text
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  // Fallback for older browsers
  await legacyCopy(text);
}

/**
 * Legacy fallback using execCommand (deprecated but widely supported)
 */
function legacyCopy(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;

    // Prevent scrolling
    textarea.style.position = 'fixed';
    textarea.style.top = '0';
    textarea.style.left = '0';
    textarea.style.width = '2em';
    textarea.style.height = '2em';
    textarea.style.padding = '0';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.boxShadow = 'none';
    textarea.style.background = 'transparent';

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textarea);

      if (successful) {
        resolve();
      } else {
        reject(new Error('Copy command failed'));
      }
    } catch (err) {
      document.body.removeChild(textarea);
      reject(err instanceof Error ? err : new Error('Copy failed'));
    }
  });
}

/**
 * React hook for copying content to clipboard with feedback
 *
 * @example
 * ```tsx
 * const { copy, copied, error } = useCopyToClipboard();
 *
 * <button onClick={() => copy('Hello!')}>
 *   {copied ? 'Copied!' : 'Copy'}
 * </button>
 * ```
 */
export function useCopyToClipboard(
  options: UseCopyToClipboardOptions = {}
): UseCopyToClipboardReturn {
  const { successDuration = 2000, onSuccess, onError } = options;

  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const reset = useCallback(() => {
    setCopied(false);
    setError(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const copy = useCallback(
    async (content: CopyContent): Promise<boolean> => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      try {
        await writeToClipboard(content);

        setCopied(true);
        setError(null);
        onSuccess?.(content);

        // Auto-reset after duration
        if (successDuration > 0) {
          timeoutRef.current = setTimeout(() => {
            setCopied(false);
            timeoutRef.current = null;
          }, successDuration);
        }

        return true;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Copy failed');
        setError(error);
        setCopied(false);
        onError?.(error);
        return false;
      }
    },
    [successDuration, onSuccess, onError]
  );

  return { copy, copied, error, reset };
}
