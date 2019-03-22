import { FileSystem } from '../fs/FileSystem';
import { createMainModuleCache } from '../ast/MainModuleCache';
import { getFileSystem } from '../fs/CachedFileSystem';
import { parse } from '../ast/Parser';
import { serialize } from '../ast/Serializer';
import { remap } from '../ast/Remap';
import { parseImports, importsToText, RawToken } from './RawSourceParser';

export interface ImportRemapperResult {
  inputImports: RawToken[];
  outputImportsCode: string;
}

export type Remapper = (code: string, id: string) => string;

export const createRemapper = (fs: FileSystem = getFileSystem()): Remapper => {
  const mainModuleCache = createMainModuleCache();

  return (code: string, id: string) => {
    const program = parse(code);

    // This doesn't force flat mode since in webpack dev mode we want the user to be able
    // to just copy or symlink in a project and that could project could contain node_modules.
    // TODO: In the future we should probably ignore the package node_modules and favor the root node_modules
    remap(fs, mainModuleCache, id, program, false);

    return serialize(program);
  };
};

export const remapImportsInSource = (remapper: Remapper, code: string, fullModulePath: string): ImportRemapperResult => {
  const imports = parseImports(code);
  const remappedImports = remapper(importsToText(imports), fullModulePath);

  return {
    inputImports: imports,
    outputImportsCode: remappedImports
  };
};
