export const navConfig = [
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
]
