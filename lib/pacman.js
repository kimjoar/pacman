var fs       = require('fs'),
    util     = require('util'),
    path     = require('path'),
    program  = require('commander'),
    _        = require('underscore')._,

    config   = require("../lib/config"),
    log      = require("../lib/log"),
    fss      = require("../lib/fss"),
    sync     = require("../lib/sync"),
    server   = require("../lib/server");

/*
 * Current version.
 */
exports.version = "0.9.1";

/*
 * Initial logging.
 */
var preamble = function() {
  log();
  log("source", fss.baseRelative(config.source));
  log("target", fss.baseRelative(config.target));
};

/*
 * Set configuration flags.
 */
exports.config = function(custom) {
  return config.extend(custom);
};

/*
 * Start pacman in dev mode.
 */
exports.dev = function() {
  preamble();
  server.dev();
};

/*
 * Start pacman in build mode.
 */
exports.build = function() {
  preamble();
  fss.resetDir(config.pubdir);
  fss.all(config.appdir, function(files) {
    log("Generating", files.length, "files");
    _.each(files, exports.generate);
  });
  log();
};

/*
 * Deploy files using rsync.
 */
exports.sync = function() {
  if(!config.build) log();
  sync.perform();
};

/*
 * Regenerate one file from the source directory to the target directory.
 */
exports.generate = function(file) {
  if(!fss.isProcessableFile(file) || fss.isHelperFile(file)) return;

  var source = fss.source(file);
  var target = fss.target(source);

  if(config.transform.filename && config.needsProcessing(source)) {
    target = config.transform.filename(target);
  }

  if(config.getPlugin(fss.filetype(source))) {
    fss.writeFile(target, exports.process(source));
  } else {
    fss.copy(source, target);
  }
};

/*
 * Process the content of a single file.
 */
exports.process = function(f, locals) {
  var data    = fss.readFile(f);
  var type    = fss.filetype(f);
  var content = type.indexOf(".") === -1 ? "html" : type;
  var filter  = config.getPlugin(content);
  return _.isFunction(filter) ? filter(f, data, locals) : data;
};
