import { parse } from '../ast/Parser';
import { serialize } from '../ast/Serializer';
import { patch } from '../ast/PatchExports';
import { remap } from '../ast/Remap';
import { FileSystem } from '../fs/FileSystem';
import { getFileSystem } from '../fs/CachedFileSystem';
import { createMainModuleCache } from '../ast/MainModuleCache'

interface Options {
  fileSystem?: FileSystem
}

let transform = (fs: FileSystem, mainModuleCache) => (code: string, id: string): any => {
  let program = parse(code);

  patch(program);
  remap(fs, mainModuleCache, id, program);

  let newCode = serialize(program);

  return {
    code: newCode,
    map: { version: 3, sources: [], mappings: '' }
  };
};

let remapImports = (options: Options={}) => {
  let fs = options.fileSystem ? options.fileSystem : getFileSystem();
  let mainModuleCache = createMainModuleCache();

  return {
    name: 'swag-remap-imports',
    transform: transform(fs, mainModuleCache)
  };
};

export {
  Options,
  remapImports
}