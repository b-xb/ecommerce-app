const express = require('express');
require('dotenv').config();
const session = require("express-session");
const passport = require("passport");
var cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());

const path = require('path');

app.use(express.static(path.join(__dirname, 'build')));

require("./config/passport");

// Session Config
const pgSession = require('connect-pg-simple')(session);
const pool = require('./models/database');

app.use(session({
  store: new pgSession({
    pool,
    tableName : 'session'
  }),
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 300000000, secure: false },
  saveUninitialized: false,
  resave: false,
}));

// Passport Config
app.use(passport.initialize());
app.use(passport.session());

const apiRouter = require('./routes/api/v1');
app.use('/api/v1',apiRouter);

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// This conditional is here for testing purposes:
if (!module.parent) {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

module.exports = app;