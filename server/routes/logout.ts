import { Router } from "express";
const router = Router();

router.get("/", (req:any, res:any) => {
  req.logout(function (err:any) {
    if (err) {
      return res.status(401).json({ message: "Logout failed" });
    }
  });
  res.setHeader("Set-Cookie", "");
  res.status(200).json({ message: "Logout successful" });
});

export default router;
