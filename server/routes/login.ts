import { Router } from "express";
import { createUser } from "../queries/userQueries";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import passport from "passport";
import { getProfileByEmail, getProfileById } from "../queries/profileQueries";

const client = new OAuth2Client(process.env.CLIENTID);
const router = Router();

router.get("/", async (req, res) => {
  if (req.session.user) {
    const user = await getProfileById(Number(req.session.user));

    return res.status(200).json({ message: "Good to go!", user });
  } else {
    return res.status(401).json({ message: "You arent logged in!" });
  }
});

router.post("/", async (req, res, next) => {
  passport.authenticate("local", (err: Error, user: any) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "This user does not exist!" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.session.user = user.id.toString();
      return res
        .status(200)
        .json({ message: `${user.username} has logged in` });
    });
  })(req, res, next);
});

router.post("/googleOauth", async (req, res, next) => {
  if (req.body.credential) {
    try {
      const token = req.body.credential;
      let payload: any;
      async function verify() {
        const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.CLIENTID,
        });
        payload = ticket.getPayload();
        const userid = payload["sub"];
      }
      verify().then(async () => {
        const email = payload.email;
        const picture = payload.picture;
        const sub = payload.sub;

        const emailExists = await getProfileByEmail(email);

        if (!emailExists) {
          return res.status(400).json({ message: "This user does not exist" });
        }

        const user: any = await getProfileByEmail(email);

        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }

          req.session.user = user.id.toString();

          return res.status(200).json({ message: `${email} has logged in` });
        });
      });
    } catch (e) {
      console.log("Login Google Oauth Error:", e);
      return res.status(401).json({ message: "Google Oauth Failed" });
    }
  } else {
    return res.status(401).json({ message: "Google Oauth Failed" });
  }
});

export default router;
