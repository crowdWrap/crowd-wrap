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
exports.updatePaymentTypeById = exports.getPaymentTypeById = void 0;
const index_1 = require("../index");
function getPaymentTypeById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield index_1.prisma.user.findUnique({
            where: { id },
        });
        return user === null || user === void 0 ? void 0 : user.paymentType;
    });
}
exports.getPaymentTypeById = getPaymentTypeById;
function updatePaymentTypeById(id, paymentType) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield index_1.prisma.user.update({
            where: { id },
            data: {
                paymentType,
            },
        });
        return user;
    });
}
exports.updatePaymentTypeById = updatePaymentTypeById;
