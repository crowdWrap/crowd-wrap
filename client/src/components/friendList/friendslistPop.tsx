import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faPlus,
  faInbox,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import FriendsListSearch from "./friendsListSearch";
import FriendListInbox from "./friendListInbox";
import FriendsListCover from "./friendsListCover";
import FriendListAdd from "./friendListAdd";

export default function FriendslistPop() {
  const [selectedButton, setSelectedButton] = useState(null);
  const [fetchedData, setFetchedData] = useState<any>(null);

  const handleDataUpdate = async (newData: any) => {
    setFetchedData(newData);
  };

  const handleButtonClick = (input: any) => {
    if (input === selectedButton) {
      setSelectedButton(null);
    } else {
      setSelectedButton(input);
      setFetchedData(null);
    }
  };

  return (
    <div className="friendslistPop">
      <div className="friendsListRow">
        <button onClick={() => handleButtonClick("friendListInbox")}>
          <FontAwesomeIcon icon={faInbox} />
        </button>
        <button onClick={() => handleButtonClick("friendListAdd")}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </div>

      {selectedButton !== "friendListInbox" &&
        selectedButton !== "friendListAdd" && (
          <div className="search">
            <button
              onClick={() => handleButtonClick("friendListSearch")}
              className="searchIconCover"
            >
              <FontAwesomeIcon
                className="searchIcon"
                icon={faMagnifyingGlass}
              />
            </button>
            {selectedButton === "friendListSearch" && (
              <FriendsListSearch updateData={handleDataUpdate} />
            )}
          </div>
        )}
      {selectedButton !== "friendListInbox" &&
        selectedButton !== "friendListAdd" && (
          <FriendsListCover data={fetchedData} />
        )}
      {selectedButton === "friendListInbox" && <FriendListInbox />}
      {selectedButton === "friendListAdd" && <FriendListAdd />}
    </div>
  );
}
