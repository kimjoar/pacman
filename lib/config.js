var fs     = require("fs"),
    path   = require("path"),
    _      = require('underscore')._,
    fss    = require("../lib/fss"),
    log    = require("../lib/log").log;

var config = exports.config = {};

config = _.extend(config, {
  version:   "0.0.0",
  appname:   "content",
  pubname:   "public",
  port:      3000,
  helpers:   {},
  ignore:    [],
  transform: {}
});

config.pwd     = process.cwd();
config.appdir  = path.join(config.pwd,    config.appname);
config.pubdir  = path.join(config.pwd,    config.pubname);
config.layout  = path.join(config.appdir, "_layouts", "default.html");
config.path    = path.join(config.pwd,    "config.js");

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
    log(9, "Failed to load config from", config.path);
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
