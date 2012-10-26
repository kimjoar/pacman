var fs       = require('fs'),
    path     = require('path'),
    wrench   = require('wrench'),
    async    = require('async'),
    rimraf   = require('rimraf'),
    _        = require('underscore')._,
    config   = require("../lib/config"),
    fss      = exports;

/* ------------------------------------------- */

exports.resetDir = function(dir) {
  rimraf.sync(dir);
  fs.mkdirSync(dir);
};

exports.directory = function(f) {
  return _.initial(f.split("/")).join("/");
};

exports.filetype = function(f) {
  return _.last(f.split("."));
};

exports.filename = function(f) {
  return _.last(f.split("/"));
};

exports.readFile = function(f) {
  var data = fs.readFileSync(f);
  return data.toString();
};

exports.copy = function(from, to) {
  enqueue(function() {
    wrench.mkdirSyncRecursive(fss.directory(to));
    fs.createReadStream(from).pipe(fs.createWriteStream(to));
  });
};

exports.writeFile = function(to, data) {
  enqueue(function() {
    wrench.mkdirSyncRecursive(fss.directory(to));
    fs.writeFileSync(to, data);
  });
};

exports.readAllFiles = function(all) {
  return _.map(all, function(f) {
    if(fs.lstatSync(f).isDirectory()) {
      return "";
    } else {
      return fss.readFile(f);
    }
  }).join("\n");
};

exports.exists = function(f) {
  return fs.existsSync(f);
};

exports.all = function(dir, callback) {
  var files = wrench.readdirSyncRecursive(dir);
  if(!_.isArray(files)) files = [];
  if(_.isFunction(callback)) callback(files);
  return files;
};

exports.isHelperFile = function(f) {
  return fss.relative(f)[0] === "_";
};

exports.isDotFile = function(f) {
  return _.filter(fss.relative(f).split("/"), function(d) {
    return fss.filename(d)[0] === ".";
  }).length > 0;
};

exports.isProcessableFile = function(f) {
  f = fss.source(f);
  return !fss.isIgnoredFile(f) &&
    !fs.lstatSync(f).isDirectory() &&
    !fss.isPublicFile(f);
};

exports.isPublicFile = function(f) {
  return path.resolve(f).indexOf(config.pubdir) === 0;
};

exports.isIgnoredFile = function(f) {
  if(fss.isDotFile(f)) return true;
  return _.filter(config.ignore, function(i) {
    return fss.relative(f).indexOf(i) !== -1;
  }).length > 0;
};

exports.target = function(f) {
  return path.join(config.pubdir, f.replace(config.appdir, ""));
};

exports.source = function(f) {
  if(f.indexOf(config.appdir) === 0) return f;
  return path.join(config.appdir, f);
};

exports.relative = function(f) {
  if(f.indexOf(config.appdir) === 0) f = f.replace(config.appdir, "");
  if(f.indexOf(config.pubdir) === 0) f = f.replace(config.pubdir, "");
  return f.replace(/^\//, "");
};

/* ------------------------------------------- */

var queue = async.queue(function(fn) {
  fn();
}, 500);

var enqueue = function(fn) {
  if(config.queue) {
    queue.push(fn);
  } else {
    fn();
  }
};