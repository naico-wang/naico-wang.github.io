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
    collapsed: true
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
    }],
    footer: {
      message: 'Powered by <a href="https://vitepress.dev/">VitePress</a>. ' +
        'Local CMS By <a href="https://github.com/huyikai">Huyikai</a>.',
      copyright: 'Hosted on <a href="https://pages.github.com/">GitPages</a>. ' +
        'Copyright © 2024 <a href="https://github.com/naico-wang">Naico Wang</a>'
    }
  }
})
