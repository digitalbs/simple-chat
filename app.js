'use strict';

var express = require('express');
var app = express();
var errorHandlers = require('./middleware/errorHandlers');
var log = require('./middleware/log');
var routes = require('./routes');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);
var partials = require('express-partials');
var csrf = require('csurf');
var bodyParser = require('body-parser');
var util = require('./middleware/utils');

//partial and layouts
app.use(partials());

//logger
app.use(log.logger);

//Public files
app.use(express.static(__dirname + '/public'));

//manage cookies
app.use(cookieParser('secret'));

//manage session
//needs to go after cookie, since cookies are needed to store session
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true,
  store: new RedisStore({
    url: 'redis://localhost'
  })
}));

//body parsing
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(csrf());
app.use(util.csrf);

//view engine
app.set('view engine', 'ejs');
app.set('view options', {
  defaultLayout: 'layout'
});

//Routing
app.get('/', routes.index);
app.get('/login', routes.login);
app.post('/login', routes.loginProcess);
app.get('/chat', routes.chat);

//Error Handling
app.use(errorHandlers.error);
app.use(errorHandlers.notFound);


app.listen(3000);
console.log('App is Running on port 3000');
