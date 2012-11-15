var config   = require("../lib/config"),
    log      = require("../lib/log"),
    fss      = require("../lib/fss"),
    core     = require("../lib/core"),
    mime     = require('mime'),
    express  = require('express');

/*
 * Start a server in dev mode, where all assets are served on the fly, from the source directory.
 */
exports.dev = function() {
  start(express().use(function(req, res, next) {
    var file = target(fss.source(req.path));
    if(!fss.exists(file)) {
      notFound(file, res);
    } else if(isHtml(file)) {
      res.type("text/html");
      res.send(core.processFile(file, {}));
    } else {
      next();
    }
  }), config.port, config.appdir);
};

/*
 * Start a server in build mode, serving content from the target directory.
 */
exports.build = function() {
  start(express().use(function(req, res, next) {
    var file = target(fss.target(req.path));
    if(!fss.exists(file)) {
      notFound(file, res);
    } else if(isHtml(file)) {
      res.type("text/html");
      res.send(fss.readFile(file));
    } else {
      next();
    }
  }), config.port, config.pubdir);
};

/*
 * Check if a path points to an HTML file.
 *
 * As a quick way to achieve pretty URLs, we assume files without an extension are HTML files.
 */
var isHtml = function(file) {
  return fss.filename(file).indexOf(".") === -1 || mime.lookup(file) === "text/html";
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
 * Show a plain 404 page.
 */
var notFound = function(file, res) {
  log("404", file);
  res.status(404);
  res.send("404");
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
