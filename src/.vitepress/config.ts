import { defineConfig } from 'vitepress'
import { withSidebar } from 'vitepress-sidebar'
import { sidebarConfig } from './config/sidebarConfig'
import { siteConfig } from './config/siteConfig'

export default defineConfig(withSidebar(siteConfig as any, sidebarConfig))
