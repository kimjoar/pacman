var fs     = require("fs"),
    path   = require("path"),
    _      = require('underscore')._,
    fss    = require("../lib/fss"),
    log    = require("../lib/log");

/* ------------------------------------------- */

var fns    = {};
var config = exports;

fns.extend = function(custom) {
  config = _.extend(config, custom);
};

fns.split = function(val) {
  return val.split(',');
};

fns.getLayout = function() {
  return path.join(config.appdir, config.layout);
};

fns.getPath = function() {
  return path.join(config.pwd, config.path);
};

fns.load = function(f) {
  if(fs.existsSync(f)) {
    try {
      log(1, "Config file loaded from", f);
      return require(f).config;
    } catch(e) {
      log(9, "Failed to load config from", f);
      return {};
    }
  } else {
    log(1, "No config file found at", f);
    return {};
  }
};

fns.init = function(custom) {
  config = _.extend(config, {
    version:   "0.0.0",
    appname:   "content",
    pubname:   "public",
    layout:    "_layouts/default.html",
    path:      "config.js",
    port:      3000,
    queue:     true,
    silent:    true,
    helpers:   {},
    ignore:    [],
    transform: {},
    assets:    {}
  });

  config         = _.extend(config, fns);
  config.pwd     = process.cwd();
  config.appdir  = path.join(config.pwd, config.appname);
  config.pubdir  = path.join(config.pwd, config.pubname);
  config         = _.extend(config, custom);
  config         = _.extend(config, fns.load(fns.getPath()));

  return config;
};

/* ------------------------------------------- */

module.exports = fns.init();