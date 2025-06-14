import { useState } from "react";
import "./App.scss";
import Detail from "./components/Detail";
import Footer from "./components/Footer";
import List from "./components/List";
import Navbar from "./components/Navbar";
import type { Character } from "./types/Character";

function App() {
  const [selectedItem, setSelectedItem] = useState<Character | null>(null);

  return (
    <>
      <Navbar></Navbar>
      <main>
        <section className="list">
          <List onItemSelected={setSelectedItem}></List>
        </section>
        <section className="detail">
          <Detail character={selectedItem}></Detail>
        </section>
      </main>
      <Footer></Footer>
    </>
  );
}

export default App;
