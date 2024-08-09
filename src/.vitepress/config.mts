import { fileURLToPath, URL } from 'node:url'
import { Content, defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar'
import markdownItPlantuml from 'markdown-it-plantuml'

const dynamicSideBar = generateSidebar([
  {
    documentRootPath: '/src/pages/blog/',
    resolvePath: '/blog/',
    useTitleFromFrontmatter: true,
    sortMenusByFrontmatterDate: true,
    debugPrint: false,
    collapsed: true
  }
])

export default defineConfig({
  title: '苟利国家生死以，岂因祸福避趋之',
  titleTemplate: ':title - Naico.Wang',
  description: 'Naico\'s Blog',
  base: '/',
  lang: 'en-US',
  srcDir: './pages',
  outDir: '../site',
  lastUpdated: false,
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
    },
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
    { property: 'og:image', content: '/icons/website-logo-full.png' }
  ],[
    'meta',
    { property: 'og:url', content: 'https://naico.wang' }
  ],[
    'meta',
    { name: 'referrer', content: 'no-referrer' }
  ], [
    'meta',
    { name: 'msvalidate.01', content: '8BBB0831B708566918ED021266BE0405' }
  ], [
    'script',
    {},
    `!function(p){"use strict";!function(t){var s=window,e=document,i=p,c="".concat("https:"===e.location.protocol?"https://":"http://","sdk.51.la/js-sdk-pro.min.js"),n=e.createElement("script"),r=e.getElementsByTagName("script")[0];n.type="text/javascript",n.setAttribute("charset","UTF-8"),n.async=!0,n.src=c,n.id="LA_COLLECT",i.d=n;var o=function(){s.LA.ids.push(i)};s.LA?s.LA.ids&&o():(s.LA=p,s.LA.ids=[],o()),r.parentNode.insertBefore(n,r)}()}({id:"3ItqjsY11mrrfGg3",ck:"3ItqjsY11mrrfGg3",autoTrack:true,hashMode:true});`
  ]],
  themeConfig: {
    siteTitle: 'naico.wang',
    logo: '/icons/website-logo.png',
    search: {
      provider: 'local'
    },
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blogs', link: '/blog' },
      { text: 'About Me', link: '/about' }
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
      // prev: '上一篇',
      // next: '下一篇'
    },
    returnToTopLabel: '回顶部',
    sidebarMenuLabel: '菜单',
    externalLinkIcon: true
  },
  vite: {
    resolve: {
      alias: [{
        find: /^.*\/VPFooter\.vue$/,
        replacement: fileURLToPath(
          new URL('./theme/components/CustomFooter.vue', import.meta.url)
        )}]
    }
  },
  metaChunk: true
})
