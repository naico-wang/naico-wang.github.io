import { generateSidebar } from 'vitepress-sidebar'

const dynamicSideBar = generateSidebar([
  {
    documentRootPath: '/src/pages/blog/',
    resolvePath: '/blog/',
    useTitleFromFrontmatter: true,
    sortMenusByName: false,
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: false,
    debugPrint: false,
    collapsed: true,
    useFolderTitleFromIndexFile: true
  },
  {
    documentRootPath: '/src/pages/interview/',
    resolvePath: '/interview/',
    useTitleFromFrontmatter: true,
    sortMenusByName: false,
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: false,
    debugPrint: false,
    collapsed: true,
    useFolderTitleFromIndexFile: true
  },
  {
    documentRootPath: '/src/pages/design_pattern/',
    resolvePath: '/design_pattern/',
    useTitleFromFrontmatter: true,
    sortMenusByName: false,
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: false,
    debugPrint: false,
    collapsed: false,
    useFolderTitleFromIndexFile: true
  }
])

export default dynamicSideBar
