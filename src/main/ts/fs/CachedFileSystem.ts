import * as fs from 'fs';

let statCache = {};
let contentCache = {};

let isFile = (file, cb) => {
  var cacheItem = statCache[file];

  if (typeof cacheItem !== 'undefined') {
    return cb(null, cacheItem);
  }

  fs.stat(file, function (err, stat) {
    if (!err) {
      var exists = stat.isFile() || stat.isFIFO();
      statCache[file] = exists;
      return cb(null, exists);
    }
    if (err.code === 'ENOENT' || err.code === 'ENOTDIR') {
      statCache[file] = false;
      return cb(null, false);
    }
    return cb(err);
  });
};

let readFile = (filePath, callback)  => {
  var cacheItem = contentCache[filePath];

  if (typeof cacheItem !== 'undefined') {
    return callback(null, cacheItem);
  }

  fs.readFile(filePath, function (err, data) {
    if (!err) {
      contentCache[filePath] = data;
    }

    callback(err, data);
  });
}

export {
  isFile,
  readFile
}
