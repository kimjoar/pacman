var config = require("../lib/config");
var core   = require("../lib/core");
var fss    = require("../lib/fss");
var _      = require('underscore')._;

exports.canRegenOneFile = function(test) {
  config.init({
    appdir: "spec/mocks/0",
    pubdir: "spec/out/0",
    layout: false,
    queue:  false
  });

  core.regenOne("1.html");
  test.equal("1.html", fss.readFile("spec/out/0/1.html"));
  core.regenOne("2.html");
  test.equal("2.html", fss.readFile("spec/out/0/2.html"));
  test.done();
};