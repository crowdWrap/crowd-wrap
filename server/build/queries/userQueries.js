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
exports.validateUserResetToken = exports.updateUserResetToken = exports.updateUserPassword = exports.updateUserCurrentFunds = exports.updateEventToUserUsername = exports.updateUserUsernameSet = exports.updateUserName = exports.updateUser = exports.createUser = void 0;
const index_1 = require("../index");
const profileQueries_1 = require("./profileQueries");
function createUser(username, email, password, registeredWith, usernameSet) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield index_1.prisma.user.create({
                data: {
                    username,
                    email,
                    password,
                    registeredWith,
                    usernameSet,
                    picture: "https://vectorified.com/images/no-profile-picture-icon-28.png",
                    friends: {
                        connect: [],
                    },
                    friendRequests: {
                        connect: [],
                    },
                    ownedEvents: {
                        create: [],
                    },
                    events: {
                        create: [],
                    },
                },
            });
        }
        catch (error) {
            console.error("create user error", error);
            throw new Error(`Username '${username}' or email '${email}' already exists.`);
        }
    });
}
exports.createUser = createUser;
function updateUser(email, newPic) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, profileQueries_1.getProfileByEmail)(email);
        const updatedUser = yield index_1.prisma.user.update({
            where: { id: user.id },
            data: { picture: newPic },
        });
        return updatedUser;
    });
}
exports.updateUser = updateUser;
function updateUserName(email, newUsername) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield (0, profileQueries_1.getProfileByEmail)(email);
        const updatedUser = yield index_1.prisma.user.update({
            where: { id: user.id },
            data: { username: newUsername },
        });
        return updatedUser;
    });
}
exports.updateUserName = updateUserName;
function updateUserUsernameSet(userId, usernameSet) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedUser = yield index_1.prisma.user.update({
            where: { id: userId },
            data: { usernameSet },
        });
        return updatedUser;
    });
}
exports.updateUserUsernameSet = updateUserUsernameSet;
function updateEventToUserUsername(userId, newUsername) {
    return __awaiter(this, void 0, void 0, function* () {
        const updatedUser = yield index_1.prisma.eventToUser.updateMany({
            where: { userId },
            data: { username: newUsername },
        });
        return updatedUser;
    });
}
exports.updateEventToUserUsername = updateEventToUserUsername;
function updateUserCurrentFunds(eventId, userId, currentMoney) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield index_1.prisma.eventToUser.findFirst({
            where: {
                userId,
                eventId,
            },
        });
        if (user) {
            const updateFunds = yield index_1.prisma.eventToUser.update({
                where: { id: user === null || user === void 0 ? void 0 : user.id },
                data: {
                    currentMoney: (user === null || user === void 0 ? void 0 : user.currentMoney) + currentMoney,
                },
            });
            return updateFunds;
        }
        else {
            throw new Error(`User ${userId} is not a participant in event ${eventId}`);
        }
    });
}
exports.updateUserCurrentFunds = updateUserCurrentFunds;
function updateUserPassword(id, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield index_1.prisma.user.update({
            where: { id },
            data: {
                password,
            },
        });
        return user;
    });
}
exports.updateUserPassword = updateUserPassword;
function updateUserResetToken(id, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const expirationDate = new Date(Date.now() + 5 * 60 * 1000);
        const user = yield index_1.prisma.user.update({
            where: { id },
            data: {
                resetToken: token,
                resetTokenExpiration: expirationDate,
            },
        });
        return user;
    });
}
exports.updateUserResetToken = updateUserResetToken;
function validateUserResetToken(id, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield index_1.prisma.user.findUnique({
            where: { id },
        });
        if (user &&
            user.resetToken == token &&
            Date.now() < user.resetTokenExpiration) {
            yield index_1.prisma.user.update({
                where: { id },
                data: {
                    resetToken: null,
                    resetTokenExpiration: null,
                },
            });
            return true;
        }
        else {
            return false;
        }
    });
}
exports.validateUserResetToken = validateUserResetToken;
