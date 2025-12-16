# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-17

### Added

- `useCopyToClipboard` hook for copying text and rich content to clipboard
- `CopyButton` component with render-prop pattern
- Modern Clipboard API support with `execCommand` fallback for legacy browsers
- Rich content copying (HTML + plain text)
- Configurable success duration with `successDuration` option
- `onSuccess` and `onError` callbacks
- Full TypeScript support with exported types
- SSR-safe implementation

[1.0.0]: https://github.com/samithahansaka/samiya-clipboard/releases/tag/v1.0.0
