import { extname } from 'path';
import { Plugin, SourceDescription, TransformResult } from 'rollup';

import { parse } from '../ast/js/Parser';
import { remap } from '../ast/js/Remap';
import { serialize } from '../ast/js/Serializer';
import { createRemapCache, RemapCache } from '../ast/RemapCache';
import { getFileSystem } from '../fs/CachedFileSystem';
import { FileSystem } from '../fs/FileSystem';

interface Options {
  readonly fileSystem?: FileSystem;
  readonly forceFlat: boolean;
}

const defaultOptions = {
  forceFlat: true
};

const transformJs = (fs: FileSystem, remapCache: RemapCache, forceFlat: boolean, code: string, id: string): SourceDescription => {
  const program = parse(code);

  remap(fs, remapCache, id, program, forceFlat);

  const newCode = serialize(program);

  return {
    code: newCode,
    map: { version: 3, sources: [], mappings: '' }
  };
};

const transform = (fs: FileSystem, remapCache: RemapCache, forceFlat: boolean) => (code: string, id: string): TransformResult => {
  return extname(id) === '.js' ? transformJs(fs, remapCache, forceFlat, code, id) : code;
};

const remapImports = (options: Options = defaultOptions): Plugin => {
  const combinedOptions = { ...defaultOptions, ...options };
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