var config = require("../lib/config").config;
var fss    = require("../lib/fss");
var _      = require('underscore')._;

exports.isDefined = function(test) {
  test.ok(_.isObject(fss));
  test.done();
};

exports.isProcessableFile = function(test) {
  config.appdir = "spec/mocks";
  test.ok(!fss.isProcessableFile(config, "spec/mocks/_a"));
  test.ok( fss.isProcessableFile(config, "spec/mocks/a"));
  test.ok( fss.isProcessableFile(config, "spec/mocks/.a"));
  test.done();
};