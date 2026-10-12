import { describe, expect, it } from 'vitest'
import { isReady, progressFor, staleness } from './helpers'

describe('truthful presentation helpers', () => {
  it('uses a bounded determinate value only when supplied', () => expect(progressFor({ id:'x', name:'X', status:'active', progress: 140 })).toEqual({ kind:'determinate', value:100 }))
  it('uses explicit stage before indeterminate', () => expect(progressFor({ id:'x', name:'X', status:'active', stage:'validation' })).toEqual({ kind:'stage', label:'validation' }))
  it('never invents progress', () => expect(progressFor({ id:'x', name:'X', status:'active' })).toEqual({ kind:'indeterminate' }))
  it('marks data stale after 24 hours', () => expect(staleness('2026-01-01T00:00:00Z', Date.parse('2026-01-02T00:00:01Z'))).toBe('stale'))
  it('requires an explicit ready flag', () => expect(isReady({ id:'x', name:'X', status:'complete' })).toBe(false))
})
