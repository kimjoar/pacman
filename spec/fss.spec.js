var config = require("../lib/config").config;
var fss    = require("../lib/fss");
var _      = require('underscore')._;

exports.isDefined = function(test) {
  test.ok(_.isObject(fss));
  test.done();
};

exports.isProcessableFile = function(test) {
  config.appdir = "spec/mocks/1";
  test.ok(fss.isProcessableFile(config, "spec/mocks/1/_a"), "_a");
  test.ok(fss.isProcessableFile(config, "spec/mocks/1/a"),  "a");
  test.ok(!fss.isProcessableFile(config, "spec/mocks/1/.a"), ".a");
  test.done();
};