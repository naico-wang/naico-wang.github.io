import DefaultTheme from 'vitepress/theme-without-fonts'
import { h } from 'vue';
import GiscusComment from './components/GiscusComment.vue';
import Home from './components/Home.vue'

import './custom.css'
import './font-misans.css'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(GiscusComment),
      'home-hero-before': () => h(Home)
    });
  },
}
