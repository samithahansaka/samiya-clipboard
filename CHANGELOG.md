# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.5] - 2026-06-05

### Changed

- Bump dev-dependencies group (9 packages) (#14)
- Bump `actions/checkout` from 4 to 6 (#4)
- Bump `actions/setup-node` from 4 to 6 (#5)
- Bump `actions/configure-pages` from 4 to 5 (#6)
- Bump `actions/upload-pages-artifact` from 3 to 4 (#7)

### Chore

- Enable sitemap generation for SEO
- Add Google Search Console verification

## [1.0.1] - 2024-12-17

### Fixed

- Updated to React 19 compatible dependencies
- Fixed CI workflow compatibility issues

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

[1.0.5]: https://github.com/samithahansaka/samiya-clipboard/releases/tag/v1.0.5
[1.0.1]: https://github.com/samithahansaka/samiya-clipboard/releases/tag/v1.0.1
[1.0.0]: https://github.com/samithahansaka/samiya-clipboard/releases/tag/v1.0.0
