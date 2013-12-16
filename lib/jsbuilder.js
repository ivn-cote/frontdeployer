var closurebuilder = require('closurebuilder');


/**
 * @param {Object} options
 * @param {function(Error)=} opt_callback
 */
exports.buildDepsFromConfig = function(options, opt_callback) {
  var depsWriter = new closurebuilder.DepsWriter(
    options.inputFiles, options.googPath);

  if (options.cacheFile) {
    depsWriter.setCacheFile(options.cacheFile);
  }

  depsWriter.setLogPrint(!options.logDisabled);
  depsWriter.setOutputFile(options.outputFile);
  depsWriter.build(opt_callback);
};

/**
 * @param {Object} options
 * @param {function(Error)=} opt_callback
 */
exports.buildModuleDepsFromConfig = function(options, opt_callback) {
  closurebuilder.ModuleDepsWriter.build(options.modules, options.inputFiles, {
    cacheFile: options.cacheFile,
    logPrint: !options.logDisabled,
  }, opt_callback);
};

/**
 * @param {Object} options
 * @param {function(Error)=} opt_callback
 */
exports.compileFromConfig = function(options, opt_callback) {
  closurebuilder.Builder.compile(options.compilerPath, options.inputFiles,
    options.files, {
      cacheFile: options.cacheFile,
      compilerFlags: options.compilerFlags,
      defines: options.defines,
      externs: options.externs,
      jvmFlags: options.jvmFlags,
      logLevel: option.logLevel,
      maxBuffer: options.maxBuffer,
      outputFile: options.outputFile
    }, opt_callback);
};

/**
 * @param {Object} options
 * @param {function(Error)=} opt_callback
 */
exports.compileModulesFromConfig = function(options, opt_callback) {
  closurebuilder.ModuleBuilder.compile(options.compilerPath, options.modules,
    options.files, {
      cacheFile: options.cacheFile,
      compilerFlags: options.compilerFlags,
      defines: options.defines,
      externs: options.externs,
      jvmFlags: options.jvmFlags,
      logLevel: option.logLevel,
      maxBuffer: options.maxBuffer
    }, opt_callback);
};

/**
 * @param {Object} options
 * @param {function(Error)=} opt_callback
 */
exports.checkRequiresFromConfig = function(options, opt_callback) {
  var checker = new closurebuilder.RequireChecker(options.inputFiles,
    options.externs);
  checker.setExcludeProvides(options.excludeProvides);
  checker.getWrongRequires(opt_callback);
  checker.setLogPrint(!options.logDisabled);
};
