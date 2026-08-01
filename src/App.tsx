import { useState, useMemo, useEffect, useRef, type ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  CalendarDays,
  Sparkles,
  ChevronDown,
  LayoutGrid,
  ListChecks,
  FileClock,
  Award,
  StickyNote,
  Flame,
} from 'lucide-react';

/* ---------------------------------------------------------------- */
/* Design tokens                                                     */
/* ---------------------------------------------------------------- */
const C = {
  bg: '#F6F2FC',
  card: '#FFFFFF',
  lilac50: '#F4EEFC',
  lilac100: '#E9DEF9',
  lilac200: '#D6C2F0',
  violet300: '#B79AE6',
  violet400: '#9B78D6',
  violet500: '#7C52C4',
  plum600: '#5B3597',
  plum700: '#402569',
  ink: '#3B2A5A',
  inkSoft: '#7A6C99',
  line: '#E7DCF7',
};

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');";

/* ---------------------------------------------------------------- */
/* Types                                                             */
/* ---------------------------------------------------------------- */
type Status = 'not' | 'progress' | 'done';

interface Topic {
  id: number;
  module: string;
  chapter: string;
  sub: string;
  status: Status;
}

interface Deadline {
  id: number;
  type: string;
  name: string;
  scope: string;
  due: string;
  status: Status;
}

/* ---------------------------------------------------------------- */
/* Data — Chapters 1-3 of every module you have guides for           */
/* ---------------------------------------------------------------- */
const MODULE_META: Record<string, { short: string; color: string }> = {
  'Big Data & IoT 600': { short: 'Big Data & IoT', color: '#7C52C4' },
  'Machine Learning 600': { short: 'Machine Learning', color: '#9B78D6' },
  'Programming 622': { short: 'Programming', color: '#B79AE6' },
  'Internet Programming 622': { short: 'Internet Prog.', color: '#5B3597' },
  'Information Systems 622': { short: 'Info Systems', color: '#D6C2F0' },
};

const RAW: [string, string, string[]][] = [
  [
    'Big Data & IoT 600',
    'Ch1: Big Data Analysis & Extraction',
    [
      'Big Data',
      'Characteristics of Big Data & Sources',
      'Tools & Frameworks for Analysis',
      'Big Data Analysis Techniques',
      'Cleaning, Normalization & Transformation',
    ],
  ],
  [
    'Big Data & IoT 600',
    'Ch2: IoT Architectures & Applications',
    [
      'Core IoT Concepts & Ecosystem',
      'How IoT Works',
      'Layer Architecture of IoT',
      'Architectures, Enablers & Building Blocks',
      'Security Challenges (Encryption/Auth/Privacy)',
      'IoT Applications (Homes, Health, Industry, Cities)',
    ],
  ],
  [
    'Big Data & IoT 600',
    'Ch3: IoT Technologies & Standards',
    [
      'Technologies Overview (Sensing/Edge/Cloud)',
      'Application & Network Protocols',
      'IoT Standards',
      'Data Standards in IoT',
      'Practical Applications & Standards',
    ],
  ],

  [
    'Machine Learning 600',
    'Ch1: Introduction to Machine Learning',
    [
      'Overview of Machine Learning',
      'Modeling',
      'Types of Machine Learning',
      'Overfitting and Underfitting',
      'Correctness',
      'Bias-Variance Tradeoff',
      'Feature Engineering',
      'Real-World Applications',
      'Python ML Libraries',
      'Revision Questions',
    ],
  ],
  [
    'Machine Learning 600',
    'Ch2: Data Preprocessing & Feature Eng.',
    [
      'Understanding Datasets',
      'Data Cleaning',
      'Feature Scaling & Normalization',
      'PCA',
      'Applications of PCA',
      'Summary & Review',
    ],
  ],
  [
    'Machine Learning 600',
    'Ch3: Supervised Learning – Regression',
    [
      'What is Supervised Learning?',
      'Regression',
      'Linear Regression',
      'Polynomial Regression',
      'Decision Tree Regression',
      'House Price Prediction Exercise',
    ],
  ],

  [
    'Programming 622',
    'Topic 1: SE Principles & C++ Classes',
    [
      'Software Life Cycle',
      'Software Development Phase',
      'Algorithm Analysis: Big-O',
      'Classes',
      'Worked Examples 1-9',
      'Data Abstraction & ADTs',
      'Identifying Classes/Objects/Operations',
    ],
  ],
  [
    'Programming 622',
    'Topic 2: Standard Template Library',
    [
      'Container Types',
      'Sequence Containers',
      'Sequence Container: vector',
      'begin & end Functions',
      'The copy Algorithm',
      'ostream Iterator & copy',
      'Iterators',
    ],
  ],
  [
    'Programming 622',
    'Topic 3: Linked Lists',
    [
      'Linked Lists',
      'Item Insertion and Deletion',
      'Linked List as an ADT',
      'Linked List Iterators',
      'Unordered Linked Lists',
      'Ordered Linked Lists',
      'Doubly Linked Lists',
      'STL Sequence Container: list',
      'Header & Trailer Nodes',
    ],
  ],

  [
    'Internet Programming 622',
    'Topic 1: PHP and HTML Form',
    [
      'How HTML Forms Work',
      'Creating an HTML Form',
      'Capturing Form Data with PHP',
      'PHP Form Data & Security',
      'Handling Empty Form Fields',
      'Generating Web Forms with PHP',
      'PHP Form Validation',
    ],
  ],
  [
    'Internet Programming 622',
    'Topic 2: Session Controls & Cookies',
    [
      'Cookies',
      'Sessions',
      'Alternative to Cookies',
      'Combining Cookies and Sessions',
    ],
  ],
  [
    'Internet Programming 622',
    'Topic 3: File System Management',
    [
      'Files & Directories',
      'File Info & Time Properties',
      'Filename from a Path',
      'Opening/Closing Files',
      'Reading & Writing Files/Strings',
      'End of File & Line Reading',
      'Entire Files & Random Access',
      'Copy/Rename/Delete Files',
      'Directories & Directory Objects',
    ],
  ],

  [
    'Information Systems 622',
    'Ch1: Development Strategies',
    [
      'Traditional vs Web-Based Development',
      'Evolving Trends',
      'In-House Development Options',
      'Summary & Key Points',
    ],
  ],
  [
    'Information Systems 622',
    'Ch2: User Interface Design',
    [
      'User Interfaces',
      'Human-Computer Interaction',
      'UI Guidelines: Business & Usability',
      'UI Guidelines: Validation & Layout',
      'Source Document & Form Design',
      'Printed Output & Report Design',
      'Technology Issues',
      'Security & Control Issues',
      'Emerging Trends & Summary',
    ],
  ],
  [
    'Information Systems 622',
    'Ch3: Data Design',
    [
      'Data Design Concepts',
      'DBMS Components',
      'Web-Based Design',
      'Data Design Terms & Referential Integrity',
      'Entity Relationship Diagrams',
      'Normalization Stages',
      'Codes',
      'Data Storage, Access & Control',
      'Summary',
    ],
  ],
];

let uid = 0;
const seedTopics = (): Topic[] => {
  const rows: Topic[] = [];
  RAW.forEach(([module, chapter, subs]) => {
    subs.forEach((sub) => {
      rows.push({ id: uid++, module, chapter, sub, status: 'not' });
    });
  });
  return rows;
};

const STATUS_CYCLE: Record<Status, Status> = {
  not: 'progress',
  progress: 'done',
  done: 'not',
};
const STATUS_LABEL: Record<Status, string> = {
  not: 'Not started',
  progress: 'In progress',
  done: 'Done',
};
const STATUS_COLOR: Record<Status, string> = {
  not: C.inkSoft,
  progress: '#B78A2E',
  done: '#3E9A6D',
};

/* ---------------------------------------------------------------- */
/* Deadlines                                                         */
/* ---------------------------------------------------------------- */
const TODAY = new Date('2026-07-31');
const daysUntil = (iso: string): number =>
  Math.ceil((new Date(iso).getTime() - TODAY.getTime()) / 86400000);

const seedDeadlines = (): Deadline[] => [
  {
    id: 1,
    type: 'Assignment',
    name: 'Assignment 1',
    scope: 'Ch.1–3, all modules',
    due: '2026-08-31',
    status: 'not',
  },
  {
    id: 2,
    type: 'Assignment',
    name: 'Assignment 2',
    scope: 'Ch.1–3, all modules',
    due: '2026-09-21',
    status: 'not',
  },
  {
    id: 3,
    type: 'Test',
    name: 'Continuous Assessment Tests',
    scope: 'All modules · Ch.1–3',
    due: '2026-10-19',
    status: 'not',
  },
  {
    id: 4,
    type: 'Assignment',
    name: 'Assignment 3',
    scope: 'Full syllabus',
    due: '2026-10-28',
    status: 'not',
  },
  {
    id: 5,
    type: 'Assignment',
    name: 'WIL / IT Project',
    scope: 'Applied project',
    due: '2026-10-30',
    status: 'not',
  },
  {
    id: 6,
    type: 'Exam',
    name: 'Semester 2 Examinations',
    scope: 'All modules',
    due: '2026-11-16',
    status: 'not',
  },
];

/* ---------------------------------------------------------------- */
/* Small building blocks                                             */
/* ---------------------------------------------------------------- */
function ProgressRing({ pct, size = 135 }: { pct: number; size?: number }) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#FFFFFF"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={c - (pct / 100) * c}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  sub?: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex items-center gap-4 flex-1 min-w-[220px] shadow-sm transition-all hover:shadow-md"
      style={{ background: C.card, border: `1px solid ${C.line}` }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: C.lilac50, color: C.violet500 }}
      >
        <Icon size={24} />
      </div>
      <div className="min-w-0">
        <div
          className="text-[11.5px] font-bold tracking-wider uppercase"
          style={{ color: C.inkSoft }}
        >
          {label}
        </div>
        <div
          className="text-2xl font-extrabold truncate mt-0.5"
          style={{ color: C.ink, fontFamily: 'Fraunces, serif' }}
        >
          {value}
        </div>
        {sub && (
          <div className="text-[12px] mt-0.5" style={{ color: C.inkSoft }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
  right,
}: {
  title: string;
  icon?: LucideIcon;
  children: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div
      className="rounded-3xl p-6 md:p-8 shadow-sm"
      style={{ background: C.card, border: `1px solid ${C.line}` }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {Icon && <Icon size={20} style={{ color: C.violet500 }} />}
          <h3
            className="text-[14px] font-bold uppercase tracking-wider"
            style={{ color: C.plum700 }}
          >
            {title}
          </h3>
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function StatusPill({
  status,
  onClick,
}: {
  status: Status;
  onClick: () => void;
}) {
  const icon =
    status === 'done' ? (
      <CheckCircle2 size={15} />
    ) : status === 'progress' ? (
      <Clock size={15} />
    ) : (
      <Circle size={15} />
    );
  const bg =
    status === 'done'
      ? '#E4F5EB'
      : status === 'progress'
      ? '#FBF0DA'
      : C.lilac50;
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3.5 py-2 rounded-full text-[12px] font-semibold shrink-0 transition-transform active:scale-95 shadow-xs"
      style={{ background: bg, color: STATUS_COLOR[status] }}
    >
      {icon}
      {STATUS_LABEL[status]}
    </button>
  );
}

/* ---------------------------------------------------------------- */
/* Main component                                                    */
/* ---------------------------------------------------------------- */
const STORAGE_KEY = 'bsc-it-study-tracker-state';

export default function StudyDashboard() {
  const [topics, setTopics] = useState<Topic[]>(seedTopics);
  const [deadlines, setDeadlines] = useState<Deadline[]>(seedDeadlines);
  const [tab, setTab] = useState<string>('dashboard');
  const [openModule, setOpenModule] = useState<string | null>(
    'Big Data & IoT 600'
  );
  const [note, setNote] = useState<string>(
    'Rework the IoT layer diagram from memory before Sunday.'
  );
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState<
    'idle' | 'saving' | 'saved' | 'error'
  >('idle');
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved progress from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData) as {
          topics?: Topic[];
          deadlines?: Deadline[];
          note?: string;
        };
        if (parsed.topics) setTopics(parsed.topics);
        if (parsed.deadlines) setDeadlines(parsed.deadlines);
        if (typeof parsed.note === 'string') setNote(parsed.note);
      }
    } catch {
      // Fallback if localStorage fails
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save changes to localStorage automatically (debounced)
  useEffect(() => {
    if (!loaded) return;
    setSaveState('saving');
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }

    saveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ topics, deadlines, note })
        );
        setSaveState('saved');
      } catch {
        setSaveState('error');
      }
    }, 400);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [topics, deadlines, note, loaded]);

  const cycleTopic = (id: number) =>
    setTopics((ts) =>
      ts.map((t) =>
        t.id === id ? { ...t, status: STATUS_CYCLE[t.status] } : t
      )
    );

  const cycleDeadline = (id: number) =>
    setDeadlines((ds) =>
      ds.map((d) =>
        d.id === id ? { ...d, status: STATUS_CYCLE[d.status] } : d
      )
    );

  const stats = useMemo(() => {
    const total = topics.length;
    const done = topics.filter((t) => t.status === 'done').length;
    const inProgress = topics.filter((t) => t.status === 'progress').length;
    const pct = total ? Math.round((done / total) * 100) : 0;

    const perModule = Object.keys(MODULE_META).map((m) => {
      const list = topics.filter((t) => t.module === m);
      const d = list.filter((t) => t.status === 'done').length;
      return {
        module: MODULE_META[m].short,
        full: m,
        done: d,
        total: list.length,
        pct: list.length ? Math.round((d / list.length) * 100) : 0,
        color: MODULE_META[m].color,
      };
    });

    const nextDeadline = [...deadlines]
      .filter((d) => d.status !== 'done')
      .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime())[0];

    const onTrack = perModule.filter((m) => m.pct > 0).length;

    return { total, done, inProgress, pct, perModule, nextDeadline, onTrack };
  }, [topics, deadlines]);

  const donutData = stats.perModule.map((m) => ({
    name: m.module,
    value: m.total,
    color: m.color,
  }));

  const paceData = [
    { week: 'Wk1', target: 12 },
    { week: 'Wk2', target: 25 },
    { week: 'Wk3', target: 38 },
    { week: 'Wk4', target: 45 },
    { week: 'Wk5', target: 58 },
    { week: 'Wk6', target: 70 },
    { week: 'Wk7', target: 82 },
    { week: 'Wk8', target: 100 },
  ].map((w) => ({ ...w, actual: Math.min(stats.pct, w.target) }));

  const navItems: { id: string; label: string; icon: LucideIcon }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'tracker', label: 'Study Tracker', icon: ListChecks },
    { id: 'deadlines', label: 'Deadlines', icon: FileClock },
  ];

  return (
    <div
      className="min-h-screen w-full flex flex-col xl:flex-row"
      style={{
        background: C.bg,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <style>{FONT_IMPORT}</style>

      {/* Top / Sidebar Navigation */}
      <aside
        className="w-full xl:w-[260px] shrink-0 flex xl:flex-col justify-between xl:justify-start py-4 xl:py-8 px-6 xl:px-5 gap-6 shadow-md xl:shadow-none z-20 sticky top-0 xl:static"
        style={{ background: C.plum700 }}
      >
        <div className="flex items-center gap-3.5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-inner"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <GraduationCap size={22} color="#fff" />
          </div>
          <div className="leading-tight">
            <div
              className="text-white font-bold text-[16px]"
              style={{ fontFamily: 'Fraunces, serif' }}
            >
              BSc IT Study Hub
            </div>
            <div className="text-[12px]" style={{ color: '#D6C2F0' }}>
              Semester 2
            </div>
          </div>
        </div>

        <nav className="flex xl:flex-col items-center xl:items-stretch gap-2">
          {navItems.map((n) => {
            const active = tab === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[14px] font-semibold transition-all"
                style={{
                  background: active ? '#FFFFFF' : 'transparent',
                  color: active ? C.plum700 : '#E9DEF9',
                  boxShadow: active ? '0 4px 12px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                <n.icon size={19} />
                <span className="hidden sm:inline xl:inline">{n.label}</span>
              </button>
            );
          })}
        </nav>

        <div
          className="hidden xl:flex items-center gap-3.5 p-4 rounded-2xl mt-auto shadow-sm"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <Flame size={20} color="#E9C46A" />
          <div className="text-[13px] text-white leading-tight">
            <div className="font-bold">Keep going!</div>
            <div className="text-[11.5px] mt-0.5" style={{ color: '#D6C2F0' }}>
              Ch.1–3 due 30 Sep
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-[1400px] mx-auto w-full flex flex-col gap-8">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-purple-100">
          <div>
            <h1
              className="text-3xl md:text-4xl font-extrabold tracking-tight"
              style={{ color: C.ink, fontFamily: 'Fraunces, serif' }}
            >
              Study Dashboard{' '}
              <Sparkles
                size={26}
                className="inline ml-1"
                style={{ color: C.violet400 }}
              />
            </h1>
            <p className="text-[15px] mt-1" style={{ color: C.inkSoft }}>
              Phase 1 · Chapters 1–3 · 3 August – 30 September 2026
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div
              className="px-4 py-2 rounded-2xl text-[13.5px] font-bold shadow-xs"
              style={{ background: C.lilac100, color: C.plum600 }}
            >
              {stats.done} / {stats.total} topics completed
            </div>
            <div
              className="text-[13px] font-semibold px-3 py-1 rounded-xl"
              style={{ color: C.inkSoft }}
            >
              {saveState === 'saving' && 'Saving...'}
              {saveState === 'saved' && 'Saved ✓'}
            </div>
          </div>
        </div>

        {tab === 'dashboard' && (
          <div className="flex flex-col gap-8">
            {/* Hero Banner Card */}
            <div
              className="rounded-3xl p-8 md:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${C.plum700}, ${C.violet500})`,
              }}
            >
              <div className="flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
                <div className="relative flex items-center justify-center shrink-0">
                  <ProgressRing pct={stats.pct} size={145} />
                  <div className="absolute text-center">
                    <div
                      className="text-3xl font-extrabold text-white"
                      style={{ fontFamily: 'Fraunces, serif' }}
                    >
                      {stats.pct}%
                    </div>
                    <div
                      className="text-[11px] uppercase tracking-wider font-bold"
                      style={{ color: '#D6C2F0' }}
                    >
                      Complete
                    </div>
                  </div>
                </div>
                <div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-white mb-2"
                    style={{ fontFamily: 'Fraunces, serif' }}
                  >
                    Your Academic Progress
                  </h2>
                  <p
                    className="text-[15px] max-w-lg leading-relaxed"
                    style={{ color: '#E9DEF9' }}
                  >
                    You are making steady headway! Keep up your consistency
                    across all 5 core modules for Semester 2.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4 w-full lg:w-auto shrink-0">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-center min-w-[140px]">
                  <div
                    className="text-white text-2xl font-bold"
                    style={{ fontFamily: 'Fraunces, serif' }}
                  >
                    {stats.inProgress}
                  </div>
                  <div
                    className="text-[12px] font-medium mt-1"
                    style={{ color: '#D6C2F0' }}
                  >
                    In Progress
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 text-center min-w-[140px]">
                  <div
                    className="text-white text-2xl font-bold"
                    style={{ fontFamily: 'Fraunces, serif' }}
                  >
                    {stats.onTrack}/5
                  </div>
                  <div
                    className="text-[12px] font-medium mt-1"
                    style={{ color: '#D6C2F0' }}
                  >
                    Active Modules
                  </div>
                </div>
              </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
              <StatCard
                icon={BookOpen}
                label="Total Topics"
                value={stats.total}
                sub="Ch.1–3, 5 modules"
              />
              <StatCard
                icon={CheckCircle2}
                label="Completed"
                value={stats.done}
                sub={`${stats.pct}% of total syllabus`}
              />
              <StatCard
                icon={Clock}
                label="In Progress"
                value={stats.inProgress}
                sub="Currently studying"
              />
              <StatCard
                icon={CalendarDays}
                label="Next Deadline"
                value={stats.nextDeadline?.name ?? '—'}
                sub={
                  stats.nextDeadline
                    ? `${daysUntil(stats.nextDeadline.due)} days remaining`
                    : ''
                }
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SectionCard title="Progress by Module" icon={LayoutGrid}>
                <div className="h-[280px] w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.perModule}
                      barSize={36}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid vertical={false} stroke={C.line} />
                      <XAxis
                        dataKey="module"
                        tick={{ fontSize: 12, fill: C.inkSoft }}
                        axisLine={{ stroke: C.line }}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: C.inkSoft }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 16,
                          border: `1px solid ${C.line}`,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
                          fontSize: 13,
                        }}
                        formatter={(
                          _v: number,
                          _n: string,
                          p: { payload?: { done?: number; total?: number } }
                        ) => [
                          `${p.payload?.done ?? 0} / ${
                            p.payload?.total ?? 0
                          } topics done`,
                          'Progress',
                        ]}
                      />
                      <Bar dataKey="done" radius={[10, 10, 0, 0]}>
                        {stats.perModule.map((m, i) => (
                          <Cell key={i} fill={m.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>

              <SectionCard title="Topic Distribution" icon={Award}>
                <div className="h-[220px] w-full flex items-center justify-center pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donutData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={5}
                      >
                        {donutData.map((d, i) => (
                          <Cell key={i} fill={d.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 16,
                          border: `1px solid ${C.line}`,
                          fontSize: 13,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-purple-50">
                  {donutData.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 text-[12.5px]"
                      style={{ color: C.inkSoft }}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0"
                        style={{ background: d.color }}
                      />
                      <span className="truncate font-medium">{d.name}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

            {/* Pace & Milestones Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SectionCard title="Study Pace vs Plan" icon={FileClock}>
                <div className="h-[260px] w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={paceData}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="paceGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop
                            offset="0%"
                            stopColor={C.violet400}
                            stopOpacity={0.4}
                          />
                          <stop
                            offset="100%"
                            stopColor={C.violet400}
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke={C.line} />
                      <XAxis
                        dataKey="week"
                        tick={{ fontSize: 12, fill: C.inkSoft }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: C.inkSoft }}
                        axisLine={false}
                        tickLine={false}
                        unit="%"
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 16,
                          border: `1px solid ${C.line}`,
                          fontSize: 13,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="target"
                        stroke={C.lilac200}
                        fill="none"
                        strokeDasharray="4 4"
                        strokeWidth={2.5}
                      />
                      <Area
                        type="monotone"
                        dataKey="actual"
                        stroke={C.violet500}
                        fill="url(#paceGrad)"
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div
                  className="flex gap-8 mt-4 text-[13px] font-medium"
                  style={{ color: C.inkSoft }}
                >
                  <span className="flex items-center gap-2">
                    <span
                      className="w-5 h-1 inline-block rounded-full"
                      style={{ background: C.lilac200 }}
                    />{' '}
                    Planned Pace
                  </span>
                  <span className="flex items-center gap-2">
                    <span
                      className="w-5 h-1 inline-block rounded-full"
                      style={{ background: C.violet500 }}
                    />{' '}
                    Actual Progress
                  </span>
                </div>
              </SectionCard>

              <SectionCard title="Upcoming Milestones" icon={CalendarDays}>
                <div className="flex flex-col gap-4">
                  {deadlines.slice(0, 4).map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between gap-4 p-4 rounded-2xl transition-all hover:bg-purple-50/50"
                      style={{ border: `1px solid ${C.lilac50}` }}
                    >
                      <div className="min-w-0">
                        <div
                          className="text-[14px] font-bold truncate"
                          style={{ color: C.ink }}
                        >
                          {d.name}
                        </div>
                        <div
                          className="text-[12.5px] mt-0.5"
                          style={{ color: C.inkSoft }}
                        >
                          {new Date(d.due).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </div>
                      </div>
                      <span
                        className="text-[12px] font-bold px-3.5 py-1.5 rounded-full shrink-0 shadow-xs"
                        style={{
                          background:
                            daysUntil(d.due) < 0 ? '#F8D7DA' : C.lilac50,
                          color: daysUntil(d.due) < 0 ? '#842029' : C.violet500,
                        }}
                      >
                        {daysUntil(d.due) < 0
                          ? 'Passed'
                          : `${daysUntil(d.due)} days left`}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

            {/* Quick Notes & Modules Overview Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SectionCard title="Modules at a Glance" icon={BookOpen}>
                <div className="flex flex-col gap-4 pt-1">
                  {stats.perModule.map((m) => (
                    <div
                      key={m.full}
                      className="p-4 rounded-2xl"
                      style={{ background: C.lilac50 }}
                    >
                      <div className="flex justify-between text-[13.5px] mb-2">
                        <span
                          className="font-bold"
                          style={{ color: C.plum700 }}
                        >
                          {m.full}
                        </span>
                        <span
                          className="font-semibold"
                          style={{ color: C.inkSoft }}
                        >
                          {m.done}/{m.total} topics ({m.pct}%)
                        </span>
                      </div>
                      <div
                        className="h-3 rounded-full w-full overflow-hidden bg-white/60"
                        style={{ border: `1px solid ${C.line}` }}
                      >
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${m.pct}%`, background: m.color }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Study Notes & Reminders" icon={StickyNote}>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full h-[155px] resize-none rounded-2xl p-4 text-[14px] outline-none transition-all focus:ring-2 focus:ring-purple-300"
                  style={{
                    background: C.lilac50,
                    color: C.ink,
                    border: `1px solid ${C.line}`,
                  }}
                  placeholder="Record reminders, formulas, or key concepts..."
                />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mt-4">
                  <p
                    className="text-[12.5px] italic"
                    style={{ color: C.inkSoft }}
                  >
                    Changes auto-save locally to your browser.
                  </p>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          'Are you sure you want to reset all progress data?'
                        )
                      ) {
                        localStorage.removeItem(STORAGE_KEY);
                        setTopics(seedTopics());
                        setDeadlines(seedDeadlines());
                        setNote(
                          'Rework the IoT layer diagram from memory before Sunday.'
                        );
                      }
                    }}
                    className="text-[12px] font-semibold text-red-500 hover:underline"
                  >
                    Reset Progress Data
                  </button>
                </div>
              </SectionCard>
            </div>
          </div>
        )}

        {tab === 'tracker' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2
                className="text-2xl font-bold mb-1"
                style={{ color: C.ink, fontFamily: 'Fraunces, serif' }}
              >
                Detailed Module Tracker
              </h2>
              <p className="text-[14px]" style={{ color: C.inkSoft }}>
                Expand modules to view topics and update your completion status
                interactively.
              </p>
            </div>
            {Object.keys(MODULE_META).map((m) => {
              const list = topics.filter((t) => t.module === m);
              const done = list.filter((t) => t.status === 'done').length;
              const pct = Math.round((done / list.length) * 100);
              const open = openModule === m;
              const chapters = [...new Set(list.map((t) => t.chapter))];
              return (
                <div
                  key={m}
                  className="rounded-3xl overflow-hidden shadow-sm transition-all"
                  style={{ background: C.card, border: `1px solid ${C.line}` }}
                >
                  <button
                    onClick={() => setOpenModule(open ? null : m)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className="w-4 h-4 rounded-full shrink-0"
                        style={{ background: MODULE_META[m].color }}
                      />
                      <div>
                        <div
                          className="font-bold text-lg"
                          style={{ color: C.ink, fontFamily: 'Fraunces, serif' }}
                        >
                          {m}
                        </div>
                        <div
                          className="text-[13px] mt-0.5"
                          style={{ color: C.inkSoft }}
                        >
                          {done} of {list.length} topics completed
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="hidden sm:block w-36 h-3 rounded-full overflow-hidden bg-purple-50">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${pct}%`,
                            background: MODULE_META[m].color,
                          }}
                        />
                      </div>
                      <span
                        className="text-[13px] font-bold px-3.5 py-1.5 rounded-full"
                        style={{ background: C.lilac50, color: C.violet500 }}
                      >
                        {pct}%
                      </span>
                      <ChevronDown
                        size={22}
                        style={{
                          color: C.inkSoft,
                          transform: open ? 'rotate(180deg)' : 'none',
                          transition: 'transform 0.2s',
                        }}
                      />
                    </div>
                  </button>
                  {open && (
                    <div className="px-6 pb-6 flex flex-col gap-8 pt-2 border-t border-purple-50">
                      {chapters.map((ch) => (
                        <div key={ch}>
                          <div
                            className="text-[13px] font-bold uppercase tracking-wider mb-4 px-1"
                            style={{ color: C.plum600 }}
                          >
                            {ch}
                          </div>
                          <div className="flex flex-col gap-3">
                            {list
                              .filter((t) => t.chapter === ch)
                              .map((t) => (
                                <div
                                  key={t.id}
                                  className="flex items-center justify-between gap-4 py-3.5 px-4 rounded-2xl transition-colors"
                                  style={{
                                    background:
                                      t.status === 'done'
                                        ? '#F3FBF6'
                                        : C.lilac50,
                                    border: `1px solid ${
                                      t.status === 'done'
                                        ? '#D1E7DD'
                                        : C.line
                                    }`,
                                  }}
                                >
                                  <span
                                    className="text-[14.5px] font-medium"
                                    style={{
                                      color: C.ink,
                                      textDecoration:
                                        t.status === 'done'
                                          ? 'line-through'
                                          : 'none',
                                      opacity: t.status === 'done' ? 0.6 : 1,
                                    }}
                                  >
                                    {t.sub}
                                  </span>
                                  <StatusPill
                                    status={t.status}
                                    onClick={() => cycleTopic(t.id)}
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {tab === 'deadlines' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2
                className="text-2xl font-bold mb-1"
                style={{ color: C.ink, fontFamily: 'Fraunces, serif' }}
              >
                Semester Deadlines & Assessments
              </h2>
              <p className="text-[14px]" style={{ color: C.inkSoft }}>
                Monitor your upcoming deliverables, test sessions, and final
                examinations.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {deadlines.map((d) => (
                <div
                  key={d.id}
                  className="rounded-3xl p-7 flex flex-col justify-between gap-5 shadow-sm"
                  style={{ background: C.card, border: `1px solid ${C.line}` }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[12px] font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full"
                      style={{ background: C.lilac100, color: C.plum600 }}
                    >
                      {d.type}
                    </span>
                    <span
                      className="text-[13px] font-semibold"
                      style={{
                        color: daysUntil(d.due) < 0 ? '#B4453F' : C.inkSoft,
                      }}
                    >
                      {daysUntil(d.due) < 0
                        ? 'Past due'
                        : `${daysUntil(d.due)} days remaining`}
                    </span>
                  </div>
                  <div>
                    <div
                      className="font-bold text-xl mb-1.5"
                      style={{ color: C.ink, fontFamily: 'Fraunces, serif' }}
                    >
                      {d.name}
                    </div>
                    <div className="text-[14px]" style={{ color: C.inkSoft }}>
                      {d.scope}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-purple-50 mt-1">
                    <span
                      className="text-[13.5px] font-medium flex items-center gap-2.5"
                      style={{ color: C.inkSoft }}
                    >
                      <CalendarDays
                        size={18}
                        style={{ color: C.violet500 }}
                      />{' '}
                      {new Date(d.due).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                    <StatusPill
                      status={d.status}
                      onClick={() => cycleDeadline(d.id)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
