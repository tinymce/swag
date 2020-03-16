import { remap } from '../../../main/ts/ast/Remap';
import { parse } from '../../../main/ts/ast/Parser';
import { serialize } from '../../../main/ts/ast/Serializer';
import { getFileSystem, createFile, createJsonFile } from '../mock/MockFileSystem';
import { expect } from 'chai';
import 'mocha';
import { fail } from 'assert';
import { createRemapCache } from '../../../main/ts/ast/RemapCache';

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
  createFile('/project/node_modules/@ephox/something/Module.js', ''),

  createJsonFile('/project/node_modules/@tinymce/oxide-icons-default/package.json', {
    name: '@tinymce/oxide-icons-default',
    main: 'dist/js/icons.js'
  }),
  createFile('/project/node_modules/@tinymce/oxide-icons-default/dist/js/icons.js', `
    export var getAll = function () { };
  `)
];

describe('Remap', () => {
  it('should remap module imports to absolute file imports', () => {
    const mockFs = getFileSystem(mockFiles);

    const program = parse(`
      import { Fun, Arr, Arr2, noop } from '@ephox/katamari';
    `);

    remap(mockFs, createRemapCache(), '/project/src/main/ts/Module.js', program, true);

    expect(serialize(program)).to.equal([
      `import * as Fun from '/project/node_modules/@ephox/katamari/Fun.js';`,
      `import Arr from '/project/node_modules/@ephox/katamari/Arr.js';`,
      `import Arr2 from '/project/node_modules/@ephox/katamari/Arr.js';`,
      `import { noop } from '/project/node_modules/@ephox/katamari/Fun.js';`
    ].join('\n'));
  });

  it('should throw an error if it mapped to a nested package', () => {
    const mockFs = getFileSystem(mockFiles);

    const program = parse(`
      import { FormData } from '@ephox/sand'
    `);

    try {
      remap(mockFs, createRemapCache(), '/project/node_modules/@ephox/something/Module.js', program, true);

      fail('Should never get here');
    } catch (e) {
      expect(e.message).to.equal([
        'Error non flat package structure detected:',
        ' importer: /project/node_modules/@ephox/something/Module.js',
        ' importee: @ephox/sand',
        ' resolved: /project/node_modules/@ephox/something/node_modules/@ephox/sand/Main.js'
      ].join('\n'));
    }
  });

  it('should not throw an error if it mapped to a nested package and forceFlat is set to false', () => {
    const mockFs = getFileSystem(mockFiles);

    const program = parse(`
      import { FormData } from '@ephox/sand'
    `);

    try {
      remap(mockFs, createRemapCache(), '/project/node_modules/@ephox/something/Module.js', program, false);
    } catch (e) {
      fail('Should never get here');
    }

    expect(serialize(program)).to.equal([
      `import FormData from '/project/node_modules/@ephox/something/node_modules/@ephox/sand/FormData.js';`
    ].join('\n'));
  });

  it('should passthough side effect imports', () => {
    const mockFs = getFileSystem(mockFiles);

    const program = parse(`
      import 'something';
      import '@ephox/katamari'
    `);

    remap(mockFs, createRemapCache(), '/project/src/main/ts/Module.js', program, true);

    expect(serialize(program)).to.equal([
      `import 'something';`,
      `import '@ephox/katamari';`
    ].join('\n'));
  });

  it('should passthrough variable declaration imports', () => {
    const mockFs = getFileSystem(mockFiles);

    const program = parse(`
      import { getAll as getAllOxide } from '@tinymce/oxide-icons-default';
    `);

    remap(mockFs, createRemapCache(), '/project/src/main/ts/Module.js', program, true);

    expect(serialize(program)).to.equal([
      `import { getAll as getAllOxide } from '@tinymce/oxide-icons-default';`
    ].join('\n'));
  });
});
