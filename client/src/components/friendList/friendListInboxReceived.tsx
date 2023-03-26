import { faX, faPlus } from "@fortawesome/free-solid-svg-icons";
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

async function removeFriendReceived(item: string, element: HTMLSpanElement) {
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

async function addToFriend(item: string, element: HTMLSpanElement) {
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
  const elements = useRef<(HTMLSpanElement | null)[]>([]);

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
    <div>
      {accounts &&
        accounts.map((item, index) => (
          <span
            className="friend"
            key={item.username}
            ref={(currentElement) => (elements.current[index] = currentElement)}
          >
            <img src={item.profilePic} alt="" />
            <p>{item.username}</p>
            <div className="friendAddButtonCover">
              <button
                onClick={(event) =>
                  handleButtonClick(item.username, index, event)
                }
                className="friendAddButton"
              >
                <FontAwesomeIcon icon={faX} />
              </button>
              <button
                className="friendAddButton"
                onClick={(event) =>
                  handleButtonAdd(item.username, index, event)
                }
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </span>
        ))}
    </div>
  );
}
