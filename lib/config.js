var path = require('path');
var config = exports.config = {};

config.pubname = "_public";
config.appdir  = process.cwd();
config.pubdir  = path.join(config.appdir, "..", config.pubname);
