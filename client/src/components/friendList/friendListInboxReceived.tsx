import { useEffect, useState } from "react";
import ReceivedFriend from "./friendComponents/receivedFriend";

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

interface Account {
  username: string;
  profilePic: string;
}

export default function FriendListInboxReceived({
  lastRefresh,
  setLastRefresh,
}: any) {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const handleButtonClick = async (item: string) => {
    await fetch(`/removeFriendReceived?user_name=${item}`, {
      method: "GET",
    });
    setLastRefresh(Date.now());
  };

  const handleButtonAdd = async (item: string) => {
    await fetch(`/addFriend?user_name=${item}`, {
      method: "GET",
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
          <ReceivedFriend
            item={item}
            handleButtonAdd={(val: any) => handleButtonAdd(val)}
            handleButtonClick={(val: any) => handleButtonClick(val)}
          />
        ))}
    </div>
  );
}
