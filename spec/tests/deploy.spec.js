var config = require("../../lib/config");
var pacman = require("../../lib/pacman");
var fss    = require("../../lib/fss");
var deploy = require("../../lib/deploy");

exports.setUp = function(callback) {
  config.init({
    appdir: "spec/cases/deploy/content",
    pubdir: "spec/out/deploy/public",
    sync:   "spec/out/deploy/remote",
    layout: false
  });
  callback();
};

exports.canDeployOneFile = function(test) {
  pacman.build();
  deploy.perform(function() {
    test.equal("1", fss.readFile("spec/out/deploy/remote/1.html"));
    test.done();
  });
};
