import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { SHA256 } from "crypto-js";

function createInvite(
  title: string,
  description: string,
  moneyGoal: string,
  date: string,
  time: string,
  img: string
) {
  const eventString = `${title}${description}${moneyGoal}${date}${time}${img}`;
  const hash = SHA256(eventString).toString();
  return `http://localhost:3000/events/${hash}`;
}

export default function EventMade({
  title,
  description,
  moneyGoal,
  date,
  time,
  img,
}: any) {
  const [inviteLink, setInviteLink] = useState<string>("");
  const handleCopy = () => {
    alert("Link copied to clipboard!");
  };

  useEffect(() => {
    const link = createInvite(title, description, moneyGoal, date, time, img);
    setInviteLink(link);
  }, []);

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
    </div>
  );
}
