export const navConfig = [
  { text: '首页', link: '/', activeMatch: '' },
  { text: '时间线', link: '/timeline', activeMatch: '/timeline'},
  { text: '博客', link: '/blog', activeMatch: '/blog' },
  { text: '面试八股文', link: '/interview', activeMatch: '/interview' },
  { text: '专题系列文章', activeMatch: '\\b(architect|algorithm|pattern|fullstack)\\b',
    items: [{
      text: '全栈架构', link: '/fullstack', activeMatch: '/fullstack'
    }, {
      text: '架构基础', link: '/architect', activeMatch: '/architect'
    }, {
      text: '算法与数据结构', link: '/algorithm', activeMatch: '/algorithm'
    }, {
      text: '设计模式', link: '/pattern', activeMatch: '/pattern'
  }]},
  { text: '关于', link: '/about', activeMatch: '/about' }
]
