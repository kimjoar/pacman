var connect  = require('connect'),
    http     = require('http'),
    config   = require("../lib/config"),
    log      = require("../lib/log");

module.exports = function() {
  log("server", "http://localhost:" + config.port);
  connect().use(connect["static"](config.pubdir)).listen(config.port);
};
