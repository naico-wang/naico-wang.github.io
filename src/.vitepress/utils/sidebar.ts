import { generateSidebar } from 'vitepress-sidebar'

const dynamicSideBar = generateSidebar([
  {
    documentRootPath: 'src/pages',
    scanStartPath: 'development',
    resolvePath: '/development/',
    useTitleFromFrontmatter: true,
    sortMenusByName: false,
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: false,
    collapsed: true,
    useFolderTitleFromIndexFile: true
  },
  {
    documentRootPath: 'src/pages',
    scanStartPath: 'algorithm',
    resolvePath: '/algorithm/',
    useTitleFromFrontmatter: true,
    sortMenusByName: false,
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: false,
    collapsed: true,
    useFolderTitleFromIndexFile: true
  },
  {
    documentRootPath: 'src/pages',
    scanStartPath: 'interview',
    resolvePath: '/interview/',
    useTitleFromFrontmatter: true,
    sortMenusByName: false,
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: false,
    collapsed: true,
    useFolderTitleFromIndexFile: true
  },
  {
    documentRootPath: 'src/pages',
    scanStartPath: 'pattern',
    resolvePath: '/pattern/',
    useTitleFromFrontmatter: true,
    collapsed: false,
    useFolderTitleFromIndexFile: true,
    rootGroupText: '经典设计模式'

  },
  {
    documentRootPath: 'src/pages',
    scanStartPath: 'architect',
    resolvePath: '/architect/',
    useTitleFromFrontmatter: true,
    collapsed: false,
    useFolderTitleFromIndexFile: true
  }
])

export default dynamicSideBar
