var config   = require("../lib/config").config,
    log      = require("../lib/log").log,
    fss      = require("../lib/fss"),
    uglifyJS = require("uglify-js2"),
    _        = require('underscore')._,
    cleanCSS = require('clean-css'),
    assets   = exports.assets = {};

/* ------------------------------------------ */

assets.assetFiles = function(type, group) {
  if(!config.assets) throw("No assets found in config");
  type = config.assets[type];
  if(!type) throw("Asset type not found: " + type);
  group = type[group];
  if(!type) throw("Asset group not found: " + group);
  return _.map(group, function(f) {
    return fss.source(config, f);
  });
};

assets.assetString = function(type, relative_path) {
  switch(type) {
    case "css": return "<link rel='stylesheet' type='text/css' href='" + relative_path + "'>";
    case "js":  return "<script src='" + relative_path + "'></script>";
    default:    return "";
  }
};

assets.assetPackData = function(type, files, content) {
  switch(type) {
    case "css": return cleanCSS.process(content);
    case "js":  return uglifyJS.minify(files).code;
    default:    return "";
  }
};

assets.devmodeAssets = function(type, group) {
  return _.map(assets.assetFiles(type, group), function(file) {
    return assets.assetString(type, fss.relative(config, file));
  }).join("\n");
};

assets.buildmodeAssets = function(type, group) {
  var name   = "/assets/" + group + "." + type;
  var target = fss.target(config, name);
  if(fss.exists(target)) return;

  var files   = assets.assetFiles(type, group);
  var content = fss.readAllFiles(files);
  var data    = assets.assetPackData(type, files, content);

  fss.writeFile(target, data);
  return assets.assetString(type, name);
};