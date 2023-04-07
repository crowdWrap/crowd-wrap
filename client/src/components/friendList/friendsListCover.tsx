import {
  faUserGroup,
  faClockRotateLeft,
  faUserPlus,
  faTrashCan,
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
    console.log(result);
    return result;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function removeFriend(item: string, element: HTMLSpanElement) {
  const parentElement = element.parentElement;
  if (parentElement && parentElement.contains(element)) {
    const response = await fetch(`/removeFriend?user_name=${item}`, {
      method: "GET",
    });
    const result = await response.json();
    if (result.success) {
      parentElement.removeChild(element);
    }
    return result;
  }
}

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
  const [clickMenu, setClickMenu] = useState({ index: null, x: null, y: null });
  const [refresh, setRefresh] = useState(false);

  const handleDataUpdate = async (newData: any) => {
    setFetchedData(newData);
  };

  const handleButtonClick = async (
    item: string,
    index: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    const element = elements.current[index];
    if (element) {
      await removeFriend(item, element);
      setAccounts((prevAccounts) =>
        prevAccounts.filter((account) => account.username !== item)
      );
    }
  };

  const handleRightClick = (index: any, event: any) => {
    event.preventDefault();
    setClickMenu({ index: index, x: event.clientX, y: event.clientY });
  };

  const handleMenuRemoval = (event: any) => {
    if (clickMenu.x !== null && !event.target.closest(".context-menu")) {
      setClickMenu({ index: null, x: null, y: null });
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleMenuRemoval);
    return () => {
      document.removeEventListener("click", handleMenuRemoval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickMenu]);

  useEffect(() => {
    let loaded = true;
    (async () => {
      if (loaded) {
        setAccounts(await fetchData());
      }
      if (refresh) {
        setAccounts(await fetchData());
        setRefresh(false);
      }
    })();
    return () => {
      loaded = false;
      setAccounts([]);
    };
  }, [refresh]);

  const handleMoveBar = (input: string) => {
    setMoveBar(input);
    if (input == "currentMover move-standard") {
      setRefresh(true);
    }
  };

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
                  onContextMenu={(event) => handleRightClick(index, event)}
                  className="friend"
                  key={item.username}
                  ref={(currentElement) =>
                    (elements.current[index] = currentElement)
                  }
                >
                  {clickMenu.x !== null &&
                    clickMenu.y !== null &&
                    clickMenu.index === index && (
                      <div className="context-cover">
                        <button
                          className="context-menu"
                          style={{
                            top: clickMenu.y as number,
                            left: clickMenu.x as number,
                          }}
                          onClick={(event) =>
                            handleButtonClick(item.username, index, event)
                          }
                        >
                          Delete {item.username}{" "}
                          <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                      </div>
                    )}
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
