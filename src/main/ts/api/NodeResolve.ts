import { Plugin } from 'rollup';

import { getFileSystem } from '../fs/CachedFileSystem';
import { FileSystem } from '../fs/FileSystem';
import { Prefixes, resolvePrefixPaths, resolveId, Mappers } from '../fs/Resolve';

interface Options {
  readonly basedir: string;
  readonly prefixes: Prefixes;
  readonly mappers: Mappers;
  readonly forceFlat: boolean;
  readonly fileSystem?: FileSystem;
}

const defaultOptions = {
  basedir: '.',
  prefixes: [],
  mappers: [],
  forceFlat: true
};

const nodeResolve = (options: Options = defaultOptions): Plugin => {
  const combinedOptions = { ...defaultOptions, ...options };
  const prefixes = resolvePrefixPaths(combinedOptions.basedir, combinedOptions.prefixes);
  const fs = options.fileSystem ? options.fileSystem : getFileSystem();

  return {
    name: 'swag-resolve',
    resolveId: resolveId(fs, prefixes, combinedOptions.mappers, combinedOptions.forceFlat)
  };
};

export {
  Options,
  nodeResolve
};
