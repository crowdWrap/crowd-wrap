import { Router } from "express";
import {
  getPaymentTypeById,
  updatePaymentTypeById,
} from "../queries/paymentQueries";
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

export default router;
