import { useEffect, useState, useRef } from "react";
import ClickPopup from "./logoutPop";
import styles from "../assets/css_group/App.module.css";

async function fetchProfilePic(setBackgroundImage: any) {
  const response: Response = await fetch("/profilePicRequest", {
    method: "GET",
  });

  const receivedData = await response.text();

  if (response.ok) {
    setBackgroundImage(receivedData);
  } else {
    console.log("error");
  }
}

export default function LogoutButton() {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [clicked, setClicked] = useState<boolean>(false);

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

  useEffect(() => {
    fetchProfilePic(setBackgroundImage);
  }, []);

  return (
    <div ref={btnCover} className={styles["logoutBtnCover"]}>
      <button
        style={{
          backgroundImage: `url(${backgroundImage})`,
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
