import { generateSidebar } from 'vitepress-sidebar'

const dynamicSideBar = generateSidebar([
  {
    documentRootPath: '/src/pages/mobile/',
    resolvePath: '/mobile/',
    useTitleFromFrontmatter: true,
    sortMenusByName: false,
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: false,
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
    collapsed: true,
    useFolderTitleFromIndexFile: true
  },
  {
    documentRootPath: '/src/pages/pattern/',
    resolvePath: '/pattern/',
    useTitleFromFrontmatter: true,
    collapsed: false,
    useFolderTitleFromIndexFile: true

  },
  {
    documentRootPath: '/src/pages/architect/',
    resolvePath: '/architect/',
    useTitleFromFrontmatter: true,
    collapsed: false,
    useFolderTitleFromIndexFile: true
  }
])

export default dynamicSideBar
