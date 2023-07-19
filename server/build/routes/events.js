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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profileQueries_1 = require("../queries/profileQueries");
const index_1 = require("../index");
const crypto_1 = __importDefault(require("crypto"));
const index_2 = require("../index");
const eventQueries_1 = require("../queries/eventQueries");
const messageQueries_1 = require("../queries/messageQueries");
const router = (0, express_1.Router)();
// Same problem as friendList
function eventsNotification(userIds, message, stats) {
    return __awaiter(this, void 0, void 0, function* () {
        if (userIds) {
            userIds
                .filter((user) => {
                return (index_2.onlineUsers[user.userId] && index_2.onlineUsers[user.userId][1] == "online");
            })
                .map((filteredUsers) => {
                index_1.io.to(index_2.onlineUsers[filteredUsers.userId][0]).emit("eventUpdate", {
                    message,
                    stats,
                });
            });
            // else send an email
        }
    });
}
function individalPersonEventNotification(userToSend, message, stats) {
    return __awaiter(this, void 0, void 0, function* () {
        if (userToSend) {
            if (index_2.onlineUsers[userToSend.id] &&
                index_2.onlineUsers[userToSend.id][1] == "online") {
                index_1.io.to(index_2.onlineUsers[userToSend.id][0]).emit("eventUpdate", {
                    message,
                    stats,
                });
            }
            else {
                console.log("theyre offline");
            }
            // else send an email
        }
    });
}
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const inviteLink = crypto_1.default.randomUUID();
        yield (0, eventQueries_1.createEvent)(Number(req.session.user), req.body, `${inviteLink}`);
        return res.status(200).json({ message: "complete" });
    }
}));
router.get("/invite/:link", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const link = req.params.link;
        const theEvent = yield (0, eventQueries_1.getEventByLink)(link);
        if (theEvent) {
            const eventId = theEvent.id;
            const userId = Number(req.session.user);
            const inEvent = yield (0, eventQueries_1.isParticipantInEvent)(userId, Number(eventId));
            if (!inEvent) {
                // addParticipant(userId, Number(eventId));
                return res.status(200).json({ inEvent: false, event: theEvent });
            }
            else {
                return res.status(200).json({ inEvent: true, event: theEvent });
            }
        }
        else {
            return res.status(404).json({ invalidInvite: true });
        }
    }
    else {
        return res.status(404).json({ notLoggedIn: true });
    }
}));
router.post("/invite/:link", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const link = req.params.link;
        const theEvent = yield (0, eventQueries_1.getEventByLink)(link);
        if (theEvent) {
            const eventId = theEvent.id;
            const userId = Number(req.session.user);
            const user = yield (0, profileQueries_1.getProfileById)(userId);
            const inEvent = yield (0, eventQueries_1.isParticipantInEvent)(userId, Number(eventId));
            if (!inEvent) {
                if (theEvent.participants.length < 10) {
                    (0, eventQueries_1.addParticipant)(userId, Number(eventId));
                    eventsNotification(theEvent.participants, `${user.username} has been added to "${theEvent.title}"`, "success");
                    individalPersonEventNotification(user, `You have been added to "${theEvent.title}"`, "success");
                    return res.status(200).json({ inEvent: false, event: theEvent });
                }
                else {
                    individalPersonEventNotification(user, `Maximum number of participants reached"`, "error");
                }
            }
            else {
                return res.status(404).json({ inEvent: true, event: theEvent });
            }
        }
        else {
            return res.status(404).json({ invalidInvite: true });
        }
    }
    else {
        return res.status(404).json({ notLoggedIn: true });
    }
}));
router.post("/participants/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const username = req.body.username;
        const user = yield (0, profileQueries_1.getProfileByUsername)(username);
        const eventId = req.body.eventId;
        const theEvent = yield (0, eventQueries_1.getEventById)(eventId);
        const userId = Number(req.session.user);
        const currentUser = yield (0, profileQueries_1.getProfileById)(userId);
        if (theEvent.participants.length < 10) {
            (0, eventQueries_1.addParticipant)(Number(user.id), Number(eventId));
            eventsNotification(theEvent.participants, `${username} has been added to "${theEvent.title}"`, "success");
            individalPersonEventNotification(user, `You have been added to "${theEvent.title}"`, "success");
        }
        else {
            individalPersonEventNotification(currentUser, `Maximum number of participants reached"`, "error");
        }
        return res.status(200).json({ message: "complete" });
    }
}));
router.delete("/participants/remove", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const userId = req.body.userId;
        const user = yield (0, profileQueries_1.getProfileById)(Number(userId));
        const eventId = req.body.eventId;
        const theEvent = yield (0, eventQueries_1.getEventById)(eventId);
        (0, eventQueries_1.removeParticipant)(Number(userId), Number(eventId));
        eventsNotification(theEvent.participants, `${user.username} has left "${theEvent.title}"`, "error");
        return res.status(200).json({ message: "complete" });
    }
}));
router.get("/retrieve", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const allEvents = yield (0, eventQueries_1.getAllEventsByid)(Number(req.session.user));
        return res.status(200).send(allEvents);
    }
}));
router.get("/id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const eventId = req.query.eventId;
        const event = yield (0, eventQueries_1.getEventById)(Number(eventId));
        if (event) {
            return res.status(200).json({ event });
        }
        else {
            return res.status(404).json({ event: null });
        }
    }
}));
router.delete("/remove", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const eventId = Number(req.body.eventId);
        const ownerId = Number(req.body.ownerId);
        const theEvent = yield (0, eventQueries_1.getEventById)(eventId);
        if (ownerId == Number(req.session.user)) {
            (0, messageQueries_1.removeMessages)(eventId);
            eventsNotification(theEvent.participants, `"${theEvent.title}" has been deleted`, "error");
            (0, eventQueries_1.removeEvent)(eventId);
        }
        return res.status(200).json({ message: "complete" });
    }
}));
router.get("/:eventId/messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = Number(req.params.eventId);
    const messages = yield (0, messageQueries_1.getMessagesById)(eventId);
    return res.status(200).json({ messages });
}));
router.post("/:eventId/messages", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventId = Number(req.params.eventId);
    const userId = Number(req.session.user);
    const content = req.body.content;
    const user = yield (0, profileQueries_1.getProfileById)(userId);
    const theEvent = yield (0, eventQueries_1.getEventById)(eventId);
    const newMessage = yield (0, messageQueries_1.createMessage)(userId, eventId, content);
    const messageWithPicture = Object.assign(Object.assign({}, newMessage), { picture: user.picture });
    if (theEvent.participants) {
        theEvent.participants
            .filter((user) => {
            return (index_2.onlineUsers[user.userId] && index_2.onlineUsers[user.userId][1] == "online");
        })
            .map((filteredUsers) => {
            index_1.io.to(index_2.onlineUsers[filteredUsers.userId][0]).emit("sendMsg");
        });
    }
    return res.status(200).json({ messageWithPicture });
}));
exports.default = router;
