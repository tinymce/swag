import { parse } from '../ast/Parser';
import { serialize } from '../ast/Serializer';
import { remap } from '../ast/Remap';
import { FileSystem } from '../fs/FileSystem';
import { getFileSystem } from '../fs/CachedFileSystem';
import { createRemapCache, RemapCache } from '../ast/RemapCache';

interface Options {
  fileSystem?: FileSystem;
  forceFlat: boolean;
}

const defaultOptions = {
  forceFlat: true
};

const transform = (fs: FileSystem, remapCache: RemapCache, forceFlat: boolean) => (code: string, id: string): any => {
  const program = parse(code);

  remap(fs, remapCache, id, program, forceFlat);

  const newCode = serialize(program);

  return {
    code: newCode,
    map: { version: 3, sources: [], mappings: '' }
  };
};

const remapImports = (options: Options = defaultOptions) => {
  const combinedOptions = {...defaultOptions, ...options};
  const fs = combinedOptions.fileSystem ? combinedOptions.fileSystem : getFileSystem();
  const remapCache = createRemapCache();

  return {
    name: 'swag-remap-imports',
    transform: transform(fs, remapCache, combinedOptions.forceFlat)
  };
};

export {
  Options,
  remapImports
};