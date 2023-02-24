import express from "express";
import morgan from 'morgan';
import { router } from "./routes/engineers";
import getProfile from "./queries"



const app = express();
app.use(morgan('combined'));



app.use("/crowdWrap/engineers", router);

app.get("/crowdWrap", (req, res) => {
  res.send("hey guys");
});

app.post("/register", (req, res) => {
  console.log(req.body, "BACKEND");
  res.status(200).json({ message: "Registration successful" });
})

app.post("/login", async (req, res) => {
  const profile = await getProfile(res);
  const response = JSON.stringify(profile);
  console.log(response);
  res.status(200).send(response);
})

app.post("/profile", (req, res) => {
  
})

app.listen(8000, () => {
  console.log('Server is listening on port 8000');
});

export { app };
