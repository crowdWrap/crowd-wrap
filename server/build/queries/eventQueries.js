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
exports.updateEventCurrentFunds = exports.getParticipantById = exports.isParticipantInEvent = exports.getEventByLink = exports.getAllEventsByid = exports.getEventById = exports.addParticipant = exports.removeParticipant = exports.removeEvent = exports.createEvent = void 0;
const index_1 = require("../index");
const profileQueries_1 = require("./profileQueries");
function createEvent(id, eventInfo, inviteLink) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield (0, profileQueries_1.getProfileById)(id);
            yield index_1.prisma.event.create({
                data: {
                    title: eventInfo.title,
                    description: eventInfo.description,
                    inviteLink: inviteLink,
                    ownerId: id,
                    moneyGoal: eventInfo.moneyGoal,
                    Currentfunds: 0,
                    image: eventInfo.img,
                    deadlineDate: eventInfo.date,
                    participants: {
                        create: {
                            userId: id,
                            picture: user.picture,
                            username: user.username,
                            currentMoney: 0,
                        },
                    },
                },
            });
        }
        catch (e) {
            throw e;
        }
    });
}
exports.createEvent = createEvent;
function removeEvent(eventId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield index_1.prisma.event.delete({
                where: { id: eventId },
            });
        }
        catch (e) {
            throw e;
        }
    });
}
exports.removeEvent = removeEvent;
function removeParticipant(id, eventId) {
    return __awaiter(this, void 0, void 0, function* () {
        const participant = yield index_1.prisma.eventToUser.findFirst({
            where: {
                userId: id,
                eventId,
            },
        });
        if (!participant) {
            throw new Error(`User ${id} is not a participant in event ${eventId}`);
        }
        yield index_1.prisma.eventToUser.delete({
            where: {
                id: participant.id,
            },
        });
    });
}
exports.removeParticipant = removeParticipant;
function addParticipant(id, eventId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const participantExists = yield index_1.prisma.eventToUser.findFirst({
                where: {
                    userId: id,
                    eventId,
                },
            });
            if (participantExists) {
                console.log(`User ${id} is already a participant in event ${eventId}`);
            }
            const user = yield (0, profileQueries_1.getProfileById)(id);
            yield index_1.prisma.eventToUser.create({
                data: {
                    user: {
                        connect: { id },
                    },
                    event: {
                        connect: { id: eventId },
                    },
                    picture: user.picture,
                    username: user.username,
                    currentMoney: 0,
                },
            });
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.addParticipant = addParticipant;
function getEventById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const event = yield index_1.prisma.event.findUnique({
            where: {
                id,
            },
            include: {
                participants: {
                    orderBy: {
                        joinedAt: "asc",
                    },
                },
            },
        });
        if (event) {
            return event;
        }
        else {
            return null;
        }
    });
}
exports.getEventById = getEventById;
function getAllEventsByid(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const events = yield index_1.prisma.eventToUser.findMany({
            where: {
                userId: id,
            },
            include: {
                event: {
                    include: {
                        participants: {
                            orderBy: {
                                joinedAt: "asc",
                            },
                        },
                    },
                },
            },
            orderBy: {
                event: {
                    createdAt: "desc",
                },
            },
        });
        return events.map((e) => e.event);
    });
}
exports.getAllEventsByid = getAllEventsByid;
function getEventByLink(link) {
    return __awaiter(this, void 0, void 0, function* () {
        const event = yield index_1.prisma.event.findUnique({
            where: {
                inviteLink: link,
            },
            include: {
                participants: true,
            },
        });
        if (event) {
            return event;
        }
        else {
            return null;
        }
    });
}
exports.getEventByLink = getEventByLink;
function isParticipantInEvent(id, eventId) {
    return __awaiter(this, void 0, void 0, function* () {
        const participantExists = yield index_1.prisma.eventToUser.findFirst({
            where: {
                userId: id,
                eventId,
            },
        });
        if (participantExists) {
            return true;
        }
        else {
            return false;
        }
    });
}
exports.isParticipantInEvent = isParticipantInEvent;
function getParticipantById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const userProfile = yield index_1.prisma.user.findUniqueOrThrow({
            where: {
                id,
            },
            include: {
                friends: false,
                friendRequests: false,
                friendRequestsSent: false,
                friendOf: false,
                events: false,
                ownedEvents: false,
            },
        });
        if (userProfile) {
            return { pic: userProfile.picture, id };
        }
        else {
            console.log("Profile not found.");
            throw new Error(`Profile '${id}' doesn't exist.`);
        }
    });
}
exports.getParticipantById = getParticipantById;
function updateEventCurrentFunds(eventId, currentMoney) {
    return __awaiter(this, void 0, void 0, function* () {
        const event = yield getEventById(eventId);
        if (event) {
            const updatedEvent = yield index_1.prisma.event.update({
                where: {
                    id: eventId,
                },
                data: {
                    Currentfunds: (event === null || event === void 0 ? void 0 : event.Currentfunds) + currentMoney,
                },
            });
            return updatedEvent;
        }
        else {
            throw new Error(`${eventId} doesnt exist`);
        }
    });
}
exports.updateEventCurrentFunds = updateEventCurrentFunds;
