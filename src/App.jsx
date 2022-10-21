import { useState } from "react";
import "./App.css";
import MusicPlayer from "./MusicPlayer";
import Menu from "./Menu";
import Mumbert from "./Mumbert";
import Musika from "./Musika";

function App() {
  const [menu, setMenu] = useState("musika");

  const [generating, setGenerating] = useState(false);
  const [filename, setFilename] = useState("");

  return (
    <div className="App">
      <Menu setMenu={setMenu} menu={menu} />
      <br />
      <h2>Generate Music</h2>
      {menu === "mumbert" && (
        <Mumbert
          generating={generating}
          setGenerating={setGenerating}
          setFilename={setFilename}
        />
      )}
      {menu === "musika" && (
        <Musika
          generating={generating}
          setGenerating={setGenerating}
          setFilename={setFilename}
        />
      )}
      <br />
      <br />
      {filename && <MusicPlayer filename={filename} isWav={menu == "musika"} />}
    </div>
  );
}

export default App;
