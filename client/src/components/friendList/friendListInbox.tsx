import { useState } from "react";
import FriendListInboxReceived from "./friendListInboxReceived";
import FriendListInboxSent from "./friendListInboxSent";

export default function FriendListInbox() {
  const [selectedButton, setSelectedButton] = useState("received");

  const handleButtonClick = (input: any) => {
    setSelectedButton(input);
  };

  return (
    <>
      <div className="friendListInboxTitle">
        <button
          onClick={() => handleButtonClick("received")}
          className={selectedButton === "received" ? "selected" : ""}
        >
          Received
        </button>
        <button
          onClick={() => handleButtonClick("sent")}
          className={selectedButton === "sent" ? "selected" : ""}
        >
          Sent
        </button>
      </div>
      {selectedButton === "received" && <FriendListInboxReceived />}
      {selectedButton === "sent" && <FriendListInboxSent />}
    </>
  );
}
