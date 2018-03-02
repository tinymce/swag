import { parse } from '../ast/Parser';
import { serialize } from '../ast/Serializer';
import { patch } from '../ast/PatchExports';
import { remap } from '../ast/Remap';
import { FileSystem } from '../fs/FileSystem';
import { getFileSystem } from '../fs/CachedFileSystem';
import { createMainModuleCache, MainModuleCache } from '../ast/MainModuleCache';

interface Options {
  fileSystem?: FileSystem;
  forceFlat: boolean;
}

const defaultOptions = {
  forceFlat: true
};

const transform = (fs: FileSystem, mainModuleCache: MainModuleCache, forceFlat: boolean) => (code: string, id: string): any => {
  const program = parse(code);

  patch(program);
  remap(fs, mainModuleCache, id, program, forceFlat);

  const newCode = serialize(program);

  return {
    code: newCode,
    map: { version: 3, sources: [], mappings: '' }
  };
};

const remapImports = (options: Options = defaultOptions) => {
  const combinedOptions = {...defaultOptions, ...options};
  const fs = combinedOptions.fileSystem ? combinedOptions.fileSystem : getFileSystem();
  const mainModuleCache = createMainModuleCache();

  return {
    name: 'swag-remap-imports',
    transform: transform(fs, mainModuleCache, combinedOptions.forceFlat)
  };
};

export {
  Options,
  remapImports
};