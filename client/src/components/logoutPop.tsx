import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUser,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import styles from "../assets/css_group/App.module.css";

export default function ClickPopup() {
  const navigate = useNavigate();
  const logoutSession = async () => {
    const response: Response = await fetch("/logout", { method: "get" });
    const receivedData = await response.json();

    if (response.ok) {
      navigate("/login");
    } else {
      alert(receivedData.message);
    }
  };

  return (
    <div className={styles["logoutPop"]}>
      <button className={styles["individualBtn"]}>
        <FontAwesomeIcon icon={faGear} />
        <p>Settings</p>
      </button>

      <button className={styles["individualBtn"]}>
        <FontAwesomeIcon icon={faUser} />
        <p>Profile</p>
      </button>
      <button className={styles["individualBtn"]} onClick={logoutSession}>
        <FontAwesomeIcon icon={faRightFromBracket} />
        <p>Logout</p>
      </button>
    </div>
  );
}
