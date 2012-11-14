var config = require("../../lib/config");
var core   = require("../../lib/core");
var fss    = require("../../lib/fss");
var _      = require('underscore')._;

exports.setUp = function(callback) {
  config.init({
    appdir: "spec/cases/html",
    pubdir: "spec/out/html",
    layout: false
  });
  fss.resetDir(config.pubdir);
  callback();
};

var f1 = "spec/out/html/1.html";
var f2 = "spec/out/html/2.html";
var f3 = "spec/out/html/.foo.html";

exports.canRegenOneFile = function(test) {
  core.regenOne("1.html");
  test.equal("1.html", fss.readFile(f1));
  core.regenOne("2.html");
  test.equal("2.html", fss.readFile(f2));
  test.done();
};

exports.canRegenManyFiles = function(test) {
  core.regenAll();
  test.equal("1.html", fss.readFile(f1));
  test.equal("2.html", fss.readFile(f2));
  test.done();
};

exports.canIgnoreDotfiles = function(test) {
  core.regenAll();
  test.ok( fss.exists(f1));
  test.ok( fss.exists(f2));
  test.ok(!fss.exists(f3));
  test.done();
};
