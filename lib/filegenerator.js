var async = require('async');
var ejs = require('ejs');
var fs = require('fs');


/**
 * @param {string} template
 * @param {string} outputFile Full path to output file.
 * @param {*} data
 * @param {function(Error)=} opt_callback
 */
exports.generate = function(template, outputFile, data, opt_callback) {
  var content = ejs.render(template, {
    data: data
  });
  fs.writeFile(outputFile, content, opt_callback);
};

/**
 * @param {string} templateFile Path to ejs file.
 * @param {string} outputFile Full path to output file.
 * @param {*} data
 * @param {function(Error)=} opt_callback
 */
exports.generateFromFile = function(templateFile, outputFile, data,
    opt_callback) {
  fs.readFile(templateFile, 'utf8', function(err, content) {
    if (!err) {
      exports.generate(content, outputFile, data, opt_callback);
    } if (opt_callback) {
      opt_callback(err);
    }
  });
};

/**
 * @param {Array.<{template:string,outputFile:string,data:*}>} options
 * @param {function(Error)=} opt_callback
 */
exports.generateAll = function(options, opt_callback) {
  async.each(options, function(option, callback) {
    exports.generate(option.template, option.outputFile, data, callback);
  }, opt_callback);
};

/**
 * @param {Array.<{templateFile:string,outputFile:string,data:*}>} options
 * @param {function(Error)=} opt_callback
 */
exports.generateAllFromFiles = function(options, opt_callback) {
  async.each(options, function(option, callback) {
    exports.generateFromFile(
      option.templateFile, option.outputFile, option.data, callback);
  }, opt_callback);
};
