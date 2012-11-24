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
  log("server", "http://localhost:" + config.port);
  log("serving", fss.baseRelative(config.appdir));
  var app = express();

  app.use(function(req, res, next) {
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
  });

  app.use(express["static"](config.appdir));
  app.listen(config.port);
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
