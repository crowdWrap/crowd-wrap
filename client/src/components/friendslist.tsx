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
  const click = () => {
    setClicked(clicked == false);
    document.addEventListener("click", (e: MouseEvent) => {
      const target = e.target as Element;
      if (target && !target.closest(".friendsListCover")) {
        setClicked(false);
      }
    });
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
