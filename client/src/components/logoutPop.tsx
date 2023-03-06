import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUser,
  faRightFromBracket,
  faAddressBook,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

export default function ClickPopup() {
  const navigate = useNavigate();
  const logoutSession = async () => {
    const response: Response = await fetch("/logout", { method: "get" });
    const receivedData = await response.json();

    console.log(receivedData);

    if (response.ok) {
      navigate("/login");
    } else {
      alert(receivedData.message);
    }
  };

  return (
    <div className="logoutPop">
      <ul>
        <button className="individualBtn">
          <FontAwesomeIcon icon={faGear} />
          <p>Settings</p>
        </button>

        <button className="individualBtn">
          <FontAwesomeIcon icon={faUser} />
          <p>Profile</p>
        </button>

        <button className="individualBtn">
          <FontAwesomeIcon icon={faAddressBook} />
          <p>Friends</p>
        </button>

        <button className="individualBtn" onClick={logoutSession}>
          {" "}
          <FontAwesomeIcon icon={faRightFromBracket} />
          <p>Logout</p>
        </button>
      </ul>
    </div>
  );
}
