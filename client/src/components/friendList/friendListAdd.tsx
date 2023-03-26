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

//Everything is working well, didnt test the feature to actually add to friend requests sent, but
//the problem is when trying to remove from the list it for some reason removes the friendslistpop
//this can be seen when u remove the function for removing friendslistpop when clicked outside
//I am not sure what to do, maybe I will remove the functionun logoutremoval and rebuild it so its better

export default function FriendListAdd() {
  const [searchText, setSearchText] = useState<string>("");
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
        setAccounts(await fetchData(searchText));
      }
    })();
    return () => {
      loaded = false;
      setAccounts([]);
    };
  }, [searchText]);

  return (
    <div className="friendListCover">
      <input
        style={{
          marginBottom: "-20px",
        }}
        placeholder="Search Friend"
        type="text"
        onChange={(e) => setSearchText(e.target.value)}
      />
      {accounts &&
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
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </span>
        ))}
    </div>
  );
}
