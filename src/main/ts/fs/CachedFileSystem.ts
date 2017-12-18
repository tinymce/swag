import * as fs from 'fs';
import { FileSystem } from './FileSystem';

let getFileSystem = (): FileSystem => {
  let statCache = {};
  let contentCache = {};
  let resolveCache = {};

  let isFile = (file: string, cb: (err: any, state?: boolean) => any): void => {
    let cacheItem = statCache[file];
  
    if (typeof cacheItem !== 'undefined') {
      return cb(null, cacheItem);
    }
  
    fs.stat(file, function (err, stat) {
      if (!err) {
        let exists = stat.isFile() || stat.isFIFO();
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

  let readFile = (filePath: string, callback: (err: any, data?: Buffer) => any): void => {
    let cacheItem = contentCache[filePath];
  
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

  let isFileSync = (filePath: string): boolean => {
    let cacheItem = statCache[filePath];
  
    if (typeof cacheItem !== 'undefined') {
      return cacheItem;
    }
  
    try {
        let stat = fs.statSync(filePath);
        let exists = stat.isFile() || stat.isFIFO();
        statCache[filePath] = exists;
        return exists;
    } catch (e) {
        if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return false;
        throw e;
    }
  };

  let readFileSync = (filePath: string): Buffer => {
    let cacheItem = contentCache[filePath];
  
    if (typeof cacheItem !== 'undefined') {
      return cacheItem;
    }
  
    let data = fs.readFileSync(filePath);
    contentCache[filePath] = data;
    return data;
  };

  let realpathSync = (filePath: string): string => {
    let cacheItem = resolveCache[filePath];
  
    if (typeof cacheItem !== 'undefined') {
      return cacheItem;
    }
  
    if (filePath && fs.existsSync(filePath)) {
      let resolved = fs.realpathSync(filePath);
      resolveCache[filePath]= resolved;
      return resolved;
    }
  
    return filePath;
  };

  return {
    isFile,
    readFile,
    isFileSync,
    readFileSync,
    realpathSync
  }
};

export {
  getFileSystem
}
