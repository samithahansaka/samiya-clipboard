# useCopyToClipboard

A React hook for copying content to the clipboard with feedback.

## Usage

```tsx
import { useCopyToClipboard } from '@samithahansaka/clipboard';

const { copy, copied, error, reset } = useCopyToClipboard(options);
```

## Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `successDuration` | `number` | `2000` | Duration in ms before `copied` resets to `false`. Set to `0` to disable auto-reset. |
| `onSuccess` | `(content) => void` | - | Callback when copy succeeds |
| `onError` | `(error) => void` | - | Callback when copy fails |

## Returns

| Property | Type | Description |
|----------|------|-------------|
| `copy` | `(content: CopyContent) => Promise<boolean>` | Function to copy content to clipboard. Returns `true` on success. |
| `copied` | `boolean` | `true` if content was recently copied successfully |
| `error` | `Error \| null` | Error object if copy failed |
| `reset` | `() => void` | Manually reset `copied` and `error` state |

## Types

### CopyContent

Content that can be copied to the clipboard:

```ts
type CopyContent = string | ClipboardItem;

interface ClipboardItem {
  text: string;   // Plain text (required)
  html?: string;  // Rich HTML content (optional)
}
```

## Examples

### Basic Usage

```tsx
const { copy, copied } = useCopyToClipboard();

<button onClick={() => copy('Hello!')}>
  {copied ? 'Copied!' : 'Copy'}
</button>
```

### With Options

```tsx
const { copy, copied } = useCopyToClipboard({
  successDuration: 3000,
  onSuccess: (content) => console.log('Copied:', content),
  onError: (error) => console.error('Failed:', error),
});
```

### Copy Rich Content

```tsx
const { copy } = useCopyToClipboard();

copy({
  text: 'Hello',
  html: '<strong>Hello</strong>',
});
```
