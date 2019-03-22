import { readImports, createImport, toAst, ImportInfoKind } from '../../../main/ts/ast/Imports';
import { parse } from '../../../main/ts/ast/Parser';
import { expect } from 'chai';
import 'mocha';

describe('Imports', () => {
  it('readImports should read the various formats correctly', () => {
    const imports = readImports(parse(`
      import * as ModuleA from './ModuleA';
      import { a, b as B } from './ModuleB';
      import ModuleC from './ModuleC';
      import './ModuleD';
    `));

    expect(imports).to.eql([
      {
        kind: ImportInfoKind.Namespace,
        fromName: 'ModuleA',
        name: 'ModuleA',
        modulePath: './ModuleA'
      },
      {
        kind: ImportInfoKind.Specified,
        fromName: 'a',
        name: 'a',
        modulePath: './ModuleB'
      },
      {
        kind: ImportInfoKind.Specified,
        fromName: 'b',
        name: 'B',
        modulePath: './ModuleB'
      },
      {
        kind: ImportInfoKind.Default,
        fromName: 'ModuleC',
        name: 'ModuleC',
        modulePath: './ModuleC'
      },
      {
        kind: ImportInfoKind.SideEffect,
        fromName: null,
        name: null,
        modulePath: './ModuleD'
      },
    ]);
  });

  it('createImport should produce a object with all items', () => {
    const kind = ImportInfoKind.Default;
    const fromName = 'fromName';
    const name = 'name';
    const modulePath = 'modulePath';

    const imp = createImport(kind, name, fromName, modulePath);

    expect(imp).to.eql({
      kind,
      fromName,
      name,
      modulePath
    });
  });

  it('toAst should produce the expected ast from imports', () => {
    const ast = toAst([
      createImport(ImportInfoKind.Default, 'A', 'A', './A'),
      createImport(ImportInfoKind.Namespace, 'B2', 'B', './B'),
      createImport(ImportInfoKind.Specified, 'C2', 'C', './C'),
      createImport(ImportInfoKind.SideEffect, null, null, './D')
    ]);

    expect(ast).to.eql([
      {
        type: 'ImportDeclaration',
        specifiers: [
          {
            type: 'ImportDefaultSpecifier',
            local: {
              type: 'Identifier',
              name: 'A'
            }
          }
        ],
        source: {
          type: 'Literal',
          value: './A',
          raw: `'./A'`
        }
      },

      {
        type: 'ImportDeclaration',
        specifiers: [
          {
            type: 'ImportNamespaceSpecifier',
            local: {
              type: 'Identifier',
              name: 'B2'
            }
          }
        ],
        source: {
          type: 'Literal',
          value: './B',
          raw: `'./B'`
        }
      },

      {
        type: 'ImportDeclaration',
        specifiers: [
          {
            type: 'ImportSpecifier',
            imported: {
              type: 'Identifier',
              name: 'C'
            },
            local: {
              type: 'Identifier',
              name: 'C2'
            }
          }
        ],
        source: {
          type: 'Literal',
          value: './C',
          raw: `'./C'`
        }
      },

      {
        type: 'ImportDeclaration',
        specifiers: [],
        source: {
          type: 'Literal',
          value: './D',
          raw: `'./D'`
        }
      }
    ]);
  });
});
