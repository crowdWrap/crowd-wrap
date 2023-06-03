import dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
declare module "express-session" {
  interface Session {
    user: string;
    id: string;
  }
}
import {
  addFriend,
  createEvent,
  createUser,
  getEventById,
  removeFriend,
  removeFriendReceived,
  removeFriendSent,
  updateFriendRequestSent,
  addParticipant,
  removeEvent,
  removeParticipant,
  getEventByLink,
  isParticipantInEvent,
} from "./userQueries";
import {
  getProfileByUsername,
  getProfileByEmail,
  getProfileById,
  updateUser,
  updateUserName,
  getProfilesByPartialUsername,
  getFriendsByPartialUsername,
  getParticipantById,
} from "./profileQueries";
import bcrypt from "bcryptjs";
import cors from "cors";
import { User } from "@prisma/client";
import passport from "passport";
import session from "express-session";
import http from "http";
import { OAuth2Client } from "google-auth-library";
import crypto from "crypto";
import { Server } from "socket.io";
import intializePassport from "./passport";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { PrismaClient } from "@prisma/client";
import expressSession from "express-session";

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
app.use(morgan("combined"));

intializePassport(
  passport,
  getProfileByUsername,
  getProfileById,
  getProfileByEmail
);

const client = new OAuth2Client(process.env.CLIENTID);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.use((socket: any, next: any) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});

io.on("connection", async (socket: any) => {
  console.log("User Connected", socket.id);
  try {
    let session = socket.request.session;
    session.userId = session.user;
    session.socketId = socket.id;
    await session.save();
  } catch (e) {
    throw e;
  }

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

//Used in order to let typescript know that req.session.user is a strings

app.post("/register/setUsername", async (req, res) => {
  const username = req.body.username;
  const usernameExists = await getProfileByUsername(username);

  if (usernameExists) {
    return res.status(400).json({ message: "user exists" });
  }
});

app.post("/register", async (req, res) => {
  if (req.body.credential) {
    try {
      const token = req.body.credential;
      // console.log(req.body.credential);
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
          const firstname = payload.given_name;
          const lastname = payload.family_name;
          const email = payload.email;
          const picture = payload.picture;
          const userData = payload.sub;

          // console.log(payload);
          //makes sure that the user doesnt exist
          const emailExists = await getProfileByEmail(email);

          if (emailExists) {
            return res
              .status(400)
              .json({ message: "This user exists, please login!" });
          }

          createUser(userData, email, "");
          updateUser(email, picture);
          return res.status(200).json({ message: `${email} has been created` });
        })
        .catch((e) => console.log("firstError:", e));
    } catch (e) {
      console.log("secondError:", e);
      return res.status(401).json({ message: "Registration Failed" });
    }
  } else {
    //normal
    try {
      const { username, email, password } = req.body;

      //makes sure the fields arent blank and pass is > 8
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
      createUser(username, email, hashedPass);
      return res.status(201).json({ message: `${username} has been created` });
    } catch (e) {
      console.log("thirdError:", e);
      return res.status(401).json({ message: "Registration Failed" });
    }
  }
});

app.post("/login", async (req, res, next) => {
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
          // updateUser(email, picture);
          req.session.user = user.id.toString();

          if (user.username == sub) {
            return res.status(200).json({ message: "Needs username" });
          } else {
            return res.status(200).json({ message: `${email} has logged in` });
          } //
        });
      });
      //google oauth
    } catch (e) {
      console.log("fourthError:", e);
    }
  } else {
    //normal auhtentication and session
    passport.authenticate("local", (err: Error, user: User) => {
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
  }
});

app.get("/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(401).json({ message: "Logout failed" });
    }
  });
  res.setHeader("Set-Cookie", "");
  res.status(200).json({ message: "Logout successful" });
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    return res
      .status(200)
      .json({ message: "Good to go!", userId: req.session.user });
  } else {
    return res.status(401).json({ message: "You arent logged in!" });
  }
});

app.get("/profile", async (req, res) => {
  //are they  able to bypass the setusername part if they go to /profile? should i leave it or is there a resolution?
  if (req.session.user) {
    const user = await getProfileById(Number(req.session.user));
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ user });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

app.get("/register/setUsername", async (req, res) => {
  if (req.session.user) {
    const user = await getProfileById(Number(req.session.user));
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json({ message: "authorized" });
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

app.post("/setUsername", async (req, res) => {
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

app.get("/profilePicRequest", async (req, res) => {
  if (req.session.user) {
    const user = await getProfileById(Number(req.session.user));
    res.send(user.picture);
  }
});

app.get("/friendSearch", async (req, res) => {
  const userSearch: any = req.query.user_search;
  const user = await getProfileById(Number(req.session.user));
  const profiles = await getProfilesByPartialUsername(userSearch);
  let accounts;
  if (profiles) {
    accounts = profiles
      .filter((item) => item.username != user.username)
      .filter(
        (item) =>
          !user.friendRequestsSent.some((el) => el.username === item.username)
      )
      .filter(
        (item) => !user.friends.some((el) => el.username === item.username)
      )
      .map((item) => {
        return { username: item.username, profilePic: item.picture };
      });
  }
  res.send(accounts);
});

app.get("/friendsListSearch", async (req, res) => {
  const userSearch: any = req.query.user_search;
  const user = await getProfileById(Number(req.session.user));
  const friends = await getFriendsByPartialUsername(userSearch, user.id);

  let accounts;
  if (friends) {
    accounts = friends.map((item) => {
      return { username: item.username, profilePic: item.picture };
    });
  }
  res.send(accounts);
});

app.post("/sendFriendRequest", async (req, res) => {
  let account;
  if (req.session.user) {
    const userToSendFriendRequest: any = req.body.username;
    const currentUserID: number = Number(req.session.user);
    const user = await getProfileById(Number(req.session.user));

    if (userToSendFriendRequest) {
      // if you have received a friend request from them then add them and removle received and sent, if not send them one
      const friendRequests = user.friendRequests;
      if (friendRequests && friendRequests.length > 0) {
        account = friendRequests.filter(
          (item) => item.username == userToSendFriendRequest
        );
      }
      if (account && account.length > 0) {
        const userToRemove: any = await getProfileByUsername(
          userToSendFriendRequest
        );

        addFriend(userToSendFriendRequest, currentUserID);

        removeFriendSent(user.username, userToRemove.id);

        const profileOfSend = await getProfileByUsername(
          userToSendFriendRequest
        );

        if (profileOfSend) {
          const allSessions: any = await prisma.session.findMany();

          let userSessions = allSessions
            .filter((session: any) => {
              let sessionData = JSON.parse(session.data);
              return Number(sessionData.userId) == Number(profileOfSend.id);
            })
            .map((session: any) => {
              let sessionData = JSON.parse(session.data);
              return {
                userId: sessionData.userId,
                socketId: sessionData.socketId,
              };
            });

          if (userSessions && userSessions.socketId) {
            console.log("omg inner so close 2");
            io.to(userSessions.socketId).emit("friendRequestReceived", {
              from: user.username,
              message: `${user.username} has accepted your friend request.`,
            });
          }
        }
      } else {
        await updateFriendRequestSent(userToSendFriendRequest, currentUserID);

        const profileOfSend = await getProfileByUsername(
          userToSendFriendRequest
        );
        if (profileOfSend) {
          const allSessions: any = await prisma.session.findMany();

          let userSessions = allSessions
            .filter((session: any) => {
              let sessionData = JSON.parse(session.data);
              return Number(sessionData.userId) == Number(profileOfSend.id);
            })
            .map((session: any) => {
              let sessionData = JSON.parse(session.data);
              return {
                userId: sessionData.userId,
                socketId: sessionData.socketId,
              };
            });

          if (userSessions[0] && userSessions[0].socketId) {
            io.to(userSessions[0].socketId).emit("friendRequestReceived", {
              from: user.username,
              message: `${user.username} has sent you a friend request.`,
            });
          }
        }
      }
    }
    return res.status(200).json({ message: "complete" });
  }
});

app.get("/friendReceived", async (req, res) => {
  let accounts;
  if (req.session.user) {
    const user = await getProfileById(Number(req.session.user));
    const friendRequests = user.friendRequests;

    if (friendRequests) {
      accounts = friendRequests.map((item) => {
        return { username: item.username, profilePic: item.picture };
      });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.send(accounts);
});

app.get("/friendSent", async (req, res) => {
  let accounts;
  if (req.session.user) {
    const user = await getProfileById(Number(req.session.user));
    const friendRequestsSent = user.friendRequestsSent;

    if (friendRequestsSent) {
      accounts = friendRequestsSent.map((item) => {
        return { username: item.username, profilePic: item.picture };
      });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.send(accounts);
});

app.get("/friends", async (req, res) => {
  let accounts;
  if (req.session.user) {
    const user = await getProfileById(Number(req.session.user));
    const friends = user.friends;

    if (friends) {
      accounts = friends.map((item) => {
        return {
          username: item.username,
          profilePic: item.picture,
          userId: item.id,
        };
      });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.send(accounts);
});

app.post("/addFriend", async (req, res) => {
  if (req.session.user) {
    const usertoRemoveUsername: any = req.body.username;
    const currentUserID: number = Number(req.session.user);
    //
    const userToRemove: any = await getProfileByUsername(usertoRemoveUsername);
    const user = await getProfileById(Number(req.session.user));
    addFriend(usertoRemoveUsername, currentUserID);
    //add them adn then remove the sent, and received
    removeFriendReceived(user.username, userToRemove.id);
    removeFriendSent(user.username, userToRemove.id);

    if (usertoRemoveUsername) {
      const allSessions: any = await prisma.session.findMany();

      let userSessions = allSessions
        .filter((session: any) => {
          let sessionData = JSON.parse(session.data);
          return Number(sessionData.userId) == Number(userToRemove.id);
        })
        .map((session: any) => {
          let sessionData = JSON.parse(session.data);
          return {
            userId: sessionData.userId,
            socketId: sessionData.socketId,
          };
        });

      if (userSessions[0] && userSessions[0].socketId) {
        io.to(userSessions[0].socketId).emit("friendRequestReceived", {
          from: user.username,
          message: `${user.username} has accepted your friend request.`,
        });
      }
    }

    return res.status(200).json({ message: "complete" });
  }
});

app.delete("/removeFriend", async (req, res) => {
  if (req.session.user) {
    const usertoRemoveUsername: any = req.body.username;
    const currentUserID: number = Number(req.session.user);
    removeFriend(usertoRemoveUsername, currentUserID);
    return res.status(200).json({ message: "complete" });
  }
});
//when they click the button, just add them as a friend

app.delete("/removeFriendSent", async (req, res) => {
  if (req.session.user) {
    const usertoRemoveUsername: any = req.body.username;
    const currentUserID: number = Number(req.session.user);
    const userToRemove: any = await getProfileByUsername(usertoRemoveUsername);
    const user = await getProfileById(Number(currentUserID));
    //removing from current users sent
    removeFriendSent(usertoRemoveUsername, currentUserID);
    //removing from the received users received
    removeFriendReceived(usertoRemoveUsername, currentUserID);
    return res.status(200).json({ message: "complete" });
  }
});

app.delete("/removeFriendReceived", async (req, res) => {
  if (req.session.user) {
    const usertoRemoveUsername: any = req.body.username;
    const userToRemove: any = await getProfileByUsername(usertoRemoveUsername);
    const user = await getProfileById(Number(req.session.user));
    //removing the received from current user
    removeFriendReceived(user.username, userToRemove.id);
    //removing user from userToRemoves sent
    removeFriendSent(user.username, userToRemove.id);
    return res.status(200).json({ message: "complete" });
  }
});

app.post("/events", async (req, res) => {
  if (req.session.user) {
    const { title, description, img, moneyGoal, date } = req.body;
    const inviteLink = crypto.randomUUID();

    await createEvent(Number(req.session.user), req.body, `${inviteLink}`);
    return res.status(200).json({ message: "complete" });
  }
});

app.get("/events/invite/:link", async (req, res) => {
  if (req.session.user) {
    const link = req.params.link;
    const theEvent: any = await getEventByLink(link);
    if (theEvent) {
      const eventId = theEvent.id;
      const userId = Number(req.session.user);
      const inEvent = await isParticipantInEvent(userId, Number(eventId));
      if (!inEvent) {
        addParticipant(userId, Number(eventId));
        return res.status(200).json({ inEvent: false });
      } else {
        return res.status(200).json({ inEvent: true });
      }
    } else {
      return res.status(404).json({ invalidInvite: true });
    }
  } else {
    return res.status(404).json({ notLoggedIn: true });
  }
});

app.post("/events/participants/add", async (req, res) => {
  if (req.session.user) {
    const username: string = req.body.username;
    const user: any = await getProfileByUsername(username);
    const eventId: number = req.body.eventId;

    addParticipant(Number(user.id), Number(eventId));
    return res.status(200).json({ message: "complete" });
  }
});

app.delete("/events/participants/remove", async (req, res) => {
  if (req.session.user) {
    const userId = req.body.userId;
    const eventId = req.body.eventId;

    removeParticipant(Number(userId), Number(eventId));
    return res.status(200).json({ message: "complete" });
  }
});

app.get("/events/retrieve", async (req, res) => {
  if (req.session.user) {
    const user = await getProfileById(Number(req.session.user));
    const allEvents = await Promise.all(
      user.events.map(async (e) => {
        return await getEventById(e.eventId);
      })
    );
    res.status(200).send(allEvents);
  }
});

app.get("/events/id", async (req, res) => {
  if (req.session.user) {
    const eventId: any = req.query.eventId;
    const event = await getEventById(Number(eventId));
    res.send(event);
  }
});

app.delete("/events/remove", async (req, res) => {
  if (req.session.user) {
    const eventId: number = Number(req.body.eventId);
    const ownerId: number = Number(req.body.ownerId);
    if (ownerId == Number(req.session.user)) {
      removeEvent(eventId);
    }
    return res.status(200).json({ message: "complete" });
  }
});

server.listen(8000, () => {
  console.log(`Server is listening on port 8000`);
});
