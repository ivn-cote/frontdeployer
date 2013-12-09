/**
 * @param {Object} json
 * @param {Config=} opt_parentConfig
 * @constructor
 */
var Config = module.exports = function(json, opt_parentConfig) {
  var settings = {};
  Config.extendRecursive(settings, json);

  if (opt_parentConfig) {
    Config.extendRecursive(settings, opt_parentConfig.settings);
  }

  this.settings = settings;
};

/**
 * @param {Object} configs
 * @param {string} name
 * @return {Config?}
 */
Config.createConfig = function(configs, name) {
  if (name && configs[name]) {
    return new Config(configs[name],
      Config.createConfig(configs, configs[name].inherits));
  }

  return null;
};

/**
 * @param {Object} target
 * @param {...Object} var_args
 */
Config.extendRecursive = function(target, var_args) {
  for (var i = 0; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Config.isObject(source[key])) {
        if (!Config.isObject(target[key])) {
          target[key] = {};
        }

        Config.extendRecursive(target[key], source[key]);
      } else if (undefined === target[key]) {
        target[key] = source[key];
      }
    }
  }
};

/**
 * @param {*} val
 * @return {boolean}
 */
Config.isObject = function(val) {
  return 'object' == typeof val && !Array.isArray(val);
};
