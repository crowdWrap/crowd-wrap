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
  const [backgroundImage, setBackgroundImage] = useState(
    "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2F474x%2F1c%2F8a%2Fad%2F1c8aad7f8b84b7968c298ae9b9db153d.jpg&f=1&nofb=1&ipt=f31c4684de03f2a10c6431e024592ac2b66a9f0060720731dbd143fe57103552&ipo=images"
  );
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

  // useEffect(() => {
  fetchProfilePic(setBackgroundImage);
  // }, []);

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
