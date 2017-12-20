let resolve = require('resolve');

import * as path from 'path';
import { FileSystem } from '../fs/FileSystem';

type Prefixes = any;

let resolveSync = (fs: FileSystem, importee: string, importer: string): string => {
  let resolved = resolve.sync(
    importee,
    {
      basedir: path.dirname(importer),
      isFile: fs.isFileSync,
      readFileSync: fs.readFileSync,
      preserveSymlinks: false
    }
  );

  if (resolved && fs.isFileSync(resolved)) {
    return fs.realpathSync(resolved);
  } else {
    return resolved;
  }
};

let resolveUsingNode = (fs: FileSystem, importee: string, importer: string): Promise<string> => {
  return new Promise((fulfil, reject) => {
    //console.log(importee, importer);
    resolve(
      importee,
      {
        basedir: path.dirname(importer),
        isFile: fs.isFile,
        readFile: fs.readFile,
        preserveSymlinks: false
      }, (err, resolved) => {
        if (err) {
          console.log(err)
          reject(err);
        } else {
          if (resolved && fs.isFileSync(resolved)) {
            resolved = fs.realpathSync(resolved);
          }

          fulfil(resolved);
        }
      }
    );
  });
};

let normalizePrefix = (prefix: string): string => {
  return prefix.endsWith('/') ? prefix : prefix + '/';
};

let matchesPrefix = (prefixes: Prefixes, importee: string): boolean => {
  return Object.keys(prefixes).find((p) => importee.startsWith(normalizePrefix(p))) !== undefined;
};

let resolvePrefix = (prefixes: Prefixes, importee: string, importer: string): Promise<string> => {
  return new Promise((fulfil, reject) => {
    let prefix = Object.keys(prefixes).find((p) => importee.startsWith(normalizePrefix(p)));
    let resolvedPrefix = prefixes[prefix];
    let resolvedPath = path.join(resolvedPrefix, importee.substring(normalizePrefix(prefix).length)) + '.js';

    fulfil(resolvedPath);
  });
};

let resolvePrefixPaths = (baseDir: string, prefixes: Prefixes): Prefixes => {
  let outPrefixes = {};

  Object.keys(prefixes).forEach((prefix) => {
    let resolveBaseDir = baseDir ? baseDir : '.';
    outPrefixes[prefix] = path.resolve(path.join(resolveBaseDir, prefixes[prefix]));
  });

  return outPrefixes;
};

let resolveId = (fs: FileSystem, prefixes: Prefixes) => (importee: string, importer: string) => {
  if (/\0/.test(importee) || !importer) return null;

  if (matchesPrefix(prefixes, importee)) {
    return resolvePrefix(prefixes, importee, importer);
  } else {
    return resolveUsingNode(fs, importee, importer);
  }
};

export {
  Prefixes,
  resolveSync,
  resolvePrefixPaths,
  resolveId
}
