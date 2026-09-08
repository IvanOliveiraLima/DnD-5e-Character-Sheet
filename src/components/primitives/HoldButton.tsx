import type { CSSProperties, ReactNode } from 'react'
import { useHoldRepeat } from '@/hooks/useHoldRepeat'

export function HoldButton({
  onTap,
  onHoldTick,
  disabled,
  style,
  children,
  ...rest
}: {
  onTap: () => void
  onHoldTick: () => void
  disabled?: boolean
  style?: CSSProperties
  children: ReactNode
  'data-testid'?: string
  'aria-label'?: string
}) {
  const handlers = useHoldRepeat(onTap, onHoldTick)
  return (
    <button
      type="button"
      disabled={disabled}
      style={style}
      {...(disabled ? {} : handlers)}
      {...rest}
    >
      {children}
    </button>
  )
}
