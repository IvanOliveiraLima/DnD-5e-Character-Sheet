/**
 * useHoldRepeat — unit tests (fake timers)
 *
 * Covers:
 *  - Quick release (before holdMs) calls only onTap
 *  - Holding past holdMs fires onHoldTick once, then repeats every intervalMs
 *  - Releasing stops further ticks
 *  - Unmount cleans up pending timers
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useHoldRepeat } from '@/hooks/useHoldRepeat'

describe('useHoldRepeat', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('quick release (before holdMs) calls only onTap, not onHoldTick', () => {
    const onTap = vi.fn()
    const onHoldTick = vi.fn()
    const { result } = renderHook(() => useHoldRepeat(onTap, onHoldTick, { holdMs: 450, intervalMs: 120 }))

    act(() => { result.current.onPointerDown() })
    act(() => { vi.advanceTimersByTime(100) })   // before holdMs
    act(() => { result.current.onPointerUp() })

    expect(onTap).toHaveBeenCalledOnce()
    expect(onHoldTick).not.toHaveBeenCalled()
  })

  it('holding past holdMs fires onHoldTick once at holdMs', () => {
    const onTap = vi.fn()
    const onHoldTick = vi.fn()
    const { result } = renderHook(() => useHoldRepeat(onTap, onHoldTick, { holdMs: 450, intervalMs: 120 }))

    act(() => { result.current.onPointerDown() })
    act(() => { vi.advanceTimersByTime(450) })   // exactly holdMs

    expect(onHoldTick).toHaveBeenCalledOnce()
    expect(onTap).not.toHaveBeenCalled()
  })

  it('holding repeats onHoldTick every intervalMs after initial tick', () => {
    const onTap = vi.fn()
    const onHoldTick = vi.fn()
    const { result } = renderHook(() => useHoldRepeat(onTap, onHoldTick, { holdMs: 450, intervalMs: 120 }))

    act(() => { result.current.onPointerDown() })
    // holdMs fires first tick; 3 more intervals = 4 total
    act(() => { vi.advanceTimersByTime(450 + 120 * 3) })

    expect(onHoldTick).toHaveBeenCalledTimes(4)
    expect(onTap).not.toHaveBeenCalled()
  })

  it('releasing after hold stops further ticks', () => {
    const onTap = vi.fn()
    const onHoldTick = vi.fn()
    const { result } = renderHook(() => useHoldRepeat(onTap, onHoldTick, { holdMs: 450, intervalMs: 120 }))

    act(() => { result.current.onPointerDown() })
    act(() => { vi.advanceTimersByTime(450 + 120) }) // 2 ticks
    act(() => { result.current.onPointerUp() })      // release
    act(() => { vi.advanceTimersByTime(500) })        // more time passes

    expect(onHoldTick).toHaveBeenCalledTimes(2)
    expect(onTap).not.toHaveBeenCalled()             // held → no tap
  })

  it('onPointerLeave also stops ticks and fires onTap if released early', () => {
    const onTap = vi.fn()
    const onHoldTick = vi.fn()
    const { result } = renderHook(() => useHoldRepeat(onTap, onHoldTick, { holdMs: 450, intervalMs: 120 }))

    act(() => { result.current.onPointerDown() })
    act(() => { vi.advanceTimersByTime(100) })        // before holdMs
    act(() => { result.current.onPointerLeave() })    // leaves without hold

    expect(onTap).toHaveBeenCalledOnce()
    expect(onHoldTick).not.toHaveBeenCalled()
  })

  it('unmount clears pending timers without error', () => {
    const onTap = vi.fn()
    const onHoldTick = vi.fn()
    const { result, unmount } = renderHook(() => useHoldRepeat(onTap, onHoldTick, { holdMs: 450, intervalMs: 120 }))

    act(() => { result.current.onPointerDown() })
    act(() => { vi.advanceTimersByTime(450) })   // hold started, interval running
    unmount()
    // Advancing after unmount should not call onHoldTick
    act(() => { vi.advanceTimersByTime(600) })

    expect(onHoldTick).toHaveBeenCalledOnce()    // only the initial tick before unmount
  })
})
