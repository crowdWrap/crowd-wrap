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
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
function intializePassport(passport, getProfileByUsername, getProfileById, getProfileByEmail) {
    const authenticateUser = (username, 
    // email: string,
    password, done) => __awaiter(this, void 0, void 0, function* () {
        let user;
        let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
        const isInputEmail = regex.test(username);
        if (!isInputEmail) {
            user = yield getProfileByUsername(username);
        }
        else {
            user = yield getProfileByEmail(username);
        }
        if (user == null) {
            return done(null, false, {
                message: "Account or Password is incorrect, please try again",
            });
        }
        try {
            if (yield bcryptjs_1.default.compare(password, user.password)) {
                return done(null, user);
            }
            else {
                return done(null, false, {
                    message: "Account or Password is incorrect, please try again",
                });
            }
        }
        catch (e) {
            return done(e);
        }
    });
    passport.use(new passport_local_1.Strategy(authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getProfileById(id));
    });
}
exports.default = intializePassport;
