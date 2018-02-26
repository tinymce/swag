import * as Imports from './Imports';
import * as Exports from './Exports';
import * as estree from 'estree';
import { fail } from '../utils/Fail';

export interface MainModuleInfo {
  imports: Imports.ImportInfo[];
  exports: Exports.ExportInfo[];
}

const validate = (program: estree.Program): boolean => {
  return program.body.reduce((acc, node) => {
    const validType = node.type === 'ImportDeclaration' || node.type === 'ExportNamedDeclaration';
    return acc === false ? false : validType;
  }, true);
};

const readMainModule = (program: estree.Program): MainModuleInfo => {
  if (!validate(program)) {
    fail('Main entry point can only have imports and exports.');
  }

  return {
    imports: Imports.readImports(program),
    exports: Exports.readExports(program)
  };
};

export {
  readMainModule
};
