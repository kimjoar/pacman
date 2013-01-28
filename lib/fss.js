var _        = require("underscore")._,
    fs       = require("fs"),
    path     = require("path"),
    wrench   = require("wrench"),
    rimraf   = require("rimraf"),
    config   = require("../lib/config"),
    fss      = exports;

/*
 * Reset a directory by deleting in and recreating it.
 */
exports.resetDir = function(dir) {
  rimraf.sync(dir);
  wrench.mkdirSyncRecursive(dir);
};

/*
 * Get the directory of a file path.
 */
exports.directory = function(f) {
  return _.initial(f.split("/")).join("/");
};

/*
 * Get the filetype of a file path.
 */
exports.filetype = function(f) {
  return f.indexOf(".") === -1 ? "html" : _.last(f.split("."));
};

/*
 * Get the filename of a file path.
 */
exports.filename = function(f) {
  return _.last(f.split("/"));
};

/*
 * Read the data from a path to a string.
 */
exports.readFile = function(f) {
  var data = fs.readFileSync(f);
  return data.toString();
};

/*
 * Copy a file.
 */
exports.copy = function(from, to) {
  wrench.mkdirSyncRecursive(fss.directory(to));
  fs.writeFileSync(to, fs.readFileSync(from));
};

/*
 * Copy an entire directory.
 */
exports.copyDir = function(from, to) {
  if(!fs.lstatSync(from).isDirectory()) throw("Not a directory");
  wrench.copyDirSyncRecursive(from, to);
};

/*
 * Write data to a target file.
 */
exports.writeFile = function(to, data) {
  if(exports.isIgnoredFile(to)) return;
  wrench.mkdirSyncRecursive(fss.directory(to));
  fs.writeFileSync(to, data);
};

/*
 * Read and concatenate content from an array of file paths.
 */
exports.readAllFiles = function(all) {
  return _.map(all, function(f) {
    if(fs.lstatSync(f).isDirectory()) {
      return "";
    } else {
      return fss.readFile(f);
    }
  }).join("\n");
};

/*
 * Check if a file exists at a path.
 */
exports.exists = function(f) {
  return fs.existsSync(f) && !fs.lstatSync(f).isDirectory();
};

/*
 * Get all files from a directory.
 */
exports.all = function(dir, callback) {
  var files = wrench.readdirSyncRecursive(dir);
  if(!_.isArray(files)) files = [];
  if(_.isFunction(callback)) callback(files);
  return files;
};

/*
 * Check if a path is a helper file or directory.
 */
exports.isHelperFile = function(f) {
  return fss.relative(f)[0] === "_";
};

/*
 * Check if a file is a dotfile, or in a dot-directory.
 */
exports.isDotFile = function(f) {
  return _.filter(fss.relative(f).split("/"), function(d) {
    return fss.filename(d)[0] === ".";
  }).length > 0;
};

/*
 * Check if a file should be processed.
 */
exports.isProcessableFile = function(f) {
  f = fss.source(f);
  return !fs.lstatSync(f).isDirectory() && !fss.isPublicFile(f) && !fss.isDotFile(f);
};

/*
 * Check if a file is in the target directory.
 */
exports.isPublicFile = function(f) {
  return path.resolve(f).indexOf(config.pubdir) === 0;
};

/*
 * Check if a file should be ignored completely.
 */
exports.isIgnoredFile = function(f) {
  if(fss.isDotFile(f)) return true;
  return _.filter(config.getIgnored(), function(i) {
    return fss.relative(f).indexOf(i) !== -1;
  }).length > 0;
};

/*
 * Get the target path from a relative path.
 */
exports.target = function(f) {
  return path.join(config.pubdir, f.replace(config.appdir, ""));
};

/*
 * Get the source path from a relative path.
 */
exports.source = function(f) {
  if(f.indexOf(config.appdir) === 0) return f;
  return path.join(config.appdir, f);
};

/*
 * Turn a path relative, to either the source directory or target directory.
 */
exports.relative = function(f) {
  if(f.indexOf(config.appdir) === 0) f = f.replace(config.appdir, "");
  if(f.indexOf(config.pubdir) === 0) f = f.replace(config.pubdir, "");
  return f.replace(/^\//, "");
};

/*
 * Turn a path relative to the projects base directory.
 */
exports.baseRelative = function(f) {
  if(f.indexOf(config.pwd) === 0) f = f.replace(config.pwd, "");
  return f.replace(/^\//, "");
};

/*
 * Make sure a path has a trailing slash.
 */
exports.slashify = function(f) {
  return (f + "/").replace(/\/\/$/, "/");
};
