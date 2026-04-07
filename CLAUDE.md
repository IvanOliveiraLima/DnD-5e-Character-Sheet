# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server at http://localhost:5173
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint on js/ folder
npm run test       # Run Vitest (single run)
npm run test:watch # Run tests in watch mode
```

CI runs `npm ci && npm run lint && npm run test && npm run build` on PRs to `main-dev` and `master`.

## Architecture

**Vanilla JS SPA** — no framework. Pure DOM manipulation, ES6 modules, Vite for bundling, IndexedDB (via `idb` library) for persistence, PWA-capable.

### Module responsibilities

| File | Role |
|------|------|
| `js/main.js` | Boot sequence: run migrations, check session, route to sheet or character select |
| `js/app.js` | Page navigation, sidebar toggle, expandable sections |
| `js/save.js` | Read DOM → JSON, schema validation, auto-save debounce (800ms) |
| `js/load.js` | JSON → populate DOM form fields |
| `js/changes.js` | Input event handlers, reactive D&D calculations (ability scores → modifiers → skills/saves) |
| `js/add-attack.js` | Add/remove attack and spell rows |
| `js/modules/storage.js` | IndexedDB CRUD abstraction — only module that touches IndexedDB |
| `js/modules/calculations.js` | Pure D&D math (ability modifiers, currency conversion) |
| `js/modules/character-select.js` | Character select screen: create, open, duplicate, delete, import/export |
| `js/modules/utils.js` | Pure helpers: parsers, validators, D&D lookup tables |

### Data flow

```
IndexedDB → loadCharacter(id) → applyLoadedSheet() → DOM
DOM ← changes.js event handlers ← user input
DOM → readFormValues() [save.js] → debounced saveCharacter() → IndexedDB
```

### Boot sequence (`main.js`)

1. Migrate legacy localStorage (`dnd_sheet_v1`) → IndexedDB
2. Migrate legacy `'active'` record → `char_${timestamp}_${random}` ID
3. Check `sessionStorage.activeCharacterId`
4. If found: load character, show `#sheet-wrapper`; if not: show `#character-select-screen`

### Key patterns

- **State:** No global store — UI state lives in DOM form fields. Active character ID in `sessionStorage`. All persistent data in IndexedDB (schema version 2).
- **Lock mode:** `LOCKED` flag in `changes.js` disables auto-recalculation so users can manually override computed fields.
- **Multi-class:** `basic_info.classes` is an array of `{name, level}`; `calculateTotalClassLevel()` sums them. Legacy single-class strings are migrated on load.
- **Images:** Stored as data URLs inside the character JSON, max 2MB, capped at 600px (character) / 300px (symbol).
- **Background skill proficiencies:** `BACKGROUND_FIXED_SKILLS_MAP` and `BACKGROUND_FLEXIBLE_SET` in `changes.js` auto-apply proficiency checkboxes when background changes, and undo them on background change.
- **Inline `onclick`:** Many HTML elements use `onclick="..."` calling functions exposed on `window` in `main.js`. This is intentional — don't refactor to `addEventListener` in bulk.

### Testing

Tests live in `/tests/`. The `idb` library is mocked via `vi.mock('idb')` with an in-memory `Map`. Tests cover pure calculations (`calculations.test.js`), storage CRUD + migrations (`storage.test.js`), and utility functions (`utils.test.js`).
