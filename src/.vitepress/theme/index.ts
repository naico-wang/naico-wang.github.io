import DefaultTheme from 'vitepress/theme-without-fonts'
import { h } from 'vue';
import GiscusComment from './components/GiscusComment.vue';

import './custom.css'
import './miSans.css'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'doc-after': () => h(GiscusComment)
    });
  },
}
