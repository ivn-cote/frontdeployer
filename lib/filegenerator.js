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
  try {
    var content = ejs.render(template, {
      data: data
    });

    fs.writeFileSync(outputFile, content);

    if (opt_callback) {
      opt_callback(null);
    }
  } catch (e) {
    if (opt_callback) {
      opt_callback(e);
    }
  }
};

/**
 * @param {string} templateFile Path to ejs file.
 * @param {string} outputFile Full path to output file.
 * @param {*} data
 * @param {function(Error)=} opt_callback
 */
exports.generateFromFile = function(templateFile, outputFile, data,
    opt_callback) {
  try {
    var content = fs.readFileSync(templateFile, 'utf8');
    exports.generate(content, outputFile, data, opt_callback);
  } catch (e) {
    if (opt_callback) {
      opt_callback(err);
    }
  }
};

/**
 * @param {Array.<{template:string,outputFile:string,data:*}>} options
 * @param {function(Error)=} opt_callback
 */
exports.generateAll = function(options, opt_callback) {
  if (options && options.length) {
    async.eachSeries(options, function(option, callback) {
      exports.generate(option.template, option.outputFile, data, callback);
    }, opt_callback);
  } else if (opt_callback) {
    opt_callback(null);
  }
};

/**
 * @param {Array.<{templateFile:string,outputFile:string,data:*}>} options
 * @param {function(Error)=} opt_callback
 */
exports.generateAllFromFiles = function(options, opt_callback) {
  if (options && options.length) {
    async.eachSeries(options, function(option, callback) {
      exports.generateFromFile(
        option.templateFile, option.outputFile, option.data, callback);
    }, opt_callback);
  } else if (opt_callback) {
    opt_callback(null);
  }
};
