var _        = require('underscore')._,
    fs       = require('fs'),
    uglifyJS = require("uglify-js2"),
    cleanCSS = require('clean-css'),

    config   = require("../../config"),
    log      = require("../../log"),
    fss      = require("../../fss");

/*
 * Serve assets in dev mode, by serving the files as they are.
 */
exports.devmode = function(type, group) {
  return _.map(assetFiles(type, group), function(file) {
    return toHtml(type, "/" + fss.relative(file));
  }).join("\n");
};

/*
 * Serve assets in build mode, by concatenating and miniying resources.
 */
exports.buildmode = function(type, group) {
  var name   = "/assets/" + group + "." + type;
  var target = fss.target(name);
  if(assetCache[target]) return assetCache[target];
  log("packing", fss.baseRelative(target));

  var files   = assetFiles(type, group);
  var content = fss.readAllFiles(files);
  var data    = packed(type, files, content);
  var html    = toHtml(type, name);

  fss.writeFile(target, data);
  assetCache[target] = html;
  return html;
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
  }).flatten().value();
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
  return config.timestamp ? "?v=" + (new Date()).getTime() : "";
};

/*
 * Decide the HTML based on asset type and path.
 */
var toHtml = function(type, relative_path) {
  switch(type) {
    case "css": return "<link rel='stylesheet' type='text/css' href='" + relative_path + version() + "'>";
    case "js":  return "<script src='" + relative_path + version() + "'></script>";
    default:    return "";
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
