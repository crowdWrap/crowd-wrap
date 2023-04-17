import { useState, useEffect } from "react";
import LogoutButton from "../components/logout";
import { useNavigate } from "react-router-dom";
import FriendsList from "../components/friendList/friendslist";
import CreateEventButton from "../components/createEvent/createEventButton";

async function fetchLoginData(navigate: any, setUsername: any) {
  const response: Response = await fetch("/profile", {
    method: "GET",
  });

  const receivedData = await response.json();

  if (response.ok) {
    navigate("/events");
    setUsername(receivedData.user.username);
  } else {
    navigate("/login");
    alert(receivedData.message);
  }
}

export default function Events() {
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();
  useEffect(() => {
    fetchLoginData(navigate, setUsername);
  }, [navigate]);
  return (
    <div className="loggedIn">
      <nav className="loggedInNavbar">
        <CreateEventButton />
        <FriendsList />
        <LogoutButton />
      </nav>
      <h1>Welcome {username} to the events page</h1>
      <p>Logged in</p>
    </div>
  );
}
