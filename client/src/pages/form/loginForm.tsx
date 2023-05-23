import React from "react";
import styles from "./form.module.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import SignInGoogle from "../../api/googleSignin";
import Header from "../../components/header/Header";
import { useAuth } from "../../hooks/authContext";

// async function fetchData(navigate: any) {
//   const response: Response = await fetch("/login", {
//     method: "GET",
//   });

//   if (response.ok) {
//   } else {
//     navigate("/profile");
//   }
// }

export default function LoginForm() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-restricted-globals
  const urlParams = new URLSearchParams(location.search);
  const redirect = urlParams.get("redirect");
  const [usernameOrEmail, setusernameOrEmail] = useState<string>("");
  const [loginPass, setLoginPassword] = useState<string>("");
  const { login, authed, setAuthed } = useAuth();

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
      setAuthed(true);
      if (
        redirect &&
        !redirect.startsWith("http://") &&
        !redirect.startsWith("https://")
      ) {
        window.location.replace(redirect);
        return;
      }
      navigate("/profile");
    } else {
      alert(receivedData.message);
    }
  }

  return (
    <div className={styles["wrapper"]}>
      {/* <Header /> */}
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

          <div className={styles["submit"]}>
            <button type="submit" className={styles["buttonNormal"]}>
              Login
            </button>

            <div className={styles["googleSignIn"]}>
              <GoogleOAuthProvider
                clientId={`${process.env.REACT_APP_CLIENTID}`}
              >
                <SignInGoogle />
              </GoogleOAuthProvider>
            </div>

            <Link
              to="/register"
              className={styles["linkstyle"]}
              style={{ fontSize: 12 }}
            >
              Don't Have an account yet?
              <br />
              <span style={{ color: "pink" }}>Register for free.</span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
