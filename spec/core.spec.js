var config = require("../lib/config");
var core   = require("../lib/core");
var fss    = require("../lib/fss");
var _      = require('underscore')._;

exports.setUp = function(callback) {
  config.init({
    appdir: "spec/mocks/0",
    pubdir: "spec/out/0",
    layout: false,
    queue:  false
  });
  fss.resetDir(config.pubdir);
  callback();
}

exports.canRegenOneFile = function(test) {
  core.regenOne("1.html");
  test.equal("1.html", fss.readFile("spec/out/0/1.html"));
  core.regenOne("2.html");
  test.equal("2.html", fss.readFile("spec/out/0/2.html"));
  test.done();
};

exports.canRegenManyFiles = function(test) {
  core.regenAll();
  test.equal("1.html", fss.readFile("spec/out/0/1.html"));
  test.equal("2.html", fss.readFile("spec/out/0/2.html"));
  test.done();
};

exports.canRegenType = function(test) {
  core.regenType("html");
  test.equal("1.html", fss.readFile("spec/out/0/1.html"));
  test.equal("2.html", fss.readFile("spec/out/0/2.html"));
  test.done();
}