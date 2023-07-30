import { useEffect, useState } from "react";
import {  useLocation, useNavigate, useParams } from "react-router-dom";

import { Button, useToast } from "@chakra-ui/react";
import SingularEvent from "../components/events/singularEvent";
import { socket } from "../api/socket";
import LoginAndSignupPage from "../components/loginAndSignup/LoginAndSignupPage";

export default function EventInvite() {
  const navigate = useNavigate();
  const { link } = useParams();
  const [inviteStatus, setInviteStatus] = useState("");
  const [buttonStatus, setButtonStatus] = useState("");
  const [event, setEvent] = useState<any>();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  let location = useLocation();
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response: Response = await fetch(`/events/invite/${link}`, {
          method: "GET",
        });

        const responded: any = await response.json();

        if (responded.invalidInvite) {
          setInviteStatus("Invalid Invite!");
          setButtonStatus("😞");
        } else {
          if (responded.notLoggedIn) {
            setInviteStatus("Please log in to join!");
            setButtonStatus("Log in");
            setEvent(responded.event);
          } else {
            if (responded.inEvent) {
              setInviteStatus(
                "You have been invited to an event you're already in!"
              );
              setButtonStatus("Go to event");
              setEvent(responded.event);
            } else {
              setInviteStatus("");
              setButtonStatus("Join");
              setEvent(responded.event);
            }
          }
        }
        setLoading(false);
      } catch (e) {
        console.log("invite error:" + e);
      }
    })();
    socket.on("eventUpdate", (data) => {
      if (data.message !== "") {
        toast({
          title: "Event Notification.",
          description: `${data.message}.`,
          status: data.stats as
            | "info"
            | "warning"
            | "success"
            | "error"
            | "loading",
          duration: 4000,
        });
      }
    });

    return () => {
      socket.off("eventUpdate");
    };
  }, [link, toast]);

  const handleButton = async () => {
    if (buttonStatus === "Log in"){
      sessionStorage.setItem("loginState", JSON.stringify({ from: location }));
      navigate("/login");
     }
    if (event) {
      if (buttonStatus === "Join") {
        await fetch(`/events/invite/${link}`, {
          method: "POST",
        });
        navigate(`/events/${event.title}-${event.id}`);
      } else if (buttonStatus === "Go to event") {
        navigate(`/events/${event.title}-${event.id}`);
      } 
    }
  };

  return (
    <>
      {!loading && (
            <LoginAndSignupPage
            // handleSubmit={handleSubmit}
            headingText={"You've been invited to an event!"}
            regText={inviteStatus}
            full={true}
          >
            {event && (
              <SingularEvent
                e={event}
                inviteLink={`http://localhost:3000/events/invite/${link}`}
                events={event}
                variant="none"
                width={["xs","sm","sm","sm","sm", "md"]}
                marginTop='15px'
                // ml={["-15px",'0px']}
              />
            )}
            <Button onClick={handleButton} size="lg" colorScheme="pink">
              {buttonStatus}
            </Button>
    
        </LoginAndSignupPage>
      )}
    </>
  );
}
