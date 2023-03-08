import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";

export default function intializePassport(
  passport: any,
  getProfileByUsername: any,
  getProfileById: Function
) {
  const authenticateUser = async (
    username: string,
    password: string,
    done: any
  ) => {
    const user = await getProfileByUsername(username);

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
