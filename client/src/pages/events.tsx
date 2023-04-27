import { useState, useEffect } from "react";
import LogoutButton from "../components/logout";
import FriendsList from "../components/friendList/friendslist";
import CreateEventButton from "../components/createEvent/createEventButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

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
  const [participantData, setParticipantData] = useState<any>([]);
  const [events, setEvents] = useState<any>([]);
  const [displayFriends, setDisplayFriends] = useState(null);
  const [accounts, setAccounts] = useState<any>([]);

  useEffect(() => {
    let loaded = true;
    (async () => {
      if (loaded) {
        setAccounts(await fetchData());
      }
    })();
    return () => {
      loaded = false;
      setAccounts([]);
    };
  }, []);

  const handleAddParticipant = (e: any) => {
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

    setDisplayFriends(null);
  };

  useEffect(() => {
    fetchEvents(setEvents);

    // console.log(events[0].participants[0]);
    // (async () => {
    //   console.log(await handleParticipants(events[0].participants[0].userId));
    // })();
    //pass something up in order to refresh the page?
    //change someone across? that would beb reakign rules lets see
  }, []);

  const handleMoney = (e: any) => {
    const match = e.moneyGoal.match(/\d+/g);
    if (match[0] && match[1]) {
      return `${match[0]}-${match[1]}`;
    } else {
      return match[0];
    }
  };

  const handleProgress = (e: any) => {
    const match = e.moneyGoal.match(/\d+/g);
    return match[0];
  };

  const handleParticipants = async (e: any) => {
    const existingParticipant = participantData.find(
      (p: any) => p.id === e.userId
    );
    if (existingParticipant) {
      return existingParticipant.pic;
    }

    const response: Response = await fetch(
      `/events/participants?participantId=${await e.userId}`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    const newParticipantData = [
      ...participantData,
      { pic: data.pic, id: e.userId, name: data.name },
    ];
    setParticipantData(newParticipantData);

    return data.pic;
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
        <CreateEventButton />
        <FriendsList />
        <LogoutButton />
      </nav>
      <h1>Welcome to the events page</h1>
      <p>Logged in</p>
      <div className="eventsCover">
        {events &&
          events.map((e: any) => (
            <div className="event" key={e.id}>
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
                    handleParticipants(val);
                    // console.log(val);

                    return participantData.map((newVal: any) => {
                      if (newVal.id === val.userId) {
                        return (
                          <img key={newVal.id} src={`${newVal.pic}`} alt="" />
                        );
                      }
                    });

                    //what we are going to do now is to make sure that the participants display actually works, we do this by making the frontend first(bootleg)
                    //when they press plus bring up a list of their friends that they can invite, have to make sure they arent already in the event
                    //then make the route of adding them, and once they press invite refresh the component and add their picture
                  })}
                <FontAwesomeIcon
                  onClick={() => handleAddParticipant(e)}
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
                            //have it refresh when u add a new participant
                            //cleanup functions and split up into components
                          />
                        </div>
                      ))}
                </div>
              </div>

              {/* <div className="eventCurrentFunds">{`CurrentFunds: ${e.Currentfunds}`}</div> */}
              {/* <div>{`InviteLink: ${e.inviteLink}`}</div> */}
              {/* <div className="eventMoneyGoal">{`MoneyGoal: ${e.moneyGoal}`}</div> */}
              {/* <div className="eventDate">{`deadlineTime: ${
                e.deadlineTime === null ? "No Time" : e.deadlineTime
              }`}</div> */}
            </div>
          ))}
      </div>
    </div>
  );
}
