import { useEffect, useState } from "react";
import {
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  useToast,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import AddFriend from "./friendComponents/addFriend";
import { DebounceInput } from "react-debounce-input";

interface Account {
  username: string;
  profilePic: string;
}

async function fetchData(searchText: string) {
  if (searchText.length >= 3) {
    const response = await fetch(`/friends/search?user_search=${searchText}`, {
      method: "GET",
    });
    const result = await response.json();
    return result;
  }
}

export default function FriendListAdd({
  searchText,
  setLastRefresh,
  lastRefresh,
}: any) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const toast = useToast();

  const handleButtonClick = async (item: string) => {
    const data = JSON.stringify({
      username: item,
    });

    await fetch(`/friends/send-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });
    setLastRefresh(Date.now());
    toast({
      title: "Friend Request Sent.",
      description: `${item} has received your request.`,
      status: "success",
      duration: 4000,
    });
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
  }, [searchText, lastRefresh]);

  return (
    <>
      {accounts &&
        accounts.map((item) => (
          <AddFriend
            item={item}
            handleButtonClick={(val: any) => handleButtonClick(val)}
          />
        ))}
    </>
  );
}

export function FriendListAddSearch({ setSearchText }: any) {
  return (
    <InputGroup style={{ position: "fixed", bottom: "10px", width: "286px" }}>
      <InputLeftElement pointerEvents="none">
        <Icon color="gray.300" as={BsSearch} />
      </InputLeftElement>
      <Input
      as={DebounceInput}
      debounceTimeout={325}
        onChange={(e) => setSearchText(e.target.value)}
        type="text"
        placeholder="Add Friends"
      />
    </InputGroup>
  );
}
