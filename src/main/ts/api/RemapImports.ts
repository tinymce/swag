import { parse } from '../ast/Parser';
import { serialize } from '../ast/Serializer';
import { patch } from '../ast/PatchExports';
import { remap } from '../ast/Remap';
import { FileSystem } from '../fs/FileSystem';
import { getFileSystem } from '../fs/CachedFileSystem';
import { createMainModuleCache, MainModuleCache } from '../ast/MainModuleCache';

interface Options {
  fileSystem?: FileSystem;
}

const transform = (fs: FileSystem, mainModuleCache: MainModuleCache) => (code: string, id: string): any => {
  const program = parse(code);

  patch(program);
  remap(fs, mainModuleCache, id, program);

  const newCode = serialize(program);

  return {
    code: newCode,
    map: { version: 3, sources: [], mappings: '' }
  };
};

const remapImports = (options: Options= {}) => {
  const fs = options.fileSystem ? options.fileSystem : getFileSystem();
  const mainModuleCache = createMainModuleCache();

  return {
    name: 'swag-remap-imports',
    transform: transform(fs, mainModuleCache)
  };
};

export {
  Options,
  remapImports
};