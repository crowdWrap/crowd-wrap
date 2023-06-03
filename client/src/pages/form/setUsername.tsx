import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
async function fetchData(navigate: any, setRegisterUsername: any) {
  //to check if the user is authenticated beforehand
  const response: Response = await fetch("/register/setUsername", {
    method: "GET",
  });

  const receivedData = await response.json();

  if (!response.ok) {
    navigate("/login");
    //navigate to login if they arent authenticated
    alert(receivedData.message);
  }
}

export default function SetUsername() {
  const [registerUsername, setRegisterUsername] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line
    fetchData(navigate, setRegisterUsername);
  }, [navigate]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = JSON.stringify({
      username: registerUsername,
    });

    const response: Response = await fetch("register/setUsername", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    const receivedData = await response.json();

    console.log(receivedData);
    if (response.ok) {
      console.log(receivedData.message);
      navigate("/profile");
    } else {
      console.log(receivedData.message);
    }
  }

  return (
    <div className="wrapper signupForm">
      <div className="form-wrapper">
        <h2>Set username</h2>
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
          <div className="submit">
            <button type="submit">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
}
