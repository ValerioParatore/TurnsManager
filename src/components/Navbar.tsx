import { useEffect, useRef, useState, type FormEvent } from "react";
import FormModal from "./FormModal";
import { useCharacter } from "../provider/CharacterProvider";
import type { Character } from "../types/Character";
import { Trash2, UserRoundPlus, Swords } from 'lucide-react';

interface NavbarProps {
  startNewFight: () => void;
}
function Navbar({startNewFight}: NavbarProps) {
  const initialValue = {
    id: 0,
    nome: "",
    iniziativa: 0,
    puntiFerita: 0,
    classeArmatura: 0,
  };
  const { addHeroes, addMobs, clearMobs } = useCharacter();
  const [showFormModal, setShowFormModal] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false)
  const [forHero, setForHero] = useState(false);
  const [formData, setFormData] = useState(initialValue);
  const dropdownRef = useRef<HTMLLIElement>(null);
  const modalnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropDownOpen(false);
      }

      if (
        modalnRef.current &&
        !modalnRef.current.contains(event.target as Node)
      ) {
        setShowFormModal(false);
      }
    }

    if (dropDownOpen || showFormModal) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropDownOpen, showFormModal]);

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
      <nav className="navbar">
        <ul className="navbar-list">
          <h2>Turns Manager</h2>
          <li onClick={startNewFight}><span><Swords  /> Inizia scontro</span></li>
          <li ref={dropdownRef} onClick={() => setDropDownOpen(prev => !prev)}>
            <span><UserRoundPlus /> Aggiungi</span>
            {dropDownOpen &&
              <div className="dropdown">
                <ul>
                  <li onClick={() => openModal(false)}><span> Mob</span></li>
                  <li onClick={() => openModal(true)}><span> Eroe</span></li>
                </ul>
              </div>}
          </li>
          <li onClick={clearMobs}><span><Trash2 /> Svuota</span></li>
        </ul>
      </nav>
      {showFormModal && (
        <div ref={modalnRef}>
          <FormModal
            onChange={onInputChange}
            formData={formData}
            onSubmit={saveCharacterOnSubmit}
            onButtonClose={() => setShowFormModal(false)}
            forHero={forHero}
          ></FormModal>
        </div>
      )}
    </>
  );
}

export default Navbar;
