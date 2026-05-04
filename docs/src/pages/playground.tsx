import React, { useState } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

// ─────────────────────────────────────────────
// Inline skeleton components for the playground
// (can't import from skelion in docs build, so
//  we recreate the visual behavior with CSS)
// ─────────────────────────────────────────────

const ANIMATIONS = ['pulse', 'shimmer', 'wave', 'solid'] as const;
type Animation = typeof ANIMATIONS[number];

const VARIANTS = ['auto', 'text', 'avatar', 'card', 'image'] as const;
type Variant = typeof VARIANTS[number];

// Skeleton CSS is inlined here for the playground preview
const skeletonStyles = `
  @keyframes sk-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }
  @keyframes sk-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  @keyframes sk-wave {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
`;

function getSkeletonStyle(
  animation: Animation,
  duration: number,
  color: string,
  shimmerColor: string,
): React.CSSProperties {
  const base: React.CSSProperties = {
    backgroundColor: color,
    borderRadius: 4,
    overflow: 'hidden',
    position: 'relative' as const,
  };

  switch (animation) {
    case 'pulse':
      return { ...base, animation: `sk-pulse ${duration}s ease-in-out infinite` };
    case 'shimmer':
      return {
        ...base,
        background: `linear-gradient(90deg, ${color} 0%, ${shimmerColor} 50%, ${color} 100%)`,
        backgroundSize: '200% 100%',
        animation: `sk-shimmer ${duration}s ease-in-out infinite`,
      };
    case 'wave':
      return base;
    case 'solid':
      return base;
  }
}

function SkeletonBox({
  width = '100%',
  height = 16,
  circle = false,
  animation,
  duration,
  color,
  shimmerColor,
  style,
}: {
  width?: number | string;
  height?: number | string;
  circle?: boolean;
  animation: Animation;
  duration: number;
  color: string;
  shimmerColor: string;
  style?: React.CSSProperties;
}) {
  const skStyle = getSkeletonStyle(animation, duration, color, shimmerColor);
  return (
    <div
      style={{
        ...skStyle,
        width,
        height,
        borderRadius: circle ? '50%' : 4,
        ...style,
      }}
    >
      {animation === 'wave' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
            animation: `sk-wave ${duration}s ease-in-out infinite`,
          }}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Pill button component
// ─────────────────────────────────────────────

function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`pill ${active ? 'pill--active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

// ─────────────────────────────────────────────
// Preset previews
// ─────────────────────────────────────────────

function TextPreset(props: { animation: Animation; duration: number; color: string; shimmerColor: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <SkeletonBox {...props} width="100%" height={14} />
      <SkeletonBox {...props} width="90%" height={14} />
      <SkeletonBox {...props} width="75%" height={14} />
    </div>
  );
}

function AvatarPreset(props: { animation: Animation; duration: number; color: string; shimmerColor: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <SkeletonBox {...props} width={48} height={48} circle />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <SkeletonBox {...props} width="60%" height={14} />
        <SkeletonBox {...props} width="40%" height={12} />
      </div>
    </div>
  );
}

function CardPreset(props: { animation: Animation; duration: number; color: string; shimmerColor: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SkeletonBox {...props} width="100%" height={160} />
      <SkeletonBox {...props} width="70%" height={18} />
      <SkeletonBox {...props} width="100%" height={14} />
      <SkeletonBox {...props} width="85%" height={14} />
    </div>
  );
}

function ImagePreset(props: { animation: Animation; duration: number; color: string; shimmerColor: string }) {
  return (
    <div style={{ position: 'relative' }}>
      <SkeletonBox {...props} width="100%" height={200} />
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0.15,
        }}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// Dashboard demo using Bishawa's CV data
// ─────────────────────────────────────────────

function DashboardDemo({
  loading,
  animation,
  duration,
  color,
  shimmerColor,
}: {
  loading: boolean;
  animation: Animation;
  duration: number;
  color: string;
  shimmerColor: string;
}) {
  const skProps = { animation, duration, color, shimmerColor };

  const stats = [
    { label: 'Projects Shipped', value: '8+', change: '+2 this year', up: true },
    { label: 'npm Downloads', value: '1.2K', change: '+340% growth', up: true },
    { label: 'GitHub Stars', value: '12', change: 'Growing', up: true },
    { label: 'Years Experience', value: '2+', change: 'Since 2024', up: true },
  ];

  const projects = [
    { name: 'Invy', tech: 'Next.js, MongoDB, Redis, AWS', desc: 'Multi-branch inventory SaaS — 5+ businesses, 10K+ orders/mo' },
    { name: 'Skelion', tech: 'React, TypeScript, Jest', desc: 'Zero-config skeleton loader npm package' },
    { name: 'Retribe Store', tech: 'Next.js, Express, MongoDB, AWS', desc: 'Second-hand marketplace platform for UAE' },
    { name: 'Kasha Doors', tech: 'Next.js, Express, MongoDB, Redis', desc: 'E-commerce platform for Australian business' },
    { name: 'Golosign', tech: 'Next.js, Express, MongoDB, Resend', desc: 'Electronic document signing platform' },
  ];

  const skills = [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'Express', 'MongoDB',
    'Tailwind CSS', 'AWS', 'Python', 'Django', 'React Native', 'Supabase',
  ];

  const experience = [
    { role: 'Full-Stack Developer', company: 'ZeptoSky, Australia', period: 'Mar 2026 – Present' },
    { role: 'Full-Stack Developer', company: 'Munal Technology, UK', period: 'Nov 2025 – Present' },
    { role: 'IT Assistant / Developer', company: 'Birat Rani Eye Hospital', period: 'Feb – Nov 2025' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
        {loading ? (
          <>
            <SkeletonBox {...skProps} width={64} height={64} circle />
            <div style={{ flex: 1 }}>
              <SkeletonBox {...skProps} width={200} height={22} style={{ marginBottom: 6 }} />
              <SkeletonBox {...skProps} width={300} height={14} />
            </div>
          </>
        ) : (
          <>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: '#1a1a2e', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Sora', fontWeight: 700, fontSize: 24,
            }}>
              B
            </div>
            <div>
              <h3 style={{ margin: 0, fontFamily: 'Sora' }}>Bishawa Raj Bhujel</h3>
              <p style={{ margin: 0, color: '#71717a', fontSize: '0.9rem' }}>
                Full-Stack Developer — Biratnagar, Nepal
              </p>
            </div>
          </>
        )}
      </div>

      {/* Stats */}
      <div className="dashboard-grid" style={{ marginBottom: 24 }}>
        {stats.map((stat, i) => (
          <div className="dashboard-card" key={i}>
            {loading ? (
              <>
                <SkeletonBox {...skProps} width={80} height={12} style={{ marginBottom: 8 }} />
                <SkeletonBox {...skProps} width={60} height={28} style={{ marginBottom: 4 }} />
                <SkeletonBox {...skProps} width={100} height={12} />
              </>
            ) : (
              <>
                <h4>{stat.label}</h4>
                <p className="value">{stat.value}</p>
                <span className={`stat-change stat-change--${stat.up ? 'up' : 'down'}`}>
                  {stat.change}
                </span>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Two columns: Projects + Skills/Experience */}
      <div className="dashboard-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
        {/* Projects */}
        <div className="dashboard-card">
          <h3 style={{ fontFamily: 'Sora', fontSize: '1rem', marginBottom: 16 }}>
            {loading ? <SkeletonBox {...skProps} width={100} height={18} /> : 'Projects'}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {projects.map((project, i) => (
              <div key={i} style={{ borderBottom: i < projects.length - 1 ? '1px solid var(--ifm-color-emphasis-200)' : 'none', paddingBottom: 12 }}>
                {loading ? (
                  <>
                    <SkeletonBox {...skProps} width="50%" height={15} style={{ marginBottom: 4 }} />
                    <SkeletonBox {...skProps} width="80%" height={12} style={{ marginBottom: 4 }} />
                    <SkeletonBox {...skProps} width="60%" height={11} />
                  </>
                ) : (
                  <>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{project.name}</div>
                    <div style={{ color: '#71717a', fontSize: '0.8rem' }}>{project.tech}</div>
                    <div style={{ fontSize: '0.85rem', marginTop: 2 }}>{project.desc}</div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Skills + Experience */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Skills */}
          <div className="dashboard-card">
            <h3 style={{ fontFamily: 'Sora', fontSize: '1rem', marginBottom: 12 }}>
              {loading ? <SkeletonBox {...skProps} width={60} height={18} /> : 'Skills'}
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {skills.map((skill, i) => (
                loading ? (
                  <SkeletonBox key={i} {...skProps} width={70 + Math.random() * 30} height={28} style={{ borderRadius: 999 }} />
                ) : (
                  <span key={i} style={{
                    padding: '4px 12px',
                    borderRadius: 999,
                    border: '1px solid var(--ifm-color-emphasis-300)',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                  }}>
                    {skill}
                  </span>
                )
              ))}
            </div>
          </div>

          {/* Experience */}
          <div className="dashboard-card">
            <h3 style={{ fontFamily: 'Sora', fontSize: '1rem', marginBottom: 12 }}>
              {loading ? <SkeletonBox {...skProps} width={90} height={18} /> : 'Experience'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {experience.map((exp, i) => (
                <div key={i}>
                  {loading ? (
                    <>
                      <SkeletonBox {...skProps} width="55%" height={14} style={{ marginBottom: 4 }} />
                      <SkeletonBox {...skProps} width="70%" height={12} style={{ marginBottom: 2 }} />
                      <SkeletonBox {...skProps} width="40%" height={11} />
                    </>
                  ) : (
                    <>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{exp.role}</div>
                      <div style={{ color: '#71717a', fontSize: '0.8rem' }}>{exp.company}</div>
                      <div style={{ color: '#a1a1aa', fontSize: '0.75rem' }}>{exp.period}</div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Playground Page
// ─────────────────────────────────────────────

export default function Playground(): React.ReactNode {
  const [animation, setAnimation] = useState<Animation>('pulse');
  const [variant, setVariant] = useState<Variant>('auto');
  const [duration, setDuration] = useState(1.5);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'components' | 'dashboard'>('dashboard');
  const [color, setColor] = useState('#e5e7eb');
  const [shimmerColor, setShimmerColor] = useState('rgba(255,255,255,0.4)');
  const [customWidth, setCustomWidth] = useState(200);
  const [customHeight, setCustomHeight] = useState(20);
  const [circleSize, setCircleSize] = useState(48);
  const [textLines, setTextLines] = useState(3);

  return (
    <Layout
      title="Playground — Try every Skelion feature"
      description="Interactive playground to explore all Skelion skeleton loader features: animations, presets, sub-components, and a live dashboard demo."
    >
      <style>{skeletonStyles}</style>

      <div className="container" style={{ padding: '32px 16px' }}>
        <Heading as="h1" style={{ marginBottom: 4, fontSize: '2rem' }}>Playground</Heading>
        <p style={{ color: '#71717a', marginBottom: 32, fontSize: '0.95rem' }}>
          Try every Skelion feature. Adjust controls and see the results in real time.
        </p>

        <div className="playground-container">
          {/* Controls Panel */}
          <div className="playground-controls">
            {/* View Toggle */}
            <div className="control-group">
              <label>View</label>
              <div className="pill-group">
                <Pill label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
                <Pill label="Components" active={view === 'components'} onClick={() => setView('components')} />
              </div>
            </div>

            {/* Loading Toggle */}
            <div className="control-group">
              <label>Loading State</label>
              <div className="pill-group">
                <Pill label="Loading" active={loading} onClick={() => setLoading(true)} />
                <Pill label="Loaded" active={!loading} onClick={() => setLoading(false)} />
              </div>
            </div>

            {/* Animation */}
            <div className="control-group">
              <label>Animation</label>
              <div className="pill-group">
                {ANIMATIONS.map((a) => (
                  <Pill key={a} label={a} active={animation === a} onClick={() => setAnimation(a)} />
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="control-group">
              <label>Duration: {duration}s</label>
              <input
                type="range"
                min={0.3}
                max={4}
                step={0.1}
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
              />
            </div>

            {/* Skeleton Color */}
            <div className="control-group">
              <label>Skeleton Color</label>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  style={{ width: 36, height: 36, border: 'none', borderRadius: 6, cursor: 'pointer' }}
                />
                <code style={{ fontSize: '0.8rem' }}>{color}</code>
              </div>
            </div>

            {view === 'components' && (
              <>
                {/* Variant */}
                <div className="control-group">
                  <label>Variant</label>
                  <div className="pill-group">
                    {VARIANTS.map((v) => (
                      <Pill key={v} label={v} active={variant === v} onClick={() => setVariant(v)} />
                    ))}
                  </div>
                </div>

                {/* Custom dimensions */}
                <div className="control-group">
                  <label>Custom Width: {customWidth}px</label>
                  <input
                    type="range"
                    min={50}
                    max={500}
                    value={customWidth}
                    onChange={(e) => setCustomWidth(parseInt(e.target.value))}
                  />
                </div>

                <div className="control-group">
                  <label>Custom Height: {customHeight}px</label>
                  <input
                    type="range"
                    min={8}
                    max={300}
                    value={customHeight}
                    onChange={(e) => setCustomHeight(parseInt(e.target.value))}
                  />
                </div>

                <div className="control-group">
                  <label>Circle Size: {circleSize}px</label>
                  <input
                    type="range"
                    min={16}
                    max={128}
                    value={circleSize}
                    onChange={(e) => setCircleSize(parseInt(e.target.value))}
                  />
                </div>

                <div className="control-group">
                  <label>Text Lines: {textLines}</label>
                  <input
                    type="range"
                    min={1}
                    max={8}
                    value={textLines}
                    onChange={(e) => setTextLines(parseInt(e.target.value))}
                  />
                </div>
              </>
            )}
          </div>

          {/* Preview Panel */}
          <div className="playground-preview">
            {view === 'dashboard' ? (
              <DashboardDemo
                loading={loading}
                animation={animation}
                duration={duration}
                color={color}
                shimmerColor={shimmerColor}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
                {/* Custom Skeleton */}
                <section>
                  <Heading as="h3" style={{ fontSize: '0.95rem', marginBottom: 16, color: '#71717a' }}>
                    Custom Skeleton ({customWidth}x{customHeight})
                  </Heading>
                  <SkeletonBox
                    animation={animation}
                    duration={duration}
                    color={color}
                    shimmerColor={shimmerColor}
                    width={customWidth}
                    height={customHeight}
                  />
                </section>

                {/* Circle */}
                <section>
                  <Heading as="h3" style={{ fontSize: '0.95rem', marginBottom: 16, color: '#71717a' }}>
                    Circle ({circleSize}px)
                  </Heading>
                  <SkeletonBox
                    animation={animation}
                    duration={duration}
                    color={color}
                    shimmerColor={shimmerColor}
                    width={circleSize}
                    height={circleSize}
                    circle
                  />
                </section>

                {/* Text Lines */}
                <section>
                  <Heading as="h3" style={{ fontSize: '0.95rem', marginBottom: 16, color: '#71717a' }}>
                    Text ({textLines} lines)
                  </Heading>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {Array.from({ length: textLines }, (_, i) => (
                      <SkeletonBox
                        key={i}
                        animation={animation}
                        duration={duration}
                        color={color}
                        shimmerColor={shimmerColor}
                        width={i === textLines - 1 ? '75%' : '100%'}
                        height={14}
                      />
                    ))}
                  </div>
                </section>

                {/* Preset: Text */}
                <section>
                  <Heading as="h3" style={{ fontSize: '0.95rem', marginBottom: 16, color: '#71717a' }}>
                    Preset: Text
                  </Heading>
                  <TextPreset animation={animation} duration={duration} color={color} shimmerColor={shimmerColor} />
                </section>

                {/* Preset: Avatar */}
                <section>
                  <Heading as="h3" style={{ fontSize: '0.95rem', marginBottom: 16, color: '#71717a' }}>
                    Preset: Avatar
                  </Heading>
                  <AvatarPreset animation={animation} duration={duration} color={color} shimmerColor={shimmerColor} />
                </section>

                {/* Preset: Card */}
                <section>
                  <Heading as="h3" style={{ fontSize: '0.95rem', marginBottom: 16, color: '#71717a' }}>
                    Preset: Card
                  </Heading>
                  <CardPreset animation={animation} duration={duration} color={color} shimmerColor={shimmerColor} />
                </section>

                {/* Preset: Image */}
                <section>
                  <Heading as="h3" style={{ fontSize: '0.95rem', marginBottom: 16, color: '#71717a' }}>
                    Preset: Image
                  </Heading>
                  <ImagePreset animation={animation} duration={duration} color={color} shimmerColor={shimmerColor} />
                </section>

                {/* Combined Layout */}
                <section>
                  <Heading as="h3" style={{ fontSize: '0.95rem', marginBottom: 16, color: '#71717a' }}>
                    Combined Layout
                  </Heading>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <CardPreset animation={animation} duration={duration} color={color} shimmerColor={shimmerColor} />
                    <CardPreset animation={animation} duration={duration} color={color} shimmerColor={shimmerColor} />
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <AvatarPreset animation={animation} duration={duration} color={color} shimmerColor={shimmerColor} />
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <AvatarPreset animation={animation} duration={duration} color={color} shimmerColor={shimmerColor} />
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
