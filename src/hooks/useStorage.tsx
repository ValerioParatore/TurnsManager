import { useState } from "react";
import type { Character } from "../types/Character";

const useStorage = (itemKey: string, initialValue: Character[] = []) => {
  const stored = localStorage.getItem(itemKey);

  let parsedValue: Character[] = [];

  try {
    parsedValue = stored ? JSON.parse(stored) : initialValue;
  } catch (error) {
    console.error("Error parsing localStorage item:", error);
    parsedValue = initialValue;
  }

  const [state, setState] = useState<Character[]>(parsedValue);

  const changeState = (
    newState: Character[] | ((prev: Character[]) => Character[])
  ) => {
    const valueToStore =
      typeof newState === "function" ? newState(state) : newState;
    setState(valueToStore);
    localStorage.setItem(itemKey, JSON.stringify(valueToStore));
  };

  return [state, changeState] as const;
};

export default useStorage;
