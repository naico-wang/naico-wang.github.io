import { htmlHeadConfig } from './htmlHeadConfig'
import { markdownConfig } from './markdownConfig'
import { navConfig } from './navConfig'

export const siteConfig = {
  title: '智库',
  titleTemplate: ':title - Naico.Wang',
  description: '苟利国家生死以，岂因祸福避趋之',
  base: '/',
  lang: 'en-US',
  srcDir: './pages',
  outDir: '../site',
  lastUpdated: false,
  cleanUrls: true,
  appearance: 'force-auto',
  sitemap: {
    hostname: 'https://naico.wang'
  },
  markdown: markdownConfig,
  head: htmlHeadConfig,
  themeConfig: {
    siteTitle: '智库',
    logo: '/icons/icon-logo.svg',
    nav: navConfig,
    socialLinks: [
      { icon: 'github', link: 'https://github.com/naico-wang' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/naico-hongyu-wang-49554891/' }
    ],
    outline: {
      label: '页面导航',
      level: [ 2, 4 ]
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
        forceLocale: true,
      }
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    footer: {
      message: 'Powered by <a href="https://vitepress.dev/">VitePress</a>. Statics by <a target="_blank" title="51la网站统计" href="https://v6.51.la/land/3ItqjsY11mrrfGg3">51la统计</a>',
      copyright: 'Copyright © 2024 <a href="https://github.com/naico-wang">Naico Wang</a>'
    },
    returnToTopLabel: '回顶部',
    sidebarMenuLabel: '菜单',
    externalLinkIcon: true,
    metaChunk: true
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
            api: 'modern-compiler',
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1500,
    }
  }
}
