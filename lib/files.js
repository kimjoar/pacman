var fs       = require('fs'),
    path     = require('path');
    wrench   = require('wrench'),
    _        = require('underscore')._,
    files    = exports;

/* ------------------------------------------ */

files.resetDir = function(dir) {
  try { fs.rmdirSync(dir); } catch(e) {}; 
  try { fs.mkdirSync(dir); } catch(e) {}; 
};

files.directory = function(f) {
  return _.initial(f.split("/")).join("/");
};

files.filetype = function(f) {
  return _.last(f.split("."));
};

files.readFile = function(f) {
  var data = fs.readFileSync(f, "utf-8"); 
  return data.toString();
};

files.writeFile = function(to, data) {
  wrench.mkdirSyncRecursive(files.directory(to));
  fs.writeFileSync(to, data, "utf-8");
};

files.all = function(dir, callback) {
  wrench.readdirRecursive(dir, function(error, files) {
    if(_.isArray(files)) callback(files);
  });
};

files.isHelperFile = function(f) {
  return f[0] === "_";
};

files.isProcessableFile = function(f) {
  return !files.isHelperFile(f) && !fs.lstatSync(f).isDirectory();
};