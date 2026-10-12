import React, { useMemo, useState } from 'react';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

const ANIMATIONS = ['pulse', 'shimmer', 'wave', 'solid'] as const;
type Animation = (typeof ANIMATIONS)[number];

const skeletonStyles = `
  @keyframes sk-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.45; }
  }
  @keyframes sk-shimmer {
    0% { background-position: 140% 0; }
    100% { background-position: -40% 0; }
  }
  @keyframes sk-wave {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  @keyframes sk-shine {
    0% { transform: translateX(-120%); }
    100% { transform: translateX(280%); }
  }
`;

type SkProps = {
  animation: Animation;
  duration: number;
  color: string;
  shimmerColor: string;
  staggerMs?: number;
  index?: number;
};

function boneStyle(
  animation: Animation,
  duration: number,
  color: string,
  shimmerColor: string,
  staggerMs = 0,
  index = 0,
): React.CSSProperties {
  const delay = staggerMs > 0 ? `${index * staggerMs}ms` : undefined;
  const base: React.CSSProperties = {
    backgroundColor: color,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    animationDelay: delay,
  };

  if (animation === 'pulse') {
    return { ...base, animation: `sk-pulse ${duration}s ease-in-out infinite` };
  }
  if (animation === 'shimmer') {
    return {
      ...base,
      backgroundImage: `linear-gradient(110deg, ${color} 36%, ${shimmerColor} 50%, ${color} 64%)`,
      backgroundSize: '240% 100%',
      backgroundRepeat: 'no-repeat',
      animation: `sk-shimmer ${duration}s linear infinite`,
    };
  }
  if (animation === 'solid') return base;
  return base;
}

function Bone({
  width = '100%',
  height = 14,
  circle = false,
  radius,
  style,
  ...sk
}: SkProps & {
  width?: number | string;
  height?: number | string;
  circle?: boolean;
  radius?: number | string;
  style?: React.CSSProperties;
}) {
  const s = boneStyle(sk.animation, sk.duration, sk.color, sk.shimmerColor, sk.staggerMs, sk.index);
  return (
    <div
      style={{
        ...s,
        width,
        height,
        borderRadius: circle ? '50%' : radius ?? 8,
        flexShrink: 0,
        ...style,
      }}
    >
      {sk.animation === 'wave' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(110deg, transparent, ${sk.shimmerColor}, transparent)`,
            animation: `sk-wave ${sk.duration}s linear infinite`,
            animationDelay: sk.staggerMs ? `${(sk.index ?? 0) * sk.staggerMs}ms` : undefined,
          }}
        />
      )}
    </div>
  );
}

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
    <button type="button" className={`pill ${active ? 'pill--active' : ''}`} onClick={onClick}>
      {label}
    </button>
  );
}

const KPIS = [
  { label: 'Sales Today', value: '$12,840', change: '+12.3%', up: true },
  { label: 'Orders', value: '248', change: '+8.1%', up: true },
  { label: 'Pending', value: '19', change: '-2.4%', up: false },
  { label: 'Error Rate', value: '0.12%', change: '-0.03%', up: true },
];

const ENDPOINTS = [
  { path: '/api/orders', method: 'GET', p50: '42ms', p99: '180ms', rpm: '1.2k', ok: true },
  { path: '/api/products', method: 'GET', p50: '38ms', p99: '150ms', rpm: '890', ok: true },
  { path: '/api/checkout', method: 'POST', p50: '95ms', p99: '410ms', rpm: '320', ok: true },
  { path: '/api/inventory', method: 'PUT', p50: '110ms', p99: '520ms', rpm: '140', ok: false },
  { path: '/api/webhooks', method: 'POST', p50: '28ms', p99: '90ms', rpm: '64', ok: true },
];

const ACTIVITY = [
  { text: 'Deploy #4821 succeeded on production', time: '2m ago', tone: 'ok' },
  { text: 'Branch “Sydney” synced 128 SKUs', time: '8m ago', tone: 'ok' },
  { text: 'Low stock: Cold Brew Capsules', time: '14m ago', tone: 'warn' },
  { text: 'Webhook retry for Stripe invoice.paid', time: '21m ago', tone: 'warn' },
  { text: 'Order #10928 delivered', time: '35m ago', tone: 'ok' },
];

const TEAM = [
  { name: 'Priya Sharma', role: 'Ops lead', initials: 'PS' },
  { name: 'Jake Morrison', role: 'Warehouse', initials: 'JM' },
  { name: 'Ana Reyes', role: 'Finance', initials: 'AR' },
];

const SCHEDULE = [
  { title: 'Sprint Planning', tone: 'blue' },
  { title: 'Inventory Audit', tone: 'purple' },
  { title: '1:1 w/ Jake', tone: 'green' },
  { title: 'Deploy Window', tone: 'yellow' },
];

const BOARD = {
  Backlog: [
    { title: 'Barcode scanner UX', tag: 'frontend' },
    { title: 'CSV import v2', tag: 'backend' },
  ],
  'In Progress': [
    { title: 'Multi-branch stock sync', tag: 'backend' },
    { title: 'Dark mode tokens', tag: 'design' },
  ],
  Review: [{ title: 'Refunds dashboard', tag: 'frontend' }],
  Done: [
    { title: 'Stripe webhooks', tag: 'backend' },
    { title: 'Order filters', tag: 'frontend' },
  ],
};

const METHOD_COLOR: Record<string, string> = {
  GET: '#2563eb',
  POST: '#16a34a',
  PUT: '#ca8a04',
};

function AreaChart() {
  return (
    <svg viewBox="0 0 360 120" width="100%" height={120} preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id="sk-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M0 90 C40 70, 70 95, 110 60 C150 25, 180 55, 220 40 C260 25, 300 50, 360 30 L360 120 L0 120 Z"
        fill="url(#sk-area)"
      />
      <path
        d="M0 90 C40 70, 70 95, 110 60 C150 25, 180 55, 220 40 C260 25, 300 50, 360 30"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="2.5"
      />
    </svg>
  );
}

function BarChart() {
  const bars = [42, 68, 55, 80, 48, 72, 90, 64, 78, 52, 86, 70];
  return (
    <svg viewBox="0 0 240 120" width="100%" height={120} aria-hidden>
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 20 + 4}
          y={120 - h}
          width={12}
          height={h}
          rx={3}
          fill={i % 3 === 0 ? '#a78bfa' : '#93c5fd'}
        />
      ))}
    </svg>
  );
}

function DonutChart() {
  return (
    <svg viewBox="0 0 120 120" width={120} height={120} aria-hidden>
      <circle cx="60" cy="60" r="42" fill="none" stroke="#e4e4e7" strokeWidth="16" />
      <circle
        cx="60"
        cy="60"
        r="42"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="16"
        strokeDasharray="90 174"
        strokeDashoffset="0"
        transform="rotate(-90 60 60)"
      />
      <circle
        cx="60"
        cy="60"
        r="42"
        fill="none"
        stroke="#34d399"
        strokeWidth="16"
        strokeDasharray="55 209"
        strokeDashoffset="-90"
        transform="rotate(-90 60 60)"
      />
      <circle
        cx="60"
        cy="60"
        r="42"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="16"
        strokeDasharray="35 229"
        strokeDashoffset="-145"
        transform="rotate(-90 60 60)"
      />
      <circle
        cx="60"
        cy="60"
        r="42"
        fill="none"
        stroke="#f472b6"
        strokeWidth="16"
        strokeDasharray="24 240"
        strokeDashoffset="-180"
        transform="rotate(-90 60 60)"
      />
    </svg>
  );
}

function DashboardShell({
  loading,
  sk,
}: {
  loading: boolean;
  sk: SkProps;
}) {
  let boneIndex = 0;
  const next = () => {
    const i = boneIndex;
    boneIndex += 1;
    return i;
  };

  return (
    <div className="pg-app">
      <aside className="pg-sidebar">
        <div className="pg-brand">
          {loading ? (
            <>
              <Bone {...sk} width={28} height={28} radius={8} index={next()} />
              <Bone {...sk} width={88} height={16} index={next()} />
            </>
          ) : (
            <>
              <div className="pg-logo">S</div>
              <span>Skelion Ops</span>
            </>
          )}
        </div>

        <div className="pg-side-section">
          <div className="pg-side-label">{loading ? <Bone {...sk} width={48} height={10} index={next()} /> : 'Team'}</div>
          {TEAM.map((member) => (
            <div className="pg-team-row" key={member.name}>
              {loading ? (
                <>
                  <Bone {...sk} width={32} height={32} circle index={next()} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <Bone {...sk} width="70%" height={12} index={next()} />
                    <Bone {...sk} width="45%" height={10} index={next()} />
                  </div>
                </>
              ) : (
                <>
                  <div className="pg-avatar">{member.initials}</div>
                  <div>
                    <div className="pg-team-name">{member.name}</div>
                    <div className="pg-muted">{member.role}</div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="pg-side-section">
          <div className="pg-side-label">{loading ? <Bone {...sk} width={56} height={10} index={next()} /> : 'Today'}</div>
          {SCHEDULE.map((item) =>
            loading ? (
              <Bone key={item.title} {...sk} width="100%" height={36} radius={10} index={next()} style={{ marginBottom: 8 }} />
            ) : (
              <div key={item.title} className={`pg-chip pg-chip--${item.tone}`}>
                {item.title}
              </div>
            ),
          )}
        </div>
      </aside>

      <div className="pg-main">
        <header className="pg-topbar">
          <div className="pg-tabs">
            {loading ? (
              <>
                <Bone {...sk} width={92} height={32} radius={999} index={next()} />
                <Bone {...sk} width={84} height={32} radius={999} index={next()} />
                <Bone {...sk} width={78} height={32} radius={999} index={next()} />
              </>
            ) : (
              <>
                <span className="pg-tab pg-tab--active">Dashboard</span>
                <span className="pg-tab">Analytics</span>
                <span className="pg-tab">Branches</span>
                <span className="pg-tab">Settings</span>
              </>
            )}
          </div>
          <div className="pg-top-actions">
            {loading ? (
              <>
                <Bone {...sk} width={160} height={34} radius={10} index={next()} />
                <Bone {...sk} width={34} height={34} circle index={next()} />
                <Bone {...sk} width={34} height={34} circle index={next()} />
              </>
            ) : (
              <>
                <div className="pg-search">Search<span>⌘K</span></div>
                <div className="pg-bell">3</div>
                <div className="pg-avatar">BR</div>
              </>
            )}
          </div>
        </header>

        <div className="pg-kpis">
          {KPIS.map((kpi) => (
            <div className="pg-card" key={kpi.label}>
            {loading ? (
              <>
                <Bone {...sk} width="100%" height={12} index={next()} style={{ marginBottom: 10 }} />
                <Bone {...sk} width="100%" height={28} index={next()} style={{ marginBottom: 8 }} />
                <Bone {...sk} width="55%" height={12} index={next()} />
              </>
            ) : (
                <>
                  <div className="pg-muted">{kpi.label}</div>
                  <div className="pg-kpi-value">{kpi.value}</div>
                  <div className={kpi.up ? 'stat-change--up' : 'stat-change--down'}>{kpi.change}</div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="pg-charts">
          <div className="pg-card pg-card--wide">
            <div className="pg-card-title">
              {loading ? <Bone {...sk} width={96} height={14} index={next()} /> : 'Traffic (7d)'}
            </div>
            {loading ? (
              <Bone {...sk} width="100%" height={120} radius={12} index={next()} />
            ) : (
              <AreaChart />
            )}
          </div>
          <div className="pg-card">
            <div className="pg-card-title">
              {loading ? <Bone {...sk} width={88} height={14} index={next()} /> : 'Deploys (12w)'}
            </div>
            {loading ? (
              <Bone {...sk} width="100%" height={120} radius={12} index={next()} />
            ) : (
              <BarChart />
            )}
          </div>
          <div className="pg-card">
            <div className="pg-card-title">
              {loading ? <Bone {...sk} width={92} height={14} index={next()} /> : 'Traffic Split'}
            </div>
            {loading ? (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <Bone {...sk} width={96} height={96} circle index={next()} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Bone {...sk} width="80%" height={12} index={next()} />
                  <Bone {...sk} width="70%" height={12} index={next()} />
                  <Bone {...sk} width="60%" height={12} index={next()} />
                </div>
              </div>
            ) : (
              <div className="pg-donut-row">
                <DonutChart />
                <div className="pg-legend">
                  <div><i style={{ background: '#60a5fa' }} /> API 34%</div>
                  <div><i style={{ background: '#34d399' }} /> Web 28%</div>
                  <div><i style={{ background: '#fbbf24' }} /> Mobile 22%</div>
                  <div><i style={{ background: '#f472b6' }} /> Other 16%</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pg-split">
          <div className="pg-card">
            <div className="pg-card-title">
              {loading ? <Bone {...sk} width={120} height={14} index={next()} /> : 'API Endpoints'}
            </div>
            <div className="pg-table">
              {(loading ? ENDPOINTS : ENDPOINTS).map((row, i) =>
                loading ? (
                  <div className="pg-tr" key={i}>
                    <Bone {...sk} width="28%" height={12} index={next()} />
                    <Bone {...sk} width={44} height={20} radius={999} index={next()} />
                    <Bone {...sk} width={48} height={12} index={next()} />
                    <Bone {...sk} width={48} height={12} index={next()} />
                    <Bone {...sk} width={40} height={12} index={next()} />
                    <Bone {...sk} width={12} height={12} circle index={next()} />
                  </div>
                ) : (
                  <div className="pg-tr" key={row.path}>
                    <code>{row.path}</code>
                    <span className="pg-method" style={{ color: METHOD_COLOR[row.method] }}>
                      {row.method}
                    </span>
                    <span>{row.p50}</span>
                    <span>{row.p99}</span>
                    <span>{row.rpm}</span>
                    <span className={row.ok ? 'pg-dot pg-dot--ok' : 'pg-dot pg-dot--warn'} />
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="pg-card">
            <div className="pg-card-title">
              {loading ? <Bone {...sk} width={80} height={14} index={next()} /> : 'Activity'}
            </div>
            <div className="pg-activity">
              {ACTIVITY.map((item, i) =>
                loading ? (
                  <div className="pg-activity-row" key={i}>
                    <Bone {...sk} width={8} height={8} circle index={next()} />
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <Bone {...sk} width="90%" height={12} index={next()} />
                      <Bone {...sk} width="30%" height={10} index={next()} />
                    </div>
                  </div>
                ) : (
                  <div className="pg-activity-row" key={item.text}>
                    <span className={item.tone === 'ok' ? 'pg-dot pg-dot--ok' : 'pg-dot pg-dot--warn'} />
                    <div>
                      <div>{item.text}</div>
                      <div className="pg-muted">{item.time}</div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        <div className="pg-board">
          {Object.entries(BOARD).map(([column, cards]) => (
            <div className="pg-board-col" key={column}>
              <div className="pg-card-title">
                {loading ? <Bone {...sk} width={72} height={12} index={next()} /> : column}
              </div>
              {cards.map((card, i) =>
                loading ? (
                  <div className="pg-card pg-task" key={`${column}-${i}`}>
                    <Bone {...sk} width="85%" height={12} index={next()} style={{ marginBottom: 10 }} />
                    <Bone {...sk} width={64} height={20} radius={999} index={next()} />
                  </div>
                ) : (
                  <div className="pg-card pg-task" key={card.title}>
                    <div>{card.title}</div>
                    <span className="pg-tag">{card.tag}</span>
                  </div>
                ),
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComponentsLab({ loading, sk }: { loading: boolean; sk: SkProps }) {
  return (
    <div className="pg-lab">
      <section className="pg-lab-block">
        <Heading as="h3">Text</Heading>
        <div className="pg-lab-stack">
          {loading ? (
            <>
              <Bone {...sk} width="100%" height={14} index={0} />
              <Bone {...sk} width="100%" height={14} index={1} />
              <Bone {...sk} width="75%" height={14} index={2} />
            </>
          ) : (
            <>
              <p className="pg-lab-line">Inventory sync keeps every branch stocked in real time.</p>
              <p className="pg-lab-line">Orders, refunds, and webhooks land in one activity stream.</p>
              <p className="pg-lab-line pg-lab-line--short">Built for multi-branch SaaS teams.</p>
            </>
          )}
        </div>
      </section>
      <section className="pg-lab-block">
        <Heading as="h3">Avatar</Heading>
        <div className="pg-lab-avatar">
          {loading ? (
            <>
              <Bone {...sk} width={48} height={48} circle index={0} />
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Bone {...sk} width="100%" height={14} index={1} />
                <Bone {...sk} width="60%" height={12} index={2} />
              </div>
            </>
          ) : (
            <>
              <div className="pg-avatar" style={{ width: 48, height: 48, fontSize: '0.85rem' }}>PS</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="pg-team-name">Priya Sharma</div>
                <div className="pg-muted">Ops lead · Skelion Ops</div>
              </div>
            </>
          )}
        </div>
      </section>
      <section className="pg-lab-block">
        <Heading as="h3">Card</Heading>
        <div className="pg-lab-card">
          {loading ? (
            <>
              <Bone {...sk} width="100%" height={160} radius={12} index={0} />
              <Bone {...sk} width="100%" height={18} index={1} />
              <Bone {...sk} width="100%" height={14} index={2} />
              <Bone {...sk} width="85%" height={14} index={3} />
            </>
          ) : (
            <>
              <div className="pg-lab-card-media" />
              <h4 className="pg-lab-card-title">Weekly branch report</h4>
              <p className="pg-lab-line">Sales, stockouts, and fulfillment across every location.</p>
              <p className="pg-lab-line pg-lab-line--short">Updated every Monday at 09:00.</p>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

export default function Playground(): React.ReactNode {
  const [animation, setAnimation] = useState<Animation>('shimmer');
  const [duration, setDuration] = useState(2);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'dashboard' | 'components'>('dashboard');
  const [color, setColor] = useState('#f0f0f0');
  const [shimmerColor, setShimmerColor] = useState('#f7f7f7');
  const [stagger, setStagger] = useState(false);

  const sk = useMemo<SkProps>(
    () => ({
      animation,
      duration,
      color,
      shimmerColor,
      staggerMs: stagger ? 80 : 0,
    }),
    [animation, duration, color, shimmerColor, stagger],
  );

  return (
    <Layout
      title="Playground"
      description="Interactive Skelion playground — real ops dashboard with pulse, shimmer, wave, and solid skeletons."
    >
      <style>{skeletonStyles}</style>

      <div className="pg-page">
        <div className="pg-toolbar">
          <div className="pill-group">
            <Pill label="Skeleton" active={loading} onClick={() => setLoading(true)} />
            <Pill label="Loaded" active={!loading} onClick={() => setLoading(false)} />
          </div>
          <div className="pill-group">
            {ANIMATIONS.map((a) => (
              <Pill key={a} label={a} active={animation === a} onClick={() => setAnimation(a)} />
            ))}
          </div>
          <div className="pill-group">
            <Pill label="Dashboard" active={view === 'dashboard'} onClick={() => setView('dashboard')} />
            <Pill label="Components" active={view === 'components'} onClick={() => setView('components')} />
          </div>
          <div className="pg-toolbar-sliders">
            <label>
              {duration.toFixed(1)}s
              <input
                type="range"
                min={0.8}
                max={3.5}
                step={0.1}
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
              />
            </label>
            <label>
              Stagger
              <input type="checkbox" checked={stagger} onChange={(e) => setStagger(e.target.checked)} />
            </label>
            <label>
              Bone
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
            </label>
          </div>
        </div>

        <div className="pg-stage">
          {view === 'dashboard' ? (
            <DashboardShell loading={loading} sk={sk} />
          ) : (
            <ComponentsLab loading={loading} sk={sk} />
          )}
        </div>
      </div>
    </Layout>
  );
}
