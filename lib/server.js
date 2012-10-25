var connect  = require('connect'),
    http     = require('http'),
    log      = require("../lib/log").log;

var server = exports.server = {};

server.start = function(config) {
  log(1, "Starting server from", config.pubdir, "on port", config.port);
  connect()
    .use(connect["static"](config.pubdir))
    .listen(config.port);
};
