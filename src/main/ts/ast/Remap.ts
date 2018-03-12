import * as estree from 'estree';
import { readImports, toAst, createImport, ImportInfo } from './Imports';
import { resolveSync } from '../fs/Resolve';
import { FileSystem } from '../fs/FileSystem';
import { readMainModule, MainModuleInfo } from '../ast/MainModule';
import { parse } from '../ast/Parser';
import { fail } from '../utils/Fail';
import { MainModuleCache } from './MainModuleCache';
import { ObjectCache } from '../utils/ObjectCache';

const isImport = (node: estree.Node) => node.type === 'ImportDeclaration';
const isMainModuleImport = (modulePath: string) => /^@ephox\/\w+$/.test(modulePath);

const remapImport = (fs: FileSystem, mainModuleCache: MainModuleCache, id: string, imp: ImportInfo, forceFlat: boolean): ImportInfo => {
  const mainModulePath = resolveSync(fs, imp.modulePath, id, forceFlat);

  const mainModule = mainModuleCache.getOrThunk(mainModulePath, () => {
    const mainModuleProgram = parse(fs.readFileSync(mainModulePath).toString());
    return readMainModule(mainModuleProgram);
  });

  const exportForImport = mainModule.exports.find((exp) => exp.name === imp.fromName);
  if (!exportForImport) {
    fail(`Could not find export ${imp.fromName} in main module ${mainModulePath}`);
  }

  const mainImportFromExport = mainModule.imports.find((imp) => imp.name === exportForImport.fromName);
  if (!exportForImport) {
    fail(`Could not find import ${exportForImport.fromName} in main module ${mainModulePath}`);
  }

  const resolvedModulePath = resolveSync(fs, mainImportFromExport.modulePath, mainModulePath, forceFlat);

  return createImport(mainImportFromExport.kind, imp.name, mainImportFromExport.fromName, resolvedModulePath);
};

const remapImports = (fs: FileSystem, mainModuleCache: MainModuleCache, id: string, imports: ImportInfo[], forceFlat: boolean): ImportInfo[] => {
  return imports.map((imp) => {
    return isMainModuleImport(imp.modulePath) ? remapImport(fs, mainModuleCache, id, imp, forceFlat) : imp;
  });
};

const remap = (fs: FileSystem, mainModuleCache: MainModuleCache, id: string, node: estree.Program, forceFlat: boolean): void => {
  const imports = readImports(node);
  const body = node.body.filter((n) => !isImport(n));
  const remappedImports = remapImports(fs, mainModuleCache as ObjectCache<MainModuleInfo>, id, imports, forceFlat);
  node.body = [].concat(toAst(remappedImports)).concat(body);
};

export {
  remap
};