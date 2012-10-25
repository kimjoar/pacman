var fs     = require("fs"),
    path   = require("path"),
    _      = require('underscore')._,
    fss    = require("../lib/fss"),
    log    = require("../lib/log").log;

/* ------------------------------------------ */

var config = exports.config = {};

config.pubname = "_public";
config.appdir  = process.cwd();
config.pubdir  = path.join(config.appdir, "..", config.pubname);
config.layout  = path.join(config.appdir, "_layouts", "default.html");
config.path    = path.join(config.appdir, "_config.js");

/* ------------------------------------------ */

var parse_config = function() {
  try {
    config = _.extend(config, require(config.path).config);
    log(1, "Config file loaded from", config.path);
  } catch(e) {
    log(9, "Cound not load config at", config.path);
  }
};

var load_config = function() {
  if(fs.existsSync(config.path)) {
    parse_config();
  } else {
    log(1, "No config file found at", config.path);
  }
};

/* ------------------------------------------ */

load_config();