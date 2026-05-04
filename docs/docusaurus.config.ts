import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Skelion',
  tagline: 'Zero-config, DOM-aware, SSR-safe skeleton system for React & Next.js',
  favicon: '/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://skelion.bishawaraj.com.np',
  baseUrl: '/',

  organizationName: 'brajbhujel',
  projectName: 'Skelion',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/brajbhujel/Skelion/tree/main/docs/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Skelion',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://www.npmjs.com/package/skelion',
          label: 'npm',
          position: 'right',
        },
        {
          href: 'https://github.com/brajbhujel/Skelion',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Getting Started', to: '/docs/installation' },
            { label: 'API Reference', to: '/docs/api-reference' },
            { label: 'CLI', to: '/docs/cli/overview' },
          ],
        },
        {
          title: 'Links',
          items: [
            { label: 'npm', href: 'https://www.npmjs.com/package/skelion' },
            { label: 'GitHub', href: 'https://github.com/brajbhujel/Skelion' },
          ],
        },
        {
          title: 'Author',
          items: [
            { label: 'Bishawa Raj Bhujel', href: 'https://bishawaraj.com.np' },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} Bishawa Raj Bhujel. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
