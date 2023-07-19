"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const index_1 = require("../index");
const index_2 = require("../index");
const index_3 = require("../index");
const friendQueries_1 = require("../queries/friendQueries");
const profileQueries_1 = require("../queries/profileQueries");
const router = (0, express_1.Router)();
// A lot of scalablity problems with the friendlist, for example the notificatins. There would be a problem if there were too many active users (Redis could solve)
// Another problem would be how friends are displayed, they are all. So if someone has 100s of friends their browser would likely crash trying to display
// all of those. This can easily be fixed though by capping the shown amount, and having it lazy load.
//Same problem when adding a friend, itll show every single user that that has letters that they are searching for, should probably cap it too
function friendListNotification(userToSend, message) {
    return __awaiter(this, void 0, void 0, function* () {
        if (userToSend) {
            if (index_3.onlineUsers[userToSend.id] &&
                index_3.onlineUsers[userToSend.id][1] == "online") {
                index_2.io.to(index_3.onlineUsers[userToSend.id][0]).emit("friendListUpdate", {
                    message,
                });
            }
            else {
                console.log("theyre offline");
            }
            // else send an email
        }
    });
}
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let accounts;
    if (req.session.user) {
        const user = yield (0, profileQueries_1.getProfileById)(Number(req.session.user));
        const friends = user.friends;
        if (friends) {
            const allSessions = yield index_1.prisma.session.findMany();
            // console.log(allSessions);
            accounts = friends.map((item) => {
                let isOnline = "offline";
                if (index_3.onlineUsers[item.id] && index_3.onlineUsers[item.id][1] == "online") {
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
    }
    else {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.send(accounts);
}));
router.get("/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userSearch = req.query.user_search;
    const user = yield (0, profileQueries_1.getProfileById)(Number(req.session.user));
    const profiles = yield (0, profileQueries_1.getProfilesByPartialUsername)(userSearch);
    let accounts;
    if (profiles) {
        accounts = profiles
            .filter((item) => item.username != user.username)
            .filter((item) => !user.friendRequestsSent.some((el) => el.username === item.username))
            .filter((item) => !user.friends.some((el) => el.username === item.username))
            .map((item) => {
            return { username: item.username, profilePic: item.picture };
        });
    }
    res.send(accounts);
}));
router.get("/list-search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userSearch = req.query.user_search;
    const user = yield (0, profileQueries_1.getProfileById)(Number(req.session.user));
    const friends = yield (0, friendQueries_1.getFriendsByPartialUsername)(userSearch, user.id);
    let accounts;
    if (friends) {
        accounts = friends.map((item) => {
            return { username: item.username, profilePic: item.picture };
        });
    }
    res.send(accounts);
}));
router.post("/send-request", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let account;
    if (req.session.user) {
        const userToSendFriendRequest = req.body.username;
        const currentUserID = Number(req.session.user);
        const user = yield (0, profileQueries_1.getProfileById)(Number(req.session.user));
        if (userToSendFriendRequest) {
            const friendRequests = user.friendRequests;
            if (friendRequests && friendRequests.length > 0) {
                account = friendRequests.filter((item) => item.username == userToSendFriendRequest);
            }
            if (account && account.length > 0) {
                const userToRemove = yield (0, profileQueries_1.getProfileByUsername)(userToSendFriendRequest);
                (0, friendQueries_1.addFriend)(userToSendFriendRequest, currentUserID);
                (0, friendQueries_1.removeFriendSent)(user.username, userToRemove.id);
                const profileOfSend = yield (0, profileQueries_1.getProfileByUsername)(userToSendFriendRequest);
                friendListNotification(profileOfSend, `${user.username} has accepted your friend request.`);
            }
            else {
                yield (0, friendQueries_1.updateFriendRequestSent)(userToSendFriendRequest, currentUserID);
                const profileOfSend = yield (0, profileQueries_1.getProfileByUsername)(userToSendFriendRequest);
                friendListNotification(profileOfSend, `${user.username} has sent you a friend request.`);
            }
        }
        return res.status(200).json({ message: "complete" });
    }
}));
router.get("/received", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let accounts;
    if (req.session.user) {
        const user = yield (0, profileQueries_1.getProfileById)(Number(req.session.user));
        const friendRequests = user.friendRequests;
        if (friendRequests) {
            accounts = friendRequests.map((item) => {
                return { username: item.username, profilePic: item.picture };
            });
        }
    }
    else {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.send(accounts);
}));
router.delete("/received/remove", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const usertoRemoveUsername = req.body.username;
        const userToRemove = yield (0, profileQueries_1.getProfileByUsername)(usertoRemoveUsername);
        const user = yield (0, profileQueries_1.getProfileById)(Number(req.session.user));
        //removing the received from current user
        (0, friendQueries_1.removeFriendReceived)(user.username, userToRemove.id);
        //removing user from userToRemoves sent
        (0, friendQueries_1.removeFriendSent)(user.username, userToRemove.id);
        return res.status(200).json({ message: "complete" });
    }
}));
router.get("/sent", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let accounts;
    if (req.session.user) {
        const user = yield (0, profileQueries_1.getProfileById)(Number(req.session.user));
        const friendRequestsSent = user.friendRequestsSent;
        if (friendRequestsSent) {
            accounts = friendRequestsSent.map((item) => {
                return { username: item.username, profilePic: item.picture };
            });
        }
    }
    else {
        return res.status(401).json({ message: "Unauthorized" });
    }
    res.send(accounts);
}));
router.delete("/sent/remove", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const usertoRemoveUsername = req.body.username;
        const currentUserID = Number(req.session.user);
        const userToRemove = yield (0, profileQueries_1.getProfileByUsername)(usertoRemoveUsername);
        const user = yield (0, profileQueries_1.getProfileById)(Number(currentUserID));
        //removing from current users sent
        (0, friendQueries_1.removeFriendSent)(usertoRemoveUsername, currentUserID);
        //removing from the received users received
        (0, friendQueries_1.removeFriendReceived)(usertoRemoveUsername, currentUserID);
        return res.status(200).json({ message: "complete" });
    }
}));
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const usertoRemoveUsername = req.body.username;
        const currentUserID = Number(req.session.user);
        //
        const userToRemove = yield (0, profileQueries_1.getProfileByUsername)(usertoRemoveUsername);
        const user = yield (0, profileQueries_1.getProfileById)(Number(req.session.user));
        (0, friendQueries_1.addFriend)(usertoRemoveUsername, currentUserID);
        //add them adn then remove the sent, and received
        (0, friendQueries_1.removeFriendReceived)(user.username, userToRemove.id);
        (0, friendQueries_1.removeFriendSent)(user.username, userToRemove.id);
        friendListNotification(userToRemove, `${user.username} has accepted your friend request.`);
        return res.status(200).json({ message: "complete" });
    }
}));
router.delete("/remove", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const usertoRemoveUsername = req.body.username;
        const currentUserID = Number(req.session.user);
        const user = yield (0, profileQueries_1.getProfileById)(Number(req.session.user));
        (0, friendQueries_1.removeFriend)(usertoRemoveUsername, currentUserID);
        const profileOfSend = yield (0, profileQueries_1.getProfileByUsername)(usertoRemoveUsername);
        friendListNotification(profileOfSend, "");
        return res.status(200).json({ message: "complete" });
    }
}));
exports.default = router;
