import React from 'react'
import styles from './index.module.css'

const ModuleLayout: React.FunctionComponent<{ title: string, children: React.ReactNode }> = ({ title, children }) => {
  return (
    <section className={styles.moduleContainer}>
      <div className={styles.moduleTitle}>{ title }</div>
      { children }
    </section>
  )
}

export default ModuleLayout