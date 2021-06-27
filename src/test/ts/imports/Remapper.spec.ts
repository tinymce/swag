import { expect } from 'chai';
import 'mocha';

import { createRemapper, remapImportsInSource } from '../../../main/ts/imports/Remapper';
import { getFileSystem, createFile, createJsonFile } from '../mock/MockFileSystem';

const mockFiles = [
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
  createFile('/project/src/main/ts/Module.js', ''),

  createJsonFile('/project/node_modules/@ephox/something/node_modules/@ephox/sand/package.json', {
    name: '@ephox/sand',
    main: './Main.js'
  }),
  createFile('/project/node_modules/@ephox/something/node_modules/@ephox/sand/FormData.js', `
    export { }
  `),
  createFile('/project/node_modules/@ephox/something/node_modules/@ephox/sand/Main.js', `
    import FormData from './FormData';
    export { FormData }
  `),
  createFile('/project/node_modules/@ephox/something/Module.js', '')
];

describe('Remapper', () => {
  it('should remap module imports to absolute file imports', () => {
    const mockFs = getFileSystem(mockFiles);
    const remapper = createRemapper(mockFs);

    const inputSource = `
      import { Fun, Arr, Arr2, noop } from '@ephox/katamari'
    `;

    const outputSource = remapper(inputSource, '/project/src/main/ts/Module.js');

    expect(outputSource).to.equal([
      `import * as Fun from '/project/node_modules/@ephox/katamari/Fun.js';`,
      `import Arr from '/project/node_modules/@ephox/katamari/Arr.js';`,
      `import Arr2 from '/project/node_modules/@ephox/katamari/Arr.js';`,
      `import { noop } from '/project/node_modules/@ephox/katamari/Fun.js';`
    ].join('\n'));
  });

  it('should remap module imports to absolute file imports in source', () => {
    const mockFs = getFileSystem(mockFiles);
    const remapper = createRemapper(mockFs);

    const inputSource = `
      import { Fun, Arr, Arr2, noop } from '@ephox/katamari';
    `;

    const remapResult = remapImportsInSource(remapper, inputSource, '/project/src/main/ts/Module.js');
    expect(remapResult).to.deep.equal({
      inputImports: [
        {
          start: 7,
          end: 62,
          text: 'import { Fun, Arr, Arr2, noop } from \'@ephox/katamari\';'
        }
      ],
      outputImportsCode: [
        `import * as Fun from '/project/node_modules/@ephox/katamari/Fun.js';`,
        `import Arr from '/project/node_modules/@ephox/katamari/Arr.js';`,
        `import Arr2 from '/project/node_modules/@ephox/katamari/Arr.js';`,
        `import { noop } from '/project/node_modules/@ephox/katamari/Fun.js';`
      ].join('\n')
    });
  });
});
