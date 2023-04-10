import React from "react";
import styles from "../assets/css_group/form.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";

async function fetchData(navigate: any) {
  const response: Response = await fetch("/login", {
    method: "GET",
  });
  // eslint-disable-next-line
  const receivedData = await response.json();

  if (response.ok) {
  } else {
    navigate("/profile");
  }
}

export default function LoginForm() {
  const navigate = useNavigate();
  const [loginUsername, setLoginUsername] = useState < string > ("");
  const [loginPass, setLoginPassword] = useState < string > ("");

  useEffect(() => {
    fetchData(navigate);
    // eslint-disable-next-line
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = JSON.stringify({
      username: loginUsername,
      password: loginPass,
    });

    const response: Response = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    const receivedData = await response.json();

    if (response.ok) {
      alert(receivedData.message);
      navigate("/profile");
    } else {
      alert(receivedData.message);
    }
  }

  return (
    
    <div className = {styles["wrapper"]}>
      <Header />
      <div className={styles["form-wrapper"]}>
        <div className={styles["logintitle"]}>Login</div>
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles["username"]}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              onChange={(e) => setLoginUsername(e.target.value)}
            />
          </div>
          <div className={styles["password"]}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={(e) => setLoginPassword(e.target.value)}
            />
          </div>

          <div className={styles["submit"]}>
            <button type="submit" className={styles["buttonNormal"]}>Login</button>
            <Link to="/register" className={styles["linkstyle"]} style={{ fontSize: 12 }}>
              Don't Have an account yet?{" "}
              <span style={{ color: "pink" }}>Register for free.</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

