import { Router } from "express";
import {
  getProfileById,
  getProfileByUsername,
} from "../queries/profileQueries";
import { updateUserName, updateUserUsernameSet } from "../queries/userQueries";
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
  const username: any = req.query.username;
  const usernameExists = await getProfileByUsername(username);

  if (usernameExists) {
    return res.status(400).json({ isValid: false });
  } else {
    return res.status(200).json({ isValid: true });
  }
});

router.post("/setUsername", async (req, res) => {
  if (req.session.user) {
    const user = await getProfileById(Number(req.session.user));
    res.setHeader("Content-Type", "application/json");

    const usernameExists = await getProfileByUsername(req.body.username);
    if (usernameExists) {
      return res.status(400).json({ message: "This username is taken!" });
    }

    const newUser = await updateUserName(user.email, req.body.username);
    const newestUser = await updateUserUsernameSet(newUser.id, true);
    return res.status(200).json({
      message: `Your username has been set to ${req.body.username}!`,
      user: newestUser,
    });
  } else {
    console.log("not");
    return res.status(401).json({ message: "Not authorized" });
  }
});

export default router;
