import DefaultTheme from 'vitepress/theme'
import './custom.css'

import { h } from 'vue';
import GiscusComment from './components/GiscusComment.vue';

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
        'doc-after': () => h(GiscusComment),
    });
  },
}
