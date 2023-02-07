import "./App.css";
import { useEffect, useState } from "react";
import Engineers from "./components/Engineers";

function App() {
  const [counter, setCounter] = useState<number>(0);
  const [allEngineers, setAllEngineers] = useState<string[]>([]);
  const [showEngineers, setShowEngineers] = useState<Boolean>(false);
  const [className, setClassName] = useState<string>("");

  useEffect(() => {
    setClassName("startBtn startBtnActivated startBtnBuffer");
    setTimeout(() => {
      setClassName("startBtn startBtnActivated ");
      setShowEngineers(false);
    }, 250);
  }, [showEngineers]);

  const handleClick = async () => {
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
<<<<<<< HEAD
      <h1>Server Test {counter} </h1>
      <button className={className} onClick={handleClick} />
      {showEngineers && <Engineers allEngineers={allEngineers} />}
=======
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload. Hello World.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
>>>>>>> main
    </div>
  );
}

export default App;
