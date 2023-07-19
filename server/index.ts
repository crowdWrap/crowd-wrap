import dotenv from "dotenv";
dotenv.config();
import express from "express";
declare module "express-session" {
  interface Session {
    user: string;
    id: string;
  }
}
import {
  getProfileByUsername,
  getProfileByEmail,
  getProfileById,
} from "./queries/profileQueries";
import cors from "cors";
import passport from "passport";
import http from "http";
import { Server } from "socket.io";
import intializePassport from "./passport";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import expressSession from "express-session";
import registerRouter from "./routes/register";
import loginRouter from "./routes/login";
import logoutRouter from "./routes/logout";
import profileRouter from "./routes/profile";
import friendsRouter from "./routes/friends";
import eventsRouter from "./routes/events";
import paymentRouter from "./routes/payment";
const morgan = require("morgan");

export const app = express();
export const prisma = new PrismaClient();

const sessionMiddleware = expressSession({
  cookie: { maxAge: 24 * 60 * 60 * 1000 }, //24 hour
  secret: process.env.SECRET as string,
  resave: true,
  saveUninitialized: false,
  store: new PrismaSessionStore(prisma, {
    checkPeriod: 2 * 60 * 1000, //ms
    dbRecordIdIsSessionId: true,
    dbRecordIdFunction: undefined,
  }),
});

app.use(sessionMiddleware);

app.use(express.json());
app.use(cors({ origin: true }));
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("dev"));


intializePassport(
  passport,
  getProfileByUsername,
  getProfileById,
  getProfileByEmail
);

const server = http.createServer(app);

export const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3001/",
    credentials: true,
  },
});

io.use((socket: any, next: any) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});

export let onlineUsers: any = {};

io.on("connection", async (socket: any) => {
  console.log("User Connected", socket.id);
  try {
    let session = socket.request.session;

    session.userId = session.user;
    session.socketId = socket.id;
    session.status = "online";

    onlineUsers[session.user] = [socket.id, session.status];
    console.log(onlineUsers);
    await session.save();
  } catch (e) {
    throw e;
  }

  socket.on("disconnect", async () => {
    console.log("User Disconnected", socket.id);
    let session = socket.request.session;
    session.status = "offline";
    onlineUsers[session.user] = [socket.id, session.status];
    console.log(onlineUsers);
  });
});


app.use("/register", registerRouter);

app.use("/login", loginRouter);

app.use("/logout", logoutRouter);

app.use("/profile", profileRouter);

app.use("/friends", friendsRouter);

app.use("/events", eventsRouter);

app.use("/payment", paymentRouter);

server.listen(process.env.PORT || 8000, () => {
  console.log(`Server is listening `);
});
