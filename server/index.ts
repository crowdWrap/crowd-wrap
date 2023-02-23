
import express from "express";
import morgan from 'morgan';
import { router } from "./routes/engineers";

const app = express();
app.use(morgan('combined'));

app.listen(8000, () => {
  console.log('Server is listening on port 8000');
});

app.use("/crowdWrap/engineers", router);

app.get("/crowdWrap", (req, res) => {
  res.send("hey guys");
});

app.post("/register", (req, res) => {
  console.log(req.body, "BACKEND");
  res.status(200).json({ message: "Registration successful" });
})

app.post("/login", (req, res) => {
  console.log(req.body, "BACKEND");
  res.status(200).json({ message: "login successful" });
})

app.post("/profile", (req, res) => {})

export { app };
