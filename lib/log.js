var date   = require('date-utils'),
    colors = require('colors'),
    config = require("../lib/config"),
    _      = require('underscore')._;

/* ------------------------------------------- */

module.exports = function(lvl) {
  if(config.silent) {
    return;
  } else if(arguments.length === 0) {
    console.log();
  } else {
    var msgs = _.rest(arguments);
    var date = "[" + (new Date()).toFormat("HH24:MI:SS") + "] ";
    var msg  = date + msgs.join(" ");
    console.log(msg[color(lvl)].bold);
  }
};

/* ------------------------------------------- */

var color = function(lvl) {
  return {
    1: "white",
    2: "yellow",
    3: "blue",
    9: "red"
  }[lvl] || "green";
};
