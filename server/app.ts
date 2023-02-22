import session from "express-session";
import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import expressSession from "express-session";
import { Prisma, PrismaClient } from "@prisma/client";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import bcrypt from "bcryptjs";

const app = express();
const prisma = new PrismaClient();

async function getUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  return user;
}

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

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

//Authentication

passport.use(
  new LocalStrategy(async (email: string, password, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return done(null, false, { message: "Invalid email" });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return done(null, false, { message: "Invalid password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await prisma.user.findUnique({ where: { id } });
//     if (!user) {
//       return done(new Error("User not found"));
//     }
//     return done(null, user);
//   } catch (err) {
//     return done(err);
//   }
// });

//
//Signup

// passport.use(
//   new LocalStrategy((emailInput, password, done) => {
//     const user = await prisma.user.findUnique({ where: { email: emailInput } });
//   })
// );

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  res.send("Hi");
});

function env(arg0: string): string | string[] {
  throw new Error("problem with secret env variable.");
}
