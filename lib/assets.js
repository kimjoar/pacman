var fs       = require('fs'),
    config   = require("../lib/config").config,
    log      = require("../lib/log").log,
    fss      = require("../lib/fss"),
    uglifyJS = require("uglify-js2"),
    _        = require('underscore')._,
    cleanCSS = require('clean-css'),
    assets   = exports.assets = {};

assets.cache = {};

assets.files = function(type, group) {
  if(!config.assets) throw("No assets found in config");
  type = config.assets[type];
  if(!type) throw("Asset type not found: " + type);
  group = type[group];
  if(!group) throw("Asset group not found: " + group);

  if(_.isArray(group)) {
    return _.map(group, function(f) {
      return fss.source(config, f);
    });
  } else {
    return _.chain(fss.all(fss.source(config, group))).map(function(f) {
      return fss.source(config, group + f);
    }).filter(function(f) {
      return !fs.lstatSync(f).isDirectory();
    }).value();
  }
};

assets.toHtml = function(type, relative_path) {
  switch(type) {
    case "css": return "<link rel='stylesheet' type='text/css' href='" + relative_path + "'>";
    case "js":  return "<script src='" + relative_path + "'></script>";
    default:    return "";
  }
};

assets.packed = function(type, files, content) {
  switch(type) {
    case "css": return cleanCSS.process(content);
    case "js":  return uglifyJS.minify(files).code;
    default:    return "";
  }
};

assets.devmode = function(type, group) {
  return _.map(assets.files(type, group), function(file) {
    return assets.toHtml(type, "/" + fss.relative(config, file));
  }).join("\n");
};

assets.buildmode = function(type, group) {
  var name   = "/assets/" + group + "." + type;
  var target = fss.target(config, name);
  if(fss.exists(target)) return assets.cache[target];

  var files   = assets.files(type, group);
  var content = fss.readAllFiles(files);
  var data    = assets.packed(type, files, content);
  var html    = assets.toHtml(type, name);

  fss.writeFile(target, data);
  assets.cache[target] = html;
  return html;
};