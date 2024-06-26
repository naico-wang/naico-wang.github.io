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
    useTitleFromFileHeading: false,
    sortMenusByFrontmatterOrder: true,
    debugPrint: true,
    collapsed: true
  }
])

export default defineConfig({
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
    nav: [
      { text: 'Home', link: '/' },
      { text: 'About Me', link: '/about' },
      { text: 'Blogs', link: '/blog'},

    ],

    sidebar: dynamicSideBar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    footer: {
      message: 'Released under the <a href="https://github.com/vuejs/vitepress/blob/main/LICENSE">MIT License</a>.',
      copyright: 'Copyright © 2019-present <a href="https://github.com/yyx990803">Evan You</a>'
    }
  }
})
