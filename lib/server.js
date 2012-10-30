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
  var last = file.substr(file.length - 1);
  if(last === "/") file = file + "index.html";
  var to = fss.source(file);

  if(fss.exists(to + ".html")) {
    return to + ".html";
  } else {
    return to;
  }
};