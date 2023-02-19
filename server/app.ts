import session from "express-session";
import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

const app = express();

app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  res.send("Hi");
});
