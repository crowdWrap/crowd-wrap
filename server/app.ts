import session from "express-session";
import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import expressSession from "express-session";
import { PrismaClient } from "@prisma/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

const app = express();

//Sessions

app.use(
  expressSession({
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
    secret: env("SECRET"),
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

// app.get("/login", (req, res) => {
//   req.session.isLoggedIn = true;
//   res.send("LOGGED IN");
// });

// app.get("/profile", (req, res) => {
//   if (req.session.isLoggedIn) {
//     res.send("YOUR PROFILE");
//   } else {
//     res.redirect("/login");
//   }
// });

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  res.send("Hi");
});

function env(arg0: string): string | string[] {
  throw new Error("problem with secret env variable.");
}
