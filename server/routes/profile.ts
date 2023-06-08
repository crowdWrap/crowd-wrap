import { Router } from "express";
import { getProfileById } from "../queries/profileQueries";
const router = Router();

router.get("/", async (req, res) => {
  if (req.session.user) {
    const user = await getProfileById(Number(req.session.user));
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ user });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

router.get("/pic-request", async (req, res) => {
  if (req.session.user) {
    const user = await getProfileById(Number(req.session.user));
    res.send(user.picture);
  }
});

export default router;
