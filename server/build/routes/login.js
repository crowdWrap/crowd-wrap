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
const userQueries_1 = require("../queries/userQueries");
const google_auth_library_1 = require("google-auth-library");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const passport_1 = __importDefault(require("passport"));
const profileQueries_1 = require("../queries/profileQueries");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mail_1 = __importDefault(require("@sendgrid/mail"));
mail_1.default.setApiKey(process.env.SENDGRID_API);
const client = new google_auth_library_1.OAuth2Client(process.env.CLIENTID);
const router = (0, express_1.Router)();
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.session.user) {
        const user = yield (0, profileQueries_1.getProfileById)(Number(req.session.user));
        return res.status(200).json({ message: "Good to go!", user });
    }
    else {
        return res.status(401).json({ message: "You arent logged in!" });
    }
}));
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate("local", (err, user) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: "This user does not exist!" });
        }
        req.logIn(user, (err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                return next(err);
            }
            req.session.user = user.id.toString();
            const userAccount = yield (0, profileQueries_1.getProfileById)(Number(req.session.user));
            return res
                .status(200)
                .json({ message: `${user.username} has logged in`, user: userAccount });
        }));
    })(req, res, next);
}));
router.post("/googleOauth", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.credential) {
        try {
            const token = req.body.credential;
            let payload;
            function verify() {
                return __awaiter(this, void 0, void 0, function* () {
                    const ticket = yield client.verifyIdToken({
                        idToken: token,
                        audience: process.env.CLIENTID,
                    });
                    payload = ticket.getPayload();
                    const userid = payload["sub"];
                });
            }
            verify().then(() => __awaiter(void 0, void 0, void 0, function* () {
                const email = payload.email;
                const picture = payload.picture;
                const sub = payload.sub;
                const emailExists = yield (0, profileQueries_1.getProfileByEmail)(email);
                if (!emailExists) {
                    return res.status(400).json({ message: "This user does not exist" });
                }
                const user = yield (0, profileQueries_1.getProfileByEmail)(email);
                req.logIn(user, (err) => __awaiter(void 0, void 0, void 0, function* () {
                    if (err) {
                        return next(err);
                    }
                    req.session.user = user.id.toString();
                    const userAccount = yield (0, profileQueries_1.getProfileById)(Number(req.session.user));
                    return res
                        .status(200)
                        .json({ message: `${email} has logged in`, user: userAccount });
                }));
            }));
        }
        catch (e) {
            console.log("Login Google Oauth Error:", e);
            return res.status(401).json({ message: "Google Oauth Failed" });
        }
    }
    else {
        return res.status(401).json({ message: "Google Oauth Failed" });
    }
}));
router.post("/forgot", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usernameOrEmail = req.body.usernameEmail;
    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    let user;
    const isInputEmail = regex.test(usernameOrEmail);
    if (!isInputEmail) {
        user = yield (0, profileQueries_1.getProfileByUsername)(usernameOrEmail);
    }
    else {
        user = yield (0, profileQueries_1.getProfileByEmail)(usernameOrEmail);
    }
    if (user !== null && user && user.registeredWith !== "google") {
        const resetToken = Math.floor(100000000 + Math.random() * 900000000);
        yield (0, userQueries_1.updateUserResetToken)(Number(user.id), resetToken.toString());
        const msg = {
            to: `${user.email}`,
            from: "crowdwrap@gmail.com",
            subject: "Password Reset",
            text: `Hi, your password reset token is ${resetToken}. It will last for 5 minutes!`,
        };
        mail_1.default
            .send(msg)
            .then(() => {
            console.log("Email sent");
        })
            .catch((error) => {
            console.error(error);
        });
    }
    return res.status(200).json({ message: "Good to go!" });
}));
router.post("/forgot/check", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usernameOrEmail = req.body.usernameEmail;
    const token = req.body.token;
    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    let user;
    const isInputEmail = regex.test(usernameOrEmail);
    if (!isInputEmail) {
        user = yield (0, profileQueries_1.getProfileByUsername)(usernameOrEmail);
    }
    else {
        user = yield (0, profileQueries_1.getProfileByEmail)(usernameOrEmail);
    }
    if (user !== null && user) {
        const validation = yield (0, userQueries_1.validateUserResetToken)(Number(user.id), token);
        console.log(validation);
        return res.status(200).json({ valid: validation });
    }
    return res.status(400).json({ valid: false });
}));
router.post("/forgot/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usernameOrEmail = req.body.usernameEmail;
    const password = req.body.password;
    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    let user;
    const isInputEmail = regex.test(usernameOrEmail);
    if (!isInputEmail) {
        user = yield (0, profileQueries_1.getProfileByUsername)(usernameOrEmail);
    }
    else {
        user = yield (0, profileQueries_1.getProfileByEmail)(usernameOrEmail);
    }
    if (user !== null && user) {
        if (!password || password.length < 8 || password.length > 20) {
            return res.status(400).json({ message: "Invalid fields" });
        }
        const hashedPass = yield bcryptjs_1.default.hash(password, 10);
        const updatedUser = yield (0, userQueries_1.updateUserPassword)(Number(user.id), hashedPass);
        return res.status(200).json({ message: "Password Changed!" });
    }
    else {
        return res.status(400).json({ message: "Invalid User!" });
    }
}));
exports.default = router;
