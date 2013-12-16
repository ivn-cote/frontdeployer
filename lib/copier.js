var async = require('async');
var mkdirp = require('mkdirp');
var ncp = require('ncp').ncp;
var path = require('path');

ncp.limit = 16;


/**
 * @param {Object} paths
 * @param {function(Error)=} opt_callback
 */
exports.copy = function(paths, opt_callback) {
  var sources = [];

  for (var file in paths) {
    sources.push(file);
  }

  if (sources.length) {
    async.eachSeries(sources, function(source, callback) {
      mkdirp(path.dirname(paths[source]), 0755, function(err) {
        if (err) {
          callback(err);
        } else {
          ncp(source, paths[source], callback);
        }
      });
    }, opt_callback);
  } else if (opt_callback) {
    opt_callback(null);
  }
};
