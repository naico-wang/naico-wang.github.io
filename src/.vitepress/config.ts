import { defineConfig } from 'vitepress'
import markdownItPlantuml from 'markdown-it-plantuml'
import dynamicSideBar from './utils/sidebar'


export default defineConfig({
  title: '奶一口智库',
  titleTemplate: ':title - Naico.Wang',
  description: '苟利国家生死以，岂因祸福避趋之',
  base: '/',
  lang: 'en-US',
  srcDir: './pages',
  outDir: '../site',
  lastUpdated: false,
  cleanUrls: true,
  // appearance: 'force-auto',
  sitemap: {
    hostname: 'https://naico.wang'
  },
  markdown: {
    math: true,
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    },
    // theme: 'one-dark-pro',
    config: (md) => {
      md.use(markdownItPlantuml, {
        openMarker: '```plantuml',
        closeMarker: '```',
        imageFormat: 'svg',
      })
    }
  },
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '智库' }],
    ['meta', { property: 'og:description', content: '奶一口智库' }],
    ['meta', { property: 'og:image', content: 'https://naico.wang/icons/icon-logo.png' }],
    ['meta', { property: 'og:url', content: 'https://naico.wang' }],
    ['meta', { name: 'referrer', content: 'no-referrer' }]
  ],
  themeConfig: {
    siteTitle: '智库',
    logo: '/icons/icon-logo.svg',
    nav: [
      { text: '首页', link: '/', activeMatch: '' },
      { text: '文章导览', link: '/posts', activeMatch: '/posts' },
      { text: '开发笔记', link: '/development', activeMatch: '/development' },
      { text: '面试八股文', link: '/interview', activeMatch: '/interview' },
      { text: '深入 ● 技术与设计', activeMatch: '\\b(architect|algorithm|pattern|react)\\b',
        items: [{
          text: 'React技术揭秘', link: '/react', activeMatch: '/react'
        }, {
          text: 'Vue源码与进阶', link: '/vue', activeMatch: '/vue'
        }, {
          text: '架构基础', link: '/architect', activeMatch: '/architect'
        }, {
          text: '算法与数据结构', link: '/algorithm', activeMatch: '/algorithm'
        }, {
          text: '设计模式', link: '/pattern', activeMatch: '/pattern'
      }]},
      { text: '关于', link: '/about', activeMatch: '/about' }
    ],
    sidebar: dynamicSideBar,
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
    externalLinkIcon: true
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
})
