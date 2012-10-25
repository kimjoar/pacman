var fs       = require('fs'),
    util     = require('util'),
    child    = require('child_process'),
    path     = require('path');

var watch    = require('watch'),
    async    = require('async'),
    wrench   = require('wrench'),
    colors   = require('colors'),
    date     = require('date-utils'),
    program  = require('commander'),
    _        = require('underscore')._;

var config = require("../lib/config").config;

var core = exports.core = {
  version: "0.0.0",
  log:     require("../lib/log").log,
  files:   require("../lib/files")
};

/* ------------------------------------------ */

core.filters = {};
core.filters.html = require("../lib/html").html;

/* ------------------------------------------ */

core.target = function(f) {
  return path.join(config.pubdir, f.replace(config.appdir, ""));
};

core.processAndWriteFile = function(f, callback) {
  var data = "";
  if(core.files.isProcessableFile(f)) {
    data = core.processFile(f);
    core.files.writeFile(core.target(f), data);
  }
  if(_.isFunction(callback)) {
    callback();
  }
  return data;
};

core.processFile = function(f, locals) {
  return core.processContent(f, core.files.readFile(f), locals);    
};

core.processContent = function(f, data, locals) {
  var filter = core.filters[core.files.filetype(f)];
  return _.isObject(filter) ? filter.process(data, locals) : data;
};

/* ------------------------------------------ */

core.regen_all = function() {
  core.files.resetDir(config.pubdir);
  var queue = async.queue(core.processAndWriteFile, 200);
  core.files.all(config.appdir, queue.push);
};

core.regen_type = function(type) {
  var queue = async.queue(core.processAndWriteFile, 200);
  core.files.all(config.appdir, function(files) {
    queue.push(_.filter(wrench.readdirSyncRecursive(config.appdir), function(f) {
      return core.files.isProcessableFile(f) && core.files.filetype(f) === type;
    }));
  });
}; 

core.watch = function() {
  core.log(2, "Watching directory", config.appdir);
  core.log();
  var change = function(f) {
    if(!core.files.isProcessableFile(f)) return;
    core.log(3, "Changed", f);
    core.regen_type(core.files.filetype(f), f);
  };
  watch.createMonitor(config.appdir, function (monitor) {
    monitor.on("created", change);
    monitor.on("changed", change);
    monitor.on("removed", change);
  });
};
