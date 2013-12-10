var connect = require("connect");

function init(app) 
{
  app.get("/signin", signin);
  app.post("/signin", signin);
  app.get("/signout", signout);
  
  app.get("/register", register);
  app.post("/register", [connect.multipart()], register);
}


function signin(req, res) {
  if(req.method == "GET") 
    return res.render("auth/signin");

  // TODO: Check login user/pass
  req.session.user = { email: req.body.email };
  return res.redirect("/");

}

function signout(req, res) {
  req.session = null;
  return res.redirect("/");
}

function register(req, res) {
  if(req.method == "GET") 
    // GET: Return the register form
    return res.render("auth/register");

  // TODO: Handler user registration
  console.log("BODY: ", req.body);
  console.log("FILES: ", req.files);
  return res.end("POST");
}


module.exports = {
  init: init,
};