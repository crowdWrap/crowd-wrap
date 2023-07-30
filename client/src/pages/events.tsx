import { useState, useEffect } from "react";
import React from "react";

import { Flex, useDisclosure, useToast } from "@chakra-ui/react";
import { useAuth } from "../hooks/authContext";
import RemoveEventDialog from "../components/events/alertDialog";
import AddFriendToEvent from "../components/events/addFriend";
import { socket } from "../../src/api/socket";
import SingularEvent from "../components/events/singularEvent";

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
  const [accounts, setAccounts] = useState<any>([]);

  const toast = useToast();
  const [selectedEvent, setSelectedEvent] = useState<string>("");

  const [inviteLoading, setInviteLoading] = useState<any>(null);

  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();
  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  const { refreshEvent, setRefreshEvent } = useAuth();

  useEffect(() => {
    let loaded = true;
    (async () => {
      if (loaded) {
        fetchEvents(setEvents);
        setAccounts(await fetchData());
      }
      if (refreshEvent) {
        fetchEvents(setEvents);
        setAccounts(await fetchData());
        setRefreshEvent(false);
        setInviteLoading(null);
      }
    })();
    return () => {
      loaded = false;
      // setAccounts([]);
    };
  }, [refreshEvent, setRefreshEvent]);

  useEffect(() => {
    socket.on("eventUpdate", (data) => {
      setRefreshEvent(true);
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
  }, [setRefreshEvent, toast]);

  return (
    <Flex
    justifyContent={'center'}
    >
      
    <Flex
      // bg={'black'} 
      // maxWidth='95%'
      // padding="9px"
      
      justifyContent="center"
      paddingTop="70px"
      gap="35px"
      flexWrap="wrap"
    >
      {events &&
        events.map((e: any) => (
          <React.Fragment key={e.id}>
            <SingularEvent
              e={e}
              events={events}
              setSelectedEvent={setSelectedEvent}
              onOpen1={onOpen1}
              onOpen2={onOpen2}
              needMenu={true}
            />

            {selectedEvent === e.id && accounts && (
              <AddFriendToEvent
                isOpen2={isOpen2}
                e={e}
                onClose2={onClose2}
                accounts={accounts}
                setSelectedEvent={(val: string) => setSelectedEvent(val)}
                setInviteLoading={setInviteLoading}
                inviteLoading={inviteLoading}
              />
            )}

            {selectedEvent === e.id && (
              <RemoveEventDialog
                e={e}
                onClose1={onClose1}
                isOpen1={isOpen1}
                setSelectedEvent={(val: string) => setSelectedEvent(val)}
              />
            )}
          </React.Fragment>
        ))}
    </Flex>

    </Flex>
  );
}
