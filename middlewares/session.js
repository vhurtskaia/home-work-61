const session = require('express-session');

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'home-work-61-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60,
    httpOnly: true,
  },
});

module.exports = sessionMiddleware;
