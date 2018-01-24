import { Prefixes, resolvePrefixPaths, resolveId } from '../fs/Resolve';
import { getFileSystem } from '../fs/CachedFileSystem';
import { FileSystem } from '../fs/FileSystem';

interface Options {
  basedir?: string;
  prefixes?: Prefixes;
  fileSystem?: FileSystem;
}

const nodeResolve = (options: Options) => {
  const combinedOptions = {
    ...{ basedir: '.', prefixes: [] },
    ...options
  };
  const prefixes = resolvePrefixPaths(combinedOptions.basedir, combinedOptions.prefixes);
  const fs = options.fileSystem ? options.fileSystem : getFileSystem();

  return {
    name: 'swag-resolve',
    resolveId: resolveId(fs, prefixes)
  };
};

export {
  Options,
  nodeResolve
};
