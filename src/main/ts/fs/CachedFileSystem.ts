import * as fs from 'fs';
import { FileSystem } from './FileSystem';

const getFileSystem = (): FileSystem => {
  const statCache = {};
  const contentCache = {};
  const resolveCache = {};

  const isFile = (file: string, cb: (err: any, state?: boolean) => any): void => {
    const cacheItem = statCache[file];

    if (typeof cacheItem !== 'undefined') {
      return cb(null, cacheItem);
    }

    fs.stat(file, function (err, stat) {
      if (!err) {
        const exists = stat.isFile() || stat.isFIFO();
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

  const readFile = (filePath: string, callback: (err: any, data?: Buffer) => any): void => {
    const cacheItem = contentCache[filePath];

    if (typeof cacheItem !== 'undefined') {
      return callback(null, cacheItem);
    }

    fs.readFile(filePath, function (err, data) {
      if (!err) {
        contentCache[filePath] = data;
      }

      callback(err, data);
    });
  };

  const isFileSync = (filePath: string): boolean => {
    const cacheItem = statCache[filePath];

    if (typeof cacheItem !== 'undefined') {
      return cacheItem;
    }

    try {
        const stat = fs.statSync(filePath);
        const exists = stat.isFile() || stat.isFIFO();
        statCache[filePath] = exists;
        return exists;
    } catch (e) {
        if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) { return false; }
        throw e;
    }
  };

  const readFileSync = (filePath: string): Buffer => {
    const cacheItem = contentCache[filePath];

    if (typeof cacheItem !== 'undefined') {
      return cacheItem;
    }

    const data = fs.readFileSync(filePath);
    contentCache[filePath] = data;
    return data;
  };

  const realpathSync = (filePath: string): string => {
    const cacheItem = resolveCache[filePath];

    if (typeof cacheItem !== 'undefined') {
      return cacheItem;
    }

    if (filePath && fs.existsSync(filePath)) {
      const resolved = fs.realpathSync(filePath);
      resolveCache[filePath] = resolved;
      return resolved;
    }

    return filePath;
  };

  const isDirectory = (dirPath: string, cb: (err: any, state?: boolean) => any): void => {
    const cacheItem = statCache[dirPath];

    if (typeof cacheItem !== 'undefined') {
      return cb(null, cacheItem);
    }

    fs.stat(dirPath, function (err, stat) {
      if (!err) {
        const exists = stat.isDirectory();
        statCache[dirPath] = exists;
        return cb(null, exists);
      }
      if (err.code === 'ENOENT' || err.code === 'ENOTDIR') {
        statCache[dirPath] = false;
        return cb(null, false);
      }
      return cb(err);
    });
  };

  const isDirectorySync = (dirPath: string): boolean => {
    const cacheItem = statCache[dirPath];

    if (typeof cacheItem !== 'undefined') {
      return cacheItem;
    }

    try {
      const stat = fs.statSync(dirPath);
      const exists = stat.isDirectory();
      statCache[dirPath] = exists;
      return exists;
    } catch (e) {
      if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) { return false; }
      throw e;
    }
  };

  return {
    isFile,
    readFile,
    isFileSync,
    readFileSync,
    realpathSync,
    isDirectory,
    isDirectorySync
  };
};

export {
  getFileSystem
};
