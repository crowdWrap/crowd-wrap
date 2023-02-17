import "./App.css";
import { useEffect, useState } from "react";
import Engineers from "./components/Engineers";
import LogoutButton from "./components/logout";
import LoginButton from "./components/login";
import SignupButton from "./components/signup";

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
      <h1 className="title">Server Test {counter} </h1>
      <LogoutButton />
      <button className={className} onClick={handleClick} />
      {showEngineers && <Engineers allEngineers={allEngineers} />}
      <LoginButton />
      <SignupButton />
    </div>
  );
}

export default App;
