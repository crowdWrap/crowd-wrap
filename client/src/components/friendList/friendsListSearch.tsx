import { Icon, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { BsSearch } from "react-icons/bs";
import { useAuth } from "../../hooks/authContext";
import { DebounceInput } from "react-debounce-input";

async function fetchData(searchText: string) {
  if (searchText.length >= 3) {
    const response = await fetch(
      `/friends/list-search?user_search=${searchText}`,
      {
        method: "GET",
      }
    );
    const result = await response.json();
    return result;
  } else {
    return;
  }
}

export default function FriendsListSearch({ updateData, eventUse }: any) {
  const [searchText, setSearchText] = useState<string>("");

  const { refreshEvent } = useAuth();

  useEffect(() => {
    async function fetchAndUpdate() {
      const data = await fetchData(searchText);
      await updateData(data);
    }
    fetchAndUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, refreshEvent]);

  return (
    <>
      {!eventUse ? (
        <InputGroup
          style={{
            position: "fixed",
            bottom: "10px",
            width: "286px",
          }}
        >
          <InputLeftElement pointerEvents="none">
            <Icon color="gray.300" as={BsSearch} />
          </InputLeftElement>
          <Input
          as={DebounceInput}
          debounceTimeout={325}
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            placeholder="Search Friends"
          />
        </InputGroup>
      ) : (
        <InputGroup
          style={{
            position: "fixed",
            marginRight: "105px",
            width: "286px",
          }}
        >
          <InputLeftElement pointerEvents="none">
            <Icon color="gray.300" as={BsSearch} />
          </InputLeftElement>
          <Input
           as={DebounceInput}
           debounceTimeout={225}
            onChange={(e) => setSearchText(e.target.value)}
            type="text"
            placeholder="Search Friends"
          />
        </InputGroup>
      )}
    </>
  );
}
