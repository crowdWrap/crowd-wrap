import {
  faUserGroup,
  faClockRotateLeft,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import "./friendslist.css";
import FriendsListSearch from "./friendsListSearch";
import FriendListAdd, { FriendListAddSearch } from "./friendListAdd";
import FriendListInbox from "./friendListInbox";

async function fetchData() {
  try {
    const response = await fetch(`/friends`, {
      method: "GET",
    });
    const result = await response.json();
    return result;
  } catch (error: any) {
    throw new Error(error);
  }
}

// async function removeFriend(item: string, element: HTMLSpanElement) {
//   const parentElement = element.parentElement;
//   if (parentElement && parentElement.contains(element)) {
//     const response = await fetch(`/removeFriend?user_name=${item}`, {
//       method: "GET",
//     });
//     const result = await response.json();
//     if (result.success) {
//       parentElement.removeChild(element);
//     }
//     return result;
//   }
// }

interface Account {
  username: string;
  profilePic: string;
}

export default function FriendsListCover() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const elements = useRef<(HTMLSpanElement | null)[]>([]);
  const [moveBar, setMoveBar] = useState<string>("currentMover move-standard");
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [searchText, setSearchText] = useState<string>("");

  const handleDataUpdate = async (newData: any) => {
    setFetchedData(newData);
  };

  // const handleButtonClick = async (
  //   item: string,
  //   index: number,
  //   event: React.MouseEvent<HTMLButtonElement>
  // ) => {
  //   event.stopPropagation();
  //   const element = elements.current[index];
  //   if (element) {
  //     await removeFriend(item, element);
  //     setAccounts((prevAccounts) =>
  //       prevAccounts.filter((account) => account.username !== item)
  //     );
  //   }
  // };

  const handleMoveBar = (input: string) => {
    setMoveBar(input);
  };

  useEffect(() => {
    let loaded = true;
    (async () => {
      if (loaded) {
        setAccounts(await fetchData());
      }
    })();
    return () => {
      loaded = false;
      setAccounts([]);
    };
  }, []);

  return (
    <div id="chatbox">
      <div id="friendslist">
        <div id="topmenu">
          <FontAwesomeIcon
            icon={faUserGroup}
            className={
              moveBar == "currentMover move-standard"
                ? "fontAwesome selected"
                : "fontAwesome"
            }
            onClick={() => handleMoveBar("currentMover move-standard")}
          />
          <FontAwesomeIcon
            icon={faClockRotateLeft}
            className={
              moveBar == "currentMover move-middle"
                ? "fontAwesome selected"
                : "fontAwesome"
            }
            onClick={() => handleMoveBar("currentMover move-middle")}
          />
          <FontAwesomeIcon
            icon={faUserPlus}
            className={
              moveBar == "currentMover move-right"
                ? "fontAwesome selected"
                : "fontAwesome"
            }
            onClick={() => handleMoveBar("currentMover move-right")}
          />
          <div className={moveBar}></div>
        </div>

        <div id="friends">
          <div className="friendCover">
            {accounts &&
              !fetchedData &&
              moveBar == "currentMover move-standard" &&
              accounts.map((item, index) => (
                <div
                  className="friend"
                  key={item.username}
                  ref={(currentElement) =>
                    (elements.current[index] = currentElement)
                  }
                >
                  <img alt="" src={item.profilePic} />
                  <p>{item.username}</p>
                  <div className="status available"></div>
                </div>
              ))}
            {fetchedData &&
              moveBar == "currentMover move-standard" &&
              fetchedData.map((item: any, index: any) => (
                <div
                  className="friend"
                  key={item.username}
                  ref={(currentElement) =>
                    (elements.current[index] = currentElement)
                  }
                >
                  <img alt="" src={item.profilePic} />
                  <p>{item.username}</p>
                  <div className="status available"></div>
                </div>
              ))}

            {moveBar == "currentMover move-right" && (
              <FriendListAdd searchText={searchText} />
            )}

            {moveBar == "currentMover move-middle" && <FriendListInbox />}
          </div>

          {/* what would happen if you have text in it and move to add friend etc */}
          {moveBar == "currentMover move-standard" && (
            <FriendsListSearch updateData={handleDataUpdate} />
          )}

          {moveBar == "currentMover move-right" && (
            <FriendListAddSearch setSearchText={setSearchText} />
          )}

          {/* has to change based on what class it is on. */}
        </div>
      </div>
    </div>
  );
}
