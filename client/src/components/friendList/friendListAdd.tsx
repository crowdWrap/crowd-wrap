import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

interface Account {
  username: string;
  profilePic: string;
}

async function fetchData(searchText: string) {
  if (searchText.length >= 3) {
    const response = await fetch(`/friendSearch?user_search=${searchText}`, {
      method: "GET",
    });
    const result = await response.json();
    return result;
  }
}
async function sendFriendRequest(item: string, element: HTMLSpanElement) {
  const parentElement = element.parentElement;
  if (parentElement && parentElement.contains(element)) {
    const response = await fetch(`/sendFriendRequest?user_name=${item}`, {
      method: "GET",
    });
    const result = await response.json();
    if (result.success) {
      parentElement.removeChild(element);
    }
    return result;
  }
}

export default function FriendListPanel(props: { searchText: string }) {
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
      await sendFriendRequest(item, element);
      setAccounts((prevAccounts) =>
        prevAccounts.filter((account) => account.username !== item)
      );
    }
  };

  useEffect(() => {
    let loaded = true;
    (async () => {
      if (loaded) {
        setAccounts(await fetchData(props.searchText));
      }
    })();
    return () => {
      loaded = false;
      setAccounts([]);
    };
  }, [props.searchText]);

  return (
    <>
      {accounts &&
        accounts.map((item, index) => (
          <div
            className="friend"
            key={item.username}
            ref={(currentElement) => (elements.current[index] = currentElement)}
          >
            <img alt="The profile pic of the user" src={item.profilePic} />
            <p>{item.username}</p>
            <button
              onClick={(event) =>
                handleButtonClick(item.username, index, event)
              }
              className="friendAddButton"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
        ))}
    </>
  );
}

export function FriendListAddSearch(props: {
  setSearchText: (text: string) => void;
}) {
  return (
    <div id="search">
      <input
        type="text"
        id="searchfield"
        placeholder="Search friends"
        onChange={(e) => props.setSearchText(e.target.value)}
      />
    </div>
  );
}
