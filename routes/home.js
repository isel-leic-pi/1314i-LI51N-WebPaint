function init(app) {
  app.get("/", index);
  app.get("/about", about);
}

function index(req, res) {
  res.render("index");
}


function about(req, res) {
  res.render("about");
}


module.exports = {
  init: init
}