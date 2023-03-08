import { useState } from "react";
import ClickPopup from "./logoutPop";

export default function LogoutButton() {
  const [clicked, setClicked] = useState<boolean>(false);

  const clickHandler = (event: MouseEvent) => {
    logoutRemoval(event);
  };

  const logoutRemoval = (e: MouseEvent) => {
    const target = e.target as Element;
    if (target && !target.closest(".logoutBtnCover")) {
      setClicked(false);
      document.removeEventListener("click", clickHandler);
    }
  };

  const click = () => {
    setClicked(clicked == false);
    document.addEventListener("click", clickHandler);
  };
  return (
    <div className="logoutBtnCover">
      <button
        className={!clicked ? "logoutBtn" : "logoutBtn logoutBtnClicked"}
        onClick={click}
      ></button>
      <div>{clicked && <ClickPopup />}</div>
    </div>
  );
}
