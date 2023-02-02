import "./App.css";
import { useState } from "react";
import Engineers from "./components/Engineers";

function changeDisplay(props: string) {
  (document.querySelector(props) as HTMLElement).classList.add(
    "startBtnActivated"
  );
  (document.querySelector(props) as HTMLElement).classList.toggle(
    "startBtnBuffer"
  );
  setTimeout(() => {
    (document.querySelector(props) as HTMLElement).classList.toggle(
      "startBtnBuffer"
    );
  }, 250);
}

function App() {
  const [counter, setCounter] = useState<number>(0);
  const [allEngineers, setAllEngineers] = useState<string[]>([]);
  const [showEngineers, setShowEngineers] = useState<Boolean>(false);

  const handleClick = async () => {
    changeDisplay(".startBtn");
    setCounter(counter + 1);
    setShowEngineers(true);

    try {
      const response = await fetch("/crowdWrap/engineers");
      const json = await response.json();
      setAllEngineers(json);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <h1>Server Test {counter} </h1>
      <button className="startBtn" onClick={handleClick} />
      {showEngineers && <Engineers allEngineers={allEngineers} />}
    </div>
  );
}

export default App;
