import { Prefixes, resolvePrefixPaths, resolveId } from '../fs/Resolve';
import { getFileSystem } from '../fs/CachedFileSystem';
import { FileSystem } from '../fs/FileSystem';

interface Options {
  basedir?: string,
  prefixes?: Prefixes,
  fileSystem?: FileSystem
}

let nodeResolve = (options: Options={}) => {
  let prefixes = resolvePrefixPaths(options.basedir, options.prefixes);
  let fs = options.fileSystem ? options.fileSystem : getFileSystem();

  return {
    name: 'swag-resolve',
    resolveId: resolveId(fs, prefixes)
  };
};

export {
  Options,
  nodeResolve
}
