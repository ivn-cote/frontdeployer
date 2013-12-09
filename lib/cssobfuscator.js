var CssMap = require('cssmap');
var async = require('async');
var cssMapFormatter = require('cssmap/formatter');
var fs = require('fs');


/**
 * Требует установленный cssmap.
 * @param {string|Array.<string>|Object.<string>} cssFilePath
 * @param {Array.<Object>} renamings
 * @constructor
 */
var CssObfuscator = module.exports = function(cssFilePath, renamings) {
  var cssFilePathMap = {};

  if ('string' == typeof cssFilePath) {
    cssFilePathMap[cssFilePath] = cssFilePath;
  } else if (Array.isArray(cssFilePath)) {
    cssFilePath.forEach(function(path) {
      cssFilePathMap[path] = path;
    });
  } else {
    cssFilePathMap = cssFilePath;
  }

  /**
   * @type {boolean}
   */
  this.byWholeStyle = false;

  /**
   * @type {function(Error)?}
   */
  this._callback = null;

  /**
   * @type {Object.<string>}
   */
  this.cssFilePath = cssFilePathMap;

  /**
   * @type {CssMap}
   */
  this._cssMap = null;

  /**
   * @type {Array.<string>}
   */
  this.excludes = null;

  /**
   * @type {string}
   */
  this.mapSymbols = 'ABCDEFGHIJKLMNOPQRTUVWXYZabcdefghijklmnopqrtuvwxyz';

  /**
   * @type {Array.<Object>}
   */
  this.renamings = renamings;
};


/**
 * @typedef {{
 *  data: string,
 *  output: string,
 *  result: string?
 * }}
 */
CssObfuscator.FileData;

/**
 * @param {string|Array.<string>|Object.<string,string>} cssFilePath
 * @param {Array.<Object>} renamings
 * @param {function(Error)=} opt_callback
 */
CssObfuscator.create = function(cssFilePath, renamings, opt_callback) {
  var cssMap = new CssObfuscator(cssFilePath, renamings);
  cssMap.create(opt_callback);
};

/**
 * @param {Config} config
 * @param {function(boolean)=} opt_callback
 */
CssObfuscator.createFromConfig = function(config, opt_callback) {
  var cssMap = new CssObfuscator(
    config.settings.css.intermediateCssPath,
    config.settings.css.renamings
  );
  cssMap.byWholeStyle = !!config.settings.css.obfuscateByWhole;
  cssMap.excludes = config.settings.css.obfuscateExcludes;
  cssMap.create(function(err) {
    if (opt_callback) {
      opt_callback(!err);
    }
  });
};


/**
 * @param {function(Error)=} opt_callback
 */
CssObfuscator.prototype.create = function(opt_callback) {
  this._callback = opt_callback || null;

  /** @type {!Array.<CssObfuscator.FileData>} */
  var files = this._getFileData(this.cssFilePath);

  this._cssMap = new CssMap();
  this._cssMap.enableByWholeStyle(this.byWholeStyle);
  this._cssMap.setExcludes(this.excludes || []);

  files.forEach(function(file) {
    this._cssMap.addFile(file.data);
  }, this);
  this._cssMap.setMapSymbols(this.mapSymbols);
  this._cssMap.compile();

  var obfuscated = this._cssMap.getFiles();

  files.forEach(function(fileData, i) {
    fileData.result = obfuscated[i].result;
  });

  async.forEach(
    files, this._writeFile.bind(this), this._onFilesWriteComplete.bind(this));
};

/**
 * @param {CssObfuscator.FileData} fileData
 * @param {function(Error)} callback
 * @private
 */
CssObfuscator.prototype._writeFile = function(fileData, callback) {
  fs.writeFile(fileData.output, fileData.result, callback);
};

/**
 * @param {Object.<string>} cssFilePathMap
 * @return {!Array.<CssObfuscator.FileData>}
 * @private
 */
CssObfuscator.prototype._getFileData = function(cssFilePathMap) {
  var files = [];

  for (var inputCssFile in cssFilePathMap) {
    files.push({
      output: cssFilePathMap[inputCssFile],
      data: new String(fs.readFileSync(inputCssFile)),
      result: null
    });
  }

  return files;
};

/**
 * @param {Error} err
 * @private
 */
CssObfuscator.prototype._onFilesWriteComplete = function(err) {
  if (!err) {
    var map = this._cssMap.getMap();

    async.each(this.renamings, function(item, callback) {
      var mapData = cssMapFormatter.format(map, item.template);
      fs.writeFile(item.outputPath, mapData, callback);
    }, this._callback);
  } else if (this._callback) {
    this._callback(err);
  }
};