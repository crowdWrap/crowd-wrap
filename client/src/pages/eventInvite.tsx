import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EventInvite() {
  const navigate = useNavigate();
  const { link } = useParams();
  useEffect(() => {
    (async () => {
      try {
        const response: Response = await fetch(`/events/invite/${link}`, {
          method: "GET",
        });

        const responded: any = await response.json();

        if (responded.invalidInvite) {
          console.log("invalid invite");
        } else {
          if (responded.notLoggedIn) {
            console.log("not logged in");
          } else {
            if (responded.inEvent) {
              console.log("in event");
            } else {
              console.log("not in event");
            }
          }
        }
      } catch (e) {
        console.log("invite error:" + e);
      }
    })();
  });
  return (
    <div>
      <h1>You have been invited to join </h1>
    </div>
  );
}
