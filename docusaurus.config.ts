import { themes as prismThemes } from 'prism-react-renderer';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';


const config: Config = {
  title: 'Naico智库',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://naico.wang',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'Naico.Wang', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  staticDirectories: ['static'],
  markdown: {
    mermaid: true,
  },
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex]
        },
        theme: {
          customCss: './src/css/custom.css',
        }
      } satisfies Preset.Options,
    ],
  ],
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig: {
    image: 'img/logo.png',
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: true
      }
    },
    announcementBar: {
      id: 'naico-wang',
      content:
        '<strong>Too Young, Too Simple, Sometimes Naive.</strong>',
      backgroundColor: '#f1f1f1',
      textColor: '#000000',
      isCloseable: false,
    },
    navbar: {
      title: '智库',
      logo: {
        alt: '智库 - naico.wang',
        src: 'img/logo.png',
      },
      hideOnScroll: true,
      items: [
        {
          to: '/docs',
          position: 'right',
          label: '所有文章',
          activeBaseRegex: '^/docs$',
        },
        {
          to: '/docs/tags',
          position: 'right',
          label: '所有标签',
        },
        {
          to: '/docs/category/系统架构设计',
          position: 'right',
          label: '系统架构设计',
          activeBaseRegex: '^/docs/architect',
        },
        {
          to: '/docs/category/经典设计模式',
          position: 'right',
          label: '经典设计模式',
          activeBaseRegex: '^/docs/pattern',
        },
        {
          to: '/docs/category/日常读书笔记',
          position: 'right',
          label: '日常读书笔记',
          activeBaseRegex: '^/docs/reading',
        },
        {
          to: '/docs/category/面试八股文',
          position: 'right',
          label: '面试八股文',
          activeBaseRegex: '^/docs/interview',
        },
        {
          href: 'https://github.com/naico-wang',
          className: 'header-github-link',
          position: 'right',
        },
        {
          href: 'https://www.linkedin.com/in/naico-wang-49554891/',
          className: 'header-linkedin-link',
          position: 'right',
        },
      ],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
      respectPrefersColorScheme: false,
    },
    footer: {
      style: 'light',
      copyright: `Copyright © ${new Date().getFullYear()} naico.wang. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
