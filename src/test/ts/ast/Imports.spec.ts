import { readImports, createImport, toAst } from '../../../main/ts/ast/Imports';
import { parse } from '../../../main/ts/ast/Parser';
import { expect } from 'chai';
import 'mocha';

describe('Imports', () => {
  it('readImports should read the various formats correctly', () => {
    let imports = readImports(parse(`
      import * as ModuleA from './ModuleA';
      import { a, b as B } from './ModuleB';
      import ModuleC from './ModuleC';
    `));

    expect(imports).to.eql([
      {
        kind: 'namespace',
        fromName: 'ModuleA',
        name: 'ModuleA',
        modulePath: './ModuleA'
      },
      {
        kind: 'specified',
        fromName: 'a',
        name: 'a',
        modulePath: './ModuleB'
      },
      {
        kind: 'specified',
        fromName: 'b',
        name: 'B',
        modulePath: './ModuleB'
      },
      {
        kind: 'default',
        fromName: 'ModuleC',
        name: 'ModuleC',
        modulePath: './ModuleC'
      },
    ]);
  });

  it('createImport should produce a object with all items', () => {
    let kind = 'kind', fromName = 'fromName', name = 'name', modulePath = 'modulePath';

    let imp = createImport(kind, name, fromName, modulePath);

    expect(imp).to.eql({
      kind: kind,
      fromName: fromName,
      name: name,
      modulePath: modulePath
    });
  });

  it('toAst should produce the expected ast from imports', () => {
    let ast = toAst([
      createImport('default', 'A', 'A', './A'),
      createImport('namespace', 'B2', 'B', './B'),
      createImport('specified', 'C2', 'C', './C')
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
      }
    ]);
  });
});
