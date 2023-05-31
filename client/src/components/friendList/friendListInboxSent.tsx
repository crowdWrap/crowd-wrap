import { useEffect, useState } from "react";
import InboxFriend from "./friendComponents/sentFriend";

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

export default function FriendListInboxSent({
  lastRefresh,
  setLastRefresh,
}: any) {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const handleButtonClick = async (item: string) => {
    const data = JSON.stringify({
      username: item,
    });
    await fetch(`/removeFriendSent`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    setLastRefresh(Date.now());
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastRefresh]);

  return (
    <div
      style={{
        marginTop: "-16px",
        width: "286px",
        position: "relative",
        left: "-16px",
      }}
    >
      {accounts &&
        accounts.map((item) => (
          <InboxFriend
            item={item}
            handleButtonClick={(val: any) => handleButtonClick(val)}
          />
        ))}
    </div>
  );
}
