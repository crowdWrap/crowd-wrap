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
exports.getMessagesById = exports.removeMessages = exports.createMessage = void 0;
const index_1 = require("../index");
function createMessage(userId, eventId, content) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newMessage = yield index_1.prisma.message.create({
                data: {
                    userId,
                    eventId,
                    content,
                },
            });
            return newMessage;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.createMessage = createMessage;
function removeMessages(eventId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield index_1.prisma.message.deleteMany({
                where: { eventId: eventId },
            });
        }
        catch (e) {
            throw e;
        }
    });
}
exports.removeMessages = removeMessages;
function getMessagesById(eventId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const message = yield index_1.prisma.message.findMany({
                where: {
                    eventId,
                },
                include: {
                    user: true,
                },
                orderBy: {
                    createdAt: "asc",
                },
            });
            return message;
        }
        catch (e) {
            throw e;
        }
    });
}
exports.getMessagesById = getMessagesById;
