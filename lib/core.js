var fs       = require('fs'),
    util     = require('util'),
    path     = require('path'),
    watch    = require('watch'),
    program  = require('commander'),
    _        = require('underscore')._,
    config   = require("../lib/config").config,
    log      = require("../lib/log").log,
    fss      = require("../lib/fss");

var core = exports.core = {};

core.filters = {};
core.filters.html = require("../lib/html").html;

core.processFile = function(f, locals) {
  var data   = fss.readFile(f);
  var filter = core.filters[fss.filetype(f)];
  return _.isObject(filter) ? filter.process(data, locals) : data;
};

core.processAndWriteFile = function(f) {
  if(!fss.isProcessableFile(config, f)) return;
  fss.writeFile(fss.target(config, f), core.processFile(f));
};

core.regenAll = function() {
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

core.regenType = function(type) {
  fss.all(config.appdir, function(files) {
    _.each(files, function(f) {
      if(fss.filetype(f) === type) {
        core.regenOne(f);
      }
    });
  });
};

core.regenOne = function(f) {
  if(fss.isProcessableFile(config, f)) {
    core.processAndWriteFile(f);
  }
};

core.decide = function(f) {
  if(!f || !fss.isProcessableFile(config, f)) return;
  log(3, "Changed", f);
  var type = fss.filetype(f);
  if(type === "html") {
    core.regenType(type);
  } else {
    core.regenOne(f);
  }
};

core.watch = function() {
  log(2, "Watching directory", config.appdir);
  log();
  watch.createMonitor(config.appdir, { persistent: true, interval: 1000 }, function (monitor) {
    monitor.on("created", core.decide);
    monitor.on("changed", core.decide);
    monitor.on("removed", core.decide);
  });
};
