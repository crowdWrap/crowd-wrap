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
exports.getProfileByEmail = exports.getProfilesByPartialUsername = exports.getProfileByUsername = exports.getProfileById = void 0;
const index_1 = require("../index");
function getProfileById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const userProfile = yield index_1.prisma.user.findUniqueOrThrow({
            where: {
                id,
            },
            select: {
                id: true,
                username: true,
                usernameSet: true,
                paymentType: true,
                email: true,
                picture: true,
                registeredWith: true,
                friends: {
                    select: {
                        id: true,
                        username: true,
                        picture: true,
                    },
                },
                friendRequests: {
                    select: {
                        id: true,
                        username: true,
                        picture: true,
                    },
                },
                friendRequestsSent: {
                    select: {
                        id: true,
                        username: true,
                        picture: true,
                    },
                },
                friendOf: {
                    select: {
                        id: true,
                        username: true,
                        picture: true,
                    },
                },
                events: true,
                ownedEvents: true,
            },
        });
        if (userProfile) {
            return userProfile;
        }
        else {
            console.log("Profile not found.");
            throw new Error(`Profile '${id}' doesn't exist.`);
        }
    });
}
exports.getProfileById = getProfileById;
function getProfileByUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userProfile = yield index_1.prisma.user.findUnique({
                where: {
                    username,
                },
                include: {
                    friends: {
                        select: {
                            id: true,
                            username: true,
                            picture: true,
                        },
                    },
                    friendRequests: {
                        select: {
                            id: true,
                            username: true,
                            picture: true,
                        },
                    },
                    friendRequestsSent: {
                        select: {
                            id: true,
                            username: true,
                            picture: true,
                        },
                    },
                    friendOf: {
                        select: {
                            id: true,
                            username: true,
                            picture: true,
                        },
                    },
                    events: true,
                    ownedEvents: true,
                },
            });
            if (userProfile) {
                return userProfile;
            }
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.getProfileByUsername = getProfileByUsername;
function getProfilesByPartialUsername(partialUsername) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userProfiles = yield index_1.prisma.user.findMany({
                where: {
                    username: {
                        contains: partialUsername,
                        mode: "insensitive",
                    },
                },
            });
            return userProfiles;
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.getProfilesByPartialUsername = getProfilesByPartialUsername;
function getProfileByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userProfile = yield index_1.prisma.user.findUnique({
                where: {
                    email,
                },
            });
            if (userProfile) {
                return userProfile;
            }
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.getProfileByEmail = getProfileByEmail;
