import React from "react";
import styles from "../assets/css_group/form.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ChakraProvider, Button, Stack, Input } from '@chakra-ui/react';
import SignInGoogle from "../api/googleSignin";
import Header from "../components/Header";

async function fetchData(navigate: any) {
  const response: Response = await fetch("/login", {
    method: "GET",
  });

  if (response.ok) {
  } else {
    navigate("/profile");
  }
}

export default function LoginForm() {
  const navigate = useNavigate();
  const [usernameOrEmail, setusernameOrEmail] = useState<string>("");
  const [loginPass, setLoginPassword] = useState<string>("");

  useEffect(() => {
    fetchData(navigate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = JSON.stringify({
      username: usernameOrEmail,
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
    <ChakraProvider>
    <div className = {styles["wrapper"]}>
      <Header />
      <div className={styles["form-wrapper"]}>
        <div className={styles["logintitle"]}>Login</div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="username">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              onChange={(e) => setusernameOrEmail(e.target.value)}
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

          <div className="submit">
            <button type="submit">Login</button>
            <Link to="/register" className="linkstyle" style={{ fontSize: 12 }}>
              Don't Have an account yet?{" "}
              <span style={{ color: "pink" }}>Register for free.</span>
            </Link>

          <GoogleOAuthProvider clientId={`${process.env.REACT_APP_CLIENTID}`}>
            <SignInGoogle />
          </GoogleOAuthProvider>
          </div>
        </form>
        <GoogleOAuthProvider clientId="951239670358-q89e1msbgovmepbaq4fplqc20qn62ha9.apps.googleusercontent.com">
          <SignInGoogle />
        </GoogleOAuthProvider>
      </div>
    </div>
    </ChakraProvider>
  );
}
