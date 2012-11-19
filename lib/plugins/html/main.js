var _        = require('underscore')._,
    path     = require('path'),
    config   = require("../../config"),
    assets   = require("../../plugins/html/assets"),
    core     = require("../../core"),
    fss      = require("../../fss"),
    log      = require("../../log");

/*
 * Decide if an HTML file needs processing (has tags, is not ignored).
 */
var needsProcessing = function(f, data) {
  var not_ignored = _.filter(config.ignore_processing, function(ignored) {
    return f.indexOf(ignored) !== -1;
  }).length === 0;
  var has_tags = data.indexOf("<%") !== -1;
  return not_ignored && has_tags;
};

/*
 * Process the layout file.
 */
var processLayout = function(f, content) {
  if(!config.layout) return content;
  var data = fss.readFile(config.getLayout());
  return compile(f, data, _.extend(templateData({}), { content: content }));
};

/*
 * Compile a template with data.
 */
var compile = function(f, data, context) {
  try {
    return _.template(data)(context);
  } catch(e) {
    log("Error", f);
    throw(e);
  }
};

/*
 * Reset the current list of variables.
 */
var reset = function() {
  if(config.filters && config.filters.html && config.filters.html.vars) {
    vars = _.clone(config.filters.html.vars);
  } else {
    vars = {};
  }
};

/*
 * Return the current template data, with additional local vars.
 */
var templateData = function(locals) {
  return _.extend(helpers, config.helpers, locals);
};

/*
 * A hash of current variables.
 */
var vars = {};

/*
 * A list of helper functions for templates.
 */
var helpers = {};

/*
 * Helper to render another template file (e.g. a partial).
 */
helpers.render = function(type, f, locals) {
  locals = locals || {};
  locals.type = type;
  return core.processFile(path.join(config.appdir, f), locals);
};

/*
 * Helper to get the value of a var, with an optional default value.
 */
helpers.get = function(key, defaultValue) {
  if(key in vars) return vars[key];
  return defaultValue;
};

/*
 * Helper to set a var.
 */
helpers.set = function(key, value) {
  vars[key] = value;
  return value;
};

/*
 * Helper to get the assets of a type and group for the current mode.
 */
helpers.assets = function(type, group) {
  return config.dev ?
    assets.devmode(type, group) :
    assets.buildmode(type, group);
};

/*
 * The function to process any HTML file, exposed by this filter.
 */
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
