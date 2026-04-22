import { create } from 'zustand'
import { listCharacters } from '@/lib/db'
import type { CharacterSummary } from '@/types/character'

interface CharactersState {
  characters: CharacterSummary[]
  loading:    boolean
  error:      string | null
  fetchCharacters: () => Promise<void>
}

export const useCharactersStore = create<CharactersState>((set) => ({
  characters: [],
  loading:    false,
  error:      null,

  fetchCharacters: async () => {
    set({ loading: true, error: null })
    try {
      const characters = await listCharacters()
      set({ characters, loading: false })
    } catch (err) {
      set({
        error:   err instanceof Error ? err.message : 'Failed to load characters',
        loading: false,
      })
    }
  },
}))
