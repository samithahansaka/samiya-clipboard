# CopyButton

A render-prop component for copy-to-clipboard functionality.

## Usage

```tsx
import { CopyButton } from '@samithahansaka/clipboard';

<CopyButton content="Hello, World!">
  {({ copy, copied, error, reset }) => (
    <button onClick={copy}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  )}
</CopyButton>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string \| ClipboardItem` | *required* | Content to copy |
| `successDuration` | `number` | `2000` | Duration before copied state resets |
| `onSuccess` | `(content) => void` | - | Callback on success |
| `onError` | `(error) => void` | - | Callback on error |
| `children` | `(state) => ReactElement` | *required* | Render function |

## Render Props

The `children` function receives:

```ts
interface CopyButtonRenderProps {
  copy: () => void;        // Trigger copy
  copied: boolean;         // Success state
  error: Error | null;     // Error state
  reset: () => void;       // Reset state
}
```

## Examples

### Basic

```tsx
<CopyButton content="Hello!">
  {({ copy, copied }) => (
    <button onClick={copy}>
      {copied ? '✓' : 'Copy'}
    </button>
  )}
</CopyButton>
```

### With Error Handling

```tsx
<CopyButton content="Hello!">
  {({ copy, copied, error }) => (
    <button onClick={copy} disabled={!!error}>
      {error ? 'Failed!' : copied ? 'Copied!' : 'Copy'}
    </button>
  )}
</CopyButton>
```

### With Callbacks

```tsx
<CopyButton
  content="Hello!"
  onSuccess={() => toast.success('Copied!')}
  onError={() => toast.error('Failed')}
>
  {({ copy }) => (
    <button onClick={copy}>Copy</button>
  )}
</CopyButton>
```

### Rich Content

```tsx
<CopyButton content={{ text: 'Bold', html: '<strong>Bold</strong>' }}>
  {({ copy, copied }) => (
    <button onClick={copy}>
      {copied ? 'Copied!' : 'Copy formatted'}
    </button>
  )}
</CopyButton>
```
