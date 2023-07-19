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
const userQueries_1 = require("../queries/userQueries");
const router = (0, express_1.Router)();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const user = yield (0, profileQueries_1.getProfileById)(Number(req.session.user));
        res.setHeader("Content-Type", "application/json");
        return res.status(200).json({ user });
    }
    else {
        return res.status(401).json({ message: "Unauthorized" });
    }
}));
router.get("/setUsername", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const username = req.query.username;
        const usernameExists = yield (0, profileQueries_1.getProfileByUsername)(username);
        if (usernameExists) {
            return res.status(400).json({ isValid: false });
        }
        else {
            return res.status(200).json({ isValid: true });
        }
    }
}));
router.post("/setUsername", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const user = yield (0, profileQueries_1.getProfileById)(Number(req.session.user));
        res.setHeader("Content-Type", "application/json");
        const usernameExists = yield (0, profileQueries_1.getProfileByUsername)(req.body.username);
        if (usernameExists) {
            return res.status(400).json({ message: "This username is taken!" });
        }
        if (!req.body.username ||
            req.body.username.length < 3 ||
            req.body.username.length > 15) {
            return res.status(400).json({ message: "Invalid fields" });
        }
        const newUser = yield (0, userQueries_1.updateUserName)(user.email, req.body.username);
        yield (0, userQueries_1.updateEventToUserUsername)(Number(req.session.user), req.body.username);
        const newestUser = yield (0, userQueries_1.updateUserUsernameSet)(newUser.id, true);
        return res.status(200).json({
            message: `Your username has been set to ${req.body.username}!`,
            user: newestUser,
        });
    }
    else {
        console.log("not");
        return res.status(401).json({ message: "Not authorized" });
    }
}));
router.post("/password/update", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newPassword;
        const tempUser = yield (0, profileQueries_1.getProfileById)(Number(req.session.user));
        const user = yield (0, profileQueries_1.getProfileByEmail)(tempUser.email);
        if (user) {
            bcryptjs_1.default.compare(String(oldPassword), user.password, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    throw new Error(String(err));
                }
                else if (result) {
                    if (!newPassword ||
                        newPassword.length < 8 ||
                        newPassword.length > 20) {
                        return res.status(400).json({ message: "Invalid fields" });
                    }
                    const hashedPass = yield bcryptjs_1.default.hash(newPassword, 10);
                    const updatedUser = yield (0, userQueries_1.updateUserPassword)(Number(req.session.user), hashedPass);
                    return res.status(200).json({ message: "Password Changed!" });
                }
                else {
                    return res
                        .status(400)
                        .json({ message: "Old password does not match!" });
                }
            }));
        }
        else {
            return res.status(401).json({ message: "Error" });
        }
    }
}));
exports.default = router;
