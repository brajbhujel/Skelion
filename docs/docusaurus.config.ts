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

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Sora:wght@100..800&display=swap',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'keywords',
        content: 'skeleton loader, react skeleton, nextjs skeleton, loading placeholder, shimmer effect, dom-aware skeleton, ssr skeleton, react loading, typescript, zero-config',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:type',
        content: 'website',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:title',
        content: 'Skelion — Zero-config skeleton system for React & Next.js',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        property: 'og:description',
        content: 'DOM-aware, SSR-safe skeleton loading system. Auto-generate pixel-perfect skeleton UIs from your real component layout.',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:title',
        content: 'Skelion — Zero-config skeleton system for React & Next.js',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:description',
        content: 'DOM-aware, SSR-safe skeleton loading system. Auto-generate pixel-perfect skeleton UIs from your real component layout.',
      },
    },
  ],

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
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    metadata: [
      { name: 'description', content: 'Skelion is a zero-config, DOM-aware, SSR-safe skeleton loading system for React and Next.js. Auto-generate pixel-perfect skeleton UIs from your real component layout.' },
      { name: 'author', content: 'Bishawa Raj Bhujel' },
    ],
    colorMode: {
      defaultMode: 'dark',
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Skelion',
      logo: {
        alt: 'Skelion Logo',
        src: 'img/logo-skelion.svg',
      },
      style: 'dark',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/playground',
          label: 'Playground',
          position: 'left',
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
            { label: 'Playground', to: '/playground' },
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
            { label: 'LinkedIn', href: 'https://linkedin.com/in/bishawaraj' },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} Bishawa Raj Bhujel. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'diff'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
