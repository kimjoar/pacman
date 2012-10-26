var _        = require('underscore')._,
    path     = require('path'),
    config   = require("../lib/config").config,
    assets   = require("../lib/assets").assets,
    core     = require("../lib/core").core,
    fss      = require("../lib/fss"),
    html     = exports.html = {};

html.vars    = {};
html.helpers = {};

html.needsProcessing = function(data) {
  return data.indexOf("<%") !== -1;
};

html.process = function(f, data, locals) {
  locals = locals || {};
  
  // TODO: Fix vars.
  html.reset();

  if(html.needsProcessing(data)) {
    data = html.compile(f, data, html.templateData(locals));
  }

  if(locals.type === "partial") {
    return data;
  } else {
    return html.processLayout(f, data);
  }
};

html.processLayout = function(f, content) {
  if(!config.layout) return content;
  var data = fss.readFile(config.layout);
  return html.compile(f, data, _.extend(html.templateData({}), { content: content }));
};

html.compile = function(f, data, context) {
  try {
    return _.template(data)(context);  
  } catch(e) {
    log(9, "Compile error in", f);
    throw(e);
  }
};

html.reset = function() {
  if(config.filters && config.filters.html && config.filters.html.vars) {
    html.vars = config.filters.html.vars;
  } else {
    html.vars = {};
  }
};

html.templateData = function(locals) {
  return _.extend(html.helpers, config.helpers, locals);
};

html.helpers.render = function(type, f, locals) {
  locals = locals || {};
  locals.type = type;
  return core.processFile(path.join(config.appdir, f), locals);
};

html.helpers.get = function(key, defaultValue) {
  if(key in html.vars) return html.vars[key];
  return defaultValue;
};

html.helpers.set = function(key, value) {
  html.vars[key] = value;
  return value;
};

html.helpers.assets = function(type, group) {
  return config.dev ?
    assets.devmode(type, group) :
    assets.buildmode(type, group);
};