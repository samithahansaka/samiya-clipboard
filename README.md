# @samithahansaka/clipboard

A modern, lightweight React hook and component for copying to clipboard with feedback.

[![CI](https://github.com/samithahansaka/samiya-clipboard/actions/workflows/ci.yml/badge.svg)](https://github.com/samithahansaka/samiya-clipboard/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@samithahansaka/clipboard.svg)](https://www.npmjs.com/package/@samithahansaka/clipboard)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@samithahansaka/clipboard)](https://bundlephobia.com/package/@samithahansaka/clipboard)
[![codecov](https://codecov.io/gh/samithahansaka/samiya-clipboard/branch/master/graph/badge.svg)](https://codecov.io/gh/samithahansaka/samiya-clipboard)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![license](https://img.shields.io/npm/l/@samithahansaka/clipboard.svg)](https://github.com/samithahansaka/samiya-clipboard/blob/main/LICENSE)
[![docs](https://img.shields.io/badge/docs-VitePress-green.svg)](https://samithahansaka.github.io/samiya-clipboard/)
[![demo](https://img.shields.io/badge/demo-CodeSandbox-blue.svg)](https://codesandbox.io/p/sandbox/samithahansaka-clipboard-demo-s34ypx)

## Features

- **Modern Clipboard API** - Uses `navigator.clipboard` with smart fallbacks
- **Hook + Component APIs** - Use whichever fits your needs
- **Rich content support** - Copy HTML alongside plain text
- **TypeScript-first** - Full type definitions included
- **Zero dependencies** - Just React as a peer dependency
- **Tiny bundle** - ~1KB gzipped
- **SSR-safe** - Works with Next.js, Remix, etc.

## Installation

```bash
npm install @samithahansaka/clipboard
```

```bash
yarn add @samithahansaka/clipboard
```

```bash
pnpm add @samithahansaka/clipboard
```

## Usage

### Hook API

```tsx
import { useCopyToClipboard } from '@samithahansaka/clipboard';

function MyComponent() {
  const { copy, copied, error, reset } = useCopyToClipboard();

  return (
    <button onClick={() => copy('Hello, World!')}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
```

### With Options

```tsx
import { useCopyToClipboard } from '@samithahansaka/clipboard';

function MyComponent() {
  const { copy, copied } = useCopyToClipboard({
    successDuration: 3000, // Reset after 3 seconds (default: 2000)
    onSuccess: (content) => console.log('Copied:', content),
    onError: (error) => console.error('Failed:', error),
  });

  return (
    <button onClick={() => copy('Hello!')}>
      {copied ? '✓ Copied!' : 'Copy to clipboard'}
    </button>
  );
}
```

### Component API

```tsx
import { CopyButton } from '@samithahansaka/clipboard';

function MyComponent() {
  return (
    <CopyButton content="Hello, World!">
      {({ copy, copied, error }) => (
        <button onClick={copy} disabled={!!error}>
          {error ? 'Failed!' : copied ? 'Copied!' : 'Copy'}
        </button>
      )}
    </CopyButton>
  );
}
```

### Copy Rich Content (HTML + Text)

```tsx
import { useCopyToClipboard } from '@samithahansaka/clipboard';

function MyComponent() {
  const { copy, copied } = useCopyToClipboard();

  const handleCopy = () => {
    copy({
      text: 'Hello, World!', // Plain text fallback
      html: '<strong>Hello, World!</strong>', // Rich HTML
    });
  };

  return (
    <button onClick={handleCopy}>
      {copied ? 'Copied!' : 'Copy formatted text'}
    </button>
  );
}
```

### With Toast Notifications

```tsx
import { useCopyToClipboard } from '@samithahansaka/clipboard';
import { toast } from 'your-toast-library';

function CopyableCode({ code }: { code: string }) {
  const { copy, copied } = useCopyToClipboard({
    onSuccess: () => toast.success('Copied to clipboard!'),
    onError: () => toast.error('Failed to copy'),
  });

  return (
    <div className="code-block">
      <pre>{code}</pre>
      <button onClick={() => copy(code)}>
        {copied ? '✓' : 'Copy'}
      </button>
    </div>
  );
}
```

## API Reference

### `useCopyToClipboard(options?)`

#### Options

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `successDuration` | `number` | `2000` | Duration in ms before `copied` resets to `false`. Set to `0` to disable auto-reset. |
| `onSuccess` | `(content) => void` | - | Callback when copy succeeds |
| `onError` | `(error) => void` | - | Callback when copy fails |

#### Returns

| Property | Type | Description |
|----------|------|-------------|
| `copy` | `(content) => Promise<boolean>` | Copy content to clipboard. Returns `true` on success. |
| `copied` | `boolean` | `true` if content was recently copied |
| `error` | `Error \| null` | Error object if copy failed |
| `reset` | `() => void` | Manually reset `copied` and `error` state |

### `<CopyButton>`

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string \| ClipboardItem` | - | Content to copy |
| `successDuration` | `number` | `2000` | Duration before copied state resets |
| `onSuccess` | `(content) => void` | - | Callback on success |
| `onError` | `(error) => void` | - | Callback on error |
| `children` | `(state) => ReactNode` | - | Render prop for custom UI |

#### Render Props

The `children` function receives:

```ts
{
  copy: () => void;      // Trigger copy
  copied: boolean;       // Success state
  error: Error | null;   // Error state
  reset: () => void;     // Reset state
}
```

## Browser Support

- **Modern browsers**: Uses the Clipboard API (`navigator.clipboard`)
- **Older browsers**: Falls back to `document.execCommand('copy')`
- **Rich content**: HTML copying requires Clipboard API support (Chrome 76+, Firefox 63+, Safari 13.1+)

## License

MIT
