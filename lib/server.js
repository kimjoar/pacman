var config   = require("../lib/config"),
    log      = require("../lib/log"),
    fss      = require("../lib/fss"),
    core     = require("../lib/core"),
    mime     = require('mime'),
    express  = require('express');

/* ------------------------------------------- */

exports.dev = function() {
  var app = express();
  app.use(function(req, res, next) {
    serve(res, target(req));
  });
  start(app, config.port);
};

exports.build = function() {
  var app = express();
  app.use(express["static"](config.pubdir));
  start(app, config.port);
};

/* ------------------------------------------- */

var start = function(app, port) {
  log("server", "http://localhost:" + port);
  app.listen(port);
};

var target = function(req) {
  var file = req.path;
  if(file === "/") file = "index.html";
  return fss.source(file);
};

var serve = function(res, to) {
  if(fss.exists(to)) {
    log("send", fss.relative(to));
    res.set('Content-Type', mime.lookup(to));
    res.send(core.processFile(to, {}));
  } else {
    res.send(404);
  }
};