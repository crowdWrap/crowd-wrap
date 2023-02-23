import express from "express";
import cors from "cors";
import passport from "passport"
import { Strategy as LocalStrategy } from 'passport-local';
import cookieParser from 'cookie-parser';
import bcryptjs from 'bcryptjs';
import session from 'express-session';
import dotenv from "dotenv";
import { app } from './';

  
dotenv.config();
const secretVal = process.env.SECRET || "N/A";
if (secretVal !== undefined) {
  console.log(secretVal);
}

// Middleware 
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    origin: "localhost:3000",
    credentials: true
}))

app.use(session({ 
    secret: secretVal, resave: false, saveUninitialized: true 
}));

app.use(cookieParser(secretVal));

// Routes



