import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";

export default function intializePassport(
  passport: any,
  getProfileByUsername: any,
  getProfileById: Function,
  getProfileByEmail: any
) {
  const authenticateUser = async (
    username: string,
    // email: string,
    password: string,
    done: any
  ) => {
    let user;

    const isInputEmail = username.includes("@");

    if (!isInputEmail) {
      user = await getProfileByUsername(username);
    } else if (isInputEmail) {
      user = await getProfileByEmail(username);
    }

    if (user == null) {
      return done(null, false, {
        message: "Account or Password is incorrect, please try again",
      });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        console.log("correct! User loggedin:", user.username);
        return done(null, user);
      } else {
        console.log("incorrect! try again");
        return done(null, false, {
          message: "Account or Password is incorrect, please try again",
        });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new LocalStrategy(authenticateUser));
  passport.serializeUser((user: User, done: any) => done(null, user.id));
  passport.deserializeUser((id: Number, done: any) => {
    return done(null, getProfileById(id));
  });
}
