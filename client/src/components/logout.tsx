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
