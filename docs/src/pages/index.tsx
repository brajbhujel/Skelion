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
    description: 'Reads your actual component layout and generates pixel-perfect skeleton placeholders automatically.',
  },
  {
    title: '4 Animation Styles',
    description: 'Pulse, shimmer, wave, and solid. Customize duration, colors, and radius with CSS variables.',
  },
  {
    title: 'SSR-Safe',
    description: 'Boneyard Pattern ensures zero hydration mismatches in Next.js App Router and streaming.',
  },
  {
    title: 'Zero Config',
    description: 'Wrap your component, set loading={true}, done. No boilerplate, no setup files required.',
  },
  {
    title: 'CLI Tool',
    description: 'npx skelion init to bootstrap. npx skelion generate to scaffold skeleton components instantly.',
  },
  {
    title: 'TypeScript-First',
    description: 'Full type safety with autocomplete-friendly props. Tree-shakable ESM + CJS exports.',
  },
];

const codeExample = `import { Skeleton } from "skelion";
import "skelion/styles.css";

function UserProfile({ user, loading }) {
  return (
    <Skeleton loading={loading} animation="shimmer">
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
        <div style={{marginBottom: 12, opacity: 0.5, fontSize: '0.85rem', fontFamily: 'var(--ifm-font-family-base)', letterSpacing: '0.1em', textTransform: 'uppercase'}}>
          Open Source · v3
        </div>
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle" style={{maxWidth: 600, margin: '0 auto 32px'}}>
          {siteConfig.tagline}
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/">
            Get Started
          </Link>
          <Link
            className="button button--lg"
            style={{
              marginLeft: 12,
              background: 'transparent',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
            to="/playground">
            Playground
          </Link>
        </div>
        <div style={{marginTop: 24, fontFamily: 'monospace', opacity: 0.6, fontSize: '0.9rem'}}>
          npm install skelion
        </div>
      </div>
    </header>
  );
}

function Feature({title, description}: {title: string; description: string}) {
  return (
    <div className={clsx('col col--4')} style={{marginBottom: 24}}>
      <div style={{padding: '24px 16px'}}>
        <Heading as="h3" style={{fontSize: '1.1rem', marginBottom: 8}}>{title}</Heading>
        <p style={{color: '#71717a', fontSize: '0.95rem', lineHeight: 1.6}}>{description}</p>
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Zero-config skeleton system for React & Next.js"
      description="Skelion is a zero-config, DOM-aware, SSR-safe skeleton loading system for React and Next.js. Auto-generate pixel-perfect skeleton UIs from your real component layout.">
      <HomepageHeader />
      <main>
        <section className="container" style={{paddingTop: 64, paddingBottom: 64}}>
          <div className="row">
            {features.map((feature, idx) => (
              <Feature key={idx} {...feature} />
            ))}
          </div>
        </section>

        <section style={{
          borderTop: '1px solid var(--ifm-color-emphasis-200)',
          borderBottom: '1px solid var(--ifm-color-emphasis-200)',
          padding: '64px 0',
        }}>
          <div className="container">
            <div className="row">
              <div className="col col--8 col--offset-2">
                <Heading as="h2" className="text--center" style={{marginBottom: 32}}>
                  Simple API, Powerful Results
                </Heading>
                <CodeBlock language="tsx" title="UserProfile.tsx">
                  {codeExample}
                </CodeBlock>
              </div>
            </div>
          </div>
        </section>

        <section className="container" style={{padding: '64px 0'}}>
          <div className="row">
            <div className="col col--8 col--offset-2 text--center">
              <Heading as="h2" style={{marginBottom: 12}}>Ready to Get Started?</Heading>
              <p style={{color: '#71717a', marginBottom: 24}}>
                Install Skelion and add skeleton loading to your React app in under a minute.
              </p>
              <div style={{display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap'}}>
                <Link className="button button--navy button--lg" to="/docs/installation">
                  Read the Docs
                </Link>
                <Link
                  className="button button--lg"
                  style={{
                    background: 'transparent',
                    border: '1px solid #d4d4d8',
                    color: 'var(--ifm-color-primary)',
                  }}
                  to="/playground">
                  Try the Playground
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
