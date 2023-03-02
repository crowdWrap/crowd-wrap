import "../assets/App.css";
import { useEffect, useState } from "react";
import Engineers from "../components/Engineers";
import LogoutButton from "../components/logout";
import SignupForm from "./signupForm";
import LoginForm from "./loginForm";
import { Link, Router } from "react-router-dom";

export default function HomePage() {
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
      <button className={className} onClick={handleClick} />
      {showEngineers && <Engineers allEngineers={allEngineers} />}

      <div className="btnWrap">
        <Link to="/register">
          <button className="signupBtn"> Sign up</button>
        </Link>
        <Link to="/login">
          <button className="loginBtn"> Login</button>
        </Link>
      </div>
    </div>
  );
}
