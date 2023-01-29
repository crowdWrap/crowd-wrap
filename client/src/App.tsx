import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function App() {
  const [counter, setCounter] = useState(0);

  const handleClick = () => {
    changeDisplay(".butt");
    setCounter(counter + 1);
  };

  return (
    <div className="App">
      <Display counter={counter} />
      <button className="butt" onClick={handleClick} />
    </div>
  );
}

function Display(props: { counter: number }) {
  return <h1>Server Test {props.counter} </h1>;
}

function changeDisplay(props: string) {
  console.log("hi");
  (document.querySelector(props) as HTMLElement).style.backgroundColor =
    "rgb(173, 255, 169)";
  (document.querySelector(props) as HTMLElement).style.opacity = "0.6";
  setTimeout(() => {
    (document.querySelector(props) as HTMLElement).style.opacity = "1";
  }, 250);
  (document.querySelector(props) as HTMLElement).style.borderColor = "black";
}

export default App;
