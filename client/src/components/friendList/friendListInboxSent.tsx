import { useEffect, useRef, useState } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

async function fetchData() {
  try {
    const response = await fetch(`/friendSent`, {
      method: "GET",
    });
    const result = await response.json();
    return result;
  } catch (error: any) {
    throw new Error(error);
  }
}

interface Account {
  username: string;
  profilePic: string;
}

async function removeFriendSent(item: string, element: HTMLSpanElement) {
  const parentElement = element.parentElement;
  if (parentElement && parentElement.contains(element)) {
    const response = await fetch(`/removeFriendSent?user_name=${item}`, {
      method: "GET",
    });
    const result = await response.json();
    if (result.success) {
      parentElement.removeChild(element);
    }
    return result;
  }
}

export default function FriendListInboxSent() {
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
      await removeFriendSent(item, element);
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
    <>
      {accounts &&
        accounts.map((item, index) => (
          <div
            className="friend"
            key={item.username}
            ref={(currentElement) => (elements.current[index] = currentElement)}
          >
            <img alt="" src={item.profilePic} />
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
            </div>
          </div>
        ))}
    </>
  );
}
