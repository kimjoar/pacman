var config   = require("../lib/config"),
    log      = require("../lib/log"),
    fss      = require("../lib/fss"),
    exec     = require('child_process').exec;

/*
 * Make sure rsync options are all right, and deploy.
 */
var rsync_begin = function(source, target) {
  log("from", fss.baseRelative(source));
  log("to", target);
  source = fss.slashify(source);
  target = fss.slashify(target);
  var cmd = [config.rsync_command, source, target].join(" ");
  var opt = { maxBuffer: 5000*1024 };
  exec(cmd, opt, rsync_end);
};

/*
 * Report result from rsync.
 */
var rsync_end = function(err, stdout, stderr) {
  if(err) {
    throw err;
  } else if(stderr) {
    console.log("\n", stderr, "\n");
  } else {
    log("rsync", "complete");
    log();
  }
};

/*
 * Deploy the target folder, using rsync.
 */
exports.perform = function() {
  if(!config.remote) {
    log("error", "no config.remote set");
  } else {
    rsync_begin(config.pubdir, config.remote);
  }
};