import { readExports } from '../../../main/ts/ast/Exports';
import { parse } from '../../../main/ts/ast/Parser';
import { expect } from 'chai';
import 'mocha';

describe('Exports', () => {
  it('readExports should read the various formats correctly', () => {
    const exports = readExports(parse(`
      export {
        a,
        b,
        b as b2
      }
    `));

    expect(exports).to.eql([
      {
        fromName: 'a',
        name: 'a'
      },
      {
        fromName: 'b',
        name: 'b'
      },
      {
        fromName: 'b',
        name: 'b2'
      }
    ]);
  });
});
