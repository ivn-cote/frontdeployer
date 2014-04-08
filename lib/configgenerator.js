var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var uuid = require('node-uuid');


/**
 * @param {string} templatePath Путь к шаблону, из которого будет генерироваться
 *    файл конфига.
 * @param {string} configPath Полное имя файла сгенерированного конфига.
 * @param {string} rootPath Полный путь к директории проекта.
 * @param {string} keyVersion Ключ версии.
 * @param {function(Error)=} opt_callback
 */
exports.generate = function(templatePath, configPath, rootPath, keyVersion,
    opt_callback) {
  templatePath = path.resolve(templatePath);
  configPath = path.resolve(configPath);
  rootPath = path.resolve(rootPath);

  var json = require(templatePath).generate(rootPath, keyVersion);
  var content = 'exports.config = ' + JSON.stringify(json, null, '  ') + ';';
  mkdirp(path.dirname(configPath), 0755, function(err) {
    if (!err) {
      writeFile(content, configPath, opt_callback);
    } else if (opt_callback) {
      opt_callback(err);
    }
  });
};

/**
 * @param {string} templatePath Путь к шаблону, из которого будет генерироваться
 *    файл конфига.
 * @param {string} configPath Полное имя файла сгенерированного конфига.
 * @param {string} rootPath Полный путь к директории проекта.
 * @param {string} filesPath Путь, по которому будут лежать сгенерированные
 *    файлы. '%s' заменяется на сгенерированный ключ.
 * @param {string} webFilesPath Путь, по которому будет доступ к сгенерированным
 *    файлам на веб-сервере. '%s' заменяется на сгенерированный ключ.
 * @param {function(Error)=} opt_callback
 */
exports.generateRandom = function(templatePath, configPath, rootPath,
    opt_callback) {
  var keyVersion = uuid.v4().replace(/\-/g, '');

  exports.generate(
    templatePath, configPath, rootPath, keyVersion, opt_callback);

  return keyVersion;
};

/**
 * @param {string} content
 * @param {string} filename
 * @param {number|string=} opt_mode Octal permission for directory.
 *    Defaults to 0755.
 * @param {function(Error)=} opt_callback
 */
function writeFile(content, filename, opt_mode, opt_callback) {
  var callback;
  var mode = 0755;

  if ('string' == typeof opt_mode || 'number' == typeof opt_mode) {
    mode = opt_mode;
  } else if (typeof opt_mode == 'function') {
    callback = opt_mode;
  }

  if (!callback) {
    callback = opt_callback || function() {};
  }

  mkdirp(path.dirname(filename), mode, function(err) {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(filename, content, callback);
    }
  });
};
