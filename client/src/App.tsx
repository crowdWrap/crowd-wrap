import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";

function App() {
  const [counter, setCounter] = useState(0);
  const [engineers, setEngineers] = useState([]);
  const [showEngineers, setShowEngineers] = useState(false);

  const handleClick = async () => {
    changeDisplay(".butt");
    setCounter(counter + 1);
    setShowEngineers(true);

    try {
      const response = await fetch("/crowdWrap/engineers");
      const json = await response.json();
      setEngineers(json);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="App">
      <Display counter={counter} />
      <button className="butt" onClick={handleClick} />
      {showEngineers && <Engineers engineers={engineers} />}
    </div>
  );
}

function Display(props: { counter: number }) {
  return <h1>Server Test {props.counter} </h1>;
}

function changeDisplay(props: string) {
  (document.querySelector(props) as HTMLElement).style.backgroundColor =
    "rgb(173, 255, 169)";
  (document.querySelector(props) as HTMLElement).style.opacity = "0.6";
  setTimeout(() => {
    (document.querySelector(props) as HTMLElement).style.opacity = "1";
  }, 250);
  (document.querySelector(props) as HTMLElement).style.borderColor = "black";
}

//run server and react

function Engineers({ engineers }: { engineers: Array<{ engineer: any }> }) {
  return (
    <div className="engineer">
      <ul>
        {engineers.map((e) => {
          return <li key={e.engineer}> {e.engineer} </li>;
        })}
      </ul>
    </div>
  );
}

export default App;
