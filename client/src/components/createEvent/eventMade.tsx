import { useEffect, useState } from "react";
import { useClipboard, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function EventMade({
  title,
  description,
  moneyGoal,
  date,
  time,
  img,
  loading,
  setLoading,
}: // setTheInviteLink,
any) {
  const [inviteLink, setInviteLink] = useState<string>("Loading...");
  const { onCopy, hasCopied } = useClipboard(inviteLink);
  const [theId, setTheId] = useState<any>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response: Response = await fetch("/events/retrieve", {
        method: "GET",
      });

      const receivedData = await response.json();
      setInviteLink(
        `http://localhost:3000/events/invite/${
          receivedData[receivedData.length - 1].inviteLink
        }`
      );
      setTheId(receivedData[receivedData.length - 1].id);
      setLoading(false);
    };
    fetchData();
  }, [loading]);

  const navigateEvent = () => {
    navigate(`/events/${title}-${theId}`);
  };

  return (
    <div className="titleFormCover">
      <h1>Invite Link:</h1>
      <p>{inviteLink}</p>

      <Button id="copyButton" onClick={onCopy}>
        {hasCopied ? "Copied!" : "Copy"}
      </Button>

      <div>
        <p>invite any of your friends?</p>
      </div>
      <button onClick={() => navigateEvent()}>goto event</button>
    </div>
  );
}
