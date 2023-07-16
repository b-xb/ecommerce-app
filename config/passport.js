const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const { fetchPassword } = require("../models/auth")
const { getById } = require("../models/users")

// Set up the Passport strategy:
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
},
  async function (email, password, done) {

    try {
      const fetchPasswordResponse = await fetchPassword(email);

      if (fetchPasswordResponse.rowCount===1) {
        const { id, password: storedPassword } = fetchPasswordResponse.rows[0];
        const matchedPassword = await bcrypt.compare(password, storedPassword);
        if(!matchedPassword) return done(null, false);
        return done(null, {id});
      } else {
        return done(null, false);
      }

    } catch (error) {
      return done(error);
    }
  })
);

// Serialize a user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize a user
passport.deserializeUser(async (id, done) => {
  try {
    const response = await getById(id);
    if (response.rowCount===1) {
      const user = response.rows[0];
      done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(error);
  }
});