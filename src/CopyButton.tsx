import React, { useCallback } from 'react';
import { useCopyToClipboard } from './useCopyToClipboard';
import type { CopyButtonProps } from './types';

/**
 * Render-prop component for copy-to-clipboard functionality
 *
 * @example
 * ```tsx
 * <CopyButton content="Hello world!">
 *   {({ copy, copied }) => (
 *     <button onClick={copy}>
 *       {copied ? 'Copied!' : 'Copy'}
 *     </button>
 *   )}
 * </CopyButton>
 * ```
 *
 * @example With rich content
 * ```tsx
 * <CopyButton content={{ text: 'Hello', html: '<b>Hello</b>' }}>
 *   {({ copy, copied, error }) => (
 *     <button onClick={copy} disabled={!!error}>
 *       {error ? 'Failed' : copied ? 'Copied!' : 'Copy'}
 *     </button>
 *   )}
 * </CopyButton>
 * ```
 */
export function CopyButton({
  content,
  successDuration,
  onSuccess,
  onError,
  children,
}: CopyButtonProps): React.ReactElement {
  const { copy, copied, error, reset } = useCopyToClipboard({
    successDuration,
    onSuccess,
    onError,
  });

  const handleCopy = useCallback(() => {
    copy(content);
  }, [copy, content]);

  return children({ copy: handleCopy, copied, error, reset });
}
