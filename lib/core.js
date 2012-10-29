var fs       = require('fs'),
    util     = require('util'),
    path     = require('path'),
    program  = require('commander'),
    _        = require('underscore')._,
    config   = require("../lib/config"),
    log      = require("../lib/log"),
    fss      = require("../lib/fss");

var filters = {
  html: require("../lib/html")
};

/* ------------------------------------------- */

exports.regenAll = function() {
  fss.resetDir(config.pubdir);
  fss.all(config.appdir, function(files) {
    log("Generating", files.length, "files");
    _.each(files, exports.regenOne);
  });
};

exports.regenOne = function(f) {
  if(fss.isProcessableFile(f)) {
    exports.processAndWriteFile(fss.source(f));
  }
};

exports.processFile = function(f, locals) {
  var data   = fss.readFile(f);
  var filter = filters[fss.filetype(f)];
  return _.isFunction(filter) ? filter(f, data, locals) : data;
};

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