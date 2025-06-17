import type {ReactNode} from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HeroBanner from '@site/src/components/HeroBanner/index';
import WorkExperience from '@site/src/components/WorkExperience/index';
import Recommend from '@site/src/components/Recommend/index';

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title}>
      <HeroBanner />
      <Recommend />
      <WorkExperience />
    </Layout>
  );
}
