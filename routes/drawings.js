var drawingsRepository = require("./../data/drawings.js");
var util = require("util");
var connect = require("connect");

function init(app) {
  // list 
  app.get("/drawings", allDrawings);
  
  // details
  app.get("/drawings/:id", showDrawing);
  app.get("/drawings/:id/json", showDrawingJSON);
  
  // edit 
  app.get("/drawings/:id/edit", editDrawing);
  app.post("/drawings/:id/edit", editDrawingSave);
  app.post("/drawings/:id/edit/saveImage", [connect.json()], editDrawingSaveImage);
}



function allDrawings(req, res) {
  drawingsRepository.allDrawings(function(err, paints) 
  {
    if(err) return serverError(req, res);
    res.render("drawings/all", { paints: paints });
  });
}


function showDrawing(req, res) {
  getDrawingAndRender(req, res, "drawings/show");
}

function showDrawingJSON(req, res) {
  getDrawingAndRender(req, res, function(drawing) {
    return res.json({paint: drawing });
  });
}


function editDrawing(req, res) {
  getDrawingAndRender(req, res, "drawings/edit");
}

function editDrawingSave(req, res) {
  var id = req.params.id;

  drawingsRepository.getPaint(id, function(err, paint) 
  {
    if(err) return notFound(req, res);

    paint.title = req.body.title;
    res.redirect("/drawings/" + req.params.id);
  });
}

function editDrawingSaveImage(req, res) {
  var id = req.params.id;

  drawingsRepository.getPaint(id, function(err, paint) 
  {
    if(err) return notFound(req, res);
    if(id != req.body.paint.id) return res.status(400).end("Bad request");

    // Save
    paint.content = req.body.paint.content;
    res.json({ success: true });
  });
}


function getDrawingAndRender(req, res, viewOrCallback) {
  var id = req.params.id;
  drawingsRepository.getPaint(id, function(err, drawing) 
  {
    if(!drawing) return notFound(req, res);

    if(typeof(viewOrCallback) == "function") return viewOrCallback(drawing);
    
    res.render(viewOrCallback, { paint: drawing });  
  });
}


function notFound(req, res) {
  var msg = util.format("Page %s not found.", req.url);
  res.status(404).end(msg);
}


function serverError(req, res) {
  res.status(500).end("Server Error! Try again later.");
}



module.exports = {
  init: init
}



