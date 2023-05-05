import { useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

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
  const [id, setId] = useState<any>();
  const navigate = useNavigate();
  const [event, setEvent] = useState();
  const handleCopy = () => {
    alert("Link copied to clipboard!");
  };

  useEffect(() => {
    const fetchData = async () => {
      const response: Response = await fetch("/events/retrieve", {
        method: "GET",
      });

      const receivedData = await response.json();
      console.log(receivedData[receivedData.length - 1]);
      setId(receivedData[receivedData.length - 1].id);
    };
    fetchData();
  }, [title]);

  //for some reason its using the value from the previous render, unless u refresh the component

  const navigateEvent = () => {
    navigate(`/events/${title}-${id}`);
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
      <button onClick={() => navigateEvent()}>goto event</button>
      {/* navigate */}
    </div>
  );
}
