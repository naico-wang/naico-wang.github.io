import { defineConfig } from 'vitepress'
import { generateSidebarForPath } from './utils/generateSidebar';
import { vitepressMermaidPreview } from 'vitepress-mermaid-preview'

export default defineConfig({
  title: '奶一口智库',
  description: '苟利国家生死以，岂因祸福避趋之',
  head: [
    ['link', { rel: 'icon', href: '/images/favicon.ico' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: '奶一口智库' }],
    ['meta', { property: 'og:description', content: '奶一口智库' }],
    ['meta', { property: 'og:image', content: 'https://naico.wang/icons/icon-logo.png' }],
    ['meta', { property: 'og:url', content: 'https://naico.wang' }],
    ['meta', { name: 'referrer', content: 'no-referrer' }],
    ['script', {}, `!function(p){"use strict";!function(t){var s=window,e=document,i=p,c="".concat("https:"===e.location.protocol?"https://":"http://","sdk.51.la/js-sdk-pro.min.js"),n=e.createElement("script"),r=e.getElementsByTagName("script")[0];n.type="text/javascript",n.setAttribute("charset","UTF-8"),n.async=!0,n.src=c,n.id="LA_COLLECT",i.d=n;var o=function(){s.LA.ids.push(i)};s.LA?s.LA.ids&&o():(s.LA=p,s.LA.ids=[],o()),r.parentNode.insertBefore(n,r)}()}({id:"3ItqjsY11mrrfGg3",ck:"3ItqjsY11mrrfGg3",autoTrack:true,hashMode:true});`]
  ],
  outDir: './dist',
  srcDir: 'src',
  themeConfig: {
    logo: {
      light: '/images/logo-light.svg',
      dark: '/images/logo-dark.svg'
    },
    search: {
      provider: 'local',
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '经典设计模式', link: '/design-pattern' },
      { text: 'AI 工程化', link: '/ai-engineering' },
    ],
    sidebar: {
      '/design-pattern/': generateSidebarForPath('design-pattern'),
      '/ai-engineering/': generateSidebarForPath('ai-engineering')
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/naico-wang/naico-wang.github.io' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/naico-wang-49554891/' }
    ],
    outline: {
      label: '页面导航'
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
      message: 'Powered by <a href="https://vitepress.dev/">VitePress</a>.',
      copyright: `Copyright © ${new Date().getFullYear()} <a href="https://github.com/naico-wang">Naico Wang</a>. Statics by <a target="_blank" title="51la网站统计" href="https://v6.51.la/land/3ItqjsY11mrrfGg3">51La</a>.`
    },
    returnToTopLabel: '回顶部',
    sidebarMenuLabel: '菜单',
    externalLinkIcon: true,
  },
  markdown: {
    config: (md: any) => {
      vitepressMermaidPreview(md, {
        showToolbar: true,
      });
    },
    lineNumbers: true,
    image: {
      lazyLoading: true
    },
    theme: {
      light: 'min-light',
      dark: 'min-dark'
    },
  }
})
