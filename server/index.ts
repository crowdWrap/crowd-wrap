import express from "express";
import morgan from "morgan";
import { router } from "./routes/engineers";
import { createUser } from "./userQueries";
import {
  getProfileByUsername,
  getProfileByEmail,
  getProfileById,
} from "./profileQueries";
import bcrypt from "bcryptjs";
import cors from "cors";
import { User } from "@prisma/client";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import { Session, MemoryStore } from "express-session";
import dotenv from "dotenv";

export const app = express();

import intializePassport from "./passport";
intializePassport(passport, getProfileByUsername, getProfileById);

dotenv.config();

app.use(
  session({
    secret: process.env.SECRET as string,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, //24 hour
    resave: true,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("combined"));

//Used in order to let typescript know that req.session.user is a string
declare module "express-session" {
  interface Session {
    user: string;
    id: string;
  }
}

app.use("/crowdWrap/engineers", router);

app.get("/crowdWrap", (req, res) => {
  res.send("hey guys");
});

app.post("/", (req, res) => {});

app.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPass = await bcrypt.hash(password, 10);

    //Create user and send to DB
    createUser(username, email, hashedPass);
    return res.status(201).json({ message: "Registration succesful" });
  } catch (e) {
    console.log(e);
    return res.status(401).json({ message: "registration failed" });
  }
});

app.post("/login", async (req, res, next) => {
  passport.authenticate("local", (err: Error, user: User) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.session.user = user.id.toString();
      return res.json({ message: "Authentication successful" });
    });
  })(req, res, next);
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      res.status(401).json({ message: "Logout failed" });
    }
  });
  res.setHeader("Set-Cookie", "");
  res.status(200).json({ message: "Logout successful" });
});

// app.post("/profile", (req, res) => {});

app.get("/login", (req, res) => {
  if (req.session.user) {
    return res.status(401).json({ message: "Youre already logged in" });
  } else {
    return res.status(200).json({ message: "Okay log in" });
  }
});

app.get("/profile", async (req, res) => {
  if (req.session.user) {
    const user = await getProfileById(Number(req.session.user));
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ user });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});

//have landing page change once the user is logged in, displaying the logout button etc, removing login button, etc
//since user is already logged in have them redirect from signup to profile
