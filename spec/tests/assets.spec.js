var config = require("../../lib/config");
var core   = require("../../lib/core");
var fss    = require("../../lib/fss");
var _      = require('underscore')._;

var css = function(path) {
  return "<link rel='stylesheet' type='text/css' href='" + path + "'>";
};

var js = function(path) {
  return "<script src='" + path + "'></script>";
};

exports.setUp = function(callback) {
  config.init({
    appdir: "spec/cases/assets",
    pubdir: "spec/out/assets",
    path:   "spec/cases/assets/assets1.js",
    layout: false,
    queue:  false,
    dev:    true
  });
  fss.resetDir(config.pubdir);
  callback();
};

exports.canGenerateDevAssets = function(test) {
  core.regenAll();
  test.equal(fss.readFile("spec/out/assets/css.html"), css("/css/1.css"));
  test.equal(fss.readFile("spec/out/assets/js.html"),  js("/js/1.js"));
  test.done();
};

exports.canGenerateBuildAssets = function(test) {
  config.dev   = false;
  config.build = true;
  core.regenAll();

  test.equal(fss.readFile("spec/out/assets/css.html"), css("/assets/group2.css"));
  test.equal(fss.readFile("spec/out/assets/js.html"),  js("/assets/group1.js"));

  test.equal(fss.readFile("spec/out/assets/assets/group2.css"), "*{z-index:1}");
  test.equal(fss.readFile("spec/out/assets/assets/group1.js"),  "var a=1");

  test.done();
};

exports.canGenerateIgnoredAssets = function(test) {
  config.ignore_processing = ["templates/", "t2.html"];
  core.regenAll();
  test.equal(fss.readFile("spec/out/assets/templates/t1.html"), '<%= render("foo", "foo") %>');
  test.equal(fss.readFile("spec/out/assets/templates/t2.html"), '<%= render("bar", "bar") %>');
  test.done();
};