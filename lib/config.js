var fs     = require("fs"),
    path   = require("path"),
    _      = require('underscore')._,
    fss    = require("../lib/fss"),
    log    = require("../lib/log").log;

var config = exports.config = {};

config.version = "0.0.0";
config.pubname = "public";
config.port    = 3000;
config.helpers = {};
config.ignore  = [];

config.appdir  = process.cwd();
config.pubdir  = path.join(config.appdir, "..", config.pubname);
config.layout  = path.join(config.appdir, "_layouts", "default.html");
config.path    = path.join(config.appdir, "_config.js");

config.override = function(custom, keys) {
  _.each(keys, function(key) {
    if(custom[key]) config[key] = custom[key];
  });
};

config.split = function(val) {
  return val.split(',');
};

config.parse = function() {
  try {
    config = _.extend(config, require(config.path).config);
    log(1, "Config file loaded from", config.path);
  } catch(e) {
    log(9, "Cound not load config at", config.path);
  }
};

config.load = function() {
  if(fs.existsSync(config.path)) {
    config.parse();
  } else {
    log(1, "No config file found at", config.path);
  }
  return config;
};
