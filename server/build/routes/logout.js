"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (req, res) => {
    req.logout(function (err) {
        if (err) {
            return res.status(401).json({ message: "Logout failed" });
        }
    });
    res.setHeader("Set-Cookie", "");
    res.status(200).json({ message: "Logout successful" });
});
exports.default = router;
