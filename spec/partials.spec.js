var config = require("../lib/config").config;
var core   = require("../lib/core").core;
var fss    = require("../lib/fss");
var _      = require('underscore')._;

exports.partialsAreInCorrectOrder = function(test) {
  config.appdir = "spec/mocks/2";
  config.pubdir = "spec/out/2";
  config.silent = true;
  config.queue  = false;
  core.regenAll();
  test.equal("1 2 3 4 5 6 7", fss.readFile("spec/out/2/index.html"));
  test.done();
};

exports.partialsCanSetVars = function(test) {
  config.appdir = "spec/mocks/3";
  config.pubdir = "spec/out/3";
  config.silent = true;
  config.queue  = false;
  core.regenAll();
  test.equal("1 a pa 1", fss.readFile("spec/out/3/a.html"));
  test.equal("2 b pb 2", fss.readFile("spec/out/3/b.html"));
  test.equal("3 c 3",    fss.readFile("spec/out/3/c.html"));
  test.done();
};