import { expect } from 'chai';
import 'mocha';
import { ExportInfoKind, readExports } from '../../../main/ts/ast/Exports';
import { parse } from '../../../main/ts/ast/Parser';

describe('Exports', () => {
  it('readExports should read the various formats correctly', () => {
    const exports = readExports(parse(`
      var a = 'a';
      var b = 'b';
      export var c = 'c';
      export {
        a,
        b,
        b as b2
      }
    `));

    expect(exports).to.eql([
      {
        fromName: 'c',
        name: 'c',
        kind: ExportInfoKind.Variable
      },
      {
        fromName: 'a',
        name: 'a',
        kind: ExportInfoKind.Specified
      },
      {
        fromName: 'b',
        name: 'b',
        kind: ExportInfoKind.Specified
      },
      {
        fromName: 'b',
        name: 'b2',
        kind: ExportInfoKind.Specified
      }
    ]);
  });
});
