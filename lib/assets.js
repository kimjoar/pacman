var fs       = require('fs'),
    config   = require("../lib/config"),
    log      = require("../lib/log"),
    fss      = require("../lib/fss"),
    uglifyJS = require("uglify-js2"),
    _        = require('underscore')._,
    cleanCSS = require('clean-css');

/* ------------------------------------------- */

exports.devmode = function(type, group) {
  return _.map(assetFiles(type, group), function(file) {
    return toHtml(type, "/" + fss.relative(file));
  }).join("\n");
};

exports.buildmode = function(type, group) {
  var name   = "/assets/" + group + "." + type;
  var target = fss.target(name);
  if(assetCache[target]) return assetCache[target];

  var files   = assetFiles(type, group);
  var content = fss.readAllFiles(files);
  var data    = packed(type, files, content);
  var html    = toHtml(type, name);

  log("packing", fss.baseRelative(target));
  fss.writeFile(target, data);
  assetCache[target] = html;
  return html;
};

/* ------------------------------------------- */

var assetCache = {};

var assetFiles = function(type, group) {
  if(!config.assets) throw("No assets found in config");
  var t = config.assets[type];
  if(!t) throw("Asset type not found: " + type);
  var g = t[group];
  if(!g) throw("Asset group not found: " + group);

  if(_.isArray(g)) {
    return _.map(g, function(f) {
      return fss.source(f);
    });
  } else {
    return _.chain(fss.all(fss.source(g))).map(function(f) {
      return fss.source(g + f);
    }).filter(function(f) {
      return !fs.lstatSync(f).isDirectory();
    }).value();
  }
};

var toHtml = function(type, relative_path) {
  switch(type) {
    case "css": return "<link rel='stylesheet' type='text/css' href='" + relative_path + "'>";
    case "js":  return "<script src='" + relative_path + "'></script>";
    default:    return "";
  }
};

var packed = function(type, files, content) {
  switch(type) {
    case "css": return cleanCSS.process(content);
    case "js":  return uglifyJS.minify(files).code;
    default:    return "";
  }
};
