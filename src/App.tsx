import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Headphones,
  PhoneCall,
  PlayCircle,
  Search,
  Send,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { FaSlack, FaTelegramPlane, FaWhatsapp } from 'react-icons/fa'
import { SiGmail, SiImessage } from 'react-icons/si'
import type { IconType } from 'react-icons'

import { Button } from '@/components/ui/button'

type DemoKey = 'inventory' | 'lead' | 'staffing'

type DemoMetric = {
  label: string
  value: string
  delta: string
}

type DemoEvent = {
  time: string
  title: string
  detail: string
  icon: LucideIcon
}

type DemoScenario = {
  label: string
  title: string
  summary: string
  alert: string
  impact: string
  actions: string[]
  metrics: DemoMetric[]
  timeline: DemoEvent[]
}

type IntegrationNode = {
  name: string
  icon: IconType
  colorClass: string
  positionClass: string
  duration: number
  delay: number
}

const agentImage = '/karl-agent.jpg'
const demoAgentImage = '/jamie-agent.jpg'

const navLinks = [
  { label: 'How We Work', href: '#how' },
  { label: 'Services', href: '#services' },
  { label: 'Integrations', href: '#integrations' },
  { label: 'Demo', href: '#demo' },
  { label: 'Use Cases', href: '#use-cases' },
]

const services: Array<{
  icon: LucideIcon
  title: string
  description: string
  metric: string
}> = [
  {
    icon: PhoneCall,
    title: 'AI Receptionist',
    description:
      'Answers inbound calls, captures caller details, and routes qualified conversations without missing revenue after hours.',
    metric: 'Missed-call loss reduced by 78%',
  },
  {
    icon: Headphones,
    title: 'AI Customer Support',
    description:
      'Handles repetitive support questions instantly and escalates edge cases with full context for your human team.',
    metric: 'Sub-60-second first response',
  },
  {
    icon: BarChart3,
    title: 'AI Revenue Recovery Agent',
    description:
      'Monitors response speed, pipeline drift, lead intent, and booking drop-off so high-value opportunities get recovered before they go cold.',
    metric: '41% faster first-touch outreach',
  },
  {
    icon: Search,
    title: 'AI Operations Analyst',
    description:
      'Tracks staffing, scheduling, booking flow, and workload pressure across your operation, then recommends changes before capacity gets lost.',
    metric: '22+ bookings recovered monthly',
  },
]

const steps = [
  {
    title: 'Understand the Use Case',
    description:
      'We start with what you actually want help with, whether that is business tasks, study flow, client follow-up, scheduling, or daily organization.',
  },
  {
    title: 'Shape the Agent Around You',
    description:
      'We build the agent around your current workflow, tools, tone, and routines so it fits what you already do instead of forcing a generic setup.',
  },
  {
    title: 'Make It Ready to Use',
    description:
      'We keep the setup practical and easy to use so you can start getting value quickly without needing a complicated system.',
  },
  {
    title: 'Improve as You Grow',
    description:
      'As your needs change, we refine the agent with you so it keeps becoming more useful over time for personal or business work.',
  },
]

const audiences = ['Solo business owners', 'Students', 'Coaches', 'Creators', 'Operators', 'Anyone with a workflow']

const personalAgentBenefits = [
  'A personal agent gives one person leverage without needing a full team.',
  'It keeps tasks, reminders, follow-ups, and routine decisions from slipping.',
  'It becomes more valuable as your workload or goals grow more complex.',
]

const integrations: IntegrationNode[] = [
  {
    name: 'Slack',
    icon: FaSlack,
    colorClass: 'text-[#4A154B]',
    positionClass: 'left-[6%] top-[18%]',
    duration: 6.2,
    delay: 0,
  },
  {
    name: 'Telegram',
    icon: FaTelegramPlane,
    colorClass: 'text-[#229ED9]',
    positionClass: 'left-[18%] top-[58%]',
    duration: 7.1,
    delay: 0.25,
  },
  {
    name: 'WhatsApp',
    icon: FaWhatsapp,
    colorClass: 'text-[#25D366]',
    positionClass: 'left-[42%] top-[72%]',
    duration: 6.8,
    delay: 0.5,
  },
  {
    name: 'iMessage',
    icon: SiImessage,
    colorClass: 'text-[#34C759]',
    positionClass: 'right-[15%] top-[56%]',
    duration: 7.4,
    delay: 0.8,
  },
  {
    name: 'Gmail',
    icon: SiGmail,
    colorClass: 'text-[#EA4335]',
    positionClass: 'right-[8%] top-[16%]',
    duration: 6.5,
    delay: 0.15,
  },
]

const demoScenarios: Record<DemoKey, DemoScenario> = {
  inventory: {
    label: 'Inventory Watch',
    title: 'Agent caught inventory overspend before it hit margin',
    summary:
      'The agent noticed supply usage rising much faster than order volume at one location and flagged it before the next reorder cycle.',
    alert: 'Packaging and glove usage is up 26% while order count only rose 5% this week.',
    impact: '$3,420 monthly waste projected if the pattern continues.',
    actions: [
      'Flag the Midtown location manager and run a same-day count audit.',
      'Reduce the next auto-reorder quantity by 18% until usage normalizes.',
      'Track waste by shift for 7 days to isolate the source of overspend.',
    ],
    metrics: [
      { label: 'Order Volume', value: '+5%', delta: 'normal range' },
      { label: 'Glove Usage', value: '+26%', delta: 'above expected' },
      { label: 'Wrap Usage', value: '+18%', delta: 'above expected' },
      { label: 'Next Reorder', value: '6 days early', delta: 'risk detected' },
    ],
    timeline: [
      {
        time: '09:12',
        title: 'Variance detected',
        detail: 'Agent compared supply consumption against orders and historical usage.',
        icon: Search,
      },
      {
        time: '09:18',
        title: 'Cross-check completed',
        detail: 'No related promo or order surge was found, so the spike was flagged abnormal.',
        icon: BarChart3,
      },
      {
        time: '09:24',
        title: 'Ops team alerted',
        detail: 'Manager received a short action brief with affected items and projected waste.',
        icon: Send,
      },
    ],
  },
  lead: {
    label: 'Lead Recovery',
    title: 'Agent found pipeline loss caused by slow follow-up',
    summary:
      'The agent tracked submission timestamps against first response time and surfaced a conversion drop from delayed outreach.',
    alert: '12 high-intent leads waited longer than 37 minutes for first contact today.',
    impact: '$18.6k in pipeline value is currently at risk from response lag.',
    actions: [
      'Auto-assign every high-intent lead to instant AI outreach within 60 seconds.',
      'Escalate enterprise leads directly to the closer on duty with a summary.',
      'Send a same-day recovery sequence to delayed leads still untouched.',
    ],
    metrics: [
      { label: 'High-Intent Leads', value: '12', delta: 'waiting' },
      { label: 'Average Delay', value: '37 min', delta: 'too slow' },
      { label: 'Close Rate Drop', value: '-14%', delta: 'vs last week' },
      { label: 'Recoverable Pipeline', value: '$18.6k', delta: 'at risk' },
    ],
    timeline: [
      {
        time: '11:02',
        title: 'Lead decay detected',
        detail: 'Agent identified a response-time spike across paid traffic submissions.',
        icon: Search,
      },
      {
        time: '11:05',
        title: 'Priority scoring applied',
        detail: 'High-budget and urgent leads were grouped for immediate recovery.',
        icon: BarChart3,
      },
      {
        time: '11:09',
        title: 'Recovery plan drafted',
        detail: 'AI proposed instant outreach rules and the exact reps to notify.',
        icon: Send,
      },
    ],
  },
  staffing: {
    label: 'Capacity Planner',
    title: 'Agent spotted a staffing gap behind missed bookings',
    summary:
      'The agent connected missed-call windows, abandoned bookings, and staff schedules to show where demand was being lost.',
    alert: 'Tuesday to Thursday from 3-5 PM is running above booking capacity by 22%.',
    impact: '22 additional bookings per month could be recovered with a schedule adjustment.',
    actions: [
      'Move one staff block from Friday morning into the 3-5 PM demand window.',
      'Use AI receptionist overflow to hold and book callers during peak traffic.',
      'Test reminder spacing to reduce same-day cancellations in that time block.',
    ],
    metrics: [
      { label: 'Peak Call Overflow', value: '+22%', delta: 'capacity gap' },
      { label: 'Missed Booking Rate', value: '17%', delta: 'during peak' },
      { label: 'Idle Friday Hours', value: '9 hrs', delta: 'reallocatable' },
      { label: 'Recovered Bookings', value: '22/mo', delta: 'projected' },
    ],
    timeline: [
      {
        time: '14:41',
        title: 'Peak-hour mismatch found',
        detail: 'The agent compared call spikes against booking-team availability by hour.',
        icon: Search,
      },
      {
        time: '14:47',
        title: 'Schedule shift modeled',
        detail: 'It tested one staff reallocation and predicted recovered booking volume.',
        icon: BarChart3,
      },
      {
        time: '14:55',
        title: 'Ops recommendation sent',
        detail: 'Leadership got a concise plan with expected booking lift and no added payroll.',
        icon: Send,
      },
    ],
  },
}

const useCases = [
  {
    title: 'For Business Owners',
    summary:
      'Use an agent to talk to your data, spot patterns, and turn numbers into practical advice you can actually use.',
    detail:
      'The agent can connect with your workflows, surface risks or opportunities, and recommend next actions without making you dig through dashboards all day.',
  },
  {
    title: 'For Lawyers',
    summary:
      'Use an agent to scan through thousands of pages of paperwork, contracts, or case material much faster than manual review.',
    detail:
      'It can summarize long documents, pull key clauses, compare versions, and help surface the exact information that matters before you spend hours searching for it.',
  },
  {
    title: 'For Coaches',
    summary:
      'Use an agent to scout through athlete information and compare performance against your own benchmarks and standards.',
    detail:
      'It can organize reports, compare metrics, flag strong matches, and help you evaluate more athletes with a clearer system behind each decision.',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
}

function App() {
  const heroRef = useRef<HTMLElement | null>(null)
  const [activeDemo, setActiveDemo] = useState<DemoKey>('inventory')

  const { scrollYProgress } = useScroll()
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const heroTextY = useTransform(heroProgress, [0, 1], [0, -42])
  const heroTextOpacity = useTransform(heroProgress, [0, 0.85], [1, 0.35])
  const heroCardY = useTransform(heroProgress, [0, 1], [0, 56])
  const heroCardRotate = useTransform(heroProgress, [0, 1], [0, -3])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <motion.div className="progress-bar" style={{ scaleX: scrollYProgress }} />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="ambient-field ambient-field-one" />
        <div className="ambient-field ambient-field-two" />
        <div className="ambient-ribbon ambient-ribbon-one" />
        <div className="ambient-ribbon ambient-ribbon-two" />
        <div className="glow-orb glow-orb-one" />
        <div className="glow-orb glow-orb-two" />
        <div className="glow-grid" />
      </div>

      <header className="site-header sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl">
        <div className="flex w-full items-center justify-between gap-8 px-6 py-4 lg:px-8">
          <a
            href="#home"
            className="text-2xl font-semibold tracking-tight text-white md:text-3xl"
            style={{ fontFamily: "'Space Grotesk', var(--font-body)" }}
          >
            agent-realm
          </a>

          <nav className="nav-shell hidden flex-1 items-center justify-center gap-2 md:flex">
            {navLinks.map((item) => (
              <motion.a
                key={item.label}
                href={item.href}
                className="nav-link"
                whileHover={{ y: -1, scale: 1.02 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                {item.label}
              </motion.a>
            ))}
          </nav>

          <Button asChild className="rounded-full px-5 shadow-sm">
            <a href="#book-agent">Book Agent</a>
          </Button>
        </div>
      </header>

      <main className="space-y-6 pb-6">
        <section
          ref={heroRef}
          id="home"
          className="hero-surface mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center"
        >
          <motion.div
            initial="hidden"
            animate="show"
            variants={fadeUp}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            style={{ y: heroTextY, opacity: heroTextOpacity }}
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-xs text-zinc-300 shadow-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-zinc-200" />
              Agent-as-a-Service for modern operators
            </p>

            <h1
              className="mt-6 max-w-3xl text-balance text-5xl font-medium leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl"
              style={{ fontFamily: "'Space Grotesk', var(--font-body)" }}
            >
              Hire AI Employees That Work 24/7
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
              We build and manage AI employees that fit your business as it operates today. They
              answer calls, support customers, qualify leads, and book appointments like a real
              front-office team, without adding headcount.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Button asChild className="rounded-full px-7 py-6 text-sm font-medium shadow-sm">
                <a href="#book-agent">
                  Book Agent
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>

              <Button
                asChild
                variant="ghost"
                className="glass rounded-full border border-white/10 px-7 py-6 text-sm font-medium text-white hover:bg-white/10"
              >
                <a href="#demo">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Watch Demo
                </a>
              </Button>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['24/7', 'Always on'],
                ['7 days', 'First deployment window'],
                ['1 workflow', 'Focused initial rollout'],
              ].map(([value, label]) => (
                <div key={label} className="glass rounded-2xl px-4 py-4">
                  <p className="text-xl font-semibold text-white">{value}</p>
                  <p className="mt-1 text-sm text-slate-300">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="grid gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.12, ease: 'easeOut' }}
            style={{ y: heroCardY, rotate: heroCardRotate }}
          >
            <div className="glass overflow-hidden rounded-[2rem] p-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-2 pb-4">
                <div>
                  <p className="text-sm font-medium text-white">Meet Your AI Employee</p>
                  <p className="text-xs text-slate-400">A more human, memorable way to present the product</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-1 text-xs text-white shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Ready
                </span>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="collector-stage relative min-h-[420px] rounded-[1.5rem] border border-white/10 bg-[linear-gradient(180deg,#1a2236,#0f172a)]">
                  <img
                    src={agentImage}
                    alt="Collectible-style AI employee card"
                    className="agent-card-image h-full w-full rounded-[1.5rem] object-contain p-3"
                  />

                  <div className="agent-note absolute bottom-4 left-4 right-4 rounded-2xl bg-slate-950/78 p-4 shadow-sm backdrop-blur-md">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Hero Direction</p>
                    <p className="mt-2 text-sm font-medium text-white">Make the AI employee feel like a real hire, not abstract software.</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">
                      This packaging-style visual gives the offer personality and makes the service easier to understand in seconds.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Agent Snapshot</p>
                    <div className="mt-4 grid gap-3">
                      <div className="metric-card-dark rounded-2xl p-4">
                        <p className="text-xs text-slate-300">Persona</p>
                        <p className="mt-2 text-3xl font-semibold text-white">Karl</p>
                        <p className="mt-1 text-xs text-zinc-300">AI account manager visual</p>
                      </div>
                      <div className="metric-card-dark rounded-2xl p-4">
                        <p className="text-xs text-slate-300">Positioning</p>
                        <p className="mt-2 text-3xl font-semibold text-white">Human-first</p>
                        <p className="mt-1 text-xs text-zinc-300">Feels closer to an actual team member</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-5 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Deployment Snapshot</p>
                    <div className="mt-4 space-y-3 text-sm text-slate-300">
                      {[
                        'Understands call intent and lead quality',
                        'Books directly into approved calendars',
                        'Hands off complex issues to humans cleanly',
                      ].map((item) => (
                        <div key={item} className="flex items-start gap-3">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 text-zinc-200" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <motion.section
          id="how"
          className="section-shell section-shell-warm mx-auto max-w-7xl px-6 py-20"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div>
              <p className="text-sm font-medium text-zinc-300">Who We Are</p>
              <h2
                className="mt-3 max-w-3xl text-4xl font-medium tracking-tight text-white sm:text-5xl"
                style={{ fontFamily: "'Space Grotesk', var(--font-body)" }}
              >
                We help anyone build a personal AI agent for their real use case.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
                We make AI agents easy, useful, and ready to fit into the workflow you already
                have. That could mean a solo business owner handling leads, a student organizing
                research and deadlines, a coach managing client follow-up, or anyone who wants a
                personal system that saves time and keeps things moving.
              </p>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
                A personal agent matters because it gives you consistent support. It helps you stay
                organized, respond faster, and turn repeated tasks into something reliable without
                adding more complexity to your day.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="glass rounded-[1.75rem] p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Who It Is For</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {audiences.map((audience) => (
                    <span
                      key={audience}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-200"
                    >
                      {audience}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass rounded-[1.75rem] p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Why a Personal Agent Matters</p>
                <div className="mt-4 space-y-3 text-sm text-slate-300">
                  {personalAgentBenefits.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-zinc-200" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-12">
            <p className="text-sm font-medium text-zinc-300">How We Work</p>
            <h3
              className="mt-3 max-w-2xl text-3xl font-medium tracking-tight text-white sm:text-4xl"
              style={{ fontFamily: "'Space Grotesk', var(--font-body)" }}
            >
              We keep the setup simple, practical, and ready to use.
            </h3>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {steps.map((step, idx) => (
              <motion.article
                key={step.title}
                className="glass rounded-[1.75rem] p-6"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
              >
                <p className="text-xs tracking-[0.18em] text-slate-400">
                  STEP {String(idx + 1).padStart(2, '0')}
                </p>
                <h3
                  className="mt-3 text-2xl text-white"
                  style={{ fontFamily: "'Space Grotesk', var(--font-body)" }}
                >
                  {step.title}
                </h3>
                <p className="mt-3 text-sm text-slate-300">{step.description}</p>
              </motion.article>
              ))}
          </div>
        </motion.section>

        <motion.section
          id="services"
          className="section-shell section-shell-cool mx-auto max-w-7xl px-6 py-20"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55 }}
          >
            <p className="text-sm font-medium text-zinc-300">Services</p>
            <h2
              className="mt-3 max-w-2xl text-4xl font-medium tracking-tight text-white sm:text-5xl"
              style={{ fontFamily: "'Space Grotesk', var(--font-body)" }}
            >
              AI employees tailored to your current business workflow, then managed as you grow.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              We do not force a generic setup. We shape each agent around your current team,
              process, and bottlenecks so it works in the business you already have.
            </p>
          </motion.div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {services.map((service, index) => {
              const Icon = service.icon

              return (
                <motion.article
                  key={service.title}
                  className="glass rounded-[1.75rem] p-6"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.42, delay: index * 0.08 }}
                >
                  <div className="inline-flex rounded-2xl bg-white/10 p-3 text-zinc-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3
                    className="mt-4 text-2xl text-white"
                    style={{ fontFamily: "'Space Grotesk', var(--font-body)" }}
                  >
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{service.description}</p>
                  <p className="mt-5 text-xs uppercase tracking-[0.14em] text-zinc-300">{service.metric}</p>
                </motion.article>
              )
            })}
          </div>
        </motion.section>

        <motion.section
          id="integrations"
          className="section-shell section-shell-cool mx-auto max-w-7xl px-6 py-20"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-sm font-medium text-zinc-300">Integrations</p>
            <h2
              className="mt-3 text-4xl font-medium tracking-tight text-white sm:text-5xl"
              style={{ fontFamily: "'Space Grotesk', var(--font-body)" }}
            >
              Plug your agent into the channels your business already runs on.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
              Slack, Telegram, WhatsApp, iMessage, and Gmail can all become operating surfaces for
              the same agent. We fit the system into where your team already communicates.
            </p>
          </div>

          <div className="integration-stage mt-12">
            <div className="integration-core glass">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Agent Control Layer</p>
              <h3
                className="mt-3 text-2xl text-white sm:text-3xl"
                style={{ fontFamily: "'Space Grotesk', var(--font-body)" }}
              >
                One agent, multiple channels.
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Route alerts, customer messages, approvals, and internal updates wherever the work
                is already happening.
              </p>
            </div>

            <div className="integration-lane integration-lane-one" aria-hidden="true" />
            <div className="integration-lane integration-lane-two" aria-hidden="true" />
            <div className="integration-lane integration-lane-three" aria-hidden="true" />

            {integrations.map((platform) => {
              const Icon = platform.icon

              return (
                <motion.div
                  key={platform.name}
                  className={`integration-node ${platform.positionClass}`}
                  animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
                  transition={{
                    duration: platform.duration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: platform.delay,
                  }}
                >
                  <div className="integration-card glass">
                    <div className={`integration-icon ${platform.colorClass}`}>
                      <Icon />
                    </div>
                    <p className="mt-3 text-sm font-medium text-white">{platform.name}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        <motion.section
          id="demo"
          className="section-shell section-shell-cool mx-auto max-w-7xl px-6 py-20"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <motion.div
              className="glass rounded-[1.75rem] p-7"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-sm font-medium text-zinc-300">Interactive Demo</p>
              <h2
                className="mt-3 text-4xl font-medium tracking-tight text-white"
                style={{ fontFamily: "'Space Grotesk', var(--font-body)" }}
              >
                See how the agent catches problems and recommends action.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300">
                This is more than chat. The agent monitors your operation, flags issues early,
                and gives your team an immediate plan for what to do next.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {(Object.keys(demoScenarios) as DemoKey[]).map((key) => {
                  const active = activeDemo === key

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveDemo(key)}
                      className={`rounded-full border px-4 py-2 text-xs transition ${
                        active
                          ? 'border-white/20 bg-white/10 text-white'
                          : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {demoScenarios[key].label}
                    </button>
                  )
                })}
              </div>

              <motion.div
                className="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950/55 p-3 shadow-sm"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.35, delay: 0.08 }}
              >
                <div className="rounded-[1.25rem] bg-[linear-gradient(180deg,#232323,#bcbcbc)]">
                  <img
                    src={demoAgentImage}
                    alt="Collectible-style AI employee coordinator card preview"
                    className="h-[320px] w-full object-contain p-4"
                  />
                </div>
                <div className="px-2 pb-2 pt-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Visual Layer</p>
                  <p className="mt-2 text-sm font-medium text-white">
                    Pair operational intelligence with a memorable AI employee identity.
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    Jamie gives this section a cleaner client-service feel while keeping the focus
                    on business decisions and real outcomes.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="glass glass-contrast rounded-[1.75rem] p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-4">
                <p className="text-sm text-slate-300">{demoScenarios[activeDemo].title}</p>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
                  Live Decision Feed
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeDemo}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.28 }}
                  className="space-y-5"
                >
                  <div className="rounded-[1.4rem] border border-white/10 bg-gradient-to-br from-white/[0.08] to-white/[0.02] p-5 shadow-sm">
                    <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr] lg:items-start">
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-zinc-300">Alert</p>
                        <p className="mt-2 text-lg font-medium leading-snug text-white">
                          {demoScenarios[activeDemo].alert}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
                        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">
                          Projected Impact
                        </p>
                        <p
                          className="mt-2 text-lg leading-snug text-white md:text-xl"
                          style={{ fontFamily: "'Space Grotesk', var(--font-body)" }}
                        >
                          {demoScenarios[activeDemo].impact}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-300">
                      {demoScenarios[activeDemo].summary}
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {demoScenarios[activeDemo].metrics.map((metric, index) => (
                      <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: index * 0.05 }}
                        className="rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 shadow-sm"
                      >
                        <p className="text-xs text-slate-400">{metric.label}</p>
                        <p className="mt-2 text-2xl font-semibold text-white">{metric.value}</p>
                        <p className="mt-1 text-xs text-zinc-300">{metric.delta}</p>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[0.82fr_1.18fr] xl:grid-cols-[0.78fr_1.22fr]">
                    <div className="actions-panel rounded-2xl border border-white/10 bg-slate-950/55 p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                        <div>
                          <p className="actions-eyebrow">Recommended Actions</p>
                          <p className="mt-2 text-sm leading-relaxed text-slate-300">
                            The fastest changes to recover booking capacity without adding payroll.
                          </p>
                        </div>
                        <span className="actions-count">
                          {demoScenarios[activeDemo].actions.length} moves
                        </span>
                      </div>
                      <div className="mt-4 space-y-3">
                        {demoScenarios[activeDemo].actions.map((action, index) => (
                          <motion.div
                            key={action}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, delay: index * 0.06 }}
                            className="action-item"
                          >
                            <span className="action-index">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                            <p className="action-copy">{action}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="decision-chain rounded-2xl border border-white/10 p-5 shadow-sm">
                      <div className="flex items-center gap-3">
                        <span className="decision-chain-badge inline-flex h-10 w-10 items-center justify-center rounded-full">
                          <CalendarClock className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-violet-200/70">Decision Chain</p>
                          <p className="mt-1 text-sm font-medium text-white">How the agent reached the recommendation</p>
                        </div>
                      </div>

                      <div className="mt-6 space-y-6">
                        {demoScenarios[activeDemo].timeline.map((event, index) => {
                          const EventIcon = event.icon

                          return (
                            <motion.div
                              key={`${event.time}-${event.title}`}
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.25, delay: index * 0.07 }}
                              className="decision-step"
                            >
                              <div className="decision-time text-violet-200">{event.time}</div>
                              <div className="decision-rail">
                                <span className="decision-node">
                                  <EventIcon className="h-4 w-4" />
                                </span>
                                {index < demoScenarios[activeDemo].timeline.length - 1 ? (
                                  <span className="decision-link" aria-hidden="true" />
                                ) : null}
                              </div>
                              <div className="decision-copy">
                                <p className="text-lg font-medium text-white">{event.title}</p>
                                <p className="mt-1 text-sm leading-relaxed text-slate-300">
                                  {event.detail}
                                </p>
                              </div>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.section>

        <motion.section
          id="use-cases"
          className="section-shell section-shell-cool mx-auto max-w-7xl px-6 py-20"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-medium text-zinc-300">Use Cases</p>
          <h2
            className="mt-3 max-w-2xl text-4xl font-medium tracking-tight text-white sm:text-5xl"
            style={{ fontFamily: "'Space Grotesk', var(--font-body)" }}
          >
            Personal agents become powerful when they are built around how you actually work.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
            These are the kinds of real workflows a tailored agent can support, from business
            decisions to document review to evaluating people against your own standards.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {useCases.map((useCase, idx) => (
              <motion.article
                key={useCase.title}
                className="glass rounded-[1.75rem] p-6"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
              >
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Example Workflow</p>
                <h3
                  className="mt-3 text-2xl text-white"
                  style={{ fontFamily: "'Space Grotesk', var(--font-body)" }}
                >
                  {useCase.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-slate-300">{useCase.summary}</p>
                <p className="mt-5 border-t border-white/10 pt-5 text-sm leading-relaxed text-zinc-300">
                  {useCase.detail}
                </p>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          id="book-agent"
          className="section-shell section-shell-hero mx-auto max-w-7xl px-6 pb-14 pt-12"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.22 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="hero-cta-panel relative overflow-hidden rounded-[2rem] p-8 sm:p-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5 }}
          >
            <div className="pointer-events-none absolute left-1/2 top-0 h-44 w-44 -translate-x-1/2 rounded-full bg-white/25 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-medium text-zinc-200">Book Your Agent</p>
                <h2
                  className="mt-3 text-4xl font-medium tracking-tight text-white sm:text-5xl"
                  style={{ fontFamily: "'Space Grotesk', var(--font-body)" }}
                >
                  Tell us about your business and the first workflow you want automated.
                </h2>
                <p className="mt-4 max-w-xl text-sm text-slate-300 sm:text-base">
                  Fill this out and we will map the best agent setup for your current business,
                  whether that is lead handling, support, booking, or internal operations.
                </p>

                <div className="mt-8 space-y-4 text-sm text-slate-300">
                  {[
                    'We shape the agent around your current process, not a generic template.',
                    'You get a rollout recommendation based on your actual bottleneck.',
                    'Best for teams that want practical AI operations, not just a chatbot.',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-zinc-200" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <form
                action="https://formspree.io/f/mpqbaqpj"
                method="POST"
                className="glass rounded-[1.6rem] p-5 shadow-sm"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm text-slate-300">
                    Name
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      required
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    />
                  </label>

                  <label className="block text-sm text-slate-300">
                    Work Email
                    <input
                      type="email"
                      name="email"
                      placeholder="you@company.com"
                      required
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    />
                  </label>

                  <label className="block text-sm text-slate-300">
                    Company
                    <input
                      type="text"
                      name="company"
                      placeholder="Business name"
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    />
                  </label>

                  <label className="block text-sm text-slate-300">
                    Team Size
                    <input
                      type="text"
                      name="teamSize"
                      placeholder="e.g. 5-20"
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    />
                  </label>

                  <label className="block text-sm text-slate-300 md:col-span-2">
                    What should the agent handle first?
                    <textarea
                      rows={5}
                      name="message"
                      placeholder="Tell us the bottleneck, what is happening now, and what you want the agent to take over."
                      required
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
                    />
                  </label>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <Button type="submit" className="rounded-full px-7 py-6 text-sm font-medium shadow-sm">
                    Request Agent Plan
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="glass rounded-full border border-white/10 px-7 py-6 text-sm font-medium text-white hover:bg-white/10"
                  >
                    <a href="#demo">View Demo First</a>
                  </Button>
                </div>

                <p className="mt-4 text-xs text-slate-400">
                  No fluff. Just tell us your workflow problem and we will recommend the right
                  agent setup.
                </p>
              </form>
            </div>
          </motion.div>
        </motion.section>
      </main>

      <footer className="border-t border-white/10 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 text-center text-sm text-slate-400 md:flex-row md:text-left">
          <p>agent-realm - Agent-as-a-Service for high-performance business workflows.</p>
          <p>Copyright {new Date().getFullYear()} agent-realm. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
