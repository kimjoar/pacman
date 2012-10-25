var fs       = require('fs'),
    util     = require('util'),
    path     = require('path');

var watch    = require('watch'),
    program  = require('commander'),
    _        = require('underscore')._;

var config = require("../lib/config").config;
var log    = require("../lib/log").log;
var fss    = require("../lib/fss");

var core = exports.core = {};

/* ------------------------------------------ */

core.filters = {};
core.filters.html = require("../lib/html").html;

/* ------------------------------------------ */

core.processFile = function(f, locals) {
  var data   = fss.readFile(f);
  var filter = core.filters[fss.filetype(f)];
  return _.isObject(filter) ? filter.process(data, locals) : data;
};

core.processAndWriteFile = function(f) {
  if(!fss.isProcessableFile(config, f)) return;
  fss.writeFile(fss.target(config, f), core.processFile(f));
};

core.regen_all = function() {
  log(2, "Generating all files");
  fss.resetDir(config.pubdir);
  fss.all(config.appdir, function(files) {
    var dir = fss.directory(fss.source(config, files[0]));
    if(fss.isIgnoredFile(config, dir)) return;
    log(3, "Found", files.length, "files", "in", dir);
    _.each(files, function(f) {
      core.processAndWriteFile(f);
    });
  });
};

core.regen_type = function(type) {
  fss.all(config.appdir, function(files) {
    _.each(files, function(f) {
      if(fss.isProcessableFile(config, f) && fss.filetype(f) === type) {
        core.processAndWriteFile(f);
      }
    });
  });
};

core.watch = function() {
  log(2, "Watching directory", config.appdir);
  log();
  var change = function(f) {
    if(!f || !fss.isProcessableFile(config, f)) return;
    log(3, "Changed", f);
    core.regen_type(fss.filetype(f), f);
  };
  watch.createMonitor(config.appdir, { persistent: true, interval: 1000 }, function (monitor) {
    monitor.on("created", change);
    monitor.on("changed", change);
    monitor.on("removed", change);
  });
};
