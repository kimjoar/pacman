var config = require("../../lib/config");
var core   = require("../../lib/core");
var fss    = require("../../lib/fss");
var _      = require('underscore')._;

exports.isDefined = function(test) {
  test.ok(_.isObject(fss));
  test.done();
};

exports.isProcessableFile = function(test) {
  config.init({
    appdir: "spec/cases/files"
  });
  test.ok(fss.isProcessableFile("spec/cases/files/_a"), "_a");
  test.ok(fss.isProcessableFile("spec/cases/files/a"),  "a");
  test.ok(!fss.isProcessableFile("spec/cases/files/.a"), ".a");
  test.done();
};