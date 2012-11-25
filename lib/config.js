var _      = require('underscore')._,
    fs     = require("fs"),
    path   = require("path"),


    fss    = require("../lib/fss"),
    log    = require("../lib/log"),
    config = exports,
    fns    = {};

/*
 * Default config.
 */
var defaults = {

  // The source directory
  source: "content",

  // The target directory
  target: "public",

  // The config file
  config: "config.js",

  // Server post to use in dev mode
  port: 3000,

  // Logging off or on
  silent: true,

  // Add timestamp param to asset paths
  timestamp: true,

  // Default layout file for HTML files
  layout: "_layouts/default.html",

  // Other layouts for specific file paths
  layouts: {},

  // HTML helper functions
  helpers: {},

  // Transform file names on compile
  transform: {},

  // Specify asset groups
  assets: {},

  // Files which should always be ignored
  ignore: [],

  // Files which should be ignored in dev mode
  ignore_dev: [],

  // Files which should be ignored in build mode
  ignore_build: [],

  // Files which should not be processed as HTML
  ignore_processing: [],

  // The rsync command used for syncing files
  rsync: "rsync -a --delete",

  // Remote server address
  remote: false,

  // Which plugins to use for processing files
  plugins: ["html"]

};

/*
 * Extend the current config with custom flags.
 */
fns.extend = function(custom) {
  config = _.extend(config, custom);
  return config;
};

/*
 * Get the absolute layout path from the current config.
 */
fns.getLayout = function(f) {
  var match = _.chain(config.layouts).keys().filter(function(key) {
    return f.indexOf(key) !== -1;
  }).last().value();
  return path.join(config.appdir, match ? config.layouts[match] : config.layout);
};

/*
 * Get the config file path.
 */
fns.getPath = function() {
  return path.join(config.pwd, config.config);
};

/*
 * Get a list of all ignored files.
 */
fns.getIgnored = function() {
  return config.dev ?
    _.union(config.ignore, config.ignore_dev) :
    _.union(config.ignore, config.ignore_build);
};

/*
 * Load a config file from a path.
 */
fns.load = function(f) {
  try { return require(f).config; } catch(e) { return {}; }
};

/*
 * An object holding the processing function of each plugin.
 */
fns.plugin = {};

/*
 * Load each plugin to its correct place.
 */
fns.loadPlugin = function(name) {
  fns.plugin[name] = require("../lib/plugins/" + name + "/main.js");
};

/*
 * Get the processing function of a plugin by name.
 */
fns.getPlugin = function(name) {
  return fns.plugin[name];
};

/*
 * Initialize the default config with custom flags.
 */
fns.init = function(custom) {
  config = _.extend(config, defaults);
  config = _.extend(config, fns);

  config.pwd    = process.cwd();
  config.appdir = path.join(config.pwd, config.source);
  config.pubdir = path.join(config.pwd, config.target);

  config = _.extend(config, custom);
  config = _.extend(config, fns.load(fns.getPath()));

  _.each(config.plugins || [], fns.loadPlugin);
  return config;
};

/*
 * Create the default config on first load.
 */
module.exports = fns.init();
