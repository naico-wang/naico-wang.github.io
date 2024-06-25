import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  titleTemplate: ':title - Naico.Wang',
  description: 'Naico\'s Blog',
  base: '/',
  lang: 'en-US',
  head: [
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' }
    ],
    [
      'link',
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
    ],
    [
      'link',
      { href: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap', rel: 'stylesheet' }
    ]
  ],
  srcDir: './pages',
  outDir: '../site',
  assetsDir: 'static',
  sitemap: {
    hostname: 'https://naico.wang'
  },
  themeConfig: {
    siteTitle: false,
    logo: '/logo.png',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: 'Dropdown',
        items: [
          { text: 'Examples', link: '/markdown-examples' },
          { text: 'Home', link: '/' },
          { text: 'Examples', link: '/markdown-examples' }
        ]
      },

    ],

    sidebar: [
      {
        text: 'Examples',
        items: [
          { text: 'Markdown Examples', link: '/markdown-examples' },
          { text: 'Runtime API Examples', link: '/api-examples' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
