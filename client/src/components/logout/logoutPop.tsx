import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUser,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import styles from "./logout.module.css";
import { useAuth } from "../../hooks/authContext";
import { useEffect } from "react";

export default function ClickPopup() {
  const navigate = useNavigate();
  const { logout, loading } = useAuth();

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
      <button className={styles["individualBtn"]} onClick={logout}>
        <FontAwesomeIcon icon={faRightFromBracket} />
        <p>Logout</p>
      </button>
    </div>
  );
}
