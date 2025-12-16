# Contributing to @samithahansaka/clipboard

First off, thanks for taking the time to contribute! This project is made better by people like you.

Whether you're fixing a typo, reporting a bug, or proposing a new feature — every contribution matters.

## Quick Links

- [I Have a Question](#i-have-a-question)
- [I Found a Bug](#i-found-a-bug)
- [I Want to Suggest a Feature](#i-want-to-suggest-a-feature)
- [I Want to Contribute Code](#i-want-to-contribute-code)

---

## I Have a Question

Before asking:
1. Check the [README](README.md) — it covers most use cases
2. Search [existing issues](https://github.com/samithahansaka/samiya-clipboard/issues) — someone might have asked already

Still stuck? Open a [Discussion](https://github.com/samithahansaka/samiya-clipboard/discussions) and we'll help out.

---

## I Found a Bug

**Great catch!** Help us fix it by [opening an issue](https://github.com/samithahansaka/samiya-clipboard/issues/new?template=bug_report.md) with:

- What you expected to happen
- What actually happened
- Steps to reproduce
- Browser + OS + React version
- A code snippet (bonus points for a minimal reproduction!)

---

## I Want to Suggest a Feature

We'd love to hear your ideas! [Open a feature request](https://github.com/samithahansaka/samiya-clipboard/issues/new?template=feature_request.md) and tell us:

- What problem does this solve?
- How would the API look?
- Any alternatives you've considered?

Keep in mind: this library aims to stay **small and focused**. We may decline features that add significant complexity or bundle size.

---

## I Want to Contribute Code

Awesome! Here's how to get started:

### 1. Set Up Your Environment

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/samiya-clipboard.git
cd samiya-clipboard

# Install dependencies
npm install

# Make sure everything works
npm test
```

### 2. Create a Branch

```bash
git checkout -b fix/clipboard-safari-bug
# or
git checkout -b feat/add-timeout-option
```

### 3. Make Your Changes

A few guidelines:

| Do | Don't |
|----|-------|
| Write tests for new features | Skip tests |
| Keep changes focused | Mix unrelated changes |
| Follow existing code style | Reformat entire files |
| Update docs if needed | Leave outdated docs |

### 4. Test Your Changes

```bash
npm run lint        # Check code style
npm run typecheck   # Verify types
npm test            # Run tests
npm run build       # Make sure it builds
```

### 5. Commit Your Changes

We use conventional commits:

```bash
git commit -m "fix: handle clipboard permission denied error"
git commit -m "feat: add onCopy callback option"
git commit -m "docs: add Safari troubleshooting section"
```

### 6. Open a Pull Request

Push your branch and [open a PR](https://github.com/samithahansaka/samiya-clipboard/compare). Include:

- What changed and why
- How to test it
- Screenshots (if UI-related)

---

## Code Style

- **TypeScript** — All code is typed
- **Prettier** — Formatting is automatic (runs on commit)
- **ESLint** — Linting catches common issues

Don't worry too much about style — our tools handle most of it automatically.

---

## Project Philosophy

This library follows a few principles:

1. **Zero dependencies** — We only rely on React
2. **Small bundle** — Every byte counts
3. **Simple API** — Easy to use, hard to misuse
4. **Browser compatibility** — Works everywhere, gracefully degrades

If your contribution aligns with these, we'll likely merge it!

---

## License

By contributing, you agree that your code will be licensed under the [MIT License](LICENSE).

---

## Thank You!

Seriously — whether you're fixing a comma or adding a feature, we appreciate you taking the time to make this project better.

Happy coding!
