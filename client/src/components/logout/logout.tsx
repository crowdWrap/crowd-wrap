import { useEffect, useState, useRef } from "react";
import ClickPopup from "./logoutPop";
import styles from "./logout.module.css";
import { useAuth } from "../../hooks/authContext";

export default function LogoutButton() {
  const [clicked, setClicked] = useState<boolean>(false);
  const { profilePic, loading } = useAuth();

  const btnCover: any = useRef();

  const clickHandler = (event: MouseEvent) => {
    logoutRemoval(event, setClicked);
  };
  const logoutRemoval = (e: MouseEvent, setClicked: any) => {
    const target = e.target as Element;
    if (target && !target.closest(`.${styles.logoutBtnCover}`)) {
      // check if target is not within logoutCover
      setClicked(false);
      document.removeEventListener("click", clickHandler);
    }
  };

  const click = () => {
    setClicked(clicked === false);
    document.addEventListener("click", clickHandler);
  };

  return (
    <div ref={btnCover} className={styles["logoutBtnCover"]}>
      <button
        style={{
          backgroundImage: `url(${profilePic})`,
        }}
        className={`${styles.logoutBtn} ${
          clicked ? styles.logoutBtnClicked : ""
        }`}
        onClick={click}
      ></button>
      <div>{clicked && <ClickPopup />}</div>
    </div>
  );
}
