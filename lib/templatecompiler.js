var ojster = require('ojster');


/**
 * @param {string} path
 * @constructor
 */
var TemplateCompiler = module.exports = function(path) {
  /** @private {function(Error)?} */
  this._callback = null;

  /** @type {string} */
  this.generatorClass = 'goog';

  /** @type {string} */
  this.generatorIndentStr = '  ';

  /** @type {string} */
  this.path = path;

  /** @type {boolean} */
  this.silent = false;

  /** @type {number} */
  this.tabSize = 2;
};


/**
 * @param {string} path
 * @param {function(Error)=} opt_callback
 */
TemplateCompiler.compile = function(path, opt_calback) {
  var compiler = new TemplateCompiler(path);
  compiler.compile(opt_calback);
};

/**
 * @param {Config} config
 * @param {function(boolean)=} opt_callback
 */
TemplateCompiler.compileFromConfig = function(config, opt_calback) {
  TemplateCompiler.compile(config.settings.templates.input, function(err) {
    if (opt_calback) {
      opt_calback(!err);
    }
  });
};


/**
 * @param {function(Error)=} opt_callback
 */
TemplateCompiler.prototype.compile = function(opt_calback) {
  if (opt_calback) {
    this._callback = opt_calback;
  }

  var generatorClass = this.generatorClass;

  if ('goog' == this.generatorClass) {
    generatorClass = ojster.generators.GoogGenerator;
  } else if ('node' == this.generatorClass) {
    generatorClass = ojster.generators.NodeGenerator;
  } else if ('client' == this.generatorClass) {
    generatorClass = ojster.generators.ClientGenerator;
  }

  var options = {
    silent: this.silent,
    generator: {
      generatorClass: generatorClass,
      indentStr: this.generatorIndentStr
    },
    tabSize: this.tabSize
  };
  ojster.compilePath(
    this.path, null, options, this._onCompileComplete.bind(this));
};

/**
 * @param {Error} err
 * @private
 */
TemplateCompiler.prototype._onCompileComplete = function(err) {
  if (this._callback) {
    this._callback(err);
  }
};
