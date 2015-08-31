'use strict';

var through = require('through2');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

var error = function(msg) {
  throw new PluginError('gulp-typescript-ref', msg);
};

var filter = function(sources) {
  if (! sources instanceof Array) {
    error("Must be passed an array of TS sources");
  }

  // Get normalized filepath
  var normalizeFilename = function(filename, base) {
    if (base) {
      filename = path.join(base, filename);
    }
    filename = path.resolve(filename);
    return path.normalize(filename).toLowerCase();
  };

  // Adds file if does not exist, with correct normalized, relative path
  var addToReferences = function(filename, base) {
    filename = normalizeFilename(filename, base);
    if (referencedFiles.indexOf(filename) < 0) {
      referencedFiles.push(filename);
    }
  };

  // List of referenced files -- make a copy of sources to start
  var referencedFiles = [];
  for (var index in sources) {
    addToReferences(sources[index]);
  }

  // Regex for finding file references
  var refRegEx = /^\s*\/\/\/\s*<reference\s+path=['"](.*)['"]\s*\/>\s*$/mg;

  // List of actual Vinyl file objects
  var fileList = [];

  var bufferContents = function(file, encoding, callback) {
    // Ignore empty files
    if (file.isNull()) {
      cb();
      return;
    }

    // No stream support
    if (file.isStream()) {
      error("Streaming not supported");
      callback();
      return;
    }

    // Get base path of file path
    var basePath = path.dirname(file.path);

    // Loop over contents using regex exec
    var contents = file.contents.toString('utf8');

    var match = refRegEx.exec(contents);
    while (match) {
      addToReferences(match[1], basePath);
      match = refRegEx.exec(contents);
    }

    fileList.push(file);
    callback();
  };

  var endStream = function(callback) {
    for (var index in fileList) {
      var file = fileList[index];
      if (referencedFiles.indexOf(normalizeFilename(file.path)) >= 0) {
        this.push(file);
      }
    }
    callback();
  };

  return through.obj(bufferContents, endStream);
}

module.exports = filter;
