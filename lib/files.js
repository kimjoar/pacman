var fs       = require('fs'),
    path     = require('path');
    wrench   = require('wrench'),
    _        = require('underscore')._,
    files    = exports;

files.directory = function(f) {
	return _.initial(f.split("/")).join("/");
};

files.filetype = function(f) {
	return _.last(f.split("."));
};

files.readFile = function(f) {
	var data = fs.readFileSync(f, "utf-8"); 
	return data.toString();
};

files.writeFile = function(to, data) {
  wrench.mkdirSyncRecursive(files.directory(to));
  fs.writeFileSync(to, data, "utf-8");
};

files.all = function(dir, callback) {
  wrench.readdirRecursive(dir, function(error, files) {
    if(_.isArray(files)) callback(files);
  });
};