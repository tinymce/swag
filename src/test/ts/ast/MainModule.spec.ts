import { readMainModule } from '../../../main/ts/ast/MainModule';
import { parse } from '../../../main/ts/ast/Parser';
import { expect } from 'chai';
import 'mocha';

describe('MainModule', () => {
  it('readMainModule should read the various imports/exports formats correctly', () => {
    const mainModule = readMainModule(parse(`
      import * as A from './ModuleA';

      export {
        A
      }
    `));

    expect(mainModule.imports).to.eql([
      {
        kind: 'namespace',
        fromName: 'A',
        name: 'A',
        modulePath: './ModuleA'
      }
    ]);

    expect(mainModule.exports).to.eql([
      {
        fromName: 'A',
        name: 'A'
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
