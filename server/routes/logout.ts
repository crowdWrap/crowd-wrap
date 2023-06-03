import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(401).json({ message: "Logout failed" });
    }
  });
  res.setHeader("Set-Cookie", "");
  res.status(200).json({ message: "Logout successful" });
});

export default router;
