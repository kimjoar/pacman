var _ = require('underscore')._;
var path = require('path');

var html = exports.html = {};
var config = require("../lib/config").config;
var core = require("../lib/core").core;

html.vars = {};
html.helpers = {};

html.process = function(data, locals) {
  return _.template(data)(_.extend(html.helpers, locals));
};

html.helpers.render = function(f, locals) { 
  return core.processFile(path.join(config.appdir, f), locals || {});
};
  
html.helpers.get = function(key) {
  return html.vars[key];
};
  
html.helpers.set = function(key, value) {
  html.vars[key] = value;
  return value;
};
