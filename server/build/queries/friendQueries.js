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
exports.getFriendsByPartialUsername = exports.removeFriend = exports.addFriend = exports.removeFriendReceived = exports.removeFriendSent = exports.updateFriendRequestSent = exports.updateFriendRequest = void 0;
const index_1 = require("../index");
const profileQueries_1 = require("./profileQueries");
function updateFriendRequest(username, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const sentUser = yield (0, profileQueries_1.getProfileById)(id);
            const updatedUser = yield index_1.prisma.user.update({
                where: { username: username },
                data: {
                    friendRequests: {
                        connect: [
                            {
                                username: sentUser === null || sentUser === void 0 ? void 0 : sentUser.username,
                            },
                        ],
                    },
                },
            });
            return updatedUser;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.updateFriendRequest = updateFriendRequest;
function updateFriendRequestSent(username, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const receivingUser = yield (0, profileQueries_1.getProfileByUsername)(username);
            const updatedUser = yield index_1.prisma.user.update({
                where: { id: id },
                data: {
                    friendRequestsSent: {
                        connect: [
                            {
                                username: receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.username,
                            },
                        ],
                    },
                },
            });
            return updatedUser;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.updateFriendRequestSent = updateFriendRequestSent;
function removeFriendSent(username, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //username = the person that sent, and the id = the current user.
            const sentUser = yield (0, profileQueries_1.getProfileByUsername)(username);
            const updatedUser = yield index_1.prisma.user.update({
                where: { id: id },
                data: {
                    friendRequestsSent: {
                        disconnect: [
                            {
                                id: sentUser === null || sentUser === void 0 ? void 0 : sentUser.id,
                            },
                        ],
                    },
                },
            });
            return updatedUser;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.removeFriendSent = removeFriendSent;
function removeFriendReceived(username, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //username = user to remove friend received from, id = user who sent the request and who to remove
            const sentUser = yield (0, profileQueries_1.getProfileById)(id);
            const updatedUser = yield index_1.prisma.user.update({
                where: { username: username },
                data: {
                    friendRequests: {
                        disconnect: [
                            {
                                id: sentUser.id,
                            },
                        ],
                    },
                },
            });
            return updatedUser;
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.removeFriendReceived = removeFriendReceived;
function addFriend(username, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //username = the person who sent it, and the id =  the current user
            const receivingUser = yield (0, profileQueries_1.getProfileById)(id);
            const sentUser = yield (0, profileQueries_1.getProfileByUsername)(username);
            const updatedCurrentUser = yield index_1.prisma.user.update({
                where: { id: id },
                data: {
                    friends: {
                        connect: [
                            {
                                username: sentUser === null || sentUser === void 0 ? void 0 : sentUser.username,
                            },
                        ],
                    },
                },
            });
            const updatedOppositeUser = yield index_1.prisma.user.update({
                where: { id: sentUser === null || sentUser === void 0 ? void 0 : sentUser.id },
                data: {
                    friends: {
                        connect: [
                            {
                                username: receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.username,
                            },
                        ],
                    },
                },
            });
            return { updatedCurrentUser, updatedOppositeUser };
        }
        catch (error) {
            throw error;
        }
    });
}
exports.addFriend = addFriend;
function removeFriend(username, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            //username = the person who sent it, and the id =  the current user
            const receivingUser = yield (0, profileQueries_1.getProfileById)(id);
            const sentUser = yield (0, profileQueries_1.getProfileByUsername)(username);
            const updatedCurrentUser = yield index_1.prisma.user.update({
                where: { id: id },
                data: {
                    friends: {
                        disconnect: [
                            {
                                username: sentUser === null || sentUser === void 0 ? void 0 : sentUser.username,
                            },
                        ],
                    },
                },
            });
            const updatedOppositeUser = yield index_1.prisma.user.update({
                where: { id: sentUser === null || sentUser === void 0 ? void 0 : sentUser.id },
                data: {
                    friends: {
                        disconnect: [
                            {
                                username: receivingUser === null || receivingUser === void 0 ? void 0 : receivingUser.username,
                            },
                        ],
                    },
                },
            });
            return { updatedCurrentUser, updatedOppositeUser };
        }
        catch (error) {
            throw error;
        }
    });
}
exports.removeFriend = removeFriend;
function getFriendsByPartialUsername(partialUsername, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        //current user = userId
        try {
            const user = yield index_1.prisma.user.findUnique({
                where: { id: userId },
                include: {
                    friends: {
                        select: {
                            id: true,
                            username: true,
                            picture: true,
                        },
                    },
                },
            });
            const matchingFriends = user === null || user === void 0 ? void 0 : user.friends.filter((friend) => friend.username.toLowerCase().includes(partialUsername.toLowerCase()));
            return matchingFriends;
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.getFriendsByPartialUsername = getFriendsByPartialUsername;
