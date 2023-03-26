import { useEffect, useState } from "react";
import ClickPopup from "./logoutPop";

async function fetchProfilePic(setBackgroundImage: any) {
  const response: Response = await fetch(
    "https://people.googleapis.com/v1/people/106877212988625954306?personFields=photos&key=AIzaSyD680Eb2E2_haJNH-3Dqa75uHLgD8Amr44",
    {
      method: "GET",
    }
  );
  const receivedData = await response.json();
  if (response.ok) {
    setBackgroundImage(receivedData.photos[0].url);
  } else if (response.status == 403) {
    console.log("error");
  }
}

export default function LogoutButton() {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [clicked, setClicked] = useState<boolean>(false);
  const click = () => {
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
          backgroundImage: `url(${backgroundImage}`,
        }}
        className={!clicked ? "logoutBtn" : "logoutBtn logoutBtnClicked"}
        onClick={click}
      ></button>
      <div>{clicked && <ClickPopup />}</div>
    </div>
  );
}
