import {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import { useCharacter } from "../provider/CharacterProvider";
import type { Character } from "../types/Character";
import { Shield, Heart, CircleX } from 'lucide-react';

interface Props {
  onItemSelected: (item: Character) => void;
  selectedCharcter: Character | null;
}

export type ListHandle = {
  startNewFight: () => void;
};

const List = forwardRef<ListHandle, Props>(({ onItemSelected, selectedCharcter }, ref) => {
  const { heroes, mobs, updateHeroes } = useCharacter();
  const [mergedList, setMergedList] = useState<Character[]>([]);
  const [turn, setTurn] = useState<number>(0);
  const [round, setRound] = useState<number>(1);
  const [initialized, setInitialized] = useState(false);
  const [charInTurn, setcharInTurn] = useState<Character | null>(null);
  const [showModalRestart, setshowModalRestart] = useState<boolean>(false);
  const [editableHeroes, setEditableHeroes] = useState<Character[]>([]);

  // Aggiorna mergedList ogni volta che heroes o mobs cambiano
  useEffect(() => {
    if (heroes.length > 0 || mobs.length > 0) {
      const newList = [...heroes, ...mobs].sort((a, b) => b.iniziativa - a.iniziativa);
      setMergedList(newList);
    }
  }, [heroes, mobs]);

  // Inizializza solo la prima volta che mergedList è popolata
  useEffect(() => {
    if (mergedList.length > 0 && !initialized) {
      setTurn(0);
      setRound(1);
      setcharInTurn(mergedList[0]);
      setInitialized(true); // ✅ flag per evitare esecuzioni future
    }
  }, [mergedList, initialized]);

  useImperativeHandle(ref, () => ({
    startNewFight,
  }));

  function goNextTurn() {
    if (mergedList.length === 0) return;

    const isLastTurn = turn >= mergedList.length - 1;
    const nextTurn = isLastTurn ? 0 : turn + 1;

    setTurn(nextTurn);
    setcharInTurn(mergedList[nextTurn]);

    if (isLastTurn) {
      setRound((prev) => prev + 1);
    }
  }

  function startNewFight() {
    const copiedHeroes = heroes.map(h => ({ ...h }));
    setEditableHeroes(copiedHeroes);
    setshowModalRestart(true);
    setTurn(0);
    setRound(1);
  }

  function onConfirmResetInitiative() {
    // 1. Aggiorna gli heroes nel provider
    updateHeroes(editableHeroes);

    // 2. Ricostruisci il mergedList ordinato
    const newList = [...editableHeroes, ...mobs].sort(
      (a, b) => b.iniziativa - a.iniziativa
    );
    setMergedList(newList);

    // 3. Reset turno e round
    setTurn(0);
    setRound(1);
    setcharInTurn(newList[0]);

    // 4. Chiudi la modale
    setshowModalRestart(false);
  }

  return (
    <>
      {showModalRestart &&
        <div className="form-modal modal-overlay">
          {heroes.length ? (
            <div className="modal-content">
              <div className="form-modal_header">
                <h3 className="title title-dark">Aggiorna l'iniziativa degli eroi.</h3>
                <button onClick={() => setshowModalRestart(false)}><CircleX /></button>
              </div>
              <form className="form-modal_form" onSubmit={() => onConfirmResetInitiative()}>
                {editableHeroes.map((hero, index) => (
                  <div key={hero.id}>
                    <label className="label">
                      {hero.nome}
                      
                      <input
                        className="input-number"
                        type="number"
                        name={hero.nome + index}
                        id={hero.nome + index}
                        value={hero.iniziativa}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 0;
                          const updated = [...editableHeroes];
                          updated[index].iniziativa = value;
                          setEditableHeroes(updated);
                        }}
                      />
                    </label>
                  </div>
                ))}
                <button className="btn btn-confirm" type="submit">
                  Conferma
                </button>
              </form>
            </div>
          ) : (
            <div className="form-modal_header">
              <h3 className="title title-dark">Aggiungi gli eroi per poter far iniziare lo scontro!</h3>
              <button><CircleX /></button>
            </div>
          )}
        </div>
      }
      <div className="list_header">
        <h3 className="title title-dark">Round numero: {round}</h3>
        <h4 className="subtitle subtitle-dark">
          Turno attuale: {turn + 1} / {mergedList.length}
        </h4>
        <p className="text text-dark">Lista dei personaggi in combattimento in ordine di iniziativa</p>
        <div>
          <span>È il turno di: <strong>{charInTurn?.nome}</strong></span>
        </div>
      </div>

      <div className="list_chars">
        <ul>
          {mergedList.map((char, index) => (
            <li
              key={char.id}
              onClick={() => {
                onItemSelected(char);
                // setSelectedCharId(char.id);
              }}
              className={`${char.id === selectedCharcter?.id ? "selected" : ""} ${index === turn ? "active" : ""}`}
            >
              <span className="d-flex-center">{char.nome}</span>
              <span className="d-flex-center"><Heart />PF: {char.puntiFerita}</span>
              <span className="d-flex-center"><Shield />CA: {char.classeArmatura}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="list_footer">
        <button className="btn" onClick={goNextTurn} disabled={mergedList.length === 0}>
          Prossimo turno
        </button>
      </div>
    </>
  );
})

export default List;
