import express from "express";
import morgan from 'morgan';
import { router } from "./routes/engineers";

const app = express();
app.use(morgan('combined'));

const port = 8000;

app.use("/crowdWrap/engineers", router);

app.get("/crowdWrap", (req, res) => {
  res.send("hey guys");
});

app.listen(port);
