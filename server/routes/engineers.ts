import express, { response } from "express";
import { readFile } from "node:fs";
export const router = express.Router();
let engineersArray: string[];

readFile("../engineers.txt", "utf8", async (err, data) => {
  if (err) {
    throw err;
  }

  const response = await data;
  const editedReponse = response.split("\n");
  engineersArray = editedReponse.splice(0, editedReponse.length - 1);
});

router.get("/", (req, res) => {
  res.json(engineersArray);
});
