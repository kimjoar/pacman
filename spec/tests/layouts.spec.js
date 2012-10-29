var config = require("../../lib/config");
var core   = require("../../lib/core");
var fss    = require("../../lib/fss");
var _      = require('underscore')._;

exports.setUp = function(callback) {
  fss.resetDir(config.pubdir);
  callback();
};

var testContent = function(test, expected) {
  core.regenAll();
  test.equal(fss.readFile("spec/out/layouts/index.html"), expected);
};

exports.canSkipLayout = function(test) {
  config.init({
    appdir: "spec/cases/layouts",
    pubdir: "spec/out/layouts",
    layout: false,
    queue:  false
  });
  testContent(test, "c");
  test.done();
};

exports.canUseDefaultLayout = function(test) {
  config.init({
    appdir: "spec/cases/layouts",
    pubdir: "spec/out/layouts",
    queue:  false
  });
  testContent(test, "d c d");
  test.done();
};

exports.canUseCustomLayoutPath = function(test) {
  config.init({
    appdir: "spec/cases/layouts",
    pubdir: "spec/out/layouts",
    layout: "_ls/1.html",
    queue:  false
  });
  testContent(test, "1 c 1");
  config.layout = "_ls/2.html";
  testContent(test, "2 c 2");
  test.done();
};
