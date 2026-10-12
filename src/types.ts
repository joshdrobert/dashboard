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
}

export interface SystemStatus {
  generatedAt?: string
  system?: { status?: string; autonomy?: string; activeJobs?: number; gpuJobs?: number; cpuJobs?: number; integrity?: string }
  projects?: Project[]
  vision?: Record<string, unknown>
  papers?: Record<string, unknown>
}

export interface Activity { timestamp?: string; project?: string; message: string; level?: string }
