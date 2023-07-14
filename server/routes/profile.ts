import { Router } from "express";
import {
  getProfileByEmail,
  getProfileById,
  getProfileByUsername,
} from "../queries/profileQueries";
import {
  updateEventToUserUsername,
  updateUserName,
  updateUserPassword,
  updateUserUsernameSet,
} from "../queries/userQueries";
const router = Router();
import bcrypt from "bcryptjs";

router.get("/", async (req:any, res:any) => {
  if (req.session.user) {
    const user = await getProfileById(Number(req.session.user));
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ user });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

router.get("/setUsername", async (req:any, res:any) => {
  if (req.session.user) {
    const username: any = req.query.username;
    const usernameExists = await getProfileByUsername(username);

    if (usernameExists) {
      return res.status(400).json({ isValid: false });
    } else {
      return res.status(200).json({ isValid: true });
    }
  }
});

router.post("/setUsername", async (req:any, res:any) => {
  if (req.session.user) {
    const user = await getProfileById(Number(req.session.user));
    res.setHeader("Content-Type", "application/json");

    const usernameExists = await getProfileByUsername(req.body.username);
    if (usernameExists) {
      return res.status(400).json({ message: "This username is taken!" });
    }

    if (
      !req.body.username ||
      req.body.username.length < 3 ||
      req.body.username.length > 15
    ) {
      return res.status(400).json({ message: "Invalid fields" });
    }

    const newUser = await updateUserName(user.email, req.body.username);
    await updateEventToUserUsername(
      Number(req.session.user),
      req.body.username
    );
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

router.post("/password/update", async (req:any, res:any, next:any) => {
  if (req.session.user) {
    const oldPassword: string = req.body.oldPassword;
    const newPassword: string = req.body.newPassword;
    const tempUser = await getProfileById(Number(req.session.user));
    const user: any = await getProfileByEmail(tempUser.email);
    if (user) {
      bcrypt.compare(
        String(oldPassword),
        user.password,
        async (err, result) => {
          if (err) {
            throw new Error(String(err));
          } else if (result) {
            if (
              !newPassword ||
              newPassword.length < 8 ||
              newPassword.length > 20
            ) {
              return res.status(400).json({ message: "Invalid fields" });
            }

            const hashedPass = await bcrypt.hash(newPassword, 10);

            const updatedUser = await updateUserPassword(
              Number(req.session.user),
              hashedPass
            );
            return res.status(200).json({ message: "Password Changed!" });
          } else {
            return res
              .status(400)
              .json({ message: "Old password does not match!" });
          }
        }
      );
    } else {
      return res.status(401).json({ message: "Error" });
    }
  }
});

export default router;
