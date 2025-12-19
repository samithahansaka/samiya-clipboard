# Getting Started

## Installation

::: code-group

```bash [npm]
npm install @samithahansaka/clipboard
```

```bash [yarn]
yarn add @samithahansaka/clipboard
```

```bash [pnpm]
pnpm add @samithahansaka/clipboard
```

:::

## Quick Start

### Hook API

The simplest way to add clipboard functionality:

```tsx
import { useCopyToClipboard } from '@samithahansaka/clipboard';

function MyComponent() {
  const { copy, copied } = useCopyToClipboard();

  return (
    <button onClick={() => copy('Hello, World!')}>
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}
```

### Component API

For simpler use cases, use the render-prop component:

```tsx
import { CopyButton } from '@samithahansaka/clipboard';

function MyComponent() {
  return (
    <CopyButton content="Hello, World!">
      {({ copy, copied }) => (
        <button onClick={copy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      )}
    </CopyButton>
  );
}
```

## Features

- **Modern Clipboard API** with automatic fallbacks
- **Rich HTML content** copying support
- **Auto-reset** copied state after configurable duration
- **Success/error callbacks** for notifications
- **TypeScript** support out of the box
- **SSR-safe** for Next.js, Remix, etc.

## Next Steps

- Check out [Examples](/guide/examples) for more use cases
- See the [API Reference](/api/) for full documentation
