import { useState, useEffect } from "react";
import LogoutButton from "../components/logout/logout";
import FriendsList from "../components/friendList/friendslist";
import CreateEventButton from "../components/createEvent/createEventButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faX } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

async function fetchData() {
  try {
    const response = await fetch(`/friends`, {
      method: "GET",
    });
    const result = await response.json();

    return result;
  } catch (error: any) {
    throw new Error(error);
  }
}

async function fetchEvents(setEvents: any) {
  const response: Response = await fetch("/events/retrieve", {
    method: "GET",
  });

  const receivedData = await response.json();
  await setEvents(receivedData);
}

export default function Events() {
  const [events, setEvents] = useState<any>([]);
  const [displayFriends, setDisplayFriends] = useState(null);
  const [accounts, setAccounts] = useState<any>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    let loaded = true;
    (async () => {
      if (loaded) {
        fetchEvents(setEvents);
        setAccounts(await fetchData());
      }
      if (refresh) {
        fetchEvents(setEvents);
        setRefresh(false);
      }
    })();
    return () => {
      loaded = false;
      setAccounts([]);
    };
  }, [refresh]);

  const handleAddParticipant = (e: any, event: any) => {
    event.stopPropagation();
    if (e.id !== displayFriends) {
      setDisplayFriends(e.id);
    } else {
      setDisplayFriends(null);
    }
  };

  const handleInvite = async (item: any, e: any) => {
    const response: Response = await fetch(
      `/events/participants/add?username=${await item.username}&eventId=${await e.id}`,
      {
        method: "GET",
      }
    );

    setRefresh(true);
    setDisplayFriends(null);
  };

  const removeEvent = async (e: any, event: any) => {
    event.stopPropagation();
    await fetch(`/events/remove?eventId=${e.id}&ownerId=${e.ownerId}`, {
      method: "GET",
    });

    setRefresh(true);
  };

  const handleMoney = (e: any) => {
    const match = e.moneyGoal.match(/\d+/g);
    if (match[0] && match[1]) {
      return `${match[0]}-${match[1]}`;
    } else {
      return match[0];
    }
  };

  const navigateEvent = (e: any) => {
    navigate(`/events/${e.title}-${e.id}`);
  };

  const handleProgress = (e: any) => {
    const match = e.moneyGoal.match(/\d+/g);
    return match[0];
  };

  const handleDate = (e: any) => {
    const dateObj = new Date(e.deadlineDate);
    const options: object = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = dateObj.toLocaleDateString("en-US", options);
    return formattedDate;
  };
  return (
    <div className="eventsPage">
      <nav className="loggedInNavbar">
        <CreateEventButton setRefresh={(val: any) => setRefresh(val)} />
        <FriendsList />
        <LogoutButton />
      </nav>
      <h1>Welcome to the events page</h1>
      <p>Logged in</p>
      <div className="eventsCover">
        {events &&
          events.map((e: any) => (
            <div className="event" key={e.id} onClick={() => navigateEvent(e)}>
              <div className="eventDate">{`${
                e.deadlineDate === null ? "No Deadline" : handleDate(e)
              }`}</div>
              <h1 className="eventTitle">{e.title}</h1>
              <p className="eventDesc">{e.description}</p>
              <div className="eventImg">{`${e.image}`}</div>
              <div className="eventProgressWrap">
                <h4>Progress:</h4>
                <div className="eventProgressBar">
                  <div
                    style={{
                      width: `${(e.Currentfunds / handleProgress(e)) * 100}%`,
                    }}
                    className="eventProgress"
                  ></div>
                </div>

                <h4>${handleMoney(e) === "100" ? "100+" : handleMoney(e)}</h4>
              </div>
              <div className="eventParticipants">
                {events &&
                  e.participants.map((val: any) => {
                    return <img key={val.id} src={`${val.picture}`} alt="" />;
                  })}
                <FontAwesomeIcon
                  onClick={(event) => handleAddParticipant(e, event)}
                  className="addParticipant"
                  icon={faPlus}
                />
                <div className="inviteeCover">
                  {displayFriends === e.id &&
                    accounts &&
                    accounts
                      .filter((valu: any) => {
                        const hasMatchingUser = e.participants.some(
                          (user: any) => user.userId === valu.userId
                        );
                        return !hasMatchingUser ? valu : null;
                      })
                      .map((item: any, index: any) => (
                        <div className="invitee" key={item.username}>
                          <img alt="" src={item.profilePic} />
                          <p>{item.username}</p>
                          <FontAwesomeIcon
                            className="addParticipant"
                            onClick={() => handleInvite(item, e)}
                            icon={faPlus}
                          />
                        </div>
                      ))}
                </div>
              </div>

              {/* only if they are host provide the delete button, otherwise allow them to leave. */}
              {/* inner page   */}

              <div className="eventCurrentFunds">{`CurrentFunds: ${e.Currentfunds}`}</div>
              {/* <div>{`InviteLink: ${e.inviteLink}`}</div> */}
              {/* <div className="eventMoneyGoal">{`MoneyGoal: ${e.moneyGoal}`}</div> */}
              {/* <div className="eventDate">{`deadlineTime: ${
                e.deadlineTime === null ? "No Time" : e.deadlineTime
              }`}</div> */}
              <FontAwesomeIcon
                icon={faX}
                onClick={(event) => removeEvent(e, event)}
                className="removeParticipant"
              />
            </div>
          ))}
      </div>
    </div>
  );
}
