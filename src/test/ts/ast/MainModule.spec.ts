import { expect } from 'chai';
import 'mocha';
import { ExportInfoKind } from '../../../main/ts/ast/Exports';
import { ImportInfoKind } from '../../../main/ts/ast/Imports';
import { readMainModule } from '../../../main/ts/ast/MainModule';
import { parse } from '../../../main/ts/ast/Parser';

describe('MainModule', () => {
  it('readMainModule should read the various imports/exports formats correctly', () => {
    const mainModule1 = readMainModule(parse(`
      import * as A from './ModuleA';

      export {
        A
      }
    `));

    expect(mainModule1.imports).to.eql([
      {
        kind: ImportInfoKind.Namespace,
        fromName: 'A',
        name: 'A',
        modulePath: './ModuleA'
      }
    ]);

    expect(mainModule1.exports).to.eql([
      {
        fromName: 'A',
        name: 'A',
        kind: ExportInfoKind.Specified
      }
    ]);

    const mainModule2 = readMainModule(parse(`
      export var A = 'A';
    `));

    expect(mainModule2.imports).to.eql([ ]);

    expect(mainModule2.exports).to.eql([
      {
        fromName: 'A',
        name: 'A',
        kind: ExportInfoKind.Variable
      }
    ]);
  });

  it('should throw error if the main module has other statements than imports/exports', () => {
    const read = () => {
      readMainModule(parse(`
        import * as A from './ModuleA';

        var x = {};

        export {
          A
        }
      `));
    };

    expect(read).to.throw();
  });
});
