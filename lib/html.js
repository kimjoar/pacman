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

  // TODO: Fix vars.
  reset();

  if(needsProcessing(data)) {
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

var needsProcessing = function(data) {
  return data.indexOf("<%") !== -1;
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
    log(9, "Compile error in", f);
    throw(e);
  }
};

var reset = function() {
  if(config.filters && config.filters.html && config.filters.html.vars) {
    vars = config.filters.html.vars;
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