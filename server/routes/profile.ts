import { Router } from "express";
import {
  getProfileById,
  getProfileByUsername,
} from "../queries/profileQueries";
import { updateUserName } from "../queries/userQueries";
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

router.get("/setUsername", async (req, res) => {
  const username = req.body.username;
  const usernameExists = await getProfileByUsername(username);

  if (usernameExists) {
    return res.status(400).json({ message: "user exists" });
  }
});

router.post("/setUsername", async (req, res) => {
  if (req.session.user) {
    const user = await getProfileById(Number(req.session.user));
    res.setHeader("Content-Type", "application/json");

    const usernameExists = await getProfileByUsername(req.body.username);
    if (usernameExists) {
      return res.status(400).json({ message: "user exists" });
    }

    updateUserName(user.email, req.body.username);

    return res.status(200).json({ message: "complete" });
  } else {
    console.log("not");
    return res.status(401).json({ message: "not authorized" });
  }
});

export default router;
