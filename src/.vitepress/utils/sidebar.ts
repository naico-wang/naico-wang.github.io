import { generateSidebar } from 'vitepress-sidebar'

const dynamicSideBar = generateSidebar([
  {
    documentRootPath: '/src/pages/fullstack/',
    resolvePath: '/fullstack/',
    useTitleFromFrontmatter: true,
    sortMenusByName: false,
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: false,
    collapsed: true,
    useFolderTitleFromIndexFile: true,
    rootGroupText: '全栈开发'
  },
  {
    documentRootPath: '/src/pages/interview/',
    resolvePath: '/interview/',
    useTitleFromFrontmatter: true,
    sortMenusByName: false,
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: false,
    collapsed: true,
    useFolderTitleFromIndexFile: true,
    rootGroupText: '面试知识储备'
  },
  {
    documentRootPath: '/src/pages/pattern/',
    resolvePath: '/pattern/',
    useTitleFromFrontmatter: true,
    collapsed: false,
    useFolderTitleFromIndexFile: true,
    rootGroupText: '经典设计模式'

  },
  {
    documentRootPath: '/src/pages/architect/',
    resolvePath: '/architect/',
    useTitleFromFrontmatter: true,
    collapsed: false,
    useFolderTitleFromIndexFile: true,
    rootGroupText: '软件架构体系'
  }
])

export default dynamicSideBar
