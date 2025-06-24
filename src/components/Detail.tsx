import { useState, useEffect } from "react";
import { useCharacter } from "../provider/CharacterProvider";
import type { Character } from "../types/Character";
import { CircleX } from "lucide-react";

interface Props {
  character: Character | null;
  onClearSelectedCharcter: () => void;
}

function Detail({ character, onClearSelectedCharcter }: Props) {
  const { updateHero, updateMob, removeHero, removeMob } = useCharacter();
  const [amount, setAmount] = useState<string>('');
  const [isDamage, setIsDamage] = useState<boolean>(true)
  const [confirmeDelete, setconfirmeDelete] = useState<boolean>(false)
  const [localCharacter, setLocalCharacter] = useState<Character | null>(null);

  useEffect(() => {
    setLocalCharacter(character);
  }, [character]);

  if (!localCharacter) {
    return <div className="d-flex-center"><h3 className="title title-dark">Seleziona un personaggio dalla lista</h3></div>;
  }

  const handleStatChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const newStat = parseInt(e.target.value, 10) || 0;
    setLocalCharacter((prev) => (prev ? { ...prev, [key]: newStat } : null));
  };

  const handleDamage = () => {
    const amountValue = parseInt(amount, 10) || 0;
    const newStat = localCharacter.puntiFerita + (isDamage ? -amountValue : amountValue);
    setLocalCharacter((prev) => (prev ? { ...prev, puntiFerita: newStat } : null));
  }

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
    setconfirmeDelete(false);
  }



  return (
    <>
      <div className="detail-header">
        <h3 className="title title-dark">{localCharacter.nome}</h3>
        <button onClick={onClearSelectedCharcter}><CircleX /></button>
      </div>

      <h4 className="subtitle subtitle-dark">Applica del danno o delle cure al personaggio.</h4>
      <section>
        <div className="types-wrapper">
          <div className="types">
            <label className={isDamage ? 'active' : ''} htmlFor="dmg-true">Danno</label>
            <input
              type="radio"
              name="dmg"
              id="dmg-true"

              onChange={() => setIsDamage(true)}
            />
          </div>
          <div className="types">
            <label className={!isDamage ? 'active' : ''} htmlFor="dmg-false">Cura</label>
            <input
              type="radio"
              name="dmg"
              id="dmg-false"
              className={!isDamage ? 'active' : ''}
              onChange={() => setIsDamage(false)}
            />
          </div>
        </div>
        <div className="amount">
          <div>
            <label className="label" htmlFor="damage">Ammontare di {isDamage ? 'danno' : 'cure'}</label>
            <input
              className="input" type="number" name="damage" id="damage" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <button className="btn" onClick={handleDamage}>Conferma</button>
        </div>
      </section>

      <hr />
      <h4 className="subtitle subtitle-dark">Modifica i dati del personaggio selezionato.</h4>
      <form onSubmit={onSubmit}>        
        <div>
          <label className="label" htmlFor="pf">
            Punti ferita
          </label>
          <input
            className="input"
            name="pf"
            id="pf"
            type="number"
            value={localCharacter.puntiFerita}
            onChange={(e) => handleStatChange(e, "puntiFerita")}
          />
        </div>
        <div>
          <label className="label" htmlFor="ca">
            Classe armatura
          </label>
          <input
            className="input"
            name="ca"
            id="ca"
            type="number"
            value={localCharacter.classeArmatura}
            onChange={(e) => handleStatChange(e, "classeArmatura")}
          />
        </div>
        <div>
          <label className="label" htmlFor="iniziativa">
            Iniziativa
          </label>
          <input
            className="input"
            name="iniziativa"
            id="iniziativa"
            type="number"
            value={localCharacter.iniziativa}
            onChange={(e) => handleStatChange(e, "iniziativa")}
          />
        </div>
        <hr />
        <button className="btn btn-confirm" type="submit">
          Salva
        </button>
      </form>

      <button className="btn btn-danger" type="button" onClick={() => setconfirmeDelete(true)}>
        Elimina
      </button>


      {confirmeDelete &&
        <div className="detail-confirm-modal">
          <h3 className="title title-dark">Confermi di voler eliminare il personaggio?</h3>
          <div>
            <button className="btn" onClick={() => setconfirmeDelete(false)}>Annulla</button>
            <button className="btn btn-danger" onClick={handleDelete}>Elimina</button>
          </div>
        </div>}
    </>
  );
}

export default Detail;
