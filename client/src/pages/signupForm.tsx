import React from "react";
import "../assets/form.css";
import { useState } from "react";
import { Link, Router, useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function SignupForm() {
  const [registerFullname, setRegisterFullname] = useState<string>("");
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
        fullname: registerFullname,
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
    <div className="wrapper signupForm">
      <Header />
      <div className="form-wrapper">
      <div className= "signuptitle">Sign Up</div>
      <div className="signuptitletwo">The perfect gift, everytime.</div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="fullname">
            <input
              type="text"
              name="fullname"
              placeholder="Full Name"
              onChange={(e) => setRegisterFullname(e.target.value)}
            />
          </div>
          <div className="username">
            <input
              type="username"
              name="username"
              placeholder="Username"
              onChange={(e) => setRegisterUsername(e.target.value)}
            />
          </div>
          <div className="email">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
          </div>
          <div className="password">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={(e) => setRegisterPassword(e.target.value)}
            />
          </div>
          <div className="confirm password">
            <input
              type="password"
              name="confirm password"
              placeholder="Confirm Password"
              onChange={(e) => setRegisterConfirmPassword(e.target.value)}
            />
          </div>
          <div className="submit">
            <button type="submit">Create Account</button>
          </div>
          <div className="submit">
        <Link to="/login" className="linkstyle" style={{ fontSize: 12 }}>
          Already have an account?{" "}
          <span style={{ color: "pink" }}>Sign In</span>
        </Link>
      </div>
        </form>
      </div>

      
    </div>
  );
}
