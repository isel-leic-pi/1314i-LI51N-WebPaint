var home = require("./home.js"),
    auth = require("./auth.js"),
    drawings = require("./drawings.js");


function configure(app) {
  home.init(app);
  auth.init(app);
  drawings.init(app);
}

module.exports.configure = configure;