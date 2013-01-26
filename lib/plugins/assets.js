var _        = require('underscore')._,
    fs       = require('fs'),
    path     = require('path'),
    uglifyJS = require('uglify-js'),
    cleanCSS = require('clean-css'),
    config   = require("../config"),
    log      = require("../log"),
    fss      = require("../fss");

/*
 * Serve assets in dev mode, by serving the files as they are.
 */
var dev = function(type, group) {
  return _.map(assetFiles(type, group), function(file) {
    return toHtml(type, path.join(config.root, fss.relative(file)));
  }).join("\n");
};

/*
 * Serve assets in build mode, by concatenating and miniying resources.
 */
var build = function(type, group) {
  var name = "/assets/" + group + "." + type;
  var target = fss.target(name);

  if(!fss.exists(target) || !assetCache[target]) {
    log("packing", fss.baseRelative(target));
    var files   = assetFiles(type, group);
    var content = fss.readAllFiles(files);

    if(_.isArray(files) && files.length > 0 && content !== "") {
      fss.writeFile(target, packed(type, files, content));
      assetCache[target] = toHtml(type, path.join(config.root, name));
    }
  }

  return assetCache[target] || "";
};

/*
 * A cache of already concatenated and minified assets.
 */
var assetCache = {};

/*
 * Get all asset files by type and group from the config file.
 */
var assetFiles = function(type, group) {
  if(!config.assets) throw("No assets found in config");
  var t = config.assets[type];
  if(!t) throw("Asset type not found: " + type);
  var g = t[group];
  if(!g) throw("Asset group not found: " + group);

  if(!_.isArray(g)) g = [g];
  return _.chain(g).map(function(f) {
    return fss.source(f);
  }).map(function(f) {
    if(fs.lstatSync(f).isDirectory()) return assetFilesFromDir(f);
    return f;
  }).flatten().uniq().filter(function(f) {
    var process  = fss.isProcessableFile(f);
    var include  = !fss.isHelperFile(_.last(f.split("/")));
    return process && include && !assetFileTypeMismatch(type, f);
  }).value();
};

/*
 * Check if JS and CSS asset files have the correct file extension.
 */
var assetFileTypeMismatch = function(type, f) {
  return (type === "css" || type === "js") && type !== _.last(f.split("."));
};

/*
 * Find asset files in a directory.
 */
var assetFilesFromDir = function(dir) {
  return _.chain(fss.all(dir)).map(function(f) {
    return fss.source(dir + "/" + f);
  }).filter(function(f) {
    return !fs.lstatSync(f).isDirectory();
  }).value();
};

/*
 * Produce a URL parameter for cache busting old assets.
 */
var version = function() {
  return config.timestamp && config.build ? "?v=" + (new Date()).getTime() : "";
};

/*
 * Decide the HTML based on asset type and path.
 */
var toHtml = function(type, path) {
  switch(type) {
    case "css": return "<link rel='stylesheet' href='" + path + version() + "'>";
    case "js": return "<script src='" + path + version() + "'></script>";
    default: return "";
  }
};

/*
 * Pack assets based on type, files and their content.
 */
var packed = function(type, files, content) {
  switch(type) {
    case "css": return cleanCSS.process(content);
    case "js":  return uglifyJS.minify(files).code;
    default:    return "";
  }
};

/*
 * Export this plugin.
 */
module.exports = function(assetType, assetGroup) {
  return config.dev ?
    dev(assetType,   assetGroup) :
    build(assetType, assetGroup);
};
