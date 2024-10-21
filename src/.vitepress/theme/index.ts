import DefaultTheme from 'vitepress/theme'
import vuewordcloud from 'vuewordcloud'

import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('vue-word-cloud', vuewordcloud)
  }
}

