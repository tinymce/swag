import * as resolve from 'resolve';
import * as path from 'path';
import { FileSystem } from '../fs/FileSystem';
import { fail } from '../utils/Fail';

type Prefixes = any;
type Mappers = Array<(importee: string, importer: string) => string>;

const resolveSync = (fs: FileSystem, importee: string, importer: string, forceFlat: boolean): string => {
  const resolved = resolve.sync(
    importee,
    {
      basedir: path.dirname(importer),
      isFile: fs.isFileSync,
      readFileSync: fs.readFileSync,
      preserveSymlinks: false
    }
  );

  if (resolved && fs.isFileSync(resolved)) {
    if (forceFlat && !isFlat(resolved)) {
      fail(forcedFlatMessage(importer, importee, resolved));
    }

    return fs.realpathSync(resolved);
  } else {
    return resolved;
  }
};

const forcedFlatMessage = (importer: string, importee: string, resolved: string) => [
    'Error non flat package structure detected:',
    ' importer: ' + importer,
    ' importee: ' + importee,
    ' resolved: ' + resolved
  ].join('\n');

const isFlat = (id: string) => id.split('/').filter((p) => p === 'node_modules').length < 2;

const resolveUsingNode = (fs: FileSystem, importee: string, importer: string, forceFlat: boolean): Promise<string> => {
  return new Promise((fulfil, reject) => {
    // console.log(importee, importer);
    resolve(
      importee,
      {
        basedir: path.dirname(importer),
        packageFilter(pkg, pkgPath) {
          if (pkg['jsnext:main']) {
            pkg.main = pkg['jsnext:main'];
          }

          return pkg;
        },
        isFile: fs.isFile,
        readFile: fs.readFile,
        preserveSymlinks: false
      }, (err, resolved) => {
        if (err) {
          reject(err);
        } else {
          if (forceFlat && !isFlat(resolved)) {
            reject(forcedFlatMessage(importer, importee, resolved));
          } else {
            fulfil(fs.isFileSync(resolved) ? fs.realpathSync(resolved) : resolved);
          }
        }
      }
    );
  });
};

const normalizePrefix = (prefix: string): string => {
  return prefix.endsWith('/') ? prefix : prefix + '/';
};

const matchesPrefix = (prefixes: Prefixes, importee: string): boolean => {
  return Object.keys(prefixes).find((p) => importee.startsWith(normalizePrefix(p))) !== undefined;
};

const resolvePrefix = (prefixes: Prefixes, importee: string, importer: string): Promise<string> => {
  return new Promise((fulfil, reject) => {
    const prefix = Object.keys(prefixes).find((p) => importee.startsWith(normalizePrefix(p)));
    const resolvedPrefix = prefixes[prefix];
    const resolvedPath = path.join(resolvedPrefix, importee.substring(normalizePrefix(prefix).length)) + '.js';

    fulfil(resolvedPath);
  });
};

const resolvePrefixPaths = (baseDir: string, prefixes: Prefixes): Prefixes => {
  const outPrefixes = {};

  Object.keys(prefixes).forEach((prefix) => {
    const resolveBaseDir = baseDir ? baseDir : '.';
    outPrefixes[prefix] = path.resolve(path.join(resolveBaseDir, prefixes[prefix]));
  });

  return outPrefixes;
};

const runMappers = (importer: string, mappers: Mappers) => (resolvedImportee: string) => {
  return Promise.resolve(mappers.reduce((p, f) => f(p, importer), resolvedImportee));
};

const resolveId = (fs: FileSystem, prefixes: Prefixes, mappers: Mappers, forceFlat: boolean) => (importee: string, importer: string) => {
  if (/\0/.test(importee) || !importer) { return null; }

  if (matchesPrefix(prefixes, importee)) {
    return resolvePrefix(prefixes, importee, importer);
  } else {
    return resolveUsingNode(fs, importee, importer, forceFlat).then(runMappers(importer, mappers));
  }
};

export {
  Prefixes,
  Mappers,
  resolveSync,
  resolvePrefixPaths,
  resolveId
};
