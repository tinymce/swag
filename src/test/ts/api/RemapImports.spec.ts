import { expect } from 'chai';
import 'mocha';

import { remapImports } from '../../../main/ts/api/RemapImports';
import { getFileSystem, createJsonFile, createFile } from '../mock/MockFileSystem';

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
  createJsonFile('/project/node_modules/@tinymce/miniature/package.json', {
    name: '@tinymce/miniature',
    main: './Main.js'
  }),
  createFile('/project/node_modules/@tinymce/miniature/Main.js', `
    import TinyVer from './TinyVer';

    export {
      TinyVer
    }
  `),
  createFile('/project/node_modules/@tinymce/miniature/TinyVer.js', `
    let getVersion = () => {};

    export {
      getVersion
    }
  `),
  createFile('/project/node_modules/@ephox/katamari/TestCss.css', `.class { color: red; }`),
];

describe('RemapImports', () => {
  it('should remap target js file imports', () => {
    const mockFs = getFileSystem(mockFiles);
    const inputSource = `import { Arr } from '@ephox/katamari'`;
    const inputSource2 = `import { TinyVer } from '@tinymce/miniature'`;

    const remapper = remapImports({ fileSystem: mockFs, forceFlat: true });
    const remapResult = (remapper as any).transform(inputSource, '/project/Test.js');
    const remapResult2 = (remapper as any).transform(inputSource2, '/project/Test2.js');

    expect(remapResult).to.deep.equal({
      code: `import Arr from '/project/node_modules/@ephox/katamari/Arr.js';`,
      map: {
        mappings: '',
        sources: [],
        version: 3
      }
    });
    expect(remapResult2).to.deep.equal({
      code: `import TinyVer from '/project/node_modules/@tinymce/miniature/TinyVer.js';`,
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

    const remapper = remapImports({ fileSystem: mockFs, forceFlat: true });
    const remapResult = (remapper as any).transform(inputSource, '/project/node_modules/@ephox/katamari/TestCss.css');
    expect(remapResult).to.equal(inputSource);
  });
});
