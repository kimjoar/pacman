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
  var from = target(req);
  if(!fss.exists(from)) {
    log("404", from);
    res.status(404);
    res.send("404");
  } else if(fss.filename(from).indexOf(".") === -1 || mime.lookup(from) === "text/html") {
    res.type("text/html");
    res.send(core.processFile(from, {}));
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
  } else if(fss.exists(to.replace(/\.html$/, ""))) {
    return to.replace(/\.html$/, "");
  } else {
    return to;
  }
};
