import type { FormEvent } from "react";
import type { Character } from "../types/Character";
// import { damageTypeKeys } from "../variables/damagesType";

type Props = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  forHero: boolean;
  formData: Character;
  onChange: (field: string, value: string | number) => void;
  onButtonClose: () => void;
};

function FormModal({
  onSubmit,
  forHero,
  formData,
  onChange,
  onButtonClose,
}: Props) {
  formData.id = generateId(forHero);

  function generateId(forHero: boolean): number {
    const base = Date.now();
    if (forHero) {
      return Number(`1${base}`);
    } else {
      return Number(`2${base}`);
    }
  }
  return (
    <>
      <div className="form-modal">
        <div className="form-modal_header">
          <h3 className="title title-dark">Aggiungi {forHero ? "eroe" : "avversario"}</h3>
          <button onClick={onButtonClose}>x</button>
        </div>
        <form className="form-modal_form" onSubmit={(e) => onSubmit(e)}>
          <div>
            <label className="label">
              Nome
              <input
                className="input"
                type="text"
                value={formData.nome}
                onChange={(e) => onChange("nome", e.target.value)}
              />
            </label>
          </div>
          <div>
            <label className="label">
              Iniziativa
              <input
                className="input"
                type="number"
                value={formData.iniziativa}
                onChange={(e) => onChange("iniziativa", e.target.value)}
              />
            </label>
          </div>
          <div>
            <label className="label">
              Punti ferita
              <input
                className="input"
                type="number"
                value={formData.puntiFerita}
                onChange={(e) => onChange("puntiFerita", e.target.value)}
              />
            </label>
          </div>
          <div>
            <label className="label">
              Classe armatura
              <input
                className="input"
                type="number"
                value={formData.classeArmatura}
                onChange={(e) => onChange("classeArmatura", e.target.value)}
              />
            </label>
          </div>
          {/* coming soon res and weak */}
          {/* <div>
            <label className="label">
              Debolezze ai danni
              <select name="" id="">
                {damageTypeKeys.map((key) => (
                  <option value={key} key={`${key}-wek`}>
                    {key}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label className="label">
              Resistenze ai danni
              <select name="" id="">
                {damageTypeKeys.map((key) => (
                  <option value={key} key={`${key}-res`}>
                    {key}
                  </option>
                ))}
              </select>
            </label>
          </div> */}

          <button className="btn btn-confirm" type="submit">
            salva
          </button>
        </form>
      </div>
    </>
  );
}

export default FormModal;
