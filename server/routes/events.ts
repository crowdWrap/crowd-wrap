import { Router } from "express";
import {
  getProfileById,
  getProfileByUsername,
} from "../queries/profileQueries";

import { io } from "../index";
import crypto from "crypto";
import { stripe } from "../index";
import { onlineUsers } from "../index";
import {
  createEvent,
  getEventByLink,
  isParticipantInEvent,
  addParticipant,
  getEventById,
  removeParticipant,
  removeEvent,
} from "../queries/eventQueries";
import {
  createMessage,
  getMessagesById,
  removeMessages,
} from "../queries/messageQueries";
import { updateStripeId } from "../queries/userQueries";
const router = Router();

// Same problem as friendList
async function eventsNotification(userIds: any, message: any, stats: any) {
  if (userIds) {
    userIds
      .filter((user: any) => {
        return (
          onlineUsers[user.userId] && onlineUsers[user.userId][1] == "online"
        );
      })
      .map((filteredUsers: any) => {
        io.to(onlineUsers[filteredUsers.userId][0]).emit("eventUpdate", {
          message,
          stats,
        });
      });
    // else send an email
  }
}

async function individalPersonEventNotification(userToSend: any, message: any) {
  if (userToSend) {
    if (
      onlineUsers[userToSend.id] &&
      onlineUsers[userToSend.id][1] == "online"
    ) {
      io.to(onlineUsers[userToSend.id][0]).emit("eventUpdate", {
        message,
      });
    } else {
      console.log("theyre offline");
    }
    // else send an email
  }
}

router.post("/", async (req, res) => {
  if (req.session.user) {
    const inviteLink = crypto.randomUUID();

    await createEvent(Number(req.session.user), req.body, `${inviteLink}`);
    return res.status(200).json({ message: "complete" });
  }
});

router.post("/stripe", async (req, res) => {
  const account = await stripe.accounts.create({
    type: "express",
  });

  updateStripeId(Number(req.session.user), account.id);

  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: "https://example.com/reauth",
    return_url: "https://example.com/return",
    type: "account_onboarding",
  });
});

router.get("/invite/:link", async (req, res) => {
  if (req.session.user) {
    const link = req.params.link;
    const theEvent: any = await getEventByLink(link);
    if (theEvent) {
      const eventId = theEvent.id;
      const userId = Number(req.session.user);
      const inEvent = await isParticipantInEvent(userId, Number(eventId));
      if (!inEvent) {
        addParticipant(userId, Number(eventId));
        return res.status(200).json({ inEvent: false });
      } else {
        return res.status(200).json({ inEvent: true });
      }
    } else {
      return res.status(404).json({ invalidInvite: true });
    }
  } else {
    return res.status(404).json({ notLoggedIn: true });
  }
});

router.post("/participants/add", async (req, res) => {
  if (req.session.user) {
    const username: string = req.body.username;
    const user: any = await getProfileByUsername(username);
    const eventId: number = req.body.eventId;
    const theEvent: any = await getEventById(eventId);

    if (theEvent.participants.length < 10) {
      addParticipant(Number(user.id), Number(eventId));
      eventsNotification(
        theEvent.participants,
        `${username} has been added to "${theEvent.title}"`,
        "success"
      );
      individalPersonEventNotification(
        user,
        `You have been added to "${theEvent.title}"`
      );
    } else {
      eventsNotification(
        theEvent.participants,
        `Maximum number of participants reached"`,
        "error"
      );
    }
    return res.status(200).json({ message: "complete" });
  }
});

router.delete("/participants/remove", async (req, res) => {
  if (req.session.user) {
    const userId = req.body.userId;
    const user = await getProfileById(Number(userId));
    const eventId = req.body.eventId;
    const theEvent: any = await getEventById(eventId);

    removeParticipant(Number(userId), Number(eventId));
    eventsNotification(
      theEvent.participants,
      `${user.username} has left "${theEvent.title}"`,
      "error"
    );
    return res.status(200).json({ message: "complete" });
  }
});

router.get("/retrieve", async (req, res) => {
  if (req.session.user) {
    const user = await getProfileById(Number(req.session.user));
    const allEvents = await Promise.all(
      user.events.map(async (e) => {
        return await getEventById(e.eventId);
      })
    );
    return res.status(200).send(allEvents);
  }
});

router.get("/id", async (req, res) => {
  if (req.session.user) {
    const eventId: any = req.query.eventId;
    const event = await getEventById(Number(eventId));
    if (event) {
      console.log("hi");
      return res.status(200).json({ event });
    } else {
      console.log("bye");
      return res.status(404).json({ event: null });
    }
  }
});

router.delete("/remove", async (req, res) => {
  if (req.session.user) {
    const eventId: number = Number(req.body.eventId);
    const ownerId: number = Number(req.body.ownerId);
    const theEvent: any = await getEventById(eventId);

    if (ownerId == Number(req.session.user)) {
      removeMessages(eventId);
      removeEvent(eventId);

      eventsNotification(
        theEvent.participants,
        `"${theEvent.title}" has been deleted`,
        "error"
      );
    }
    return res.status(200).json({ message: "complete" });
  }
});

router.get("/:eventId/messages", async (req, res) => {
  const eventId = Number(req.params.eventId);
  const messages = await getMessagesById(eventId);
  return res.status(200).json({ messages });
});

router.post("/:eventId/messages", async (req, res) => {
  const eventId = Number(req.params.eventId);
  const userId = Number(req.session.user);
  const content = req.body.content;
  const user = await getProfileById(userId);
  const theEvent: any = await getEventById(eventId);
  const newMessage = await createMessage(userId, eventId, content);
  const messageWithPicture = {
    ...newMessage,
    picture: user.picture,
  };
  if (theEvent.participants) {
    theEvent.participants
      .filter((user: any) => {
        return (
          onlineUsers[user.userId] && onlineUsers[user.userId][1] == "online"
        );
      })
      .map((filteredUsers: any) => {
        io.to(onlineUsers[filteredUsers.userId][0]).emit("sendMsg");
      });
  }
  return res.status(200).json({ messageWithPicture });
});

export default router;
