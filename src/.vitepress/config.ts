import { defineConfig } from 'vitepress'
import markdownItPlantuml from 'markdown-it-plantuml'
import dynamicSideBar from './utils/sidebar'


export default defineConfig({
  title: '奶一口智库',
  titleTemplate: ':title - Naico.Wang',
  description: 'Naico\'s Blog',
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
  markdown: {
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    },
    theme: 'one-dark-pro',
    config: (md) => {
      md.use(markdownItPlantuml);
      md.use(markdownItPlantuml, {
        openMarker: '```wbs',
        closeMarker: '```',
        diagramName: 'wbs',
        imageFormat: 'svg',
      })
    }
  },
  head: [[
    'link',
    { rel: 'icon', href: '/favicon.ico' }
  ],[
    'meta',
    { property: 'og:type', content: 'website' }
  ],[
    'meta',
    { property: 'og:title', content: 'Naico Wang\'s Blog' }
  ],[
    'meta',
    { property: 'og:description', content: 'Naico Wang\'s Blog' }
  ],[
    'meta',
    { property: 'og:image', content: 'https://naico.wang/icons/website-logo-full.png' }
  ],[
    'meta',
    { property: 'og:url', content: 'https://naico.wang' }
  ],[
    'meta',
    { name: 'referrer', content: 'no-referrer' }
  ]],
  themeConfig: {
    siteTitle: '智库',
    logo: '/icons/website-logo.png',
    search: {
      provider: 'local'
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '系统架构', link: '/architect' },
      { text: '全栈开发', link: '/fullstack' },
      { text: '深入设计模式', link: '/pattern' },
      { text: '面试知识储备', link: '/interview' },
      { text: '关于', link: '/about' }
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
      prev: false,
      next: false
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
