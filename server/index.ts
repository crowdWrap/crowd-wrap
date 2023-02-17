import express from "express";
import session from "express-session";
import { router } from "./routes/engineers";

const app = express();

const port = 8000;

app.use("/crowdWrap/engineers", router);

app.get("/crowdWrap", (req, res) => {
  res.send("hey guys");
});

app.listen(port);

//Sessions

app.use(session);

app.get("/", (req, res) => {});
