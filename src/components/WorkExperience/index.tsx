import ModuleLayout from '@site/src/components/ModuleLayout/index';
import styles from './index.module.css'

export default function WorkExperience() {
  return (
    <ModuleLayout title="过往工作经历">
      <div className={styles.companyList}>
        <img src="/img/company-grain.png" alt="Grain Tech"/>
        <img src="/img/company-chinasoft.png" alt="ChinaSoft"/>
        <img src="/img/company-microsoft.png" alt="Microsoft"/>
        <img src="/img/company-farfetch.png" alt="FARFETCH"/>
        <img src="/img/company-marriott.png" alt="Marriott International"/>
      </div>
    </ModuleLayout>
  )
}