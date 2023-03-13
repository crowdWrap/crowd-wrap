import { useEffect, useState } from "react";

export default function FriendsListSearch() {
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    console.log(searchText);
  }, [searchText]);

  return (
    <input
      placeholder="Search Friend"
      type="text"
      onChange={(e) => setSearchText(e.target.value)}
    />
  );
}
