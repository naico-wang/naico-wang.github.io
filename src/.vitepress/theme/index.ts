import DefaultTheme from 'vitepress/theme'
import './custom.css'

import { h } from 'vue';
import GiscusComment from './components/GiscusComment.vue';
import CustomFooterImage from './components/CustomFooterImage.vue'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
        'doc-after': () => h(GiscusComment),
        'layout-bottom': () => h(CustomFooterImage)
    });
  },
}
