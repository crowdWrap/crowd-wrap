import { useState } from "react";
import ClickPopup from "./logoutPop";


export default function LogoutButton() {
  const [clicked, setClicked] = useState<boolean>(false);
  const click = () => {
    clicked === false ? setClicked(true) : setClicked(false);
  };
  return (
    <div className="logoutBtnCover">
      <button
        className={!clicked ? "logoutBtn" : "logoutBtnClicked"}
        onClick={click}
      ></button>
      <div>{clicked && <ClickPopup />}</div>
    </div>
  );
}