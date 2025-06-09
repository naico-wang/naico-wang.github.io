import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} wrapperClassName={styles.homeWrapper}>
      <div className={styles.homeContainer}>
        <div className={styles.siteTitle}>Too Young, Too Simple, Sometimes Naive.</div>
        <hr data-content="About Me" />
        <div className={styles.userInfo}>
          <div className={styles.basicInfo}>
            <div className={styles.name}>Hello, I'm <strong>Naico Wang</strong>.</div>
            <ul>
              <li>Work as <strong>Staff Engineer - Web</strong></li>
              <li>Talk is Cheap, Show me the <strong>CODE</strong></li>
              <li>PPT Engineer / Confluence Engineer</li>
              <li><strong>PMP</strong> / <strong>PMI-ACP</strong></li>
            </ul>
          </div>
          <div className={styles.avatar} />
        </div>
        <hr data-content="Work Experiences" />
        <div className={styles.companyList}>
          <img src="/img/company-grain.png" alt="Grain Tech"/>
          <img src="/img/company-chinasoft.png" alt="ChinaSoft"/>
          <img src="/img/company-microsoft.png" alt="Microsoft"/>
          <img src="/img/company-farfetch.png" alt="FARFETCH"/>
          <img src="/img/company-marriott.png" alt="Marriott International"/>
        </div>
        <hr data-content="Recommended Contents" />
        <div className={styles.contentList}>
          <div className={styles.itemList}>
            <div className={clsx(styles.item, styles.number1)}><Link to="/docs/category/系统架构设计">系统架构设计</Link></div>
            <div className={clsx(styles.item, styles.number2)}><Link to="/docs/category/经典设计模式">经典设计模式</Link></div>
            <div className={clsx(styles.item, styles.number3)}><Link to="/docs">算法与数据结构</Link></div>
            <div className={clsx(styles.item, styles.number4)}><Link to="/docs/category/日常读书笔记">日常读书笔记</Link></div>
            <div className={clsx(styles.item, styles.number5)}><Link to="/docs/category/面试八股文">面试八股文</Link></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
