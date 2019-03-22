import { ReplaceSource, OriginalSource, SourceMapSource } from 'webpack-sources';
import { createRemapper, remapImportsInSource } from '../imports/Remapper';
import * as path from 'path';
import { RawToken } from '../imports/RawSourceParser';

let remapper = createRemapper();
let hasInjectedCacheDropHook = false;

const deleteImports = (remappedCode: ReplaceSource, imports: RawToken[]) => {
  [].concat(imports).reverse().forEach((imp) => {
    remappedCode.replace(imp.start, imp.end, '');
  });
};

const remapSource = (loaderContext, source: string, map) => {
  const fullModulePath = path.normalize(loaderContext.resourcePath);
  const publicModulePath = path.relative(loaderContext.rootContext, fullModulePath);
  const result = remapImportsInSource(remapper, source, fullModulePath);

  const inputSource = map ? new SourceMapSource(source, publicModulePath, map) : new OriginalSource(source, publicModulePath);
  const remappedCode = new ReplaceSource(inputSource, publicModulePath);

  remappedCode.insert(0, result.outputImportsCode);
  deleteImports(remappedCode, result.inputImports);

  const sourceResult = remappedCode.sourceAndMap({
    // Columns in source map is rather slow to generate since we need to
    // re-generate almost every file when we remap the imports it's better to leave this option off
    columns: false
  });

  return sourceResult;
};

// Checks for `import ... from '@ephox/` or `import ... from "@ephox/` we don't need to process modules that doesn't contain these
const seemToContainEphoxImports = (code: string) => /\'@ephox\/|\"@ephox\//.test(code);

// We need to generate a new remapper after a bundle is created to drop the caches it has while it's remapping
// This injects that cache drop directly into the webpack compiler the _compiler is documented as hacky but
// there doesn't seem to be a better way of doing this.
const injectCacheDropHook = (loaderContext) => {
  if (!hasInjectedCacheDropHook) {
    hasInjectedCacheDropHook = true;
    loaderContext._compiler.hooks.afterEmit.tap('SwagRemapper', (params) => {
      remapper = createRemapper();
    });
  }
};

const webpackRemapperLoader = function (source: string, map) {
  const loaderContext = this;

  injectCacheDropHook(loaderContext);

  if (seemToContainEphoxImports(source)) {
    const resultMap = remapSource(loaderContext, source, map);
    loaderContext.callback(null, resultMap.source, resultMap.map);
  } else {
    loaderContext.callback(null, source, map);
  }
};

export {
  webpackRemapperLoader
};