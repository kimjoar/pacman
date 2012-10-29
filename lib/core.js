var fs       = require('fs'),
    util     = require('util'),
    path     = require('path'),
    watch    = require('watch'),
    program  = require('commander'),
    _        = require('underscore')._,
    config   = require("../lib/config"),
    log      = require("../lib/log"),
    fss      = require("../lib/fss");

/* ------------------------------------------- */

exports.watch = function() {
  log("Watching", config.appdir);
  watch.createMonitor(config.appdir, { persistent: true, interval: 1000 }, function (monitor) {
    monitor.on("created", decide);
    monitor.on("changed", decide);
    monitor.on("removed", decide);
  });
};

exports.regenAll = function() {
  fss.resetDir(config.pubdir);
  fss.all(config.appdir, function(files) {
    if(!files[0]) return;
    var dir = fss.directory(fss.source(files[0]));
    if(fss.isIgnoredFile(dir)) return;
    log("Generating", dir);
    _.each(files, exports.regenOne);
  });
};

exports.regenType = function(type) {
  fss.all(config.appdir, function(files) {
    _.each(files, function(f) {
      if(fss.filetype(f) === type) {
        exports.regenOne(f);
      }
    });
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

/* ------------------------------------------- */

var filters = {
  html: require("../lib/html")
};

var decide = function(f) {
  if(!f || !fss.isProcessableFile(f)) return;
  log("Changed", f);
  var type = fss.filetype(f);
  if(type === "html") {
    exports.regenType(type);
  } else {
    exports.regenOne(f);
  }
};
