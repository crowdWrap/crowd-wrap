import { Icon, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { BsSearch } from "react-icons/bs";

async function fetchData(searchText: string) {
  if (searchText.length >= 3) {
    const response = await fetch(
      `/friendsListSearch?user_search=${searchText}`,
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

export default function FriendsListSearch({ updateData }: any) {
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    async function fetchAndUpdate() {
      const data = await fetchData(searchText);
      await updateData(data);
    }
    fetchAndUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <InputGroup style={{ position: "fixed", bottom: "10px", width: "286px" }}>
      <InputLeftElement pointerEvents="none">
        <Icon color="gray.300" as={BsSearch} />
      </InputLeftElement>
      <Input
        fontFamily={"Roboto, sans-serif"}
        onChange={(e) => setSearchText(e.target.value)}
        type="text"
        placeholder="Search Friends"
      />
    </InputGroup>
  );
}
