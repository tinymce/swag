import * as Imports from './Imports';
import * as Exports from './Exports';
import * as estree from 'estree';
import { fail } from '../utils/Fail'

interface MainModuleInfo {
  imports: Imports.ImportInfo[],
  exports: Exports.ExportInfo[],
}

let validate = (program: estree.Program): boolean => {
  return program.body.reduce((acc, node) => {
    let validType = node.type === 'ImportDeclaration' || node.type === 'ExportNamedDeclaration';
    return acc === false ? false : validType;
  }, true);
};

let readMainModule = (program: estree.Program): MainModuleInfo => {
  if (!validate(program)) {
    fail('Main entry point can only have imports and exports.');
  }

  return {
    imports: Imports.readImports(program),
    exports: Exports.readExports(program)
  };
};

export {
  MainModuleInfo,
  readMainModule
};
