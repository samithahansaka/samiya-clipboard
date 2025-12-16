export interface ClipboardItem {
  /** Plain text to copy (required, used as fallback) */
  text: string;
  /** HTML content to copy alongside text */
  html?: string;
}

export type CopyContent = string | ClipboardItem;

export interface UseCopyToClipboardOptions {
  /** Duration in ms to show success state (default: 2000) */
  successDuration?: number;
  /** Callback when copy succeeds */
  onSuccess?: (content: CopyContent) => void;
  /** Callback when copy fails */
  onError?: (error: Error) => void;
}

export interface UseCopyToClipboardReturn {
  /** Function to copy content to clipboard */
  copy: (content: CopyContent) => Promise<boolean>;
  /** Whether content was recently copied successfully */
  copied: boolean;
  /** Error if copy failed */
  error: Error | null;
  /** Reset the copied/error state */
  reset: () => void;
}

export interface CopyButtonProps {
  /** Content to copy - string or object with text/html */
  content: CopyContent;
  /** Duration in ms to show success state (default: 2000) */
  successDuration?: number;
  /** Callback when copy succeeds */
  onSuccess?: (content: CopyContent) => void;
  /** Callback when copy fails */
  onError?: (error: Error) => void;
  /** Render prop for custom button UI */
  children: (state: CopyButtonRenderProps) => React.ReactNode;
}

export interface CopyButtonRenderProps {
  /** Function to trigger copy */
  copy: () => void;
  /** Whether content was recently copied */
  copied: boolean;
  /** Error if copy failed */
  error: Error | null;
  /** Reset the state */
  reset: () => void;
}
