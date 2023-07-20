const express = require('express');
require('dotenv').config();
const session = require("express-session");
const store = new session.MemoryStore();
const passport = require("passport");

const app = express();
const PORT = process.env.PORT || 4001;

require("./config/passport");

// Session Config
// TODO: switch out below for a more secure setup - perhaps change this setting based on environment
// e.g.
// app.use(
//   session({
//     secret: process.env.SESSION_SECRET,
//     cookie: { maxAge: 1000 * 60 *60 * 24, secure: true, sameSite: "none" },
//     saveUninitialized: false,
//     resave: false,
//   })
// );

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 300000000, secure: false },
    saveUninitialized: false,
    resave: false,
    store,
  })
);

// Passport Config
app.use(passport.initialize());
app.use(passport.session());

const apiRouter = require('./routes/api/v1');
app.use('/api/v1',apiRouter);

// This conditional is here for testing purposes:
if (!module.parent) {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

module.exports = app;