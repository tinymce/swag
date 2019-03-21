import { ReplaceSource, OriginalSource, SourceMapSource } from 'webpack-sources';
import { createRemapper, remapImportsInSource } from '../imports/Remapper';
import * as path from 'path';
import { RawToken } from '../imports/RawSourceParser';

const remapper = createRemapper();

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

  return remappedCode.sourceAndMap({
    columns: true
  });
};

// Checks for `import ... from '@ephox/` or `import ... from "@ephox/` we don't need to process modules that doesn't contain these
const seemToContainEphoxImports = (code: string) => /\'@ephox\/|\"@ephox\//.test(code);

const webpackRemapperLoader = function (source: string, map) {
  const loaderContext = this;

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