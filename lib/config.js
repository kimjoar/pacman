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

fns.getLayout = function() {
  return path.join(config.appdir, config.layout);
};

fns.getPath = function() {
  return path.join(config.pwd, config.path);
};

fns.getIgnored = function() {
  if(config.dev) {
    return _.union(config.ignore, config.ignore_dev);
  } else {
    return _.union(config.ignore, config.ignore_build);
  }
};

fns.load = function(f) {
  try {
    return require(f).config;
  } catch(e) {
    return {};
  }
};

fns.init = function(custom) {
  config = _.extend(config, {
    version: "0.2.1",
    appname: "content",
    pubname: "public",
    layout:  "_layouts/default.html",
    path:    "config.js",
    port:    3000,
    silent:  true,

    helpers:   {},
    transform: {},
    assets:    {},

    ignore: [],
    ignore_dev: [],
    ignore_build: [],
    ignore_processing: []
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
