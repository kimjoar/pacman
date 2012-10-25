var fs     = require("fs"),
    path   = require("path"),
    yaml   = require("yaml"),
    _      = require('underscore')._;
    files  = require("../lib/files"),
    log    = require("../lib/log").log;

/* ------------------------------------------ */

var config = exports.config = {};

config.pubname = "_public";
config.appdir  = process.cwd();
config.pubdir  = path.join(config.appdir, "..", config.pubname);
config.layout  = path.join(config.appdir, "_layouts", "default.html");
config.path    = path.join(config.appdir, "_config.yml");

/* ------------------------------------------ */

var parse_config = function() {
  try {
    config.data = files.readFile(config.path);
    config = _.extend(config, yaml.eval(config.data));
    log(1, "Config file loaded from", config.path);
  } catch(e) {
    log(9, "Cound not parse config at", config.path);
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