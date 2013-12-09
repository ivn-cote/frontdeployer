var closurebuilder = require('closurebuilder');


/**
 * @param {Config} config
 * @param {function(boolean)=} opt_callback
 */
exports.buildDepsFromConfig = function(config, opt_callback) {
  var depsWriter = new closurebuilder.DepsWriter(
    config.settings.js.files, config.settings.js.googPath);

  if (config.settings.js.cacheFile) {
    depsWriter.setCacheFile(config.settings.js.cacheFile);
  }

  depsWriter.setOutputFile(config.settings.js.outputFile);
  depsWriter.build(function(err) {
    if (err) {
      console.error(err);
    }

    if (opt_callback) {
      opt_callback(!err);
    }
  });
};

/**
 * @param {Config} config
 * @param {function(boolean)=} opt_callback
 */
exports.buildModuleDepsFromConfig = function(config, opt_callback) {
  closurebuilder.ModuleDepsWriter.build(
    config.settings.js.modules,
    config.settings.js.files,
    {
      cacheFile: config.settings.js.cacheFile
    },
    function(err) {
      if (err) {
        console.error(err);
      }

      if (opt_callback) {
        opt_callback(!err);
      }
    }
  );
};

/**
 * @param {Config} config
 * @param {function(boolean)=} opt_callback
 */
exports.compileFromConfig = function(config, opt_callback) {
  closurebuilder.Builder.compile(
    config.settings.js.compilerPath,
    config.settings.js.inputs,
    config.settings.js.files,
    {
      cacheFile: config.settings.js.cacheFile,
      compilerFlags: config.settings.js.compilerFlags,
      defines: config.settings.js.defines,
      externs: config.settings.js.externs,
      jvmFlags: config.settings.js.jvmFlags,
      maxBuffer: config.settings.js.maxBuffer,
      outputFile: config.settings.js.outputFile
    },
    function(err) {
      if (err) {
        console.error(err);
      }

      if (opt_callback) {
        opt_callback(!err);
      }
    }
  );
};

/**
 * @param {Config} config
 * @param {function(boolean)=} opt_callback
 */
exports.compileModulesFromConfig = function(config, opt_callback) {
  closurebuilder.ModuleBuilder.compile(
    config.settings.js.compilerPath,
    config.settings.js.modules,
    config.settings.js.files,
    {
      cacheFile: config.settings.js.cacheFile,
      compilerFlags: config.settings.js.compilerFlags,
      defines: config.settings.js.defines,
      externs: config.settings.js.externs,
      jvmFlags: config.settings.js.jvmFlags,
      maxBuffer: config.settings.js.maxBuffer
    },
    function(err) {
      if (err) {
        console.error(err);
      }

      if (opt_callback) {
        opt_callback(!err);
      }
    }
  );
};

/**
 * @param {Config} config
 * @param {function(boolean)=} opt_callback
 */
exports.checkRequiresFromConfig = function(config, opt_callback) {
  var checker = new closurebuilder.RequireChecker(
    config.settings.js.requireCheckerFiles,
    config.settings.js.requireCheckerExterns
  );
  checker.setExcludeProvides(
    config.settings.js.requireCheckerExcludeProvides);
  checker.getWrongRequires(function(err, missingRequiresMap, unnecessaryRequiresMap) {
    if (err) {
      console.error(err);
    }

    if (opt_callback) {
      opt_callback(!err);
    }
  });
};
