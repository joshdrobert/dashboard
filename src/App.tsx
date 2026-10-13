import { useEffect, useMemo, useState } from 'react'
import { entries, isReady, progressFor, staleness } from './helpers'
import type { Activity, Project, SystemStatus } from './types'

const expected = ['AortaPlan','BCM-Neuromodulation','CTBone','EchoNext','Ditto','Trace','TEER','Papers']
const UI_BUILD_ID = 'd3509a8'

function ProgressView({ project }: { project: Project }) {
  const progress = progressFor(project)
  if (progress.kind === 'determinate') return <div className="progress" aria-label={`${progress.value}% complete`}><i style={{width:`${progress.value}%`}} /></div>
  if (progress.kind === 'stage') return <div className="stage">Stage · {progress.label}</div>
  return <div className="indeterminate">Progress not quantified</div>
}

function ProjectCard({ project }: { project: Project }) {
  const task = project.taskChecklist
  const stage = project.stageProgress
  const plain = project.plainLanguage
  return <article className="card">
    <div className="cardTop"><span className="eyebrow">{project.id}</span><span className={`pill ${project.status.toLowerCase().replaceAll(' ','-')}`}>{project.status}</span></div>
    <h3>{project.name}</h3><p>{project.summary || 'No public-safe summary available.'}</p>
    <div className="goal"><b>What we're trying to do</b>{plain?.goal || project.projectGoal || project.summary}</div>
    {plain && <div className="plainGrid"><div><b>What we're doing now</b><span>{plain.now}</span></div><div><b>Recent win</b><span>{plain.recentWin}</span></div><div><b>Why that matters</b><span>{plain.whyItMatters}</span></div><div><b>What happens next</b><span>{plain.next}</span></div></div>}
    <div className="task"><b>Current task</b><span>{project.currentTask || 'No admitted bounded task'}</span>{task && <small>Checklist {task.completed}/{task.total} · {Math.round(100 * task.completed / task.total)}%</small>}</div>
    {stage && <div className="stageProgress"><span>Stage · {project.currentMilestone}</span><small>{stage.completed}/{stage.total}</small><div className="progress"><i style={{width:`${100 * stage.completed / stage.total}%`}} /></div></div>}
    <dl><div><dt>Job</dt><dd>{project.job ?? '—'}</dd></div><div><dt>Updated</dt><dd>{project.updatedAt ? new Date(project.updatedAt).toLocaleString() : 'Unknown'}</dd></div></dl>
    <dl><div><dt>Queue depth</dt><dd>{project.queueDepth ?? 0}</dd></div><div><dt>Last progress</dt><dd>{project.lastMeaningfulProgress ? new Date(project.lastMeaningfulProgress).toLocaleString() : '—'}</dd></div></dl>
    <div className="outputs"><span><b>Engineering</b>{project.engineeringOutput || '—'}</span><span><b>Scientific</b>{project.scientificOutput || '—'}</span></div>
    {!!project.sinceHourlyCheckpoint?.length && <div className="hourly"><b>Since hourly check-in</b>{project.sinceHourlyCheckpoint.map((item, i)=><span key={i}>+ {item}</span>)}</div>}
    {project.next && <div className="next"><b>Next</b> {project.next}</div>}
    {project.blocker && <div className="alert"><b>Blocker</b><p>{project.blocker}</p></div>}
    {project.alert && <div className="orphan">{project.alert}</div>}
  </article>
}

function DetailPanel({ title, data }: { title: string; data?: Record<string, unknown> }) {
  const rows = entries(data)
  return <section className="panel"><div className="sectionTitle"><span>{title}</span><small>LIVE SNAPSHOT</small></div>{rows.length ? <dl className="details">{rows.map(([k,v])=><div key={k}><dt>{k.replaceAll('_',' ')}</dt><dd>{v}</dd></div>)}</dl> : <p className="muted">No public-safe details published.</p>}</section>
}

export default function App() {
  const [status,setStatus] = useState<SystemStatus | null>(null)
  const [activity,setActivity] = useState<Activity[]>([])
  const [error,setError] = useState('')
  useEffect(()=>{Promise.all([fetch('./status.json').then(r=>{if(!r.ok) throw Error('status'); return r.json()}),fetch('./activity.json').then(r=>r.ok?r.json():[])]).then(([s,a])=>{setStatus(s);setActivity(Array.isArray(a)?a:(a.activities || a.items || []))}).catch(()=>setError('Public status snapshot is currently unavailable.'))},[])
  const projects = useMemo(()=> expected.map((name,i)=>status?.projects?.find(p=>p.name.toLowerCase()===name.toLowerCase() || p.id?.toLowerCase()===name.toLowerCase()) || {id:String(i+1).padStart(2,'0'),name,status:'Unavailable'}),[status])
  const ready = projects.filter(isReady), alerts = projects.filter(p=>p.alert)
  const age = staleness(status?.generatedAt)
  return <><header><div className="brand"><span className="mark">AI</span><div><b>Research Operations</b><small>Eight-workstream autonomous system</small></div></div><div className="system"><span className={`dot ${error?'bad':''}`} />{error ? 'OFFLINE' : (status?.system?.status || 'LOADING')}<small>{age === 'stale' ? 'STALE SNAPSHOT' : 'PUBLIC · REDACTED'}</small></div></header>
  <main><section className="portfolioHealth panel"><div><span className="kicker">PORTFOLIO HEALTH</span><h1>Research operations</h1><p>Eight V1 workstreams, with scientific progress separated from operational state.</p></div><div className="metrics"><div><strong>{status?.system?.autonomy ?? '—'}</strong><span>Autonomy</span></div><div><strong>{status?.system?.activeJobs ?? '—'}</strong><span>Active compute</span></div><div><strong>{status?.queueHealth?.orphanedCount ?? 0}</strong><span>Orphaned roadmaps</span></div></div></section>
  {error && <div className="error">{error} No private data has been requested or exposed.</div>}
  <section className="panel plainPanel"><div className="sectionTitle"><span>Recently, we…</span><small>VERIFIED PROGRESS</small></div>{(status?.recentlyWe || []).slice(0,5).map((x,i)=><div className="plainWin" key={i}><b>✓ {x.text}</b><span>Why it matters: {x.why}</span></div>)}</section>
  <section className="panel hour"><div className="sectionTitle"><span>What changed today?</span><small>{status?.hourlyCheckpoint?.changes ?? 0} MEANINGFUL CHANGES</small></div><div className="feed">{activity.slice(0,6).map((a,i)=><div key={i}><time>{a.timestamp ? new Date(a.timestamp).toLocaleTimeString([], {hour:'numeric',minute:'2-digit'}): '—'}</time><p><b>{a.project && `${a.project} · `}</b>{a.message}</p></div>)}</div></section>
  <div className="sectionTitle"><span>Workstreams</span><small>{projects.length} PROJECTS</small></div><section className="grid">{projects.map(p=><ProjectCard project={p} key={p.id}/>)}</section>
  <section className="split"><DetailPanel title="Papers funnel" data={status?.papers}/><DetailPanel title="VISION / optional compute" data={status?.vision}/></section>
  <DetailPanel title="Autonomy policy" data={status?.autonomyPolicy}/>
  <section className="panel action"><div className="sectionTitle"><span>Action required</span><small>HUMAN-UNBLOCKABLE ONLY</small></div>{status?.actionRequired?.length ? status.actionRequired.map(item=><div className="readyRow" key={item.project}><b>{item.project}</b><span>{item.instruction}</span></div>) : <p className="muted">Nothing needed from you.</p>}</section>
  <section className="lower"><div className="panel ready"><div className="sectionTitle"><span>Ready for human</span><small>EXPLICIT GATE ONLY</small></div>{ready.length ? ready.map(p=><div className="readyRow" key={p.id}><b>{p.name}</b><span>Review requested →</span></div>) : <p className="muted">Nothing is explicitly marked ready for human review.</p>}</div>
  <div className="panel"><div className="sectionTitle"><span>Activity</span><small>LATEST</small></div><div className="feed">{activity.slice(0,6).map((a,i)=><div key={i}><time>{a.timestamp ? new Date(a.timestamp).toLocaleString(): '—'}</time><p><b>{a.project && `${a.project} · `}</b>{a.message}</p></div>)}{!activity.length&&<p className="muted">No public activity published.</p>}</div></div>
  <div className="panel"><div className="sectionTitle"><span>Alerts</span><small>{alerts.length}</small></div>{alerts.map(p=><div className="alert" key={p.id}><b>{p.name}</b><p>{p.alert}</p></div>)}{!alerts.length&&<p className="muted">No active public alerts.</p>}</div></section>
  </main><footer><span>AI-SERVER / PUBLIC OPERATIONS</span><span>UI {UI_BUILD_ID} · Data {status?.generatedAt ? new Date(status.generatedAt).toLocaleString() : 'unknown'}</span></footer></>
}
