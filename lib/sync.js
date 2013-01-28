var _        = require("underscore")._,
    exec     = require("child_process").exec,
    config   = require("../lib/config"),
    log      = require("../lib/log"),
    fss      = require("../lib/fss");

/*
 * Make sure rsync options are all right, and sync.
 */
var rsync_begin = function(source, target, callback) {
  source = fss.slashify(source);
  target = fss.slashify(target);
  log("rsync", "starting");
  log("from", fss.baseRelative(source));
  log("to", target);
  var cmd = [config.rsync, source, target].join(" ");
  var opt = { maxBuffer: 5000*1024 };
  exec(cmd, opt, rsync_end(callback));
};

/*
 * Report result from rsync.
 */
var rsync_end = function(callback) {
  return function(err, stdout, stderr) {
    if(err) {
      throw err;
    } else if(stderr) {
      console.log("\n", stderr, "\n");
    } else {
      log("rsync", "complete");
      log();
      if(_.isFunction(callback)) {
        callback();
      }
    }
  };
};

/*
 * Deploy the target folder, using rsync.
 */
exports.perform = function(callback) {
  if(!_.isString(config.remote) || config.remote.length === 0) {
    log("error", "no config.remote set");
  } else {
    rsync_begin(config.pubdir, config.remote, callback);
  }
};
