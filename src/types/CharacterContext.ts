import type { Character } from "./Character";

export interface CharacterContextType {
  heroes: Character[];
  mobs: Character[];
  clearMobs: () => void
  addHeroes: (newHero: Character) => void
  addMobs: (newMobs: Character) => void
  updateHero: (updatedHero: Character) => void
  updateMob: (updatedMob: Character) => void
  removeHero: (id: number) => void
  removeMob: (id: number) => void
  updateHeroes: (updated: Character[]) => void
}