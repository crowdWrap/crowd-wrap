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
const profileQueries_1 = require("../queries/profileQueries");
const eventQueries_1 = require("../queries/eventQueries");
const crypto_1 = __importDefault(require("crypto"));
const client = new google_auth_library_1.OAuth2Client(process.env.CLIENTID);
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "Missing fields" });
        }
        else if (password.length < 8 ||
            password.length > 20 ||
            username.length < 3 ||
            username.length > 15 ||
            !email.includes("@")) {
            return res.status(400).json({ message: "Invalid fields" });
        }
        //makes sure that the user doesnt exist
        const emailExists = yield (0, profileQueries_1.getProfileByEmail)(email);
        const usernameExists = yield (0, profileQueries_1.getProfileByUsername)(username);
        if (usernameExists) {
            return res
                .status(400)
                .json({ message: "This user exists, please login!" });
        }
        else if (emailExists) {
            return res
                .status(400)
                .json({ message: "This email has already been used, please login!" });
        }
        //then continues normal process
        const hashedPass = yield bcryptjs_1.default.hash(password, 10);
        //Create user and send to DB
        const user = yield (0, userQueries_1.createUser)(username, email, hashedPass, "local", true);
        const currentDate = new Date();
        // Extract the individual components of the date
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        (0, eventQueries_1.createEvent)(Number(user.id), { title: "Welcome!", description: "This is an example event, to make your own press the plus on the top right", moneyGoal: "0", img: "default", date: formattedDate }, crypto_1.default.randomUUID());
        return res.status(201).json({ message: `${username} has been created` });
    }
    catch (e) {
        console.log("Registration Error:", e);
        return res.status(401).json({ message: "Registration Failed" });
    }
}));
router.post("/googleOauth", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
            verify()
                .then(() => __awaiter(void 0, void 0, void 0, function* () {
                const email = payload.email;
                const picture = payload.picture;
                const userData = payload.sub;
                const emailExists = yield (0, profileQueries_1.getProfileByEmail)(email);
                if (emailExists) {
                    return res
                        .status(400)
                        .json({ message: "This user exists, please login!" });
                }
                (0, userQueries_1.createUser)(userData, email, "", "google", false);
                if (picture) {
                    (0, userQueries_1.updateUser)(email, picture);
                }
                return res.status(200).json({ message: `${email} has been created` });
            }))
                .catch((e) => console.log("GoogleOauth error:", e));
        }
        catch (e) {
            console.log("GoogleOauth error:", e);
            return res.status(401).json({ message: "Google Oauth Failed" });
        }
    }
    else {
        return res.status(401).json({ message: "Google Oauth Failed" });
    }
}));
exports.default = router;
