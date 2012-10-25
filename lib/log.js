var date   = require('date-utils'),
    colors = require('colors'),
    _      = require('underscore')._;

exports.log = function() {
  var lvl  = _.first(arguments);
  var msgs = _.isString(lvl) ? _.toArray(arguments) : _.rest(arguments);
  var date = "[" + (new Date()).toFormat("HH24:MI:SS") + "] ";
  var msg  = date + msgs.join(" ");

  if(arguments.length === 0) {
    console.log();
  } else {
    if(lvl === 1)       { msg = msg.white.bold; }
    else if(lvl === 2)  { msg = msg.yellow.bold; }
    else if(lvl === 3)  { msg = msg.blue.bold; }
    else if(lvl === 9)  { msg = msg.red.bold; }
    else                { msg = msg.green.bold; }
    console.log(msg);
  }
};