import { Router } from "express";
import { getProfileById, getProfileByUsername } from "../profileQueries";
import {
  addParticipant,
  createEvent,
  getEventById,
  getEventByLink,
  isParticipantInEvent,
  removeEvent,
  removeParticipant,
} from "../userQueries";
const router = Router();

router.post("/", async (req, res) => {
  if (req.session.user) {
    const inviteLink = crypto.randomUUID();

    await createEvent(Number(req.session.user), req.body, `${inviteLink}`);
    return res.status(200).json({ message: "complete" });
  }
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

    addParticipant(Number(user.id), Number(eventId));
    return res.status(200).json({ message: "complete" });
  }
});

router.delete("/participants/remove", async (req, res) => {
  if (req.session.user) {
    const userId = req.body.userId;
    const eventId = req.body.eventId;

    removeParticipant(Number(userId), Number(eventId));
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
    res.status(200).send(allEvents);
  }
});

router.get("/id", async (req, res) => {
  if (req.session.user) {
    const eventId: any = req.query.eventId;
    const event = await getEventById(Number(eventId));
    res.send(event);
  }
});

router.delete("/remove", async (req, res) => {
  if (req.session.user) {
    const eventId: number = Number(req.body.eventId);
    const ownerId: number = Number(req.body.ownerId);
    if (ownerId == Number(req.session.user)) {
      removeEvent(eventId);
    }
    return res.status(200).json({ message: "complete" });
  }
});

export default router;
