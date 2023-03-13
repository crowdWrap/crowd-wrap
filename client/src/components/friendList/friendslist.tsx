import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGear,
  faUser,
  faRightFromBracket,
  faAddressBook,
  faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import FriendslistPop from "./friendslistPop";
import { useState } from "react";

export default function FriendsList() {
  const [clicked, setClicked] = useState<boolean>(false);
  //add another one of these for the other buttons

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
    setClicked(clicked == false);
    document.addEventListener("click", clickHandler);
  };
  return (
    <div className="friendsListCover">
      <button onClick={click} className="friendsList">
        <FontAwesomeIcon icon={faUserGroup} />
      </button>
      <div>{clicked && <FriendslistPop />}</div>
    </div>
  );
}
