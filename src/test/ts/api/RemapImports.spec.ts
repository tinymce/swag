import { remapImports } from '../../../main/ts/api/RemapImports';
import { getFileSystem, createJsonFile, createFile } from '../mock/MockFileSystem';
import { expect } from 'chai';
import 'mocha';

const mockFiles = [
  createJsonFile('/project/node_modules/@ephox/katamari/package.json', {
    name: '@ephox/katamari',
    main: './Main.js'
  }),
  createFile('/project/node_modules/@ephox/katamari/Main.js', `
    import Arr from './Arr';

    export {
      Arr
    }
  `),
  createFile('/project/node_modules/@ephox/katamari/Arr.js', `
    let each = () => {};

    export {
      each
    }
  `),
  createFile('/project/node_modules/@ephox/katamari/TestCss.css', `.class { color: red; }`),
];

describe('RemapImports', () => {
  it('should remap target js file imports', () => {
    const mockFs = getFileSystem(mockFiles);
    const inputSource = `import { Arr } from '@ephox/katamari'`;

    const remapResult = remapImports({ fileSystem: mockFs, forceFlat: true }).transform(inputSource, '/project/Test.js');
    expect(remapResult).to.deep.equal({
      code: `import Arr from '/project/node_modules/@ephox/katamari/Arr.js';`,
      map: {
        mappings: '',
        sources: [],
        version: 3
      }
    });
  });

  it('should never try to parse non js files', () => {
    const mockFs = getFileSystem(mockFiles);
    const inputSource = `.class { color: red; }`;

    const remapResult = remapImports({ fileSystem: mockFs, forceFlat: true }).transform(inputSource, '/project/node_modules/@ephox/katamari/TestCss.css');
    expect(remapResult).to.equal(inputSource);
  });
});
