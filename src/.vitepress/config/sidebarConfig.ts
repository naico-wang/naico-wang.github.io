const documentRootPath = 'src/pages';

type SideBarConfig = {
  documentRootPath?: string,
  scanStartPath?: string,
  resolvePath?: string,
  useTitleFromFrontmatter?: boolean,
  sortMenusByName?: boolean,
  sortMenusByFrontmatterDate?: boolean,
  sortMenusOrderByDescending?: boolean,
  collapsed?: boolean,
  useFolderTitleFromIndexFile?: boolean
  rootGroupText?: string
}

const getMultiFolderSidebarSettings = (collapsed:boolean = true): SideBarConfig => {
  return {
    useTitleFromFrontmatter: true,
    sortMenusByName: false,
    sortMenusByFrontmatterDate: true,
    sortMenusOrderByDescending: false,
    collapsed,
    useFolderTitleFromIndexFile: true
  }
}

const getSingleFolderSidebarSettings = (title: string): SideBarConfig => {
  return {
    useTitleFromFrontmatter: true,
    collapsed: false,
    useFolderTitleFromIndexFile: true,
    rootGroupText: title
  }
}

export const sidebarConfig: SideBarConfig[] = [{
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
    scanStartPath: 'onepic',
    resolvePath: '/onepic/',
    ...getSingleFolderSidebarSettings('一张图读懂系列')
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
