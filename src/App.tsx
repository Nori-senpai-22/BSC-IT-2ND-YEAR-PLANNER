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
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  ListChecks,
  FileClock,
  Award,
  StickyNote,
  Flame,
  Target,
  Eye,
} from 'lucide-react';

/* ---------------------------------------------------------------- */
/* Design tokens                                                     */
/* ---------------------------------------------------------------- */
const C = {
  bg: '#FFF4F8',
  card: '#FFFFFF',
  lilac50: '#FDEAF2',
  lilac100: '#FBD6E7',
  lilac200: '#F6B4D2',
  violet300: '#F191BC',
  violet400: '#E86FA3',
  violet500: '#D94C89',
  plum600: '#B93570',
  plum700: '#6B2145',
  ink: '#4A1F38',
  inkSoft: '#9A6E85',
  line: '#F6D6E6',
  gold: '#D9A441',
};

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Playball&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');";

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

interface Goal {
  id: number;
  name: string;
  pct: number;
  detail: string;
}

/* ---------------------------------------------------------------- */
/* Data — Chapters 1-3 of every module you have guides for           */
/* ---------------------------------------------------------------- */
const MODULE_META: Record<string, { short: string; color: string }> = {
  'Big Data & IoT 600': { short: 'Big Data & IoT', color: '#D94C89' },
  'Machine Learning 600': { short: 'Machine Learning', color: '#B93570' },
  'Programming 622': { short: 'Programming', color: '#F191BC' },
  'Internet Programming 622': { short: 'Internet Prog.', color: '#6B2145' },
  'Information Systems 622': { short: 'Info Systems', color: '#D9A441' },
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
function ProgressRing({ pct, size = 128 }: { pct: number; size?: number }) {
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={C.lilac100}
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="url(#ringGrad)"
        strokeWidth={stroke}
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={c - (pct / 100) * c}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <defs>
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E86FA3" />
          <stop offset="100%" stopColor="#B93570" />
        </linearGradient>
      </defs>
    </svg>
  );
}

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function MiniCalendar({
  monthDate,
  onPrev,
  onNext,
  deadlines,
}: {
  monthDate: Date;
  onPrev: () => void;
  onNext: () => void;
  deadlines: Deadline[];
}) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dueDays = new Set(
    deadlines
      .filter((d) => {
        const dd = new Date(d.due);
        return dd.getFullYear() === year && dd.getMonth() === month;
      })
      .map((d) => new Date(d.due).getDate())
  );

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const isToday = (day: number) =>
    day === TODAY.getDate() &&
    month === TODAY.getMonth() &&
    year === TODAY.getFullYear();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-[13px] font-bold"
          style={{ color: C.ink, fontFamily: 'Fraunces, serif' }}
        >
          {monthDate.toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric',
          })}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrev}
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: C.lilac50, color: C.violet500 }}
          >
            <ChevronLeft size={13} />
          </button>
          <button
            onClick={onNext}
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: C.lilac50, color: C.violet500 }}
          >
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-1.5 text-center">
        {WEEKDAY_LABELS.map((w, i) => (
          <div
            key={i}
            className="text-[10px] font-bold"
            style={{ color: C.inkSoft }}
          >
            {w}
          </div>
        ))}
        {cells.map((day, i) => (
          <div key={i} className="flex items-center justify-center py-0.5">
            {day && (
              <div
                className="relative w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-semibold"
                style={{
                  background: isToday(day) ? C.violet500 : 'transparent',
                  color: isToday(day) ? '#fff' : C.ink,
                }}
              >
                {day}
                {dueDays.has(day) && !isToday(day) && (
                  <span
                    className="absolute -bottom-0.5 w-1 h-1 rounded-full"
                    style={{ background: C.gold }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div
        className="flex items-center gap-1.5 mt-2 text-[10.5px]"
        style={{ color: C.inkSoft }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: C.gold }}
        />
        Deadline this month
      </div>
    </div>
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
      className="rounded-2xl p-4 flex items-center gap-3 flex-1 min-w-[150px]"
      style={{ background: C.card, border: `1px solid ${C.line}` }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: C.lilac50, color: C.violet500 }}
      >
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <div
          className="text-[11px] font-semibold tracking-wide uppercase"
          style={{ color: C.inkSoft }}
        >
          {label}
        </div>
        <div
          className="text-lg font-bold truncate"
          style={{ color: C.ink, fontFamily: 'Fraunces, serif' }}
        >
          {value}
        </div>
        {sub && (
          <div className="text-[11px]" style={{ color: C.inkSoft }}>
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
      className="rounded-2xl p-5"
      style={{ background: C.card, border: `1px solid ${C.line}` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={17} style={{ color: C.violet500 }} />}
          <h3
            className="text-[13px] font-bold uppercase tracking-wide"
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
      <CheckCircle2 size={14} />
    ) : status === 'progress' ? (
      <Clock size={14} />
    ) : (
      <Circle size={14} />
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
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold shrink-0 transition-transform active:scale-95"
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
  const [calMonth, setCalMonth] = useState<Date>(
    new Date(TODAY.getFullYear(), TODAY.getMonth(), 1)
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

  // Edit these directly to update the Study Goals panel
  const goals: Goal[] = [
    {
      id: 1,
      name: 'Chapters 1–3 Mastery',
      pct: stats.pct,
      detail: 'All 5 modules · due 30 Sep',
    },
    { id: 2, name: 'Assignment 1 Ready', pct: 40, detail: 'Due 31 Aug' },
    {
      id: 3,
      name: 'Revision Bank Built',
      pct: 25,
      detail: 'Flashcards + chapter summaries',
    },
    {
      id: 4,
      name: 'Mock Exam Practice',
      pct: 10,
      detail: 'Before 16 Nov exams',
    },
  ];

  const topicsByModule = [...stats.perModule].sort((a, b) => b.total - a.total);

  const navItems: { id: string; label: string; icon: LucideIcon }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'tracker', label: 'Study Tracker', icon: ListChecks },
    { id: 'deadlines', label: 'Deadlines', icon: FileClock },
  ];

  return (
    <div
      className="min-h-screen w-full flex"
      style={{
        background: C.bg,
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <style>{FONT_IMPORT}</style>

      {/* Sidebar */}
      <aside
        className="w-[76px] md:w-[196px] shrink-0 flex flex-col py-6 px-3 gap-1"
        style={{ background: C.plum700 }}
      >
        <div className="flex items-center gap-2 px-2 mb-8">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <GraduationCap size={19} color="#fff" />
          </div>
          <div className="hidden md:block leading-tight">
            <div
              className="text-white text-[19px] -mb-0.5"
              style={{ fontFamily: 'Playball, cursive' }}
            >
              Faith's Study Hub
            </div>
            <div
              className="text-[10px] uppercase tracking-wide"
              style={{ color: '#E7B9D2' }}
            >
              BSc IT · Semester 2
            </div>
          </div>
        </div>

        {navItems.map((n) => {
          const active = tab === n.id;
          return (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-semibold transition-colors"
              style={{
                background: active ? 'rgba(255,255,255,0.14)' : 'transparent',
                color: active ? '#fff' : '#E7B9D2',
              }}
            >
              <n.icon size={17} />
              <span className="hidden md:inline">{n.label}</span>
            </button>
          );
        })}

        <div
          className="mt-auto hidden md:flex items-center gap-2 px-3 py-3 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.08)' }}
        >
          <Flame size={16} color="#D9A441" />
          <div className="text-[11px] text-white leading-tight">
            <div className="font-bold">Keep going</div>
            <div style={{ color: '#E7B9D2' }}>Ch.1-3 due 30 Sep</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-7 max-w-[1180px] mx-auto w-full">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div>
            <h1
              className="text-3xl md:text-[34px] leading-none"
              style={{ color: C.plum600, fontFamily: 'Playball, cursive' }}
            >
              Study Dashboard{' '}
              <Sparkles
                size={22}
                className="inline ml-1"
                style={{ color: C.gold }}
              />
            </h1>
            <p
              className="text-[11px] font-bold uppercase tracking-[0.14em] mt-1"
              style={{ color: C.inkSoft }}
            >
              Phase 1 · Chapters 1–3 · 3 Aug – 30 Sep 2026
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="px-3 py-1.5 rounded-full text-[12px] font-semibold"
              style={{ background: C.lilac100, color: C.plum600 }}
            >
              {stats.done} / {stats.total} topics done
            </div>
            <div
              className="text-[11px] font-medium"
              style={{ color: C.inkSoft }}
            >
              {saveState === 'saving' && 'Saving...'}
              {saveState === 'saved' && 'Saved ✓'}
            </div>
          </div>
        </div>

        {tab === 'dashboard' && (
          <div className="flex flex-col gap-5">
            {/* Hero row */}
            <div
              className="rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-center gap-6"
              style={{
                background: `linear-gradient(120deg, ${C.plum700}, ${C.violet500})`,
              }}
            >
              <div className="relative flex items-center justify-center shrink-0">
                <ProgressRing pct={stats.pct} />
                <div className="absolute text-center">
                  <div
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: 'Fraunces, serif' }}
                  >
                    {stats.pct}%
                  </div>
                  <div
                    className="text-[10px] uppercase tracking-wide"
                    style={{ color: '#F6C6DE' }}
                  >
                    Complete
                  </div>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                <div>
                  <div
                    className="text-white text-xl font-bold"
                    style={{ fontFamily: 'Fraunces, serif' }}
                  >
                    {stats.done}
                  </div>
                  <div className="text-[11px]" style={{ color: '#F6C6DE' }}>
                    Topics done
                  </div>
                </div>
                <div>
                  <div
                    className="text-white text-xl font-bold"
                    style={{ fontFamily: 'Fraunces, serif' }}
                  >
                    {stats.inProgress}
                  </div>
                  <div className="text-[11px]" style={{ color: '#F6C6DE' }}>
                    In progress
                  </div>
                </div>
                <div>
                  <div
                    className="text-white text-xl font-bold"
                    style={{ fontFamily: 'Fraunces, serif' }}
                  >
                    {stats.onTrack}/5
                  </div>
                  <div className="text-[11px]" style={{ color: '#F6C6DE' }}>
                    Modules started
                  </div>
                </div>
                <div>
                  <div
                    className="text-white text-xl font-bold"
                    style={{ fontFamily: 'Fraunces, serif' }}
                  >
                    {stats.nextDeadline
                      ? `${daysUntil(stats.nextDeadline.due)}d`
                      : '—'}
                  </div>
                  <div className="text-[11px]" style={{ color: '#F6C6DE' }}>
                    To {stats.nextDeadline?.name ?? 'next deadline'}
                  </div>
                </div>
              </div>
            </div>

            {/* Stat cards */}
            <div className="flex flex-wrap gap-3">
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
                sub={`${stats.pct}% of syllabus`}
              />
              <StatCard
                icon={Clock}
                label="In Progress"
                value={stats.inProgress}
              />
              <StatCard
                icon={CalendarDays}
                label="Next Deadline"
                value={stats.nextDeadline?.name ?? '—'}
                sub={
                  stats.nextDeadline
                    ? `${daysUntil(stats.nextDeadline.due)} days left`
                    : ''
                }
              />
            </div>

            {/* Calendar + Module summary table */}
            <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-5">
              <SectionCard title="This Month" icon={CalendarDays}>
                <MiniCalendar
                  monthDate={calMonth}
                  onPrev={() =>
                    setCalMonth(
                      (m) => new Date(m.getFullYear(), m.getMonth() - 1, 1)
                    )
                  }
                  onNext={() =>
                    setCalMonth(
                      (m) => new Date(m.getFullYear(), m.getMonth() + 1, 1)
                    )
                  }
                  deadlines={deadlines}
                />
              </SectionCard>

              <SectionCard title="Module Summary" icon={LayoutGrid}>
                <div className="flex flex-col">
                  <div
                    className="grid grid-cols-[1.6fr_0.7fr_0.7fr_0.9fr] text-[10.5px] font-bold uppercase tracking-wide pb-2"
                    style={{
                      color: C.inkSoft,
                      borderBottom: `1px solid ${C.line}`,
                    }}
                  >
                    <span>Module</span>
                    <span className="text-right">Total</span>
                    <span className="text-right">Done</span>
                    <span className="text-right">Left</span>
                  </div>
                  {stats.perModule.map((m) => (
                    <div
                      key={m.full}
                      className="grid grid-cols-[1.6fr_0.7fr_0.7fr_0.9fr] items-center text-[12px] py-2"
                      style={{ borderBottom: `1px solid ${C.lilac50}` }}
                    >
                      <span
                        className="flex items-center gap-1.5 font-semibold truncate"
                        style={{ color: C.ink }}
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: m.color }}
                        />
                        {m.module}
                      </span>
                      <span className="text-right" style={{ color: C.inkSoft }}>
                        {m.total}
                      </span>
                      <span
                        className="text-right font-semibold"
                        style={{ color: C.violet500 }}
                      >
                        {m.done}
                      </span>
                      <span className="text-right" style={{ color: C.inkSoft }}>
                        {m.total - m.done}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
              <SectionCard title="Progress by Module" icon={LayoutGrid}>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stats.perModule} barSize={26}>
                    <CartesianGrid vertical={false} stroke={C.line} />
                    <XAxis
                      dataKey="module"
                      tick={{ fontSize: 11, fill: C.inkSoft }}
                      axisLine={{ stroke: C.line }}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: C.inkSoft }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: `1px solid ${C.line}`,
                        fontSize: 12,
                      }}
                      formatter={(
                        _value: number,
                        _name: string,
                        item: { payload?: { done?: number; total?: number } }
                      ) => [
                        `${item.payload?.done ?? 0} / ${
                          item.payload?.total ?? 0
                        } topics`,
                        'Done',
                      ]}
                    />
                    <Bar dataKey="done" radius={[8, 8, 0, 0]}>
                      {stats.perModule.map((m, i) => (
                        <Cell key={i} fill={m.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </SectionCard>

              <SectionCard title="Topic Distribution" icon={Award}>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={donutData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={54}
                      outerRadius={82}
                      paddingAngle={3}
                    >
                      {donutData.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: `1px solid ${C.line}`,
                        fontSize: 12,
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-1.5 mt-2">
                  {donutData.map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-[11px]"
                      style={{ color: C.inkSoft }}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: d.color }}
                      />
                      {d.name}{' '}
                      <span
                        className="ml-auto font-semibold"
                        style={{ color: C.ink }}
                      >
                        {d.value}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

            {/* Pace + goals + milestones */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.95fr_0.9fr] gap-5">
              <SectionCard title="Study Pace vs Plan" icon={FileClock}>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={paceData}>
                    <defs>
                      <linearGradient id="paceGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop
                          offset="0%"
                          stopColor={C.violet400}
                          stopOpacity={0.5}
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
                      tick={{ fontSize: 11, fill: C.inkSoft }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 11, fill: C.inkSoft }}
                      axisLine={false}
                      tickLine={false}
                      unit="%"
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: `1px solid ${C.line}`,
                        fontSize: 12,
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="target"
                      stroke={C.lilac200}
                      fill="none"
                      strokeDasharray="4 4"
                      strokeWidth={2}
                    />
                    <Area
                      type="monotone"
                      dataKey="actual"
                      stroke={C.violet500}
                      fill="url(#paceGrad)"
                      strokeWidth={2.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <div
                  className="flex gap-4 mt-1 text-[11px]"
                  style={{ color: C.inkSoft }}
                >
                  <span className="flex items-center gap-1">
                    <span
                      className="w-3 h-0.5 inline-block"
                      style={{ background: C.lilac200 }}
                    />{' '}
                    Planned pace
                  </span>
                  <span className="flex items-center gap-1">
                    <span
                      className="w-3 h-0.5 inline-block"
                      style={{ background: C.violet500 }}
                    />{' '}
                    Your progress
                  </span>
                </div>
              </SectionCard>

              <SectionCard title="Study Goals" icon={Target}>
                <div className="flex flex-col gap-3.5">
                  {goals.map((g) => (
                    <div key={g.id}>
                      <div className="flex justify-between items-baseline text-[12px] mb-1">
                        <span
                          className="font-semibold"
                          style={{ color: C.ink }}
                        >
                          {g.name}
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: C.violet500 }}
                        >
                          {g.pct}%
                        </span>
                      </div>
                      <div
                        className="h-2 rounded-full w-full"
                        style={{ background: C.lilac50 }}
                      >
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${g.pct}%`,
                            background:
                              g.pct >= 70
                                ? '#3E9A6D'
                                : g.pct >= 35
                                ? C.violet500
                                : C.gold,
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                      <div
                        className="text-[10.5px] mt-1"
                        style={{ color: C.inkSoft }}
                      >
                        {g.detail}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Upcoming Milestones" icon={CalendarDays}>
                <div className="flex flex-col gap-2">
                  {deadlines.map((d) => (
                    <div
                      key={d.id}
                      className="flex items-center justify-between gap-2 py-1.5"
                      style={{ borderBottom: `1px solid ${C.lilac50}` }}
                    >
                      <div className="min-w-0">
                        <div
                          className="text-[12.5px] font-semibold truncate"
                          style={{ color: C.ink }}
                        >
                          {d.name}
                        </div>
                        <div
                          className="text-[10.5px]"
                          style={{ color: C.inkSoft }}
                        >
                          {new Date(d.due).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </div>
                      </div>
                      <span
                        className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
                        style={{
                          background:
                            daysUntil(d.due) < 0 ? '#F3E4E4' : C.lilac50,
                          color: daysUntil(d.due) < 0 ? '#B4453F' : C.violet500,
                        }}
                      >
                        {daysUntil(d.due) < 0 ? 'past' : `${daysUntil(d.due)}d`}
                      </span>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>

            {/* Topics by module + exam countdown */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5">
              <SectionCard title="Topics by Module" icon={ListChecks}>
                <ResponsiveContainer width="100%" height={230}>
                  <BarChart
                    data={topicsByModule}
                    layout="vertical"
                    barSize={16}
                    margin={{ left: 8 }}
                  >
                    <CartesianGrid horizontal={false} stroke={C.line} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: C.inkSoft }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="module"
                      width={100}
                      tick={{ fontSize: 11, fill: C.ink }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: `1px solid ${C.line}`,
                        fontSize: 12,
                      }}
                      formatter={(_v: number, _n: string, item) => [
                        `${(item.payload as { total: number }).total} topics`,
                        'Total',
                      ]}
                    />
                    <Bar dataKey="total" radius={[0, 8, 8, 0]}>
                      {topicsByModule.map((m, i) => (
                        <Cell key={i} fill={m.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </SectionCard>

              <div
                className="rounded-2xl p-5 flex flex-col justify-between text-white relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${C.plum700}, ${C.plum600} 55%, ${C.violet500})`,
                  minHeight: 230,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.14em]"
                    style={{ color: '#F6C6DE' }}
                  >
                    Next Exam Countdown
                  </span>
                  <div
                    className="w-8 h-6 rounded-md"
                    style={{
                      background:
                        'linear-gradient(135deg, #EFD79B, #D9A441)',
                    }}
                  />
                </div>
                <div>
                  <div
                    className="text-4xl font-bold"
                    style={{ fontFamily: 'Fraunces, serif' }}
                  >
                    {stats.nextDeadline
                      ? daysUntil(stats.nextDeadline.due)
                      : '—'}
                    <span className="text-lg font-normal">
                      {' '}
                      days left
                    </span>
                  </div>
                  <div
                    className="text-[13px] font-semibold mt-1"
                    style={{ color: '#F6C6DE' }}
                  >
                    {stats.nextDeadline?.name ?? 'No upcoming deadline'}
                  </div>
                  <div className="text-[11px]" style={{ color: '#E7B9D2' }}>
                    {stats.nextDeadline?.scope}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10.5px] mb-1">
                    <span style={{ color: '#F6C6DE' }}>
                      Syllabus prepared
                    </span>
                    <span className="font-bold">{stats.pct}%</span>
                  </div>
                  <div
                    className="h-1.5 rounded-full w-full"
                    style={{ background: 'rgba(255,255,255,0.25)' }}
                  >
                    <div
                      className="h-1.5 rounded-full"
                      style={{
                        width: `${stats.pct}%`,
                        background: C.gold,
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Module list + notes */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5">
              <SectionCard title="Modules at a Glance" icon={BookOpen}>
                <div className="flex flex-col gap-3">
                  {stats.perModule.map((m) => (
                    <div key={m.full}>
                      <div className="flex justify-between text-[12px] mb-1">
                        <span
                          className="font-semibold"
                          style={{ color: C.ink }}
                        >
                          {m.module}
                        </span>
                        <span style={{ color: C.inkSoft }}>
                          {m.done}/{m.total}
                        </span>
                      </div>
                      <div
                        className="h-2 rounded-full w-full"
                        style={{ background: C.lilac50 }}
                      >
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${m.pct}%`,
                            background: m.color,
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Notes" icon={StickyNote}>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full h-[130px] resize-none rounded-xl p-3 text-[12.5px] outline-none"
                  style={{
                    background: C.lilac50,
                    color: C.ink,
                    border: `1px solid ${C.line}`,
                  }}
                  placeholder="Jot a quick reminder..."
                />
                <div className="flex justify-between items-center mt-2">
                  <p
                    className="text-[11px] italic"
                    style={{ color: C.inkSoft }}
                  >
                    "Discipline today, freedom tomorrow."
                  </p>
                  <button
                    onClick={() => {
                      if (
                        window.confirm('Reset all progress back to default?')
                      ) {
                        localStorage.removeItem(STORAGE_KEY);
                        setTopics(seedTopics());
                        setDeadlines(seedDeadlines());
                        setNote(
                          'Rework the IoT layer diagram from memory before Sunday.'
                        );
                      }
                    }}
                    className="text-[10.5px] text-red-500 hover:underline"
                  >
                    Reset Progress
                  </button>
                </div>
              </SectionCard>
            </div>

            {/* Streak, reviewed topics, and completion goal */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <SectionCard title="Study Streak" icon={Flame}>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: C.lilac50, color: C.gold }}
                  >
                    <Flame size={26} />
                  </div>
                  <div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: C.ink, fontFamily: 'Fraunces, serif' }}
                    >
                      6 days
                    </div>
                    <div className="text-[11px]" style={{ color: C.inkSoft }}>
                      Best streak: 14 days · edit in code
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Topics Reviewed" icon={Eye}>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: C.lilac50, color: C.violet500 }}
                  >
                    <Eye size={24} />
                  </div>
                  <div>
                    <div
                      className="text-2xl font-bold"
                      style={{ color: C.ink, fontFamily: 'Fraunces, serif' }}
                    >
                      {stats.done}
                    </div>
                    <div className="text-[11px]" style={{ color: C.inkSoft }}>
                      +5 this week · edit in code
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Completion Goal" icon={Award}>
                <div className="flex items-center gap-4">
                  <div className="relative flex items-center justify-center shrink-0">
                    <ProgressRing pct={stats.pct} size={72} />
                    <div
                      className="absolute text-[13px] font-bold"
                      style={{ color: C.ink }}
                    >
                      {stats.pct}%
                    </div>
                  </div>
                  <div>
                    <div
                      className="text-[12.5px] font-semibold"
                      style={{ color: C.ink }}
                    >
                      100% before exams
                    </div>
                    <div className="text-[11px]" style={{ color: C.inkSoft }}>
                      Target: 16 Nov 2026
                    </div>
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        )}

        {tab === 'tracker' && (
          <div className="flex flex-col gap-3">
            {Object.keys(MODULE_META).map((m) => {
              const list = topics.filter((t) => t.module === m);
              const done = list.filter((t) => t.status === 'done').length;
              const pct = Math.round((done / list.length) * 100);
              const open = openModule === m;
              const chapters = [...new Set(list.map((t) => t.chapter))];
              return (
                <div
                  key={m}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: C.card, border: `1px solid ${C.line}` }}
                >
                  <button
                    onClick={() => setOpenModule(open ? null : m)}
                    className="w-full flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: MODULE_META[m].color }}
                      />
                      <span
                        className="font-bold text-[14px]"
                        style={{ color: C.ink, fontFamily: 'Fraunces, serif' }}
                      >
                        {m}
                      </span>
                      <span
                        className="text-[11px] px-2 py-0.5 rounded-full"
                        style={{ background: C.lilac50, color: C.violet500 }}
                      >
                        {done}/{list.length} · {pct}%
                      </span>
                    </div>
                    <ChevronDown
                      size={18}
                      style={{
                        color: C.inkSoft,
                        transform: open ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s',
                      }}
                    />
                  </button>
                  {open && (
                    <div className="px-4 pb-4 flex flex-col gap-4">
                      {chapters.map((ch) => (
                        <div key={ch}>
                          <div
                            className="text-[11.5px] font-bold uppercase tracking-wide mb-2"
                            style={{ color: C.plum600 }}
                          >
                            {ch}
                          </div>
                          <div className="flex flex-col gap-1.5">
                            {list
                              .filter((t) => t.chapter === ch)
                              .map((t) => (
                                <div
                                  key={t.id}
                                  className="flex items-center justify-between gap-2 py-1.5 px-2 rounded-lg"
                                  style={{
                                    background:
                                      t.status === 'done'
                                        ? '#F3FBF6'
                                        : 'transparent',
                                  }}
                                >
                                  <span
                                    className="text-[12.5px]"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {deadlines.map((d) => (
              <div
                key={d.id}
                className="rounded-2xl p-4 flex flex-col gap-3"
                style={{ background: C.card, border: `1px solid ${C.line}` }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10.5px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                    style={{ background: C.lilac100, color: C.plum600 }}
                  >
                    {d.type}
                  </span>
                  <span
                    className="text-[11px] font-semibold"
                    style={{
                      color: daysUntil(d.due) < 0 ? '#B4453F' : C.inkSoft,
                    }}
                  >
                    {daysUntil(d.due) < 0
                      ? 'Past due'
                      : `${daysUntil(d.due)} days left`}
                  </span>
                </div>
                <div>
                  <div
                    className="font-bold text-[15px]"
                    style={{ color: C.ink, fontFamily: 'Fraunces, serif' }}
                  >
                    {d.name}
                  </div>
                  <div className="text-[12px]" style={{ color: C.inkSoft }}>
                    {d.scope}
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className="text-[12px] flex items-center gap-1.5"
                    style={{ color: C.inkSoft }}
                  >
                    <CalendarDays size={14} />{' '}
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
        )}
      </main>
    </div>
  );
}
