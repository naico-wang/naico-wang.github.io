import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';
import ModuleLayout from '@site/src/components/ModuleLayout/index';
import HeroBanner from '@site/src/components/HeroBanner/index';
import { HomeFeatures } from '@site/src/constant/index';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title}>
      <HeroBanner />
      <ModuleLayout title="推荐内容">
        <div className={styles.content}>
          {
            ((HomeFeatures || []) as Array<any>).map((_, idx) => {
              return (
                <Link to={_.link} key={`homepage-card-${Math.random()}-${idx}`}>
                  <div className={styles.cardItem}>
                    <div className={styles.cardImage}>
                      <img src={_.image} alt={_.title} />
                    </div>
                    <div className={styles.cardInfo}>
                      <div className={styles.cardTitle}>{_.title.toUpperCase()}</div>
                      <div className={styles.cardDesc}>{_.description}</div>
                    </div>
                  </div>
                </Link>
              )
            })
          }
        </div>
      </ModuleLayout>
      <ModuleLayout title="过往工作经历">
        <div className={styles.companyList}>
          <img src="/img/company-grain.png" alt="Grain Tech"/>
          <img src="/img/company-chinasoft.png" alt="ChinaSoft"/>
          <img src="/img/company-microsoft.png" alt="Microsoft"/>
          <img src="/img/company-farfetch.png" alt="FARFETCH"/>
          <img src="/img/company-marriott.png" alt="Marriott International"/>
        </div>
      </ModuleLayout>
    </Layout>
  );
}
