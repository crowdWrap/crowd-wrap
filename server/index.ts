import express from "express";

const app = express();
const engineers = require("./routes/engineers.ts");

const port = 8000;

app.use("/crowdWrap/engineers", engineers);

app.get("/crowdWrap", (req, res) => {
  res.send("hey guys");
});

app.listen(port);
