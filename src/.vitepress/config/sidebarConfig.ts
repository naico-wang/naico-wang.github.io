const documentRootPath = 'src/pages';

const getMultiFolderSidebarSettings = (collapsed = true) => {
  return {
    useTitleFromFrontmatter: true,
    sortMenusByName: false,
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: false,
    collapsed,
    useFolderTitleFromIndexFile: true
  }
}

const getSingleFolderSidebarSettings = (title) => {
  return {
    useTitleFromFrontmatter: true,
    collapsed: false,
    useFolderTitleFromIndexFile: true,
    rootGroupText: title
  }
}

export const sidebarConfig = [{
    documentRootPath,
    scanStartPath: 'development',
    resolvePath: '/development/',
    ...getMultiFolderSidebarSettings()
  }, {
    documentRootPath,
    scanStartPath: 'algorithm',
    resolvePath: '/algorithm/',
    ...getMultiFolderSidebarSettings()
  }, {
    documentRootPath,
    scanStartPath: 'interview',
    resolvePath: '/interview/',
    ...getMultiFolderSidebarSettings()
  }, {
    documentRootPath,
    scanStartPath: 'pattern',
    resolvePath: '/pattern/',
    ...getSingleFolderSidebarSettings('经典设计模式')
  }, {
    documentRootPath,
    scanStartPath: 'vue',
    resolvePath: '/vue/',
    ...getSingleFolderSidebarSettings('Vue源码与进阶')
  }, {
    documentRootPath,
    scanStartPath: 'architect',
    resolvePath: '/architect/',
    ...getMultiFolderSidebarSettings()
  }, {
    documentRootPath,
    scanStartPath: 'react',
    resolvePath: '/react/',
    ...getMultiFolderSidebarSettings(false)
}]
