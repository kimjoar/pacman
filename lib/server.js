var config   = require("../lib/config"),
    log      = require("../lib/log"),
    fss      = require("../lib/fss"),
    core     = require("../lib/core"),
    mime     = require('mime'),
    express  = require('express');

/* ------------------------------------------- */

exports.dev = function() {
  start(express().use(decide), config.port, config.appdir);
};

exports.build = function() {
  start(express(), config.port, config.pubdir);
};

/* ------------------------------------------- */

var start = function(app, port, dir) {
  log("server", "http://localhost:" + port);
  log("serving", fss.baseRelative(dir));
  app.use(express["static"](dir));
  app.listen(port);
};

var decide = function(req, res, next) {
  if(mime.lookup(target(req)) === "text/html") {
    res.send(core.processFile(target(req), {}));
  } else {
    next();
  }
};

var target = function(req) {
  var file = req.path;
  if(file === "/") file = "index.html";
  return fss.source(file);
};