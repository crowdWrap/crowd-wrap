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
const paymentQueries_1 = require("../queries/paymentQueries");
const profileQueries_1 = require("../queries/profileQueries");
const eventQueries_1 = require("../queries/eventQueries");
const userQueries_1 = require("../queries/userQueries");
const router = (0, express_1.Router)();
const index_1 = require("../index");
const index_2 = require("../index");
function eventsNotification(userIds, message, stats) {
    return __awaiter(this, void 0, void 0, function* () {
        if (userIds) {
            userIds
                .filter((user) => {
                return (index_1.onlineUsers[user.userId] && index_1.onlineUsers[user.userId][1] == "online");
            })
                .map((filteredUsers) => {
                index_2.io.to(index_1.onlineUsers[filteredUsers.userId][0]).emit("eventUpdate", {
                    message,
                    stats,
                });
            });
            // else send an email
        }
    });
}
router.post("/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paymentType = req.body.paymentType;
    const user = yield (0, paymentQueries_1.updatePaymentTypeById)(Number(req.session.user), paymentType);
    return res.status(200).json({ user });
}));
router.get("/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.query.userId);
    const paymentType = yield (0, paymentQueries_1.getPaymentTypeById)(userId);
    return res.status(200).json({ paymentType });
}));
router.post("/complete", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const userId = req.body.userId;
        const user = yield (0, profileQueries_1.getProfileById)(Number(userId));
        const eventId = req.body.eventId;
        const theEvent = yield (0, eventQueries_1.getEventById)(eventId);
        const amountPaid = req.body.amountPaid;
        (0, userQueries_1.updateUserCurrentFunds)(Number(eventId), Number(userId), Number(amountPaid));
        (0, eventQueries_1.updateEventCurrentFunds)(Number(eventId), Number(amountPaid));
        eventsNotification(theEvent.participants, `${user.username} has paid $${amountPaid}!!"`, "success");
        // could add confetti
        return res.status(200).json({ message: "complete" });
    }
}));
exports.default = router;
