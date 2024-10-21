import DefaultTheme from 'vitepress/theme'
import VueWordCloud from '../utils/wordcloud.mjs'

import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('vue-word-cloud', VueWordCloud)
  }
}

