import { parse } from '../ast/Parser';
import { serialize } from '../ast/Serializer';
import { patch } from '../ast/PatchExports';
import { remap } from '../ast/Remap';
import { FileSystem } from '../fs/FileSystem';
import { getFileSystem } from '../fs/CachedFileSystem';

interface Options {
  fileSystem?: FileSystem
}

let transform = (fs: FileSystem) => (code: string, id: string): any => {
  let program = parse(code);

  patch(program);
  remap(fs, id, program);

  let newCode = serialize(program);

  return {
    code: newCode,
    map: { version: 3, sources: [], mappings: '' }
  };
};

let remapImports = (options: Options={}) => {
  let fs = options.fileSystem ? options.fileSystem : getFileSystem();

  return {
    name: 'swag-remap-imports',
    transform: transform(fs)
  };
};

export {
  Options,
  remapImports
}