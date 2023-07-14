import { Router } from "express";
import {
  getPaymentTypeById,
  updatePaymentTypeById,
} from "../queries/paymentQueries";
import { getProfileById } from "../queries/profileQueries";
import { getEventById, updateEventCurrentFunds } from "../queries/eventQueries";
import { updateUserCurrentFunds } from "../queries/userQueries";
const router = Router();
import { onlineUsers } from "../index";
import { io } from "../index";

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

router.post("/update", async (req:any, res:any) => {
  const paymentType: string = req.body.paymentType;
  const user = await updatePaymentTypeById(
    Number(req.session.user),
    paymentType
  );
  return res.status(200).json({ user });
});

router.get("/update", async (req:any, res:any) => {
  const userId: number = Number(req.query.userId);
  const paymentType = await getPaymentTypeById(userId);
  return res.status(200).json({ paymentType });
});

router.post("/complete", async (req:any, res:any) => {
  if (req.session.user) {
    const userId = req.body.userId;
    const user = await getProfileById(Number(userId));
    const eventId = req.body.eventId;
    const theEvent: any = await getEventById(eventId);
    const amountPaid = req.body.amountPaid;

    updateUserCurrentFunds(Number(eventId), Number(userId), Number(amountPaid));
    updateEventCurrentFunds(Number(eventId), Number(amountPaid));
    eventsNotification(
      theEvent.participants,
      `${user.username} has paid $${amountPaid}!!"`,
      "success"
    );
    // could add confetti
    return res.status(200).json({ message: "complete" });
  }
});

export default router;
