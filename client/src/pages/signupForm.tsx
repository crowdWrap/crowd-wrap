import React from "react";
import "../assets/form.css";
import { useState } from "react";
import { Link, Router, useNavigate } from "react-router-dom";
import SignUpGoogle from "../api/googleSignup";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function SignupForm() {
  const [registerUsername, setRegisterUsername] = useState<string>("");
  const [registerEmail, setRegisterEmail] = useState<string>("");
  const [registerPass, setRegisterPassword] = useState<string>("");
  const [registerConfirmPass, setRegisterConfirmPassword] =
    useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (registerPass == registerConfirmPass) {
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
          if (response.ok) {
            navigate("/login");
          } else {
            response.json().then((data) => {
              console.log(data.message);
            });
          }
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <div className="wrapper signupForm">
      <div className="form-wrapper">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="username">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
          </div>
          <div className="email">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
          </div>
          <div className="password">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
          </div>
          <div className="confirm password">
            <label htmlFor="confirm password"> Confirm Password</label>
            <input
              type="password"
              name="confirm password"
              placeholder="Confirm Password"
              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
            />
          </div>
          <div className="submit">
            <button type="submit">Sign Up</button>
          </div>
        </form>
      </div>
      <GoogleOAuthProvider clientId="951239670358-q89e1msbgovmepbaq4fplqc20qn62ha9.apps.googleusercontent.com">
        <SignUpGoogle />
      </GoogleOAuthProvider>
      <div className="btnWrap">
        <Link to="/login">
          <button className="signupBtn"> Already Have an Account?</button>
        </Link>
        <Link to="/">
          <button className="signupBtn"> Home</button>
        </Link>
      </div>
    </div>
  );
}
