import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

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

export default function FriendsListCover(data: any) {
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
      await removeFriend(item, element);
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

  //Why isnt it working!? When clicking on the button it should be null...so why is still displayed, does
  //the component need to be updated?

  return (
    <div className="friendListCover">
      {accounts &&
        !data.data &&
        accounts.map((item, index) => (
          <span
            className="friend"
            key={item.username}
            ref={(currentElement) => (elements.current[index] = currentElement)}
          >
            <img src={item.profilePic} alt="" />
            <p>{item.username}</p>
            <button
              onClick={(event) =>
                handleButtonClick(item.username, index, event)
              }
              className="friendAddButton"
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </span>
        ))}
      {data.data &&
        data.data.map((item: any, index: any) => (
          <span
            className="friend"
            key={item.username}
            ref={(currentElement) => (elements.current[index] = currentElement)}
          >
            <img src={item.profilePic} alt="" />
            <p>{item.username}</p>
            <button
              onClick={(event) =>
                handleButtonClick(item.username, index, event)
              }
              className="friendAddButton"
            >
              <FontAwesomeIcon icon={faX} />
            </button>
          </span>
        ))}
    </div>
  );
}
