import type { Progress, Project } from './types'

export function progressFor(project: Project): Progress {
  if (typeof project.progress === 'number' && Number.isFinite(project.progress)) {
    return { kind: 'determinate', value: Math.min(100, Math.max(0, project.progress)) }
  }
  if (project.stage?.trim()) return { kind: 'stage', label: project.stage.trim() }
  return { kind: 'indeterminate' }
}

export function staleness(iso?: string, now = Date.now()): 'fresh' | 'stale' | 'unknown' {
  if (!iso) return 'unknown'
  const time = Date.parse(iso)
  if (!Number.isFinite(time)) return 'unknown'
  return now - time > 24 * 60 * 60 * 1000 ? 'stale' : 'fresh'
}

export function isReady(project: Project): boolean {
  return project.readyForHuman === true
}

export function entries(record?: Record<string, unknown>): Array<[string, string]> {
  if (!record) return []
  return Object.entries(record).filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value)).map(([key, value]) => [key, String(value)])
}
