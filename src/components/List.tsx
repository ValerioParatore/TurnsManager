import { useEffect, useState } from "react";
import { useCharacter } from "../provider/CharacterProvider";
import type { Character } from "../types/Character";

interface Props {
  onItemSelected: (item: Character) => void;
}

function List({ onItemSelected }: Props) {
  const { heroes, mobs } = useCharacter();
  const [mergedList, setMergedList] = useState<Character[]>([]);
  const [turn, setTurn] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [selectedCharId, setSelectedCharId] = useState<number | null>(null);

  useEffect(() => {
    const newList = [...heroes, ...mobs].sort(
      (a, b) => b.iniziativa - a.iniziativa
    );
    setMergedList(newList);
    setTurn(0); // reset turn when list updates
    setRound(1);
  }, [heroes, mobs]);

  function goNextTurn() {
    if (mergedList.length === 0) return;

    if (turn >= mergedList.length - 1) {
      setTurn(0);
      setRound((prev) => prev + 1);
    } else {
      setTurn((prev) => prev + 1);
    }
  }

  return (
    <>
      <div className="list_header">
        <h3 className="title title-dark">Round numero: {round}</h3>
        <h4 className="subtitle subtitle-dark">
          Turno attuale: {turn + 1} / {mergedList.length}
        </h4>
        <p className="text text-dark">Lista dei personaggi in combattimento in ordine di iniziativa</p>
        <div>
          <span>È il turno di: <strong>{mergedList.find(x => x.id === selectedCharId)?.nome}</strong></span>
        </div>
      </div>

      <div className="list_chars">
        <ul>
          {mergedList.map((char, index) => (
            <li
              key={char.id}
              onClick={() => {
                onItemSelected(char);
                setSelectedCharId(char.id);
              }}
              className={`${char.id === selectedCharId ? "selected" : ""} ${index === turn ? "active" : ""}`}
            >
              {char.nome} - PF: {char.puntiFerita} - CA: {char.classeArmatura}
            </li>
          ))}
        </ul>
      </div>

      <div className="list_footer">
        <button className="btn" onClick={goNextTurn}>
          Prossimo turno
        </button>
      </div>
    </>
  );
}

export default List;
