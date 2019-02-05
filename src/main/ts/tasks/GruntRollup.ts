import * as path from 'path';
import { rollup, InputOptions, OutputOptions, OutputChunk, OutputAsset } from 'rollup';

const isFunction = (val: any): val is Function => typeof val === 'function';

const isOutputChunk = (output: OutputChunk | OutputAsset): output is OutputChunk => output.hasOwnProperty('map');

const defaultInputOptions: Partial<InputOptions> = {
  cache: null,
  external: [],
  onwarn: null,
  plugins: null,
  treeshake: true
};

const defaultOutputOptions: Partial<OutputOptions> = {
  name: null,
  format: 'es',
  exports: 'auto',
  amd: {
    id: null
  },
  globals: {},
  indent: true,
  strict: true,
  banner: null,
  footer: null,
  intro: null,
  outro: null,
  paths: null,
  preferConst: false,
  sourcemap: false,
  sourcemapFile: null,
  interop: true
};

const defaultOptions = {
  ...defaultInputOptions,
  ...defaultOutputOptions
};

export const task = (grunt) => {
  grunt.registerMultiTask('rollup', 'rollup your grunt!', function () {
    const done = this.async();
    const options = this.options(defaultOptions);
    const file = this.files[0];
    const input = file.src[0];
    const plugins = isFunction(options.plugins) ? options.plugins() : options.plugins;

    if (this.files.length > 1) {
      grunt.fail.warn('This task only accepts a single file input.');
    } else if (!file.src || file.src.length === 0) {
      grunt.fail.warn('No entry point specified.');
    } else if (!grunt.file.exists(input)) {
      grunt.fail.warn('Entry point "' + input + '" not found.');
    }

    rollup({
      cache: options.cache,
      input,
      external: options.external,
      plugins,
      context: options.context,
      onwarn: options.onwarn,
      output: {
        preferConst: options.preferConst
      },
      treeshake: options.treeshake
    }).then((bundle) => bundle.generate({
      format: options.format,
      exports: options.exports,
      paths: options.paths,
      name: options.name,
      globals: options.globals,
      indent: options.indent,
      strict: options.strict,
      banner: options.banner,
      footer: options.footer,
      intro: options.intro,
      outro: options.outro,
      sourcemap: options.sourcemap,
      sourcemapFile: options.sourcemapFile
    })).then((result) => {
      const outputs = result.output;
      for (let i = 0; i < outputs.length; i++) {
        const output = outputs[i];
        if (isOutputChunk(output)) {
          if (options.sourcemap === true) {
            const sourceMapOutPath = file.dest + '.map';
            grunt.file.write(sourceMapOutPath, output.map.toString());
            grunt.file.write(file.dest, `${output.code}\n//# sourceMappingURL=${path.basename(sourceMapOutPath)}`);
          } else if (options.sourcemap === 'inline') {
            grunt.file.write(file.dest, `${output.code}\n//# sourceMappingURL=${output.map.toUrl()}`);
          } else {
            grunt.file.write(file.dest, output.code);
          }
        } else {
          grunt.file.write(file.dest, output.code);
        }
      }

      done();
    }).catch((error) => grunt.fail.warn(error));
  });
};
