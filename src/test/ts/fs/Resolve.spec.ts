import { getFileSystem, createFile, createJsonFile } from '../mock/MockFileSystem';
import { expect } from 'chai';
import 'mocha';
import { resolveId } from '../../../main/ts/fs/Resolve';
import { fail } from 'assert';

const packageJson = {
  name: '@ephox/katamari',
  main: './Main.js'
};

const mainJs = 'export const hello = {};';

const mockFs = getFileSystem([
  createJsonFile('/project/node_modules/@ephox/katamari/package.json', packageJson),
  createFile('/project/node_modules/@ephox/katamari/Main.js', mainJs),
  createJsonFile('/project/node_modules/@ephox/sand/package.json', packageJson),
  createFile('/project/node_modules/@ephox/sand/Main.js', mainJs),
  createJsonFile('/project/node_modules/@ephox/sugar/node_modules/@ephox/katamari/package.json', packageJson),
  createFile('/project/node_modules/@ephox/sugar/node_modules/@ephox/katamari/Main.js', mainJs),
]);

describe('Resolve', () => {
  it('should resolve flat and deep id:s', async () => {
    const resolver = resolveId(mockFs, {}, [], false);

    try {
      const katamariPath1 = await resolver('@ephox/katamari', '/project/src/Main.js');
      expect(katamariPath1).to.equal('/project/node_modules/@ephox/katamari/Main.js');

      const katamariPath2 = await resolver('@ephox/katamari', '/project/node_modules/@ephox/sugar/Main.js');
      expect(katamariPath2).to.equal('/project/node_modules/@ephox/sugar/node_modules/@ephox/katamari/Main.js');

      const katamariPath3 = await resolver('@ephox/sand', '/project/node_modules/@ephox/sugar/Main.js');
      expect(katamariPath3).to.equal('/project/node_modules/@ephox/sand/Main.js');

      const katamariPath4 = await resolver('@ephox/sand', '/project/node_modules/@ephox/sugar/node_modules/@ephox/katamari/Main.js');
      expect(katamariPath4).to.equal('/project/node_modules/@ephox/sand/Main.js');
    } catch (_) {
      fail('Should never throw' + _);
    }
  });

  it('should only resolve flat id:s', async () => {
    const resolver = resolveId(mockFs, {}, [], true);

    try {
      const katamariPath1 = await resolver('@ephox/katamari', '/project/src/Main.js');
      expect(katamariPath1).to.equal('/project/node_modules/@ephox/katamari/Main.js');

      const katamariPath2 = await resolver('@ephox/sand', '/project/node_modules/@ephox/sugar/Main.js');
      expect(katamariPath2).to.equal('/project/node_modules/@ephox/sand/Main.js');

      const katamariPath3 = await resolver('@ephox/sand', '/project/node_modules/@ephox/sugar/node_modules/@ephox/katamari/Main.js');
      expect(katamariPath3).to.equal('/project/node_modules/@ephox/sand/Main.js');
    } catch (_) {
      fail('Should never throw');
    }

    try {
      const katamariPath1 = await resolver('@ephox/katamari', '/project/node_modules/@ephox/sugar/Main.js');
      expect(katamariPath1).to.equal('/project/node_modules/@ephox/sugar/node_modules/@ephox/katamari/Main.js');

      fail('Should never get here');
    } catch (e) {
      expect(e).to.equal([
        'Error non flat package structure detected:',
        ' importer: /project/node_modules/@ephox/sugar/Main.js',
        ' importee: @ephox/katamari',
        ' resolved: /project/node_modules/@ephox/sugar/node_modules/@ephox/katamari/Main.js'
      ].join('\n'));
    }
  });

  it('should resolve using mapper', async () => {
    const resolver = resolveId(mockFs, {}, [
      (importee, importer) => '/prefix' + importee
    ], false);

    const resolvedPath = await resolver('@ephox/katamari', '/project/src/Main.js');
    expect(resolvedPath).to.equal('/prefix/project/node_modules/@ephox/katamari/Main.js');
  });

  it('should not resolve rollup plugin imports', async () => {
    const resolver = resolveId(mockFs, {}, [], false);

    const resolvedPath = await resolver('/project/src/Main.js', '\0/project/src/Main.js?commonjs-proxy');
    // tslint:disable-next-line:no-unused-expression
    expect(resolvedPath).to.be.null;
  });
});
