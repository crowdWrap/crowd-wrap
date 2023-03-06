import React, { useState, useEffect } from "react";
import LogoutButton from "../components/logout";
import { useNavigate } from "react-router-dom";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FriendsList from "../components/friendslist";

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
    <div className="loggedIn">
      <nav className="loggedInNavbar">
        <FriendsList />
        <LogoutButton />
      </nav>
      <h1>Welcome {username}</h1>
      <p>Logged in</p>
    </div>
  );
}

export default LoggedIn;
