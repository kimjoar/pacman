var date   = require('date-utils'),
    colors = require('colors'),
    _      = require('underscore')._;

var color = function(lvl) {
  return {
    1: "white",
    2: "yellow",
    3: "blue",
    9: "red"
  }[lvl] || "green";
};

exports.log = function(lvl) {
  if(arguments.length === 0) {
    console.log();
  } else {
    var msgs = _.rest(arguments);
    var date = "[" + (new Date()).toFormat("HH24:MI:SS") + "] ";
    var msg  = date + msgs.join(" ");
    console.log(msg[color(lvl)].bold);
  }
};
