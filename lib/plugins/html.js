var _        = require("underscore")._,
    path     = require("path"),
    config   = require("../config"),
    pacman   = require("../pacman"),
    fss      = require("../fss"),
    log      = require("../log");

/*
 * A map of current template variables.
 */
var templateVars = {};

/*
 * A collection of helper functions for templates.
 */
var helpers = {};

/*
 * Process the current layout file.
 */
var processLayout = function(f, content) {
  if(!config.layout) return content;
  var data = fss.readFile(config.getLayout(f));
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
 * Reset the current list of template variables,
 * they should not carry over between pages.
 */
var reset = function() {
  if(config.filters && config.filters.html && config.filters.html.vars) {
    templateVars = _.clone(config.filters.html.vars);
  } else {
    templateVars = {};
  }
};

/*
 * Return the current template data, with additional local vars.
 * The global config is also available to all templates.
 */
var templateData = function(locals) {
  return _.extend(helpers, config.helpers, locals, { config: config });
};

/*
 * Helper to render a partial.
 */
helpers.partial = function(f, locals) {
  locals = locals || {};
  locals.templateType = "partial";
  return pacman.process(path.join(config.appdir, f), locals);
};

/*
 * Helper to get the value of a template variable,
 * with an optional default value.
 */
helpers.get = function(key, defaultValue) {
  return key in templateVars ? templateVars[key] : defaultValue;
};

/*
 * Helper to set a template variable.
 */
helpers.set = function(key, value) {
  templateVars[key] = value;
  return value;
};

/*
 * Helper to get the assets of a type and
 * group for the current mode.
 */
helpers.assets = function(type, group) {
  return config.getPlugin("assets")(type, group);
};

/*
 * Helper for redirecting from one page to another.
 */
helpers.redirect = function(relative_target) {
  var target = 'window.location.protocol + "//" + window.location.host + "' + relative_target + '"';
  return '<script type="text/javascript">window.location = ' + target + ';</script>';
};

/*
 * The function to process any HTML file,
 * exposed by this plugin.
 */
module.exports = function(f, data, locals) {
  var partial = locals.templateType === "partial";
  var ignored = !config.needsProcessing(f);
  var tagged  = data.indexOf("<%") !== -1;

  if(!partial) {
    reset();
  }

  if(!ignored && tagged) {
    data = compile(f, data, templateData(locals));
  }

  if(partial || ignored) {
    return data;
  } else {
    return processLayout(f, data);
  }
};
