import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CodeBlock from '@theme/CodeBlock';

import styles from './index.module.css';

const features = [
  {
    title: 'DOM-Aware Auto Skeleton',
    description: 'Reads your actual component layout and generates pixel-perfect skeleton placeholders. No manual skeleton building needed.',
  },
  {
    title: '4 Animation Styles',
    description: 'Choose from pulse, shimmer, wave, or solid. Customize duration and style with CSS variables.',
  },
  {
    title: 'SSR-Safe',
    description: 'Boneyard Pattern ensures zero hydration mismatches in Next.js. Works with App Router, streaming, and Suspense.',
  },
  {
    title: 'Zero Config',
    description: 'Wrap your component, set loading={true}, done. CSS variables for theming. Tailwind-friendly.',
  },
  {
    title: 'CLI Tool',
    description: 'npx skelion init to set up. npx skelion generate to create skeleton components from templates.',
  },
  {
    title: 'TypeScript-First',
    description: 'Full type safety with autocomplete-friendly props. Tree-shakable exports. Minimal dependencies.',
  },
];

const codeExample = `import { Skeleton } from "skelion";
import "skelion/styles.css";

function UserProfile({ user, loading }) {
  return (
    <Skeleton loading={loading}>
      <div className="profile">
        <img src={user.avatar} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.bio}</p>
      </div>
    </Skeleton>
  );
}`;

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/">
            Get Started
          </Link>
          <Link
            className="button button--outline button--lg"
            style={{marginLeft: '1rem', color: 'white', borderColor: 'white'}}
            to="/docs/api-reference">
            API Reference
          </Link>
        </div>
        <div style={{marginTop: '1rem', opacity: 0.9, fontSize: '0.9rem'}}>
          <code>npm install skelion</code>
        </div>
      </div>
    </header>
  );
}

function Feature({title, description}: {title: string; description: string}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="padding-horiz--md padding-vert--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="Zero-config skeleton system"
      description="Zero-config, DOM-aware, SSR-safe skeleton system for React & Next.js">
      <HomepageHeader />
      <main>
        <section className="container margin-vert--xl">
          <div className="row">
            {features.map((feature, idx) => (
              <Feature key={idx} {...feature} />
            ))}
          </div>
        </section>

        <section className="container margin-vert--xl">
          <div className="row">
            <div className="col col--8 col--offset-2">
              <Heading as="h2" className="text--center margin-bottom--lg">
                Simple API, Powerful Results
              </Heading>
              <CodeBlock language="tsx" title="UserProfile.tsx">
                {codeExample}
              </CodeBlock>
            </div>
          </div>
        </section>

        <section className="container margin-vert--xl">
          <div className="row">
            <div className="col col--8 col--offset-2 text--center">
              <Heading as="h2">Ready to Get Started?</Heading>
              <p className="margin-bottom--lg">
                Install Skelion and add skeleton loading to your React app in under a minute.
              </p>
              <Link
                className="button button--primary button--lg"
                to="/docs/installation">
                Read the Docs
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
