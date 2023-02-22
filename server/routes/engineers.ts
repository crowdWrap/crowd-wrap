import express, { response } from "express";
import { readFile } from "node:fs";
export const router = express.Router();
let engineersArray: string[];

readFile("../engineers.txt", "utf8", async (err, data) => {
  if (err) {
    throw err;
  }

  const response = await data;
  const editedResponse = response.split("\n");
  engineersArray = editedResponse.splice(0, editedResponse.length - 1);
});

router.get("/", (req, res) => {
  res.set('Content-Type', 'application/json');
  console.log("ROUTER")
  res.json(engineersArray);
});
