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
    scanStartPath: 'blog',
    resolvePath: '/blog/',
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
    scanStartPath: 'fullstack',
    resolvePath: '/fullstack/',
    ...getMultiFolderSidebarSettings()
  }, {
    documentRootPath,
    scanStartPath: 'architect',
    resolvePath: '/architect/',
    ...getMultiFolderSidebarSettings()
  }]
