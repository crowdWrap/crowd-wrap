import express from "express";
import morgan from 'morgan';
import { router } from "./routes/engineers";
import {getProfileByUsername, createUser} from "./queries"
import bcrypt from 'bcryptjs';
import { usernameAuth } from "./auth";
import cors from "cors";
import passport from "passport"
import cookieParser from 'cookie-parser';
import session from 'express-session';
import dotenv from "dotenv";



export const app = express();

dotenv.config();

const secretVal = process.env.SECRET || "N/A";
if (secretVal !== undefined) {
  console.log(secretVal);
}

// Middleware 
app.use(cors({
  origin: "localhost:3000",
  credentials: true
}))

app.use(passport.initialize());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(secretVal));
app.use(passport.session());
app.use(session({
  secret: secretVal,
  resave: false,
  saveUninitialized: false,
}));



app.use(morgan('combined'));
app.use(express.json());
app.use("/crowdWrap/engineers", router);

app.get("/crowdWrap", (req, res) => {
  res.send("hey guys");
});

app.post("/register", async (req, res) => {
  const { username,email, password } = req.body;

  const hashedPass = await bcrypt.hash(password, 10);

  createUser(username, email, hashedPass);
  const isProfile = await getProfileByUsername(username)
  const response = JSON.stringify(isProfile)
  console.log("Profile returned: ", response);
})

app.post("/login", async (req, res) => {
  // const { username, password } = req.body;

  passport.authenticate("local", (err:String, user:User)=>{
    if(err) throw err
    if(!user) res.send("no user found")
    else{
      req.logIn(user, err => {
        if (err) throw err;
        res.send("Login authenticated.")
      })
    } 
  })
  // const profile = await getProfileByUsername(username);

  // const response = JSON.stringify(profile);
  // console.log(response);
})

app.post("/profile", (req, res) => {
  
})

app.listen(8000, () => {
  console.log('Server is listening on port 8000');
});


