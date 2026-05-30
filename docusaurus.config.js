// @ts-check

import { themes as prismThemes } from 'prism-react-renderer';
import rehypeShiki from '@shikijs/rehype';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Facility API Framework',
  tagline: 'Design, implement, consume, and document APIs with simple API definitions.',
  favicon: 'img/fsdicon.png',

  url: 'https://facilityapi.github.io',
  baseUrl: '/',
  trailingSlash: false,

  organizationName: 'FacilityApi',
  projectName: 'FacilityApi.github.io',

  onBrokenAnchors: 'throw',
  onBrokenLinks: 'throw',
  onDuplicateRoutes: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  markdown: {
    format: 'md',
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        indexBlog: false,
        hashed: true,
        docsRouteBasePath: '/',
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.js',
          editUrl: 'https://github.com/FacilityApi/FacilityApi.github.io/tree/master/',
          beforeDefaultRehypePlugins: [
            [
              rehypeShiki,
              {
                themes: {
                  light: 'light-plus',
                  dark: 'dark-plus',
                },
                langs: ['csharp', 'javascript', 'typescript', 'json', 'yaml', 'bash', 'markdown'],
              },
            ],
          ],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Facility',
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar',
            position: 'left',
            label: 'Documentation',
          },
          {
            href: '/editor',
            label: 'Live Editor',
            position: 'left',
          },
          {
            href: 'https://github.com/FacilityApi',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        copyright: `Copyright © ${new Date().getFullYear()} Ed Ball. Built with Docusaurus.`,
      },
      colorMode: {
        respectPrefersColorScheme: true,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
        additionalLanguages: ['csharp', 'javascript', 'typescript', 'json', 'yaml', 'bash', 'markdown'],
      },
    }),
};

export default config;
