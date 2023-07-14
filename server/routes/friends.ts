import { Router } from "express";
import { prisma } from "../index";
import { io } from "../index";
import { onlineUsers } from "../index";
import {
  getFriendsByPartialUsername,
  addFriend,
  removeFriendSent,
  updateFriendRequestSent,
  removeFriendReceived,
  removeFriend,
} from "../queries/friendQueries";
import {
  getProfileById,
  getProfilesByPartialUsername,
  getProfileByUsername,
} from "../queries/profileQueries";
const router = Router();

// A lot of scalablity problems with the friendlist, for example the notificatins. There would be a problem if there were too many active users (Redis could solve)
// Another problem would be how friends are displayed, they are all. So if someone has 100s of friends their browser would likely crash trying to display
// all of those. This can easily be fixed though by capping the shown amount, and having it lazy load.
//Same problem when adding a friend, itll show every single user that that has letters that they are searching for, should probably cap it too

async function friendListNotification(userToSend: any, message: any) {
  if (userToSend) {
    if (
      onlineUsers[userToSend.id] &&
      onlineUsers[userToSend.id][1] == "online"
    ) {
      io.to(onlineUsers[userToSend.id][0]).emit("friendListUpdate", {
        message,
      });
    } else {
      console.log("theyre offline");
    }
    // else send an email
  }
}

router.get("/", async (req:any, res:any) => {
  let accounts;
  if (req.session.user) {
    const user = await getProfileById(Number(req.session.user));
    const friends = user.friends;

    if (friends) {
      const allSessions = await prisma.session.findMany();

      // console.log(allSessions);
      accounts = friends.map((item) => {
        let isOnline = "offline";
        if (onlineUsers[item.id] && onlineUsers[item.id][1] == "online") {
          isOnline = "online";
        }

        return {
          username: item.username,
          profilePic: item.picture,
          userId: item.id,
          status: isOnline,
        };
      });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.send(accounts);
});

router.get("/search", async (req:any, res:any) => {
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

router.get("/list-search", async (req:any, res:any) => {
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

router.post("/send-request", async (req:any, res:any) => {
  let account;
  if (req.session.user) {
    const userToSendFriendRequest: any = req.body.username;
    const currentUserID: number = Number(req.session.user);
    const user = await getProfileById(Number(req.session.user));

    if (userToSendFriendRequest) {
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

        friendListNotification(
          profileOfSend,
          `${user.username} has accepted your friend request.`
        );
      } else {
        await updateFriendRequestSent(userToSendFriendRequest, currentUserID);

        const profileOfSend = await getProfileByUsername(
          userToSendFriendRequest
        );

        friendListNotification(
          profileOfSend,
          `${user.username} has sent you a friend request.`
        );
      }
    }
    return res.status(200).json({ message: "complete" });
  }
});

router.get("/received", async (req:any, res:any) => {
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

router.delete("/received/remove", async (req:any, res:any) => {
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

router.get("/sent", async (req:any, res:any) => {
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

router.delete("/sent/remove", async (req:any, res:any) => {
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

router.post("/add", async (req:any, res:any) => {
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

    friendListNotification(
      userToRemove,
      `${user.username} has accepted your friend request.`
    );

    return res.status(200).json({ message: "complete" });
  }
});

router.delete("/remove", async (req:any, res:any) => {
  if (req.session.user) {
    const usertoRemoveUsername: any = req.body.username;
    const currentUserID: number = Number(req.session.user);
    const user = await getProfileById(Number(req.session.user));
    removeFriend(usertoRemoveUsername, currentUserID);

    const profileOfSend = await getProfileByUsername(usertoRemoveUsername);

    friendListNotification(profileOfSend, "");

    return res.status(200).json({ message: "complete" });
  }
});

export default router;
