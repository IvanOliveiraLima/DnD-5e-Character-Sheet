/**
 * IndexedDB wrapper for v2.
 *
 * Strategy:
 *   v1 DB  (dnd-character-sheet, v3)    — read-only in v2
 *   v2 DB  (dnd-character-sheet-v2, v1) — read + write
 *
 * listCharacters() merges both sources; v2 records win on id collision.
 * saveCharacter()  always writes to v2 DB.
 * copyFromV1(id)   copies a specific character from v1 → v2 (call before first edit).
 *
 * Delete is a stub in Phase A.
 */

import { openDB, type IDBPDatabase } from 'idb'
import type { V1Character, CharacterSummary, ClassEntry } from '@/types/character'

/* ── DB constants ─────────────────────────────────────────────────────── */

const V1_DB_NAME   = 'dnd-character-sheet'
const V1_DB_VER    = 3
const V1_STORE     = 'characters'

const V2_DB_NAME   = 'dnd-character-sheet-v2'
const V2_DB_VER    = 1
const V2_STORE     = 'characters'

/* ── DB openers ───────────────────────────────────────────────────────── */

function openV1(): ReturnType<typeof openDB> {
  return openDB(V1_DB_NAME, V1_DB_VER, {
    upgrade(db) {
      // Never create — v1 manages its own schema. Only open if it exists.
      if (!db.objectStoreNames.contains(V1_STORE)) {
        db.createObjectStore(V1_STORE, { keyPath: 'id' })
      }
    },
  })
}

function openV2(): ReturnType<typeof openDB> {
  return openDB(V2_DB_NAME, V2_DB_VER, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(V2_STORE)) {
        db.createObjectStore(V2_STORE, { keyPath: 'id' })
      }
    },
  })
}

/* ── Adapter: v1 raw → CharacterSummary ──────────────────────────────── */

function parseNum(val: string | number | null | undefined): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val
  const n = parseInt(String(val ?? ''), 10)
  return isNaN(n) ? 0 : n
}

function adaptV1(c: V1Character): CharacterSummary {
  const bi  = c.page1?.basic_info
  const ci  = c.page1?.character_info
  const st  = c.page1?.status
  const img = c.images

  // classes: v1 stores [{name, level}] after normalisation
  const classes: ClassEntry[] = Array.isArray(bi?.classes) && bi.classes.length > 0
    ? bi.classes
    : [{ name: bi?.char_class ?? '', level: bi?.level ?? '' }]

  const totalLevel = parseNum(bi?.total_level) || parseNum(classes[0]?.level)

  const maxHp     = parseNum(st?.max_health)
  const currentHp = parseNum(st?.current_health)
  const tempHp    = parseNum(st?.temp_health)

  return {
    id:         c.id,
    name:       bi?.char_name    || 'Unnamed',
    race:       ci?.race_class   || '',
    classes,
    totalLevel,
    hp: {
      current: currentHp || maxHp,   // treat 0 current as full when unset
      max:     maxHp,
      temp:    tempHp,
    },
    portrait:   img?.character || null,
    updatedAt:  c.updatedAt ?? 0,
  }
}

/* ── Public API ───────────────────────────────────────────────────────── */

/**
 * Returns merged list of characters from v1 + v2, sorted by most recent.
 * v2 records win on id collision (user has already edited them in v2).
 */
export async function listCharacters(): Promise<CharacterSummary[]> {
  let v1db: IDBPDatabase | null = null
  let v2db: IDBPDatabase | null = null

  try {
    [v1db, v2db] = await Promise.all([openV1(), openV2()])

    const [v1All, v2All] = await Promise.all([
      v1db.getAll(V1_STORE) as Promise<V1Character[]>,
      v2db.getAll(V2_STORE) as Promise<V1Character[]>,
    ])

    const map = new Map<string, CharacterSummary>()

    // v1 first, then v2 overwrites
    for (const c of v1All) {
      if (c.id === 'active') continue     // skip legacy record
      if (!c.page1?.basic_info) continue  // skip malformed
      map.set(c.id, adaptV1(c))
    }
    for (const c of v2All) {
      if (c.id === 'active') continue
      if (!c.page1?.basic_info) continue
      map.set(c.id, adaptV1(c))
    }

    return [...map.values()].sort((a, b) => b.updatedAt - a.updatedAt)
  } catch {
    return []
  } finally {
    v1db?.close()
    v2db?.close()
  }
}

/**
 * Copy a character from v1 → v2 DB. Call before first edit in v2.
 * Returns the character if found, null otherwise.
 */
export async function copyFromV1(id: string): Promise<V1Character | null> {
  let v1db: IDBPDatabase | null = null
  let v2db: IDBPDatabase | null = null
  try {
    [v1db, v2db] = await Promise.all([openV1(), openV2()])
    const char = await v1db.get(V1_STORE, id) as V1Character | undefined
    if (!char) return null
    await v2db.put(V2_STORE, { ...char, updatedAt: Date.now() })
    return char
  } finally {
    v1db?.close()
    v2db?.close()
  }
}

/**
 * Persist a character to v2 DB. Data must have an `id` field.
 * Phase A stub — save works, but Phase B will wire up the form.
 */
export async function saveCharacter(data: V1Character): Promise<void> {
  const db = await openV2()
  try {
    await db.put(V2_STORE, { ...data, updatedAt: Date.now() })
  } finally {
    db.close()
  }
}

/**
 * Delete — stub in Phase A. Phase B will implement tombstones + sync.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function deleteCharacter(_id: string): never {
  throw new Error('deleteCharacter: not implemented in Phase A')
}
