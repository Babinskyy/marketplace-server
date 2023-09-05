import Users from "../entities/Users";
import bcrypt from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
import datasource from "../db/datasource";

const passportFunc = (passport: any) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const usersRepository = datasource.getRepository(Users);
      try {
        const user = await usersRepository.findOne({
          where: {
            username: username,
          },
        });

        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        } else {
          bcrypt.compare(password, user.password, (err, result) => {
            if (err) throw err;
            if (result) {
              return done(null, user, { message: "Authentication passed." });
            } else {
              return done(null, false, { message: "Authentication failed." });
            }
          });
        }
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user: Users, cb: any) => {
    cb(null, user.id);
  });

  passport.deserializeUser(async (id: number, cb: any) => {
    const usersRepository = datasource.getRepository(Users);
    try {
      const user = await usersRepository.findOne({
        where: {
          id: id,
        },
      });
      if (user) {
        cb(null, user.username);
      } else {
        cb(null, false);
      }
    } catch (err) {
      cb(err);
    }
  });
};

export default passportFunc;
