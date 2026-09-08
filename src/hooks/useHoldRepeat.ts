import { useEffect, useLayoutEffect, useRef } from 'react'

export function useHoldRepeat(
  onTap: () => void,
  onHoldTick: () => void,
  opts: { holdMs?: number; intervalMs?: number } = {},
) {
  const { holdMs = 450, intervalMs = 220 } = opts
  const tapRef = useRef(onTap)
  const tickRef = useRef(onHoldTick)
  useLayoutEffect(() => {
    tapRef.current = onTap
    tickRef.current = onHoldTick
  })
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const interval = useRef<ReturnType<typeof setInterval> | null>(null)
  const held = useRef(false)
  const pressed = useRef(false)

  const clear = () => {
    if (holdTimer.current) { clearTimeout(holdTimer.current); holdTimer.current = null }
    if (interval.current) { clearInterval(interval.current); interval.current = null }
  }
  const start = () => {
    pressed.current = true
    held.current = false
    holdTimer.current = setTimeout(() => {
      held.current = true
      tickRef.current()                       // primeiro ±10 ao segurar
      interval.current = setInterval(() => tickRef.current(), intervalMs)
    }, holdMs)
  }
  const stop = () => {                         // pointerup: só conta se houve press
    if (!pressed.current) return
    pressed.current = false
    const wasHeld = held.current
    clear()
    held.current = false
    if (!wasHeld) tapRef.current()            // soltou antes do hold → toque = ±1
  }
  const cancel = () => {                        // leave/cancel: encerra sem tapear (evita disparo no hover)
    if (!pressed.current) return
    pressed.current = false
    clear()
    held.current = false
  }

  useEffect(() => clear, [])
  return { onPointerDown: start, onPointerUp: stop, onPointerLeave: cancel, onPointerCancel: cancel }
}
