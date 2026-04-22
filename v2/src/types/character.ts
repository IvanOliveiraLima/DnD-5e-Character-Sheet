/**
 * TypeScript types for the v1 IndexedDB character schema.
 *
 * The v1 schema nests everything under page1–page5 and uses string values
 * for numeric fields (HP, AC, etc.) because they come directly from DOM inputs.
 * These types mirror what is actually stored, not an idealised version.
 *
 * Source of truth: js/save.js (buildSheetData) and js/modules/storage.js.
 */

/* ── Shared primitives ────────────────────────────────────────────────── */

export interface ClassEntry {
  name: string
  level: string // stored as string, e.g. "5"
}

export interface SkillEntry {
  val:  string  // numeric, stored as string
  prof: boolean
  expr: boolean // expertise
}

export interface SaveEntry {
  val:  string
  prof: boolean
}

/* ── Page 1 ───────────────────────────────────────────────────────────── */

export interface BasicInfo {
  char_name:   string
  classes:     ClassEntry[]
  total_level: number | string // number after normalisation, may be string in legacy data
  char_class:  string          // first class name, denormalised for quick display
  level:       string          // string representation of total_level
  // Legacy fields (pre-multi-class) — may be present in old saves:
  level_two?: string
}

export interface CharacterInfo {
  race_class:  string  // race value; "race_class" is the field name from v1
  background:  string
  player_name: string
  exp:         string
  alignment:   string
}

export interface TopBar {
  proficiency:       string
  initiative:        string
  passive_perception: string
  ac:                string
  speed:             string
  spell_dc:          string
  insperation:       string  // note: typo preserved from v1 field name
}

export interface Attributes {
  str: string; str_mod: string
  dex: string; dex_mod: string
  con: string; con_mod: string
  int: string; int_mod: string
  wis: string; wis_mod: string
  cha: string; cha_mod: string
}

export interface Saves {
  str_save: SaveEntry
  dex_save: SaveEntry
  con_save: SaveEntry
  int_save: SaveEntry
  wis_save: SaveEntry
  cha_save: SaveEntry
}

export interface Skills {
  acrobatics:     SkillEntry
  animal_handling: SkillEntry
  arcana:         SkillEntry
  athletics:      SkillEntry
  deception:      SkillEntry
  history:        SkillEntry
  insight:        SkillEntry
  intimidation:   SkillEntry
  investigation:  SkillEntry
  medicine:       SkillEntry
  nature:         SkillEntry
  perception:     SkillEntry
  performance:    SkillEntry
  persuasion:     SkillEntry
  religion:       SkillEntry
  sleight_of_hand: SkillEntry
  stealth:        SkillEntry
  survival:       SkillEntry
}

export interface SavesSkills {
  spell_casting: string
  saves:         Saves
  skills:        Skills
}

export interface HitDice {
  current_hd: string
  max_hd:     string
  hd_die:     string
}

export interface DeathSaves {
  success_1: boolean; success_2: boolean; success_3: boolean
  fail_1:    boolean; fail_2:    boolean; fail_3:    boolean
}

export interface Status {
  temp_health:    string  // HP fields stored as strings from DOM
  current_health: string
  max_health:     string
  hit_dice:       HitDice
  death_saves:    DeathSaves
}

export interface AttackEntry {
  name:        string
  stat:        string
  toHit:       string
  damage:      string
  damage_type: string
}

export interface AttacksSpells {
  attacks: AttackEntry[]
  spell_attack?: string
}

export interface Proficiencies {
  weapon_profs:   string
  armor_profs:    string
  tool_profs:     string
  language_profs: string
  other_profs:    string
}

export interface Page1 {
  basic_info:    BasicInfo
  character_info: CharacterInfo
  top_bar:       TopBar
  attributes:    Attributes
  saves_skills:  SavesSkills
  status:        Status
  proficiencies: Proficiencies
  attacks_spells: AttacksSpells
}

/* ── Page 2 ───────────────────────────────────────────────────────────── */

export interface EquipmentRow {
  name:   string
  weight: string
}

export interface Currency {
  cp: string; sp: string; ep: string; gp: string; pp: string
}

export interface Equipment {
  val:         { col_1: EquipmentRow[]; col_2: EquipmentRow[] }
  currency:    Currency
  encumberance: string
}

export interface Page2 {
  equipment:  Equipment
  mount_pet:  Record<string, string>
  mount_pet2: Record<string, string>
}

/* ── Page 3 ───────────────────────────────────────────────────────────── */

export interface SpellEntry {
  spell_name: string
  preped?:    boolean  // only for non-cantrips
}

export interface SpellSlotLevel {
  total: string
  used:  string
}

export interface SpellInfo {
  spell_ability:    string
  spell_save_dc:    string
  spell_atk_bonus:  string
  // per-level slot counts
  slot_1?: SpellSlotLevel; slot_2?: SpellSlotLevel; slot_3?: SpellSlotLevel
  slot_4?: SpellSlotLevel; slot_5?: SpellSlotLevel; slot_6?: SpellSlotLevel
  slot_7?: SpellSlotLevel; slot_8?: SpellSlotLevel; slot_9?: SpellSlotLevel
}

export interface Spells {
  cantrips: SpellEntry[]
  level_1:  SpellEntry[]; level_2: SpellEntry[]; level_3: SpellEntry[]
  level_4:  SpellEntry[]; level_5: SpellEntry[]; level_6: SpellEntry[]
  level_7:  SpellEntry[]; level_8: SpellEntry[]; level_9: SpellEntry[]
}

export interface Page3 {
  spell_info: SpellInfo
  spells:     Spells
}

/* ── Page 4 ───────────────────────────────────────────────────────────── */

export interface Personality {
  traits:    string
  ideals:    string
  bonds:     string
  flaws:     string
  backstory: string
}

export interface AlliesOrganizations {
  name:          string
  symbol_image?: string
}

export interface Page4 {
  backstory:           string  // legacy top-level backstory field
  allies_organizations: AlliesOrganizations
  personality:         Personality
}

/* ── Page 5 ───────────────────────────────────────────────────────────── */

export interface Page5 {
  notes_1: string
  notes_2: string
}

/* ── Images ───────────────────────────────────────────────────────────── */

export interface CharacterImages {
  character: string  // base64 data URL or ''
  symbol:    string  // base64 data URL or ''
}

/* ── Root character record ────────────────────────────────────────────── */

export interface V1Character {
  id:            string
  schemaVersion: number
  updatedAt:     number
  page1:         Page1
  page2:         Page2
  page3:         Page3
  page4:         Page4
  page5:         Page5
  images:        CharacterImages
}

/* ── Normalised view used by v2 UI ────────────────────────────────────── */

/**
 * Adapter shape — maps v1 raw data to what the CharSelect prototype expects.
 * HP values are parsed to number (0 if empty/NaN).
 * portrait is null if no image is stored.
 */
export interface CharacterSummary {
  id:         string
  name:       string
  race:       string
  classes:    ClassEntry[]        // [{name, level}]
  totalLevel: number
  hp: {
    current: number
    max:     number
    temp:    number
  }
  portrait:   string | null       // data URL or null
  updatedAt:  number
}
