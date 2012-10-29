var config = require("../lib/config");

module.exports = function(type, msg, color) {
  if(config.silent) {
    return;
  } else if(msg === "" || !msg) {
    console.log();
  } else {
    color = color || '36';
    var w = 10;
    var len = Math.max(0, w - type.length);
    var pad = Array(len + 1).join(' ');
    console.log('  \033[' + color + 'm%s\033[m : \033[90m%s\033[m', pad + type.toLowerCase(), msg);
  }
};