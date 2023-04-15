import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import "./friendslist.css";
import FriendsListCover from "./friendsListCover";

export default function FriendsList() {
  const [clicked, setClicked] = useState<boolean>(false);

  const clickHandler = (event: MouseEvent) => {
    logoutRemoval(event, setClicked);
  };

  const logoutRemoval = (e: MouseEvent, setClicked: any) => {
    const target = e.target as Element;
    if (target && !target.closest(".friendsListCover")) {
      setClicked(false);
      document.removeEventListener("click", clickHandler);
    }
  };

  const click = () => {
    setClicked(clicked === false);
    document.addEventListener("click", clickHandler);
  };
  return (
    <div className="friendsListCover">
      <button
        onClick={click}
        className={!clicked ? "friendsList" : "friendsList friendsListClicked"}
      >
        <FontAwesomeIcon icon={faUserGroup} />
      </button>
      <div>{clicked && <FriendsListCover />}</div>
    </div>
  );
}
