import bcrypt from 'bcryptjs'
import { error } from 'console';
import { Strategy as LocalStrategy } from 'passport-local';
import {prisma, getProfileById, getProfileByUsername, createUser, getProfileByEmail} from "./queries"
import {app} from "./index"
import session from 'express-session';

export function usernameAuth(passport: PassportStatic){
    new LocalStrategy(async (username, password, done) => {
        const user = await getProfileByUsername(username);
        bcrypt.compare(password, user.password, (err, result) => {
        if (err) throw err;
        if (result == true) {
            return done(null, user);
        } else {
            return done(null, false);
        }
        });
    })

    passport.serializeUser((user: User, cb: Function) => {
        cb(user.id)
    })
    passport.deserializeUser(async (id: number, cb: Function) => {
        const user = await getProfileById(id);
        cb(user)
    }) 
}


// export function emailAuth(){
//     new LocalStrategy(async (email, password, done) => {
//         const user = await getProfileByEmail(email)
//         bcrypt.compare(password, user.password, (err, result) => {
//             if (err) throw err;
//             if (result == true){
//                 return done(null, user);
//             }else{
//                 return done(null, false);
//             }
//         });
//     })
// }



