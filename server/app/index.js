'use strict';

var app = require('express')();
var path = require('path');
const session = require('express-session');
const User = require('../api/users/user.model.js');
var Sequelize = require('sequelize');

// "Enhancing" middleware (does not send response, server-side effects only)

app.use(require('./logging.middleware'));

app.use(require('./body-parsing.middleware'));

//session setup

app.use(session({
  secret: 'hoopla',
  resave: false,
  saveUninitialized: false
}));

app.use(function (req, res, next) {
  console.log('session', req.session);
  next();
});

// "Responding" middleware (may send a response back to client)

app.post('/login', function(req, res, next) {
  User.findOne({
    where: req.body
  })
  .then((user) => {
    if (!user) {
      res.sendStatus(401);
    }
    else {
      req.session.userId = user.id;
      res.sendStatus(200);
    }
  })
  .catch(next);
});

app.use('/api', require('../api/api.router'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'browser', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});

app.use(require('./statics.middleware'));

app.use(require('./error.middleware'));

module.exports = app;
