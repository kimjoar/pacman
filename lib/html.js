var _      = require('underscore')._;
var path   = require('path');
var config = require("../lib/config").config;
var core   = require("../lib/core").core;
var fss    = require("../lib/files");
var html   = exports.html = {};

/* ------------------------------------------ */

html.vars    = {};
html.helpers = {};

/* ------------------------------------------ */

html.process = function(data, locals) {
  locals = locals || {};
  var data = _.template(data)(_.extend(html.helpers, locals));
  return locals.type === "partial" ? data : html.processLayout(data);
};

html.helpers.render = function(type, f, locals) {
  locals = locals || {};
  locals.type = type;
  return core.processFile(path.join(config.appdir, f), locals);
};

html.helpers.get = function(key) {
  return html.vars[key];
};

html.helpers.set = function(key, value) {
  html.vars[key] = value;
  return value;
};

html.processLayout = function(content) {
  var data = fss.readFile(config.layout);
  return _.template(data)(_.extend(html.helpers, { content: content }));
};
