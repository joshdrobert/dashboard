export type Progress =
  | { kind: 'determinate'; value: number }
  | { kind: 'stage'; label: string }
  | { kind: 'indeterminate' }

export interface Project {
  id: string
  name: string
  status: string
  summary?: string
  stage?: string
  progress?: number | null
  updatedAt?: string
  next?: string
  job?: string | number | null
  readyForHuman?: boolean
  alert?: string
  currentTask?: string | null
  queueDepth?: number
  lastMeaningfulProgress?: string | null
  blocker?: string | null
  engineeringOutput?: string
  scientificOutput?: string
  projectGoal?: string
  currentMilestone?: string
  nextMilestone?: string
  taskDescription?: string | null
  taskStartedAt?: string | null
  taskChecklist?: { completed: number; total: number } | null
  stageProgress?: { completed: number; total: number } | null
  sinceHourlyCheckpoint?: string[]
  transfer?: Record<string, unknown> | null
}

export interface SystemStatus {
  generatedAt?: string
  system?: { status?: string; autonomy?: string; activeJobs?: number; gpuJobs?: number; cpuJobs?: number; integrity?: string }
  projects?: Project[]
  vision?: Record<string, unknown>
  papers?: Record<string, unknown>
  autonomyPolicy?: Record<string, unknown>
  queueHealth?: { orphanedRoadmaps?: string[]; orphanedCount?: number }
  actionRequired?: Array<{ project: string; instruction: string }>
  hourlyCheckpoint?: { at?: string | null; changes?: number }
}

export interface Activity { timestamp?: string; project?: string; message: string; level?: string }
