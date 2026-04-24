import type { Character } from '@/domain/character'
import { Badge } from '../ui/Badge'

interface HeroCardProps {
  character: Character
}

export function HeroCard({ character }: HeroCardProps) {
  const portrait = character.images.character
  const firstClass = character.classes[0]

  return (
    <div
      className="parchment-texture noise-grain"
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #1B1725, #15121C)',
        border: '1px solid #2A2537',
        borderRadius: 16,
        padding: 18,
        overflow: 'hidden',
      }}
    >
      {/* Responsive layout: column + centered on mobile, row on desktop */}
      <div className="flex flex-col items-center gap-3 lg:flex-row lg:items-center lg:gap-4">
        {/* Portrait */}
        <div
          className="flex-shrink-0 relative"
          style={{
            width: 72,
            height: 72,
            borderRadius: 12,
            background: portrait
              ? `url(${portrait}) center/cover`
              : `radial-gradient(circle at 40% 35%, #8B6FC5 0%, transparent 55%),
                 radial-gradient(circle at 60% 65%, #8B1A2E 0%, transparent 55%),
                 linear-gradient(135deg, #2A1F3D, #1A0F2A)`,
            border: '1.5px solid #D4A017',
            boxShadow: '0 0 20px rgba(212,160,23,0.25), inset 0 0 20px rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Cinzel', Georgia, serif",
            fontSize: 28,
            color: '#D4A017',
            fontWeight: 600,
          }}
        >
          {!portrait && (character.name[0] ?? '?')}

          {/* Level badge — ruby circle, bottom-right */}
          <div
            style={{
              position: 'absolute',
              bottom: -6,
              right: -6,
              background: '#8B1A2E',
              color: '#F4EFE0',
              fontFamily: "'Cinzel', Georgia, serif",
              fontWeight: 700,
              width: 24,
              height: 24,
              borderRadius: '50%',
              border: '2px solid #0F0D14',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
            }}
          >
            {character.totalLevel}
          </div>
        </div>

        {/* Identity */}
        <div className="flex-1 min-w-0 text-center lg:text-left" style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: "'Cinzel', Georgia, serif",
              fontSize: 22,
              fontWeight: 600,
              color: '#F4EFE0',
              letterSpacing: 0.3,
              lineHeight: 1.1,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            }}
          >
            {character.name}
          </div>

          {/* Meta: race · class level · background */}
          <div
            style={{
              fontSize: 12,
              color: '#A09DB0',
              marginTop: 3,
              display: 'flex',
              gap: 6,
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
            className="lg:justify-start"
          >
            {character.race && <span>{character.race}</span>}
            {character.race && firstClass && (
              <span style={{ color: '#3A3450' }}>•</span>
            )}
            {firstClass && (
              <span style={{ color: '#C8C4D6' }}>
                {firstClass.name} {character.totalLevel}
              </span>
            )}
            {firstClass && character.background && (
              <span style={{ color: '#3A3450' }}>•</span>
            )}
            {character.background && <span>{character.background}</span>}
          </div>

          {/* Conditions / inspiration badges */}
          <div
            className="flex flex-wrap gap-1 mt-1 justify-center lg:justify-start"
          >
            {character.inspiration && (
              <Badge variant="purple" icon={<span>✦</span>}>
                Inspirado
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
