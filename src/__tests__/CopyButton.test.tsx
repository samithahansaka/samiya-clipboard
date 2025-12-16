import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  act,
  waitFor,
} from '@testing-library/react';
import { CopyButton } from '../CopyButton';

describe('CopyButton', () => {
  describe('render prop', () => {
    it('should render children with correct initial state', () => {
      render(
        <CopyButton content="Test">
          {({ copied, error }) => (
            <div>
              <span data-testid="copied">{copied.toString()}</span>
              <span data-testid="error">
                {error ? 'has error' : 'no error'}
              </span>
            </div>
          )}
        </CopyButton>
      );

      expect(screen.getByTestId('copied')).toHaveTextContent('false');
      expect(screen.getByTestId('error')).toHaveTextContent('no error');
    });

    it('should provide copy function that triggers clipboard copy', async () => {
      render(
        <CopyButton content="Copy me">
          {({ copy, copied }) => (
            <button onClick={copy} data-testid="copy-btn">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </CopyButton>
      );

      const button = screen.getByTestId('copy-btn');
      expect(button).toHaveTextContent('Copy');

      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByTestId('copy-btn')).toHaveTextContent('Copied!');
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Copy me');
    });

    it('should provide reset function', async () => {
      render(
        <CopyButton content="Test">
          {({ copy, copied, reset }) => (
            <div>
              <button onClick={copy} data-testid="copy-btn">
                Copy
              </button>
              <button onClick={reset} data-testid="reset-btn">
                Reset
              </button>
              <span data-testid="status">{copied ? 'copied' : 'idle'}</span>
            </div>
          )}
        </CopyButton>
      );

      fireEvent.click(screen.getByTestId('copy-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('status')).toHaveTextContent('copied');
      });

      fireEvent.click(screen.getByTestId('reset-btn'));

      expect(screen.getByTestId('status')).toHaveTextContent('idle');
    });

    it('should provide error state on failure', async () => {
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(
        new Error('Access denied')
      );

      render(
        <CopyButton content="Test">
          {({ copy, error }) => (
            <div>
              <button onClick={copy} data-testid="copy-btn">
                Copy
              </button>
              <span data-testid="error">
                {error ? error.message : 'no error'}
              </span>
            </div>
          )}
        </CopyButton>
      );

      fireEvent.click(screen.getByTestId('copy-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Access denied');
      });
    });
  });

  describe('content prop', () => {
    it('should copy string content', async () => {
      render(
        <CopyButton content="Plain string">
          {({ copy }) => (
            <button onClick={copy} data-testid="copy-btn">
              Copy
            </button>
          )}
        </CopyButton>
      );

      fireEvent.click(screen.getByTestId('copy-btn'));

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
          'Plain string'
        );
      });
    });

    it('should copy ClipboardItem with text only', async () => {
      render(
        <CopyButton content={{ text: 'Text only' }}>
          {({ copy }) => (
            <button onClick={copy} data-testid="copy-btn">
              Copy
            </button>
          )}
        </CopyButton>
      );

      fireEvent.click(screen.getByTestId('copy-btn'));

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Text only');
      });
    });

    it('should copy ClipboardItem with text and html', async () => {
      render(
        <CopyButton content={{ text: 'Rich', html: '<b>Rich</b>' }}>
          {({ copy }) => (
            <button onClick={copy} data-testid="copy-btn">
              Copy
            </button>
          )}
        </CopyButton>
      );

      fireEvent.click(screen.getByTestId('copy-btn'));

      await waitFor(() => {
        expect(navigator.clipboard.write).toHaveBeenCalled();
      });
    });
  });

  describe('successDuration prop', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should use default duration (2000ms)', async () => {
      render(
        <CopyButton content="Test">
          {({ copy, copied }) => (
            <div>
              <button onClick={copy} data-testid="copy-btn">
                Copy
              </button>
              <span data-testid="status">{copied ? 'copied' : 'idle'}</span>
            </div>
          )}
        </CopyButton>
      );

      // Click and wait for the promise to resolve
      await act(async () => {
        fireEvent.click(screen.getByTestId('copy-btn'));
        // Advance just enough to resolve the promise, not the timeout
        await Promise.resolve();
      });

      expect(screen.getByTestId('status')).toHaveTextContent('copied');

      act(() => {
        vi.advanceTimersByTime(1999);
      });
      expect(screen.getByTestId('status')).toHaveTextContent('copied');

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.getByTestId('status')).toHaveTextContent('idle');
    });

    it('should use custom successDuration', async () => {
      render(
        <CopyButton content="Test" successDuration={500}>
          {({ copy, copied }) => (
            <div>
              <button onClick={copy} data-testid="copy-btn">
                Copy
              </button>
              <span data-testid="status">{copied ? 'copied' : 'idle'}</span>
            </div>
          )}
        </CopyButton>
      );

      await act(async () => {
        fireEvent.click(screen.getByTestId('copy-btn'));
        await Promise.resolve();
      });

      expect(screen.getByTestId('status')).toHaveTextContent('copied');

      act(() => {
        vi.advanceTimersByTime(499);
      });
      expect(screen.getByTestId('status')).toHaveTextContent('copied');

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.getByTestId('status')).toHaveTextContent('idle');
    });
  });

  describe('callback props', () => {
    it('should call onSuccess with content on successful copy', async () => {
      const onSuccess = vi.fn();

      render(
        <CopyButton content="Success content" onSuccess={onSuccess}>
          {({ copy }) => (
            <button onClick={copy} data-testid="copy-btn">
              Copy
            </button>
          )}
        </CopyButton>
      );

      fireEvent.click(screen.getByTestId('copy-btn'));

      await waitFor(() => {
        expect(onSuccess).toHaveBeenCalledWith('Success content');
      });
    });

    it('should call onError on failure', async () => {
      const error = new Error('Failed to copy');
      vi.mocked(navigator.clipboard.writeText).mockRejectedValueOnce(error);

      const onError = vi.fn();

      render(
        <CopyButton content="Test" onError={onError}>
          {({ copy }) => (
            <button onClick={copy} data-testid="copy-btn">
              Copy
            </button>
          )}
        </CopyButton>
      );

      fireEvent.click(screen.getByTestId('copy-btn'));

      await waitFor(() => {
        expect(onError).toHaveBeenCalledWith(error);
      });
    });
  });

  describe('content updates', () => {
    it('should copy updated content when content prop changes', async () => {
      const { rerender } = render(
        <CopyButton content="Initial">
          {({ copy }) => (
            <button onClick={copy} data-testid="copy-btn">
              Copy
            </button>
          )}
        </CopyButton>
      );

      fireEvent.click(screen.getByTestId('copy-btn'));

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Initial');
      });

      rerender(
        <CopyButton content="Updated">
          {({ copy }) => (
            <button onClick={copy} data-testid="copy-btn">
              Copy
            </button>
          )}
        </CopyButton>
      );

      fireEvent.click(screen.getByTestId('copy-btn'));

      await waitFor(() => {
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Updated');
      });
    });
  });

  describe('real-world usage patterns', () => {
    it('should work with typical button implementation', async () => {
      render(
        <CopyButton content="https://example.com">
          {({ copy, copied, error }) => (
            <button
              onClick={copy}
              disabled={!!error}
              data-testid="copy-btn"
              className={copied ? 'success' : ''}
            >
              {error ? 'Failed' : copied ? 'Copied!' : 'Copy Link'}
            </button>
          )}
        </CopyButton>
      );

      const button = screen.getByTestId('copy-btn');
      expect(button).toHaveTextContent('Copy Link');
      expect(button).not.toBeDisabled();
      expect(button).not.toHaveClass('success');

      fireEvent.click(button);

      await waitFor(() => {
        expect(button).toHaveTextContent('Copied!');
        expect(button).toHaveClass('success');
      });
    });

    it('should work with icon toggle pattern', async () => {
      render(
        <CopyButton content="Code snippet">
          {({ copy, copied }) => (
            <button
              onClick={copy}
              data-testid="copy-btn"
              aria-label="Copy code"
            >
              <span data-testid="icon">
                {copied ? 'CheckIcon' : 'CopyIcon'}
              </span>
            </button>
          )}
        </CopyButton>
      );

      expect(screen.getByTestId('icon')).toHaveTextContent('CopyIcon');

      fireEvent.click(screen.getByTestId('copy-btn'));

      await waitFor(() => {
        expect(screen.getByTestId('icon')).toHaveTextContent('CheckIcon');
      });
    });

    it('should work with toast notification pattern', async () => {
      const showToast = vi.fn();

      render(
        <CopyButton
          content="Share this!"
          onSuccess={() => showToast('Copied to clipboard!')}
          onError={(err) => showToast(`Error: ${err.message}`)}
        >
          {({ copy }) => (
            <button onClick={copy} data-testid="copy-btn">
              Share
            </button>
          )}
        </CopyButton>
      );

      fireEvent.click(screen.getByTestId('copy-btn'));

      await waitFor(() => {
        expect(showToast).toHaveBeenCalledWith('Copied to clipboard!');
      });
    });
  });
});
