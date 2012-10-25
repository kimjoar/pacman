var fs       = require('fs'),
    path     = require('path'),
    wrench   = require('wrench'),
    rimraf   = require('rimraf'),
    _        = require('underscore')._,
    fss      = exports;

/* ------------------------------------------ */

fss.resetDir = function(dir) {
  rimraf.sync(dir);
  fs.mkdirSync(dir);
};

fss.directory = function(f) {
  return _.initial(f.split("/")).join("/");
};

fss.filetype = function(f) {
  return _.last(f.split("."));
};

fss.readFile = function(f) {
  var data = fs.readFileSync(f, "utf-8");
  return data.toString();
};

fss.writeFile = function(to, data) {
  wrench.mkdirSyncRecursive(fss.directory(to));
  fs.writeFileSync(to, data, "utf-8");
};

fss.readAllFiles = function(fs) {
  return _.map(fs, function(f) {
    return fss.readFile(f);
  }).join("\n");
};

fss.exists = function(f) {
  return fs.existsSync(f);
};

fss.all = function(dir, callback) {
  wrench.readdirRecursive(dir, function(error, files) {
    if(_.isArray(files)) callback(files);
  });
};

fss.isHelperFile = function(f) {
  return f[0] === "_";
};

fss.isProcessableFile = function(config, f) {
  return !fss.isHelperFile(f) &&
    !fs.lstatSync(f).isDirectory() &&
    !fss.isPublicFile(config, f);
};

fss.isPublicFile = function(config, f) {
  return path.resolve(f).indexOf(config.pubdir) === 0;
};

fss.target = function(config, f) {
  return path.join(config.pubdir, f.replace(config.appdir, ""));
};

fss.source = function(config, f) {
  if(f.indexOf(config.appdir) === 0) return f;
  return path.join(config.appdir, f);
};

fss.relative = function(config, f) {
  if(f.indexOf(config.appdir) === 0) return f.replace(config.appdir, "");
  if(f.indexOf(config.pubdir) === 0) return f.replace(config.pubdir, "");
  return f;
};