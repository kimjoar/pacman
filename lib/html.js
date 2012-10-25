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

html.process = function(data, locals) {
  locals = locals || {};
  data   = html.needsProcessing(data) ?
    _.template(data)(html.templateData(locals)) : data;
  return locals.type === "partial" ? data : html.processLayout(data);
};

html.processLayout = function(content) {
  if(!config.layout) return content;
  var data = fss.readFile(config.layout);
  return _.template(data)(_.extend(html.templateData({}), { content: content }));
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
    assets.devmodeAssets(type, group) :
    assets.buildmodeAssets(type, group);
};
