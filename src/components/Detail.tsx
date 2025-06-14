import { useState, useEffect } from "react";
import { useCharacter } from "../provider/CharacterProvider";
import type { Character } from "../types/Character";

interface Props {
  character: Character | null;
}

function Detail({ character }: Props) {
  const { updateHero, updateMob, removeHero, removeMob } = useCharacter();
  const [localCharacter, setLocalCharacter] = useState<Character | null>(null);

  // Quando cambia il character selezionato, aggiornalo localmente
  useEffect(() => {
    setLocalCharacter(character);
  }, [character]);

  if (!localCharacter) {
    return <div>Seleziona un personaggio dalla lista</div>;
  }

  const handleStatChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const newStat = parseInt(e.target.value, 10) || 0;
    setLocalCharacter((prev) => (prev ? { ...prev, [key]: newStat } : null));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // evita il reload
    if (!localCharacter) return;

    if (String(localCharacter.id).startsWith("1")) {
      updateHero(localCharacter);
    } else if (String(localCharacter.id).startsWith("2")) {
      updateMob(localCharacter);
    }
  };

  function handleDelete() {
    if (!localCharacter) return;
    if (String(localCharacter.id).startsWith("1")) {
      removeHero(localCharacter.id);
    } else if (String(localCharacter.id).startsWith("2")) {
      removeMob(localCharacter.id);
    }

    setLocalCharacter(null);
  }

  return (
    <>
      <h3>{localCharacter.nome}</h3>

      <form onSubmit={onSubmit}>
        <div>
          <label>
            Punti ferita
            <input
              type="number"
              value={localCharacter.puntiFerita}
              onChange={(e) => handleStatChange(e, "puntiFerita")}
            />
          </label>
        </div>
        <div>
          <label>
            Classe armatura
            <input
              type="number"
              value={localCharacter.classeArmatura}
              onChange={(e) => handleStatChange(e, "classeArmatura")}
            />
          </label>
        </div>
        <div>
          <label>
            Iniziativa
            <input
              type="number"
              value={localCharacter.iniziativa}
              onChange={(e) => handleStatChange(e, "iniziativa")}
            />
          </label>
        </div>
        <button className="btn" type="submit">
          Salva
        </button>
      </form>

      <button className="btn btn-red" type="button" onClick={handleDelete}>
        Elimina
      </button>
    </>
  );
}

export default Detail;
