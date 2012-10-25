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

core.processAndWriteFile = function(f) {
  var data = "";
  if(fss.isProcessableFile(config, f)) {
    data = core.processFile(f);
    fss.writeFile(fss.target(config, f), data);
  }
  return data;
};

core.processFile = function(f, locals) {
  return core.processContent(f, fss.readFile(f), locals);
};

core.processContent = function(f, data, locals) {
  var filter = core.filters[fss.filetype(f)];
  return _.isObject(filter) ? filter.process(data, locals) : data;
};

/* ------------------------------------------ */

core.regen_all = function() {
  log(2, "Generating all files");
  fss.resetDir(config.pubdir);
  fss.all(config.appdir, function(files) {
    log(3, "Found", files.length, "files", "in", fss.directory(fss.source(config, files[0])));
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
