import express from "express";
export const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    {
      engineer: "sky159321",
    },
    {
      engineer: "Garv",
    },
    {
      engineer: "Favade",
    },
    {
      engineer: "Sana",
    },
    {
      engineer: "Vinh",
    },
    {
      engineer: "Qadeer",
    },
  ]);
});
