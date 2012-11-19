var fs     = require("fs"),
    path   = require("path"),
    _      = require('underscore')._,
    fss    = require("../lib/fss"),
    log    = require("../lib/log");

var fns    = {};
var config = exports;

/*
 * Extend the current config with custom flags.
 */
fns.extend = function(custom) {
  config = _.extend(config, custom);
};

/*
 * Get the absolute layout path from the current config.
 */
fns.getLayout = function() {
  return path.join(config.appdir, config.layout);
};

/*
 * Get the config file path.
 */
fns.getPath = function() {
  return path.join(config.pwd, config.path);
};

/*
 * Get a list of all ignored files.
 */
fns.getIgnored = function() {
  if(config.dev) {
    return _.union(config.ignore, config.ignore_dev);
  } else {
    return _.union(config.ignore, config.ignore_build);
  }
};

/*
 * Load a config file from a path.
 */
fns.load = function(f) {
  try {
    return require(f).config;
  } catch(e) {
    return {};
  }
};

/*
 * Initialize the default config with custom flags.
 */
fns.init = function(custom) {
  config = _.extend(config, {

    version:   "0.4.3",
    appname:   "content",
    pubname:   "public",
    layout:    "_layouts/default.html",
    path:      "config.js",
    port:      3000,
    silent:    true,
    timestamp: true,

    helpers:   {},
    transform: {},
    assets:    {},

    ignore: [],
    ignore_dev: [],
    ignore_build: [],
    ignore_processing: [],

    rsync: false,
    rsync_command: "rsync -a --delete",
    remote: false

  });

  config         = _.extend(config, fns);
  config.pwd     = process.cwd();
  config.appdir  = path.join(config.pwd, config.appname);
  config.pubdir  = path.join(config.pwd, config.pubname);
  config         = _.extend(config, custom);
  config         = _.extend(config, fns.load(fns.getPath()));

  return config;
};

/*
 * Create the default config on first load.
 */
module.exports = fns.init();
