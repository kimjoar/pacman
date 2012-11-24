var mime     = require('mime'),
    express  = require('express'),

    config   = require("../lib/config"),
    log      = require("../lib/log"),
    fss      = require("../lib/fss"),
    pacman   = require("../lib/pacman");

/*
 * Start a server in dev mode, where all assets are served on the fly, from the source directory.
 */
exports.dev = function() {
  start(express().use(function(req, res, next) {
    var file = target(fss.source(req.path));
    if(!fss.exists(file)) {
      log("404", file);
      res.status(404);
      res.send("404");
    } else if(fss.filename(file).indexOf(".") === -1 || mime.lookup(file) === "text/html") {
      res.type("text/html");
      res.send(pacman.process(file, {}));
    } else {
      next();
    }
  }), config.port, config.appdir);
};

/*
 * Start a server with a specific Express.js app, port and source directory.
 */
var start = function(app, port, dir) {
  log("server", "http://localhost:" + port);
  log("serving", fss.baseRelative(dir));
  app.use(express["static"](dir));
  app.listen(port);
};

/*
 * Decide which file to serve, mostly by checking for index.html files.
 */
var target = function(file) {
  if(file.substr(file.length - 1) === "/") {
    file = file + "index.html";
  }
  if(fss.exists(file + ".html")) {
    return file + ".html";
  } else if(fss.exists(file.replace(/\.html$/, ""))) {
    return file.replace(/\.html$/, "");
  } else if(fss.filename(file).indexOf(".") === -1 && fss.exists(file + "/index.html")) {
    return file + "/index.html";
  } else {
    return file;
  }
};
