import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    'installation',
    'quick-start',
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/auto-skeleton',
        'guides/animations',
        'guides/ssr',
        'guides/styling',
      ],
    },
    'api-reference',
    {
      type: 'category',
      label: 'CLI',
      items: [
        'cli/overview',
        'cli/init',
        'cli/generate',
      ],
    },
    'examples',
    'migration-v2',
  ],
};

export default sidebars;
