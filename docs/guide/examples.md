# Examples

## Basic Copy Button

```tsx
import { useCopyToClipboard } from '@samithahansaka/clipboard';

function CopyButton({ text }: { text: string }) {
  const { copy, copied } = useCopyToClipboard();

  return (
    <button onClick={() => copy(text)}>
      {copied ? '✓ Copied!' : 'Copy'}
    </button>
  );
}
```

## With Custom Duration

Reset the "copied" state after a custom duration:

```tsx
import { useCopyToClipboard } from '@samithahansaka/clipboard';

function MyComponent() {
  const { copy, copied } = useCopyToClipboard({
    successDuration: 5000, // 5 seconds
  });

  return (
    <button onClick={() => copy('Hello!')}>
      {copied ? 'Copied for 5s!' : 'Copy'}
    </button>
  );
}
```

## With Toast Notifications

Integrate with any toast library:

```tsx
import { useCopyToClipboard } from '@samithahansaka/clipboard';
import { toast } from 'sonner'; // or react-hot-toast, etc.

function ShareButton({ url }: { url: string }) {
  const { copy } = useCopyToClipboard({
    onSuccess: () => toast.success('Link copied!'),
    onError: () => toast.error('Failed to copy'),
  });

  return <button onClick={() => copy(url)}>Share</button>;
}
```

## Copy Rich HTML Content

Copy formatted text that pastes correctly in Google Docs, email, etc:

```tsx
import { useCopyToClipboard } from '@samithahansaka/clipboard';

function CopyRichText() {
  const { copy, copied } = useCopyToClipboard();

  const handleCopy = () => {
    copy({
      text: 'Hello, World!',              // Plain text fallback
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

## Code Block with Copy

A practical example for documentation sites:

```tsx
import { useCopyToClipboard } from '@samithahansaka/clipboard';

function CodeBlock({ code, language }: { code: string; language: string }) {
  const { copy, copied, error } = useCopyToClipboard();

  return (
    <div className="code-block">
      <div className="code-header">
        <span>{language}</span>
        <button onClick={() => copy(code)}>
          {error ? 'Failed!' : copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
```

## Using the Component API

For simpler cases where you don't need the full hook:

```tsx
import { CopyButton } from '@samithahansaka/clipboard';

function App() {
  return (
    <CopyButton
      content="Hello, World!"
      onSuccess={() => console.log('Copied!')}
    >
      {({ copy, copied, error, reset }) => (
        <div>
          <button onClick={copy} disabled={!!error}>
            {error ? 'Error!' : copied ? '✓' : 'Copy'}
          </button>
          {copied && <button onClick={reset}>Reset</button>}
        </div>
      )}
    </CopyButton>
  );
}
```

## Manual Reset

Manually reset the copied state:

```tsx
import { useCopyToClipboard } from '@samithahansaka/clipboard';

function MyComponent() {
  const { copy, copied, reset } = useCopyToClipboard({
    successDuration: 0, // Disable auto-reset
  });

  return (
    <div>
      <button onClick={() => copy('Hello!')}>
        {copied ? 'Copied!' : 'Copy'}
      </button>
      {copied && <button onClick={reset}>Reset</button>}
    </div>
  );
}
```
