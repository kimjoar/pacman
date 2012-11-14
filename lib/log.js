var _      = require('underscore')._,
    config = require("../lib/config");

/*
 * A simple logging function.
 */
module.exports = function(type, msg) {
  if(config.silent) {
    return;
  } else if(msg === "" || !msg) {
    console.log();
  } else {
    var len = Math.max(0, 10 - type.length);
    var pad = Array(len + 1).join(' ');
    console.log('  \033[36m%s\033[m : \033[90m%s\033[m', pad + type.toLowerCase(), _.rest(arguments).join(" "));
  }
};
