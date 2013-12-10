var express = require('express');
var connect = require("connect");

var app = express();
app.set('view engine', 'ejs');
app.use(express.logger("dev"));
app.use(connect.urlencoded());
app.use(express.cookieParser("Some - crazy! - webpaint secret"));
app.use(express.cookieSession());
app.use(express.static(__dirname + '/public'));

app.use(function loadCurrentUserIntoRequest(req, res, next) {
  var userLocal = { user: null };
  if(req.session && req.session.user)
    userLocal.user = req.session.user;

  app.locals(userLocal);
  return next();
});

require("./routes").configure(app);

// Enable views to use gravatar
app.locals({ gravatar: require("gravatar") });


app.listen(8080);
console.log('Server running at http://127.0.0.1:8080/');
