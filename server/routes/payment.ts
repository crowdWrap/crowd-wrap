import { Router } from "express";
import {
  getPaymentTypeById,
  updatePaymentTypeById,
} from "../queries/paymentQueries";
import { getProfileById } from "../queries/profileQueries";
import { getEventById, updateEventCurrentFunds } from "../queries/eventQueries";
import { updateUserCurrentFunds } from "../queries/userQueries";
const router = Router();

router.post("/update", async (req, res) => {
  const paymentType: string = req.body.paymentType;
  const user = await updatePaymentTypeById(
    Number(req.session.user),
    paymentType
  );
  return res.status(200).json({ user });
});

router.get("/update", async (req, res) => {
  const userId: number = Number(req.query.userId);
  const paymentType = await getPaymentTypeById(userId);
  return res.status(200).json({ paymentType });
});

router.post("paid", async (req, res) => {
  if (req.session.user) {
    const userId = req.body.userId;
    const user = await getProfileById(Number(userId));
    const eventId = req.body.eventId;
    const theEvent: any = await getEventById(eventId);
    const amountPaid = req.body.amountPaid;

    updateUserCurrentFunds(Number(eventId), Number(userId), Number(amountPaid));
    updateEventCurrentFunds(Number(eventId), Number(amountPaid));
    // eventsNotification(
    //   theEvent.participants,
    //   `${user.username} has left "${theEvent.title}"`,
    //   "error"
    // );
    return res.status(200).json({ message: "complete" });
  }
});

export default router;
