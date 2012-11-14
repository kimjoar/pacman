var _        = require('underscore')._,
    path     = require('path'),
    config   = require("../lib/config"),
    assets   = require("../lib/assets"),
    core     = require("../lib/core"),
    fss      = require("../lib/fss"),
    log      = require("../lib/log");

/* ------------------------------------------- */

module.exports = function(f, data, locals) {
  locals = locals || {};

  if(locals.type !== "partial") {
    reset();
  }

  if(needsProcessing(f, data)) {
    data = compile(f, data, templateData(locals));
  }

  if(locals.type === "partial") {
    return data;
  } else {
    return processLayout(f, data);
  }
};

/* ------------------------------------------- */

var vars = {};

var needsProcessing = function(f, data) {
  var not_ignored = _.filter(config.ignore_processing, function(ignored) {
    return f.indexOf(ignored) !== -1;
  }).length === 0;
  var has_tags = data.indexOf("<%") !== -1;
  return not_ignored && has_tags;
};

var processLayout = function(f, content) {
  if(!config.layout) return content;
  var data = fss.readFile(config.getLayout());
  return compile(f, data, _.extend(templateData({}), { content: content }));
};

var compile = function(f, data, context) {
  try {
    return _.template(data)(context);
  } catch(e) {
    log("Error", f);
    throw(e);
  }
};

var reset = function() {
  if(config.filters && config.filters.html && config.filters.html.vars) {
    vars = _.clone(config.filters.html.vars);
  } else {
    vars = {};
  }
};

var templateData = function(locals) {
  return _.extend(helpers, config.helpers, locals);
};

/* ------------------------------------------- */

var helpers = {};

helpers.render = function(type, f, locals) {
  locals = locals || {};
  locals.type = type;
  return core.processFile(path.join(config.appdir, f), locals);
};

helpers.get = function(key, defaultValue) {
  if(key in vars) return vars[key];
  return defaultValue;
};

helpers.set = function(key, value) {
  vars[key] = value;
  return value;
};

helpers.assets = function(type, group) {
  return config.dev ?
    assets.devmode(type, group) :
    assets.buildmode(type, group);
};
