import { faPlus, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

async function fetchData() {
  try {
    const response = await fetch(`/friendReceived`, {
      method: "GET",
    });
    const result = await response.json();
    return result;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function removeFriendReceived(item: string, element: HTMLDivElement) {
  const parentElement = element.parentElement;
  if (parentElement && parentElement.contains(element)) {
    const response = await fetch(`/removeFriendReceived?user_name=${item}`, {
      method: "GET",
    });
    const result = await response.json();
    if (result.success) {
      parentElement.removeChild(element);
    }
    return result;
  }
}

async function addToFriend(item: string, element: HTMLDivElement) {
  const parentElement = element.parentElement;
  if (parentElement && parentElement.contains(element)) {
    const response = await fetch(`/addFriend?user_name=${item}`, {
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

export default function FriendListInboxReceived() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const elements = useRef<(HTMLDivElement | null)[]>([]);
  const [clickMenu, setClickMenu] = useState({ index: null, x: null, y: null });

  const handleButtonClick = async (
    item: string,
    index: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    const element = elements.current[index];
    if (element) {
      await removeFriendReceived(item, element);
      setAccounts((prevAccounts) =>
        prevAccounts.filter((account) => account.username !== item)
      );
    }
  };

  const handleButtonAdd = async (
    item: string,
    index: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    const element = elements.current[index];
    if (element) {
      await addToFriend(item, element);
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

  useEffect(() => {
    document.addEventListener("click", handleMenuRemoval);
    return () => {
      document.removeEventListener("click", handleMenuRemoval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clickMenu]);

  return (
    <>
      {accounts &&
        accounts.map((item, index) => (
          <div
            onContextMenu={(event) => handleRightClick(index, event)}
            className="friend"
            key={item.username}
            ref={(currentElement) => (elements.current[index] = currentElement)}
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
                    Delete {item.username} <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              )}
            <img alt="" src={item.profilePic} />
            <p>{item.username}</p>
            <div className="friendAddButtonCover">
              <button
                className="friendAddButton"
                onClick={(event) =>
                  handleButtonAdd(item.username, index, event)
                }
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
        ))}
    </>
  );
}
