import React from "react";
import styles from "../assets/css_group/form.module.css";
import { useState } from "react";
// eslint-disable-next-line
import { Link, Router, useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function SignupForm() {
  const [registerUsername, setRegisterUsername] = useState<string>("");
  const [registerEmail, setRegisterEmail] = useState<string>("");
  const [registerPass, setRegisterPassword] = useState<string>("");
  const [registerConfirmPass, setRegisterConfirmPassword] =
    useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (registerPass !== registerConfirmPass) {
      console.log("Passwords do not match.");
    } else {
      const data = JSON.stringify({
        username: registerUsername,
        email: registerEmail,
        password: registerPass,
      });

      fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      })
        .then((response) => {
          response.json();
          if (response.ok) {
            navigate("/login");
          } else {
            console.log("registration failed");
          }
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <div className={styles["wrapper"]}>
      <Header />
      <div className={styles["form-wrapper"]}>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles["username"]}>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
          </div>
          <div className={styles["email"]}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
          </div>
          <div className={styles["password"]}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
          </div>
          <div className={styles["confirm password"]}>
            <label htmlFor="confirm password"> Confirm Password</label>
            <input
              type="password"
              name="confirm password"
              placeholder="Confirm Password"
              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
            />
          </div>
          <div className={styles["submit"]}>
            <button type="submit">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}
