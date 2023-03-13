import { useEffect, useState } from "react";
import FriendListInboxReceived from "./friendListInboxReceived";
import FriendListInboxSent from "./friendListInboxSent";

export default function FriendListAdd() {
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    console.log(searchText);
  }, [searchText]);

  return (
    <div className="friendListCover">
      <input
        placeholder="Search Friend"
        type="text"
        onChange={(e) => setSearchText(e.target.value)}
      />
    </div>
  );
}
