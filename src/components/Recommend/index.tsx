import styles from './index.module.css';
import { HomeFeatures } from '@site/src/constant/index';
import Link from '@docusaurus/Link';
import ModuleLayout from '@site/src/components/ModuleLayout/index';

export default function Recommend() {
  return (
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
  )
}