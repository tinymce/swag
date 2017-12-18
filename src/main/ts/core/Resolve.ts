let resolve = require('resolve');
import * as path from 'path';
import * as CachedFileSystem from '../fs/CachedFileSystem';

type Prefixes = any;

interface Options {
  basedir?: string,
  prefixes?: Prefixes
}

let resolveUsingNode = (importee: string, importer: string): Promise<string> => {
  return new Promise((fulfil, reject) => {
    resolve(
      importee,
      {
        basedir: path.dirname(importer),
        isFile: CachedFileSystem.isFile,
        readFile: CachedFileSystem.readFile
      }, (err, resolved) => {
        if (err) {
          reject(err);
        } else {
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

let resolveId = (prefixes: Prefixes) => (importee: string, importer: string) => {
  if (/\0/.test(importee) || !importer) return null;

  if (matchesPrefix(prefixes, importee)) {
    return resolvePrefix(prefixes, importee, importer);
  } else {
    return resolveUsingNode(importee, importer);
  }
};

let nodeResolve = (options: Options={}) => {
  let prefixes = resolvePrefixPaths(options.basedir, options.prefixes);

  return {
    name: 'swag-resolve',
    resolveId: resolveId(prefixes)
  };
};

export {
  Prefixes,
  Options,
  nodeResolve
}
