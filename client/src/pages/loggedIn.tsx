import React, { useState, useEffect } from "react";
import LogoutButton from "../components/logout";
import { useNavigate } from "react-router-dom";

async function fetchLoginData(navigate: any, setUsername: any) {
  const response: Response = await fetch("/profile", {
    method: "GET",
  });

  const receivedData = await response.json();

  if (response.ok) {
    navigate("/profile");
    setUsername(receivedData.user.username);
  } else {
    navigate("/login");
    alert(receivedData.message);
  }
}

function LoggedIn() {
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();
  useEffect(() => {
    fetchLoginData(navigate, setUsername);
  }, []);
  return (
    <div>
      <LogoutButton />
      <h1>Welcome {username}</h1>
      <p>Logged in</p>
    </div>
  );
}

export default LoggedIn;
