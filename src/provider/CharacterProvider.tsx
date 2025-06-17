import { createContext, useContext, useEffect } from "react";
import useStorage from "../hooks/useStorage";
import type { CharacterContextType } from "../types/CharacterContext";
import type { Character } from "../types/Character";

const CharacterContext = createContext<CharacterContextType | undefined>(
  undefined
);

type Props = {
  children: React.ReactNode;
};

const CharacterProvider = ({ children }: Props) => {
  const [heroes, setHeroes] = useStorage("heroes");
  const [mobs, setMobs] = useStorage("mobs");

  function clearMobs() {
    setMobs([]);
  }

  function addHeroes(newHero: Character) {
    setHeroes((prev: Character[]) => {
      return [...prev, newHero];
    });
  }

  function addMobs(newMobs: Character) {
    setMobs((prev: Character[]) => {
      return [...prev, newMobs];
    });
  }

  function updateHero(updatedHero: Character) {
    setHeroes((prev: Character[]) =>
      prev.map((hero) => (hero.id === updatedHero.id ? updatedHero : hero))
    );
  }

  function updateMob(updatedMob: Character) {
    setMobs((prev: Character[]) =>
      prev.map((mob) => (mob.id === updatedMob.id ? updatedMob : mob))
    );
  }

  function removeHero(id: number) {
    setHeroes((prev: Character[]) => prev.filter((hero) => hero.id !== id));
  }

  function removeMob(id: number) {
    setMobs((prev: Character[]) => prev.filter((mob) => mob.id !== id));
  }

  const updateHeroes = (updated: Character[]) => {
    setHeroes(updated);
  };

  useEffect(() => {}, []);

  return (
    <CharacterContext.Provider
      value={{
        heroes,
        mobs,
        clearMobs,
        addHeroes,
        addMobs,
        updateHero,
        updateMob,
        removeHero,
        removeMob,
        updateHeroes
      }}
    >
      {children}
    </CharacterContext.Provider>
  );
};

const useCharacter = () => {
  const value = useContext(CharacterContext);
  if (!value) {
    throw new Error("useCharacter must be used within a CharacterProvider");
  }
  return value;
};

// eslint-disable-next-line react-refresh/only-export-components
export { CharacterProvider, useCharacter };
