import { defineConfig } from 'vitepress';

export default defineConfig({
  title: '@samithahansaka/clipboard',
  description: 'Modern clipboard hook and component for React',
  base: '/samiya-clipboard/',

  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { name: 'og:title', content: '@samithahansaka/clipboard' }],
    [
      'meta',
      {
        name: 'og:description',
        content: 'Modern clipboard hook and component for React',
      },
    ],
  ],

  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'API', link: '/api/' },
      {
        text: 'Demo',
        link: 'https://codesandbox.io/p/sandbox/samithahansaka-clipboard-demo',
      },
    ],

    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting Started', link: '/guide/' },
          { text: 'Examples', link: '/guide/examples' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'useCopyToClipboard', link: '/api/' },
          { text: 'CopyButton', link: '/api/copy-button' },
        ],
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/samithahansaka/samiya-clipboard',
      },
      { icon: 'npm', link: 'https://www.npmjs.com/package/@samithahansaka/clipboard' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2024 samithahansaka',
    },
  },
});
