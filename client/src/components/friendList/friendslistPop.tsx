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

//So the process would be to make a restricting field where they can scroll, etc, and then have it
//grab the data from the database for the friends(which youll have to make in the schema prob as an array)
//if the response is okay then foreach array make an account thing and append it
//overflow:scroll
//On the account field have their account, profile picture, name , online status,
//sorta like the library/todo project except with backend and for react.
//on each of these you should probably run the auth get first to make sure they are actually authed.
//you can have session checked every second, maybe even store the session expiration.
//make a state list and push all of them from the get request
//now how would they add friends?
//I guess they can use the search bar and it will get the value from the search bar once enter is pressed
//or the search button is clicked and with that it will look in the database with someone with that username
//you can have it that instead of on enter it cna be on every btuton press where it searchs the database for someone with that name
// and if anything pops up it can display them.
//have a way to accept and deny friend request
//have button on the left to bring popup to add friend
//have sent friend requests displayed on bottom right.
//to search through your friends you would have to search through friends shcema obviously
//one sent and one received

//no more styling do logic now
//if received is empty, put a message, same for sent.

//how are you going to empty the friend part of the list the rest can stay
//remove search too, or else there will be too much difficulty

//add refresh button

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
