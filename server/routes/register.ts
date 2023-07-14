import { Router } from "express";
import { createUser, updateUser, updateUserName } from "../queries/userQueries";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import {
  getProfileByEmail,
  getProfileByUsername,
} from "../queries/profileQueries";

const client = new OAuth2Client(process.env.CLIENTID);
const router = Router();

router.post("/", async (req:any, res:any) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    } else if (
      password.length < 8 ||
      password.length > 20 ||
      username.length < 3 ||
      username.length > 15 ||
      !email.includes("@")
    ) {
      return res.status(400).json({ message: "Invalid fields" });
    }

    //makes sure that the user doesnt exist
    const emailExists = await getProfileByEmail(email);
    const usernameExists = await getProfileByUsername(username);

    if (emailExists || usernameExists) {
      return res
        .status(400)
        .json({ message: "This user exists, please login!" });
    }

    //then continues normal process
    const hashedPass = await bcrypt.hash(password, 10);

    //Create user and send to DB
    createUser(username, email, hashedPass, "local", true);
    return res.status(201).json({ message: `${username} has been created` });
  } catch (e) {
    console.log("Registration Error:", e);
    return res.status(401).json({ message: "Registration Failed" });
  }
});

router.post("/googleOauth", async (req:any, res:any) => {
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
      verify()
        .then(async () => {
          const email = payload.email;
          const picture = payload.picture;
          const userData = payload.sub;
          const emailExists = await getProfileByEmail(email);

          if (emailExists) {
            return res
              .status(400)
              .json({ message: "This user exists, please login!" });
          }

          createUser(userData, email, "", "google", false);
          if (picture) {
            updateUser(email, picture);
          }
          return res.status(200).json({ message: `${email} has been created` });
        })
        .catch((e) => console.log("GoogleOauth error:", e));
    } catch (e) {
      console.log("GoogleOauth error:", e);
      return res.status(401).json({ message: "Google Oauth Failed" });
    }
  } else {
    return res.status(401).json({ message: "Google Oauth Failed" });
  }
});

export default router;
