import { useState, type FormEvent } from "react";
import FormModal from "./FormModal";
import { useCharacter } from "../provider/CharacterProvider";
import type { Character } from "../types/Character";

function Navbar() {
  const initialValue = {
    id: 0,
    nome: "",
    iniziativa: 0,
    puntiFerita: 0,
    classeArmatura: 0,
  };
  const { addHeroes, addMobs, clearMobs } = useCharacter();
  const [showFormModal, setShowFormModal] = useState(false);
  const [forHero, setForHero] = useState(false);
  const [formData, setFormData] = useState(initialValue);

  function onInputChange(field: string, value: string | number) {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function saveCharacterOnSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const dataToSave: Character = {
      id: formData.id,
      nome: formData.nome,
      iniziativa: Number(formData.iniziativa),
      puntiFerita: Number(formData.puntiFerita),
      classeArmatura: Number(formData.classeArmatura),
    };

    if (forHero) addHeroes(dataToSave);
    else addMobs(dataToSave);
  }

  function openModal(forHero: boolean) {
    setFormData(initialValue);
    setForHero(forHero);
    setShowFormModal(true);
  }

  return (
    <>
      <nav>
        <ul>
          <li>Turns Manager</li>
          <li onClick={() => openModal(false)}>Aggiungi mob</li>
          <li onClick={() => openModal(true)}>Aggiungi personaggio</li>
          <li onClick={clearMobs}>Pulisci lista</li>
        </ul>
      </nav>
      {showFormModal && (
        <FormModal
          onChange={onInputChange}
          formData={formData}
          onSubmit={saveCharacterOnSubmit}
          onButtonClose={() => setShowFormModal(false)}
          forHero={forHero}
        ></FormModal>
      )}
    </>
  );
}

export default Navbar;
