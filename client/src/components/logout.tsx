import { useState } from "react";
import ClickPopup from "./logoutPop";

export default function LogoutButton() {
  const [clicked, setClicked] = useState<boolean>(false);
  const click = () => {
    // eslint-disable-next-line
    setClicked(clicked == false);
    document.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as Element;
      if (target && !target.closest(".logoutBtnCover")) {
        setClicked(false);
      }
    });
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
