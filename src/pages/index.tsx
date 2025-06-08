import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title}>
      <div className={styles.homeContainer}>
        <div className={styles.siteTitle}>Too Young, Too Simple, Sometimes Naive.</div>
        <hr data-content="关于本站和作者" />
        <div className={styles.userInfo}>
          <div className={styles.basicInfo}>
            <div className={styles.name}>Hello, I'm <strong>Naico Wang</strong>.</div>
            <ul>
              <li>Work as Staff Engineer.</li>
              <li>Used to be an Engineer Lead.</li>
              <li>PMP Certified.</li>
            </ul>
          </div>
          <div className={styles.avatar} />
        </div>
        <hr data-content="服务过的公司" />
        <div className={styles.companyList}>
          <img src="/img/company-grain.png" alt="Grain Tech"/>
          <img src="/img/company-chinasoft.png" alt="ChinaSoft"/>
          <img src="/img/company-microsoft.png" alt="Microsoft"/>
          <img src="/img/company-farfetch.png" alt="FARFETCH"/>
          <img src="/img/company-marriott.png" alt="Marriott International"/>
        </div>
        <hr data-content="推荐内容" />
        <div className={styles.contentList}>
          <div className={styles.itemList}>
            <div className={clsx(styles.item, styles.number1)}><Link to="/category/%E7%B3%BB%E7%BB%9F%E6%9E%B6%E6%9E%84%E8%AE%BE%E8%AE%A1">系统架构设计</Link></div>
            <div className={clsx(styles.item, styles.number2)}><Link to="/category/%E7%BB%8F%E5%85%B8%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F">经典设计模式</Link></div>
            <div className={clsx(styles.item, styles.number3)}><Link to="/algorithm">算法与数据结构</Link></div>
            <div className={clsx(styles.item, styles.number4)}><Link to="/category/%E6%97%A5%E5%B8%B8%E8%AF%BB%E4%B9%A6%E7%AC%94%E8%AE%B0">日常读书笔记</Link></div>
            <div className={clsx(styles.item, styles.number5)}><Link to="/category/%E9%9D%A2%E8%AF%95%E5%85%AB%E8%82%A1%E6%96%87">面试八股文</Link></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
