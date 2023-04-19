import { useState, useEffect } from "react";
import LogoutButton from "../components/logout";
import FriendsList from "../components/friendList/friendslist";
import CreateEventButton from "../components/createEvent/createEventButton";

async function fetchEvents(setEvents: any) {
  const response: Response = await fetch("/events/retrieve", {
    method: "GET",
  });

  const receivedData = await response.json();
  await setEvents(receivedData);
}

export default function Events() {
  const [events, setEvents] = useState<any>([]);
  useEffect(() => {
    fetchEvents(setEvents);
    // console.log(events);
    //pass something up in order to refresh the page?
    //change someone across? that would beb reakign rules lets see
  }, []);
  return (
    <div className="eventsPage">
      <nav className="loggedInNavbar">
        <CreateEventButton />
        <FriendsList />
        <LogoutButton />
      </nav>
      <h1>Welcome to the events page</h1>
      <p>Logged in</p>
      <div className="eventsCover">
        {events &&
          events.map((e: any) => (
            <div className="event">
              <div>{`Title: ${e.title}`}</div>
              <div>{`Description: ${e.description}`}</div>
              <div>{`Image: ${e.image}`}</div>
              <div>{`CurrentFunds: ${e.Currentfunds}`}</div>
              <div>{`InviteLink: ${e.inviteLink}`}</div>
              <div>{`MoneyGoal: ${e.moneyGoal}`}</div>
              <div>{`deadLineDate: ${
                e.deadlineDate === null ? "No Date" : e.deadlineDate
              }`}</div>
              <div>{`deadlineTime: ${
                e.deadlineTime === null ? "No Time" : e.deadlineTime
              }`}</div>
            </div>
          ))}
      </div>
    </div>
  );
}
