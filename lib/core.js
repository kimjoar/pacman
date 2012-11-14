var fs       = require('fs'),
    util     = require('util'),
    path     = require('path'),
    program  = require('commander'),
    _        = require('underscore')._,
    config   = require("../lib/config"),
    log      = require("../lib/log"),
    fss      = require("../lib/fss");

/*
 * Filters for different types of files.
 *
 * A filter exposes one function which is used to process files of that type.
 */
var filters = {
  html: require("../lib/html")
};

/*
 * Regenerate all files from the source directory to the target directory.
 */
exports.regenAll = function() {
  fss.resetDir(config.pubdir);
  fss.all(config.appdir, function(files) {
    log("Generating", files.length, "files");
    _.each(files, exports.regenOne);
  });
};

/*
 * Regenerate one file from the source directory to the target directory.
 */
exports.regenOne = function(f) {
  if(fss.isProcessableFile(f)) {
    exports.processAndWriteFile(fss.source(f));
  }
};

/*
 * Process the content of a single file.
 */
exports.processFile = function(f, locals) {
  var data    = fss.readFile(f);
  var type    = fss.filetype(f);
  var content = type.indexOf(".") === -1 ? "html" : type;
  var filter  = filters[content];
  return _.isFunction(filter) ? filter(f, data, locals) : data;
};

/*
 * Process a file and write it to the target directory.
 */
exports.processAndWriteFile = function(f) {
  if(!fss.isProcessableFile(f) || fss.isHelperFile(f)) return;

  var target = fss.target(f);

  if(config.transform.filename) {
    target = config.transform.filename(target);
  }

  if(filters[fss.filetype(f)]) {
    fss.writeFile(target, exports.processFile(f));
  } else {
    fss.copy(f, target);
  }
};
