import { remap } from '../../../main/ts/ast/Remap';
import { parse } from '../../../main/ts/ast/Parser';
import { serialize } from '../../../main/ts/ast/Serializer';
import { getFileSystem, createFile, createJsonFile } from '../mock/MockFileSystem';
import { createMainModuleCache } from '../../../main/ts/ast/MainModuleCache';
import { expect } from 'chai';
import 'mocha';

describe('Remap', () => {
  it('should remap module imports to absolute file imports', () => {
    const mockFs = getFileSystem([
      createJsonFile('/project/node_modules/@ephox/katamari/package.json', {
        name: '@ephox/katamari',
        main: './Main.js'
      }),
      createFile('/project/node_modules/@ephox/katamari/Main.js', `
        import * as Fun from './Fun';
        import Arr from './Arr';
        import { noop } from './Fun';

        export {
          Fun,
          Arr,
          Arr as Arr2,
          noop
        }
      `),
      createFile('/project/node_modules/@ephox/katamari/Fun.js', `
        let noop = () => {};

        export {
          noop
        }
      `),
      createFile('/project/node_modules/@ephox/katamari/Arr.js', `
        let each = () => {};

        export {
          each
        }
      `),
      createFile('/project/src/main/ts/Module.js', '')
    ]);

    const program = parse(`
      import { Fun, Arr, Arr2, noop } from '@ephox/katamari'
    `);

    remap(mockFs, createMainModuleCache(), '/project/src/main/ts/Module.js', program);

    expect(serialize(program)).to.equal([
      `import * as Fun from '/project/node_modules/@ephox/katamari/Fun.js';`,
      `import Arr from '/project/node_modules/@ephox/katamari/Arr.js';`,
      `import Arr2 from '/project/node_modules/@ephox/katamari/Arr.js';`,
      `import { noop } from '/project/node_modules/@ephox/katamari/Fun.js';`
    ].join('\n'));
  });
});
