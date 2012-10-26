var fs       = require('fs'),
    path     = require('path'),
    wrench   = require('wrench'),
    rimraf   = require('rimraf'),
    _        = require('underscore')._,
    fss      = exports;

/* ------------------------------------------- */

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

fss.filename = function(f) {
  return _.last(f.split("/"));
};

fss.readFile = function(f) {
  var data = fs.readFileSync(f);
  return data.toString();
};

fss.copy = function(from, to) {
  wrench.mkdirSyncRecursive(fss.directory(to));
  fs.createReadStream(from).pipe(fs.createWriteStream(to));
};

fss.writeFile = function(to, data) {
  wrench.mkdirSyncRecursive(fss.directory(to));
  fs.writeFileSync(to, data);
};

fss.readAllFiles = function(all) {
  return _.map(all, function(f) {
    if(fs.lstatSync(f).isDirectory()) {
      return "";
    } else {
      return fss.readFile(f);  
    }
  }).join("\n");
};

fss.exists = function(f) {
  return fs.existsSync(f);
};

fss.all = function(dir, callback) {
  var files = wrench.readdirSyncRecursive(dir);
  if(!_.isArray(files)) files = [];
  if(_.isFunction(callback)) callback(files);
  return files;
};

fss.isHelperFile = function(config, f) {
  return fss.relative(config, f)[0] === "_";
};

fss.isDotFile = function(config, f) {
  return _.filter(fss.relative(config, f).split("/"), function(d) {
    return fss.filename(d)[0] === ".";
  }).length > 0;
};

fss.isProcessableFile = function(config, f) {
  f = fss.source(config, f);
  return !fss.isIgnoredFile(config, f) &&
    !fs.lstatSync(f).isDirectory() &&
    !fss.isPublicFile(config, f);
};

fss.isPublicFile = function(config, f) {
  return path.resolve(f).indexOf(config.pubdir) === 0;
};

fss.isIgnoredFile = function(config, f) {
  if(fss.isDotFile(config, f)) return true;
  return _.filter(config.ignore, function(i) {
    return fss.relative(config, f).indexOf(i) !== -1;
  }).length > 0;
};

fss.target = function(config, f) {
  return path.join(config.pubdir, f.replace(config.appdir, ""));
};

fss.source = function(config, f) {
  if(f.indexOf(config.appdir) === 0) return f;
  return path.join(config.appdir, f);
};

fss.relative = function(config, f) {
  if(f.indexOf(config.appdir) === 0) f = f.replace(config.appdir, "");
  if(f.indexOf(config.pubdir) === 0) f = f.replace(config.pubdir, "");
  return f.replace(/^\//, "");
};
