import React from 'react'

import styles from './index.module.css'

const HeroBanner: React.FC = () => {

  return (
    <div className={styles.hero}>
      <div className={styles.heroBlur}>
        <div className={styles.heroContent}>
          <div className={styles.siteTitle}>Too Young, Too Simple, Sometimes Naive.</div>
          <div className={styles.userInfo}>
            <div className={styles.basicInfo}>
              <div className={styles.name}>Hello, I'm <strong>Naico (Hongyu) Wang</strong>.</div>
              <ul>
                <li>Work as <strong>Staff Engineer - Web</strong></li>
                <li>Talk is Cheap, Show me the <strong>CODE</strong></li>
                <li>PPT Engineer / Confluence Engineer</li>
                <li><strong>PMP</strong> / <strong>PMI-ACP</strong></li>
              </ul>
            </div>
            <div className={styles.avatar} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroBanner
