import express from "express";
import { router } from "./routes/engineers";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const port = process.env.PORT;

app.use("/crowdWrap/engineers", router);

app.get("/crowdWrap", (req, res) => {
  res.send("hey guys");
});

app.listen(port);
