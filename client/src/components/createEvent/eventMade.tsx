import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";

export default function EventMade({
  title,
  description,
  moneyGoal,
  date,
  time,
  img,
}: // setTheInviteLink,
any) {
  const [inviteLink, setInviteLink] = useState<string>("");
  const handleCopy = () => {
    alert("Link copied to clipboard!");
  };

  return (
    <div className="titleFormCover">
      <h1>Invite Link:</h1>
      <p>{inviteLink}</p>
      <CopyToClipboard text={inviteLink} onCopy={handleCopy}>
        <FontAwesomeIcon icon={faCopy} size="lg" />
      </CopyToClipboard>
      <div>
        <p>invite any of your friends?</p>
      </div>
      <button>goto event</button>
      {/* navigate */}
    </div>
  );
}
