const stories = require('./routers/stories');
var cookieParser = require("cookie-parser");

var http = require('http');
var express = require('express'),
  app = module.exports.app = express();

var server = http.createServer(app);
var io = require('socket.io').listen(server);


//-----------------------------------------------
// Variables for server and socket.io config
//-----------------------------------------------

const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV == "production") {
  app.locals.host = 'http://story-circle.herokuapp.com';
} else {
  app.locals.host = "http://localhost:3000";
}

var mongoose = require("mongoose");

app.use(
  "/socket.io",
  express.static(__dirname + "node_modules/socket.io-client/dist/")
);


// ----------------------------------------
// App Variables
// ----------------------------------------
app.locals.appName = 'Story Circle';


// ----------------------------------------
// ENV
// ----------------------------------------
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}


// ----------------------------------------
// Mongoose Database Setup
// ----------------------------------------
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => next());
  }
});


// ----------------------------------------
// Body Parser
// ----------------------------------------
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));


// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
const cookieSession = require('cookie-session');

app.use(cookieSession({
  name: 'session',
  keys: [
    process.env.SESSION_SECRET || 'secret'
  ]
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});


// ----------------------------------------
// Flash Messages
// ----------------------------------------
const flash = require('express-flash-messages');
app.use(flash());


// ----------------------------------------
// Method Override
// ----------------------------------------
const methodOverride = require('method-override');
const getPostSupport = require('express-method-override-get-post-support');

app.use(methodOverride(
  getPostSupport.callback,
  getPostSupport.options // { methods: ['POST', 'GET'] }
));


// ----------------------------------------
// Referrer
// ----------------------------------------
app.use((req, res, next) => {
  req.session.backUrl = req.header('Referer') || '/';
  next();
});

// ----------------------------------------
// CookieParser
// ----------------------------------------

app.use(cookieParser());

// ----------------------------------------
// Public
// ----------------------------------------
app.use(express.static(`${__dirname}/public`));


// ----------------------------------------
// Logging
// ----------------------------------------
const morgan = require('morgan');
const morganToolkit = require('morgan-toolkit')(morgan);

app.use(morganToolkit());

app.use((req, res, next) => {
  if (req.cookies.username) {
    res.locals.username = req.cookies.username;
  }
  next();
})

// ----------------------------------------
// Routes
// ----------------------------------------

app.get('/', (req, res) => {
  res.render('welcome')
})

app.get('/logout', (req, res, next) => {
  res.clearCookie('username');
  app.locals.loggedIn = false;
  res.render('login');
})

app.post('/login', (req, res, next) => {
  res.cookie('username', req.body.name);
  app.locals.username = req.body.name;
  req.method = "GET"
  res.redirect('/stories/current')
});

app.use('/', (req, res, next) => {

  if (req.cookies.username) {
    app.locals.loggedIn = true;
    next();
  } else {
    res.render('login')
  }
});

app.use('/stories', stories);


// ----------------------------------------
// Template Engine
// ----------------------------------------
const expressHandlebars = require('express-handlebars');
const helpers = require('./helpers');

const hbs = expressHandlebars.create({
  helpers: helpers,
  partialsDir: 'views/',
  defaultLayout: 'application'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');



//--------------------------
//Socket Io
//---------------------------

io.on('connection', function(socket) {
  socket.on('newSection', function(newSectionObj) {
    io.emit('addSection', newSectionObj);
  });
});




server.listen(PORT);



// ----------------------------------------
// Error Handling
// ----------------------------------------
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.stack) {
    err = err.stack;
  }
  res.status(500).render('errors/500', { error: err });
});


module.exports = app;