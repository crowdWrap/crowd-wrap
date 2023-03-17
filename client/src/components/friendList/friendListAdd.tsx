import { useEffect, useState } from "react";
import FriendListInboxReceived from "./friendListInboxReceived";
import FriendListInboxSent from "./friendListInboxSent";

async function fetchData(searchText: string) {
  if (searchText.length >= 3) {
    const response = await fetch(`/friendSearch?user_search=${searchText}`, {
      method: "GET",
    });
    const result = await response.json();
    return result;
  }
}

//if text is less than 3 remove ERRYTHING

interface Account {
  username: string;
  profilePic: string;
}

export default function FriendListAdd() {
  const [searchText, setSearchText] = useState<string>("");
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    (async () => {
      setAccounts(await fetchData(searchText));
    })();
    console.log(searchText);
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
        accounts.map((item) => (
          <button className="friend">
            <img src={item.profilePic} alt="" />
            <p>{item.username}</p>
          </button>
        ))}
    </div>
  );
}
