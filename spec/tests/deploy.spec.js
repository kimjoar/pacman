var config = require("../../lib/config");
var core   = require("../../lib/core");
var fss    = require("../../lib/fss");
var deploy = require("../../lib/deploy");

exports.setUp = function(callback) {
  config.init({
    appdir: "spec/cases/deploy/content",
    pubdir: "spec/out/deploy/public",
    rsync:  "spec/out/deploy/remote",
    layout: false
  });
  callback();
};

exports.canDeployOneFile = function(test) {
  core.regenAll();
  deploy.perform(function() {
    test.equal("1", fss.readFile("spec/out/deploy/remote/1.html"));
    test.done();
  });
};
