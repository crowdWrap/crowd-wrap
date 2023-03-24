import { useEffect, useState } from "react";
import ClickPopup from "./logoutPop";

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

  useEffect(() => {
    fetchProfilePic(setBackgroundImage);
  }, []);

  return (
    <div className="logoutBtnCover">
      <button
        style={{
          backgroundImage: `url(${backgroundImage}?timestamp=${Date.now()})`,
        }}
        className={!clicked ? "logoutBtn" : "logoutBtn logoutBtnClicked"}
        onClick={click}
      ></button>
      <div>{clicked && <ClickPopup />}</div>
    </div>
  );
}
