import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'

const dynamicSideBar = generateSidebar([
  {
    documentRootPath: '/src/pages/blog/',
    resolvePath: '/blog/',
    folderLinkNotIncludesFileName: true,
    includeFolderIndexFile: true,
    capitalizeFirst: true,
    hyphenToSpace: true,
    underscoreToSpace: true,
    useTitleFromFrontmatter: true,
    useFolderLinkFromIndexFile: true,
    debugPrint: false,
    collapsed: false
  }
])

export default defineConfig({
  title: 'Naico Wang',
  titleTemplate: ':title - Naico.Wang',
  description: 'Naico\'s Blog',
  base: '/',
  lang: 'en-US',
  srcDir: './pages',
  outDir: '../site',
  lastUpdated: true,
  cleanUrls: true,
  sitemap: {
    hostname: 'https://naico.wang'
  },
  markdown: {
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    }
  },
  head: [[
    'meta',
    { name: 'msvalidate.01', content: '8BBB0831B708566918ED021266BE0405' }
  ]],
  themeConfig: {
    siteTitle: '学习，提高知识水平',
    logo: '/icon-logo.svg',
    search: {
      provider: 'local'
    },
    nav: [{
      text: 'Home',
      link: '/'
    }, {
      text: 'Blogs',
      link: '/blog'
    }, {
      text: 'About Me',
      link: '/about'
    }],
    sidebar: dynamicSideBar,
    socialLinks: [{
      icon: 'github',
      link: 'https://github.com/naico-wang'
    }, {
      icon: 'linkedin',
      link: 'https://www.linkedin.com/in/naico-hongyu-wang-49554891/'
    }],
    footer: {
      message: 'Powered by <a href="https://vitepress.dev/">VitePress</a>. ' +
        'Local CMS By <a href="https://github.com/huyikai">Huyikai</a>.',
      copyright: 'Hosted on <a href="https://pages.github.com/">GitPages</a>. ' +
        'Copyright © 2024 <a href="https://github.com/naico-wang">Naico Wang</a>'
    },
    outline: {
      label: '页面导航'
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
        forceLocale: true
      }
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    returnToTopLabel: '回顶部',
    sidebarMenuLabel: '菜单',
    externalLinkIcon: true
  }
})
