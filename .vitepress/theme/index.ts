// https://vitepress.dev/guide/custom-theme
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import HomeLayout from '../components/HomeLayout.vue'
import { initComponent } from 'vitepress-mermaid-preview/component';

import 'vitepress-mermaid-preview/dist/index.css';

import './style.less'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    initComponent(app)
    app.component('HomeLayout', HomeLayout)
  }
} satisfies Theme
