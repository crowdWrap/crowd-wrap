import { useEffect, useState } from "react";

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
    <div id="search">
      <input
        type="text"
        id="searchfield"
        placeholder="Search friends"
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
}
