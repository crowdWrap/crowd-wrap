import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUser,
  faRightFromBracket,
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
        <li>
          <FontAwesomeIcon icon={faGear} />
          <button className="individualBtn firstIndiv">Settings</button>
        </li>
        <li>
          <FontAwesomeIcon icon={faUser} />
          <button className="individualBtn">Profile</button>
        </li>
        <li>
          <FontAwesomeIcon icon={faRightFromBracket} />
          <button className="individualBtn" onClick={logoutSession}>
            {" "}
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
