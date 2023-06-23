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
    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
    const isInputEmail = regex.test(username);

    if (!isInputEmail) {
      user = await getProfileByUsername(username);
    } else {
      user = await getProfileByEmail(username);
    }

    if (user == null) {
      return done(null, false, {
        message: "Account or Password is incorrect, please try again",
      });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
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
