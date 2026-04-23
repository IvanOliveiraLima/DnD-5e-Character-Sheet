/**
 * TypeScript types mirroring the v1 IndexedDB character schema verbatim.
 *
 * The v1 schema stores numeric fields as strings (HP, AC, ability scores, etc.)
 * because they come directly from DOM input values. These types reflect what is
 * actually persisted — not an idealised version.
 *
 * Source of truth: js/save.js (buildSheetData) and js/modules/storage.js.
 *
 * All fields are optional to represent that any field may be absent in legacy
 * or partially-populated records.
 */

/* ── Shared primitives ────────────────────────────────────────────────── */

/** v1 class entry — level is stored as a string from a DOM input. */
export interface V1ClassEntry {
  name?: string
  level?: string
}

export interface V1SkillEntry {
  val?:  string   // numeric, stored as string
  prof?: boolean
  expr?: boolean  // expertise
}

export interface V1SaveEntry {
  val?:  string
  prof?: boolean
}

/* ── Page 1 ───────────────────────────────────────────────────────────── */

export interface V1BasicInfo {
  char_name?:   string
  classes?:     V1ClassEntry[]
  total_level?: number | string
  char_class?:  string   // first class name, denormalised
  level?:       string
  level_two?:   string   // legacy pre-multiclass field
}

export interface V1CharacterInfo {
  race_class?:  string   // race value; field name is "race_class" from v1
  background?:  string
  player_name?: string
  exp?:         string
  alignment?:   string
}

export interface V1TopBar {
  proficiency?:        string
  initiative?:         string
  passive_perception?: string
  ac?:                 string
  speed?:              string
  spell_dc?:           string
  insperation?:        string  // intentional typo preserved from v1 field name
}

export interface V1Attributes {
  str?: string; str_mod?: string
  dex?: string; dex_mod?: string
  con?: string; con_mod?: string
  int?: string; int_mod?: string
  wis?: string; wis_mod?: string
  cha?: string; cha_mod?: string
}

export interface V1Saves {
  str_save?: V1SaveEntry
  dex_save?: V1SaveEntry
  con_save?: V1SaveEntry
  int_save?: V1SaveEntry
  wis_save?: V1SaveEntry
  cha_save?: V1SaveEntry
}

export interface V1Skills {
  acrobatics?:      V1SkillEntry
  animal_handling?: V1SkillEntry
  arcana?:          V1SkillEntry
  athletics?:       V1SkillEntry
  deception?:       V1SkillEntry
  history?:         V1SkillEntry
  insight?:         V1SkillEntry
  intimidation?:    V1SkillEntry
  investigation?:   V1SkillEntry
  medicine?:        V1SkillEntry
  nature?:          V1SkillEntry
  perception?:      V1SkillEntry
  performance?:     V1SkillEntry
  persuasion?:      V1SkillEntry
  religion?:        V1SkillEntry
  sleight_of_hand?: V1SkillEntry
  stealth?:         V1SkillEntry
  survival?:        V1SkillEntry
}

export interface V1SavesSkills {
  spell_casting?: string
  saves?:         V1Saves
  skills?:        V1Skills
}

export interface V1HitDice {
  current_hd?: string
  max_hd?:     string
  hd_die?:     string
}

export interface V1DeathSaves {
  success_1?: boolean; success_2?: boolean; success_3?: boolean
  fail_1?:    boolean; fail_2?:    boolean; fail_3?:    boolean
}

export interface V1Status {
  temp_health?:    string
  current_health?: string
  max_health?:     string
  hit_dice?:       V1HitDice
  death_saves?:    V1DeathSaves
}

export interface V1AttackEntry {
  name?:        string
  stat?:        string
  toHit?:       string
  damage?:      string
  damage_type?: string
}

export interface V1AttacksSpells {
  attacks?:      V1AttackEntry[]
  spell_attack?: string
}

export interface V1Proficiencies {
  weapon_profs?:   string
  armor_profs?:    string
  tool_profs?:     string
  language_profs?: string
  other_profs?:    string
}

export interface V1Page1 {
  basic_info?:     V1BasicInfo
  character_info?: V1CharacterInfo
  top_bar?:        V1TopBar
  attributes?:     V1Attributes
  saves_skills?:   V1SavesSkills
  status?:         V1Status
  proficiencies?:  V1Proficiencies
  attacks_spells?: V1AttacksSpells
}

/* ── Page 2 ───────────────────────────────────────────────────────────── */

export interface V1EquipmentRow {
  name?:   string
  weight?: string
}

export interface V1Currency {
  cp?: string; sp?: string; ep?: string; gp?: string; pp?: string
}

export interface V1Equipment {
  val?:          { col_1?: V1EquipmentRow[]; col_2?: V1EquipmentRow[] }
  currency?:     V1Currency
  encumberance?: string
}

export interface V1Page2 {
  equipment?:  V1Equipment
  mount_pet?:  Record<string, string>
  mount_pet2?: Record<string, string>
}

/* ── Page 3 ───────────────────────────────────────────────────────────── */

export interface V1SpellEntry {
  spell_name?: string
  preped?:     boolean
}

export interface V1SpellSlotLevel {
  total?: string
  used?:  string
}

export interface V1SpellInfo {
  spell_ability?:   string
  spell_save_dc?:   string
  spell_atk_bonus?: string
  slot_1?: V1SpellSlotLevel; slot_2?: V1SpellSlotLevel; slot_3?: V1SpellSlotLevel
  slot_4?: V1SpellSlotLevel; slot_5?: V1SpellSlotLevel; slot_6?: V1SpellSlotLevel
  slot_7?: V1SpellSlotLevel; slot_8?: V1SpellSlotLevel; slot_9?: V1SpellSlotLevel
}

export interface V1Spells {
  cantrips?: V1SpellEntry[]
  level_1?:  V1SpellEntry[]; level_2?: V1SpellEntry[]; level_3?: V1SpellEntry[]
  level_4?:  V1SpellEntry[]; level_5?: V1SpellEntry[]; level_6?: V1SpellEntry[]
  level_7?:  V1SpellEntry[]; level_8?: V1SpellEntry[]; level_9?: V1SpellEntry[]
}

export interface V1Page3 {
  spell_info?: V1SpellInfo
  spells?:     V1Spells
}

/* ── Page 4 ───────────────────────────────────────────────────────────── */

export interface V1Personality {
  traits?:    string
  ideals?:    string
  bonds?:     string
  flaws?:     string
  backstory?: string
}

export interface V1AlliesOrganizations {
  name?:          string
  symbol_image?:  string
}

export interface V1Page4 {
  backstory?:            string   // legacy top-level field
  allies_organizations?: V1AlliesOrganizations
  personality?:          V1Personality
}

/* ── Page 5 ───────────────────────────────────────────────────────────── */

export interface V1Page5 {
  notes_1?: string
  notes_2?: string
}

/* ── Images ───────────────────────────────────────────────────────────── */

export interface V1CharacterImages {
  character?: string  // base64 data URL or ''
  symbol?:    string
}

/* ── Root character record ────────────────────────────────────────────── */

export interface V1Character {
  id?:            string
  schemaVersion?: number
  updatedAt?:     number
  page1?:         V1Page1
  page2?:         V1Page2
  page3?:         V1Page3
  page4?:         V1Page4
  page5?:         V1Page5
  images?:        V1CharacterImages
}
