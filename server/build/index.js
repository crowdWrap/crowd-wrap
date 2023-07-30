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
exports.onlineUsers = exports.io = exports.prisma = exports.app = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const profileQueries_1 = require("./queries/profileQueries");
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const passport_2 = __importDefault(require("./passport"));
const prisma_session_store_1 = require("@quixo3/prisma-session-store");
const client_1 = require("@prisma/client");
const express_session_1 = __importDefault(require("express-session"));
const register_1 = __importDefault(require("./routes/register"));
const login_1 = __importDefault(require("./routes/login"));
const logout_1 = __importDefault(require("./routes/logout"));
const profile_1 = __importDefault(require("./routes/profile"));
const friends_1 = __importDefault(require("./routes/friends"));
const events_1 = __importDefault(require("./routes/events"));
const payment_1 = __importDefault(require("./routes/payment"));
// import path from "path"
const morgan = require("morgan");
exports.app = (0, express_1.default)();
exports.prisma = new client_1.PrismaClient();
const sessionMiddleware = (0, express_session_1.default)({
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false,
    store: new prisma_session_store_1.PrismaSessionStore(exports.prisma, {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
    }),
});
exports.app.use(sessionMiddleware);
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)({ origin: true }));
exports.app.use(express_1.default.urlencoded({ extended: false }));
exports.app.use(passport_1.default.initialize());
exports.app.use(passport_1.default.session());
exports.app.use(morgan("dev"));
(0, passport_2.default)(passport_1.default, profileQueries_1.getProfileByUsername, profileQueries_1.getProfileById, profileQueries_1.getProfileByEmail);
const server = http_1.default.createServer(exports.app);
exports.io = new socket_io_1.Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3001/",
        credentials: true,
    },
});
// const buildPath = path.join(__dirname, "../../client/build");
// app.use('/static', express.static(path.join(__dirname, '../../client/build/static')))
// app.use('/static', express.static(path.join(__dirname, '../client/build/static')));
exports.io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res || {}, next);
});
exports.onlineUsers = {};
exports.io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("User Connected", socket.id);
    try {
        let session = socket.request.session;
        session.userId = session.user;
        session.socketId = socket.id;
        session.status = "online";
        exports.onlineUsers[session.user] = [socket.id, session.status];
        console.log(exports.onlineUsers);
        yield session.save();
    }
    catch (e) {
        throw e;
    }
    socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("User Disconnected", socket.id);
        let session = socket.request.session;
        session.status = "offline";
        exports.onlineUsers[session.user] = [socket.id, session.status];
        console.log(exports.onlineUsers);
    }));
}));
exports.app.use("/register", register_1.default);
exports.app.use("/login", login_1.default);
exports.app.use("/logout", logout_1.default);
exports.app.use("/profile", profile_1.default);
exports.app.use("/friends", friends_1.default);
exports.app.use("/events", events_1.default);
exports.app.use("/payment", payment_1.default);
// app.get('*', function (req, res) {
//   res.sendFile(path.join(buildPath, 'index.html'));
// });
const port = process.env.PORT || 8000;
server.listen(port, () => {
    console.log(`Server is listening ${port}`);
});
