import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreateEventButton from "../createEvent/createEventButton";
import FriendsList from "../friendList/friendslist";
import LogoutButton from "../logout";
import "./innerEvents.css";

export default function TheEvent() {
  const { id } = useParams();
  const dashIndex: any = id?.lastIndexOf("-");
  const eventId = id?.substring(dashIndex + 1);
  const title = id?.substring(0, dashIndex);
  const [events, setEvents] = useState<any>([]);

  useEffect(() => {
    const fetchEvent = async () => {
      const response = await fetch(`/events/id?eventId=${eventId}`, {
        method: "GET",
      });

      const data = await response.json();
      return data;
    };

    (async () => {
      setEvents(await fetchEvent());
    })();
  }, [eventId]);

  console.log(events);
  const handleDate = () => {
    const dateObj = new Date(events.deadlineDate);
    const options: object = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = dateObj.toLocaleDateString("en-US", options);
    return formattedDate;
  };

  const handleProgress = () => {
    const match = events.moneyGoal.match(/\d+/g);
    return match[0];
  };

  const handleMoney = () => {
    const match = events.moneyGoal.match(/\d+/g);
    if (match[0] && match[1]) {
      return `${match[0]}-${match[1]}`;
    } else {
      return match[0];
    }
  };

  return (
    <div className="innerEvent">
      <nav className="loggedInNavbar">
        <CreateEventButton />
        <FriendsList />
        <LogoutButton />
      </nav>
      <div className="theEvent">
        {events && (
          <>
            <div className="innerTitleWrap">
              <div className="innerData">{`${
                events.deadlineDate === null ? "No Deadline" : handleDate()
              }`}</div>
              <p className="innerDesc">{events.description}</p>
              <div className="innerImgWrap">
                <h1 className="innerTitle">{events.title}</h1>
                <div className="innerImg">{`${events.image}`}</div>
              </div>
              <div className="innerFunds">{`CurrentFunds: ${events.Currentfunds}`}</div>
              <h4>
                Goal: $
                {events.moneyGoal &&
                  (handleMoney() === "100" ? "100+" : handleMoney())}
              </h4>
            </div>

            <div className="innerParticipants">
              {events.participants &&
                events.participants.map((val: any) => {
                  return (
                    <>
                      <img key={val.id} src={`${val.picture}`} alt="" />
                      <h4>Current Spent: {val.currentMoney}</h4>
                    </>
                  );
                })}
            </div>

            {/* <div>{`InviteLink: ${events.inviteLink}`}</div> */}
          </>
        )}
      </div>
    </div>
  );
}
