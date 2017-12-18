import * as estree from 'estree';
import { readImports, toAst, createImport, ImportInfo } from './Imports';
import { resolveSync } from '../fs/Resolve';
import { FileSystem } from '../fs/FileSystem';
import { readMainModule } from '../ast/MainModule';
import { parse } from '../ast/Parser';
import { fail } from '../utils/Fail'

let isImport = (node: estree.Node) => node.type === 'ImportDeclaration';
let isMainModuleImport = (modulePath: string) => /^@ephox\/\w+$/.test(modulePath); 

let remapImport = (fs: FileSystem, id: string, imp: ImportInfo): ImportInfo => {
  let mainModulePath = resolveSync(fs, imp.modulePath, id);
  let mainModuleProgram = parse(fs.readFileSync(mainModulePath).toString());
  let mainModule = readMainModule(mainModuleProgram);

  let exportForImport = mainModule.exports.find((exp) => exp.name === imp.fromName);
  if (!exportForImport) {
    fail(`Could not find export ${imp.fromName} in main module ${mainModulePath}`);
  }

  let mainImportFromExport = mainModule.imports.find((imp) => imp.name === exportForImport.fromName);
  if (!exportForImport) {
    fail(`Could not find import ${exportForImport.fromName} in main module ${mainModulePath}`);
  }

  let resolvedModulePath = resolveSync(fs, mainImportFromExport.modulePath, mainModulePath);

  return createImport(mainImportFromExport.kind, imp.name, mainImportFromExport.fromName, resolvedModulePath);
};

let remapImports = (fs: FileSystem, id: string, imports: ImportInfo[]): ImportInfo[] => {
  return imports.map((imp) => {
    return isMainModuleImport(imp.modulePath) ? remapImport(fs, id, imp) : imp;
  });
};

let remap = (fs: FileSystem, id: string, node: estree.Program): void => {
  let imports = readImports(node);
  let body = node.body.filter((n) => !isImport(n));
  let remappedImports = remapImports(fs, id, imports);
  node.body = [].concat(toAst(remappedImports)).concat(body);
};

export {
  remap
}