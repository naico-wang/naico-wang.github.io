import weChatImage from '../../assets/icon-wechat.png'
import gitImage from '../../assets/icon-github.png'
import twitterImage from '../../assets/icon-twitter.png'

import styles from './index.module.css'

const Footer = () => {
  return (
    <footer>
      <div
        className={ styles.sponsor }>
        <div>
          <img
            alt='React v18.3.1'
            src='https://img.shields.io/badge/React-v18.3.1-blue?style=flat-square&logo=react'/>
        </div>
        <div>
          <img
            alt='GitHub Pages'
            src='https://img.shields.io/badge/Git-gitpages-blue?style=flat-square&logo=github'/>
        </div>
      </div>
      <section
        className={ styles.contact }>
        <img
          alt='WeChat'
          src={ weChatImage }/>
        <img
          alt='Github'
          src={ gitImage }/>
        <img
          alt='Twitter'
          src={ twitterImage }/>
      </section>
    </footer>
  )
}

export default Footer
