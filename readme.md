This project contains various rollup plugins that is useful when dealing with es6 modules.

### Example of usage

```
var swag = require('@ephox/swag');

export default {
  moduleName: 'myModule',
  format: 'iife',
  banner: '(function () {',
  footer: '})()',
  plugins: [
    swag.nodeResolve({
      basedir: __dirname,
      prefixes: {
        'tinymce/core': 'src/core/dist/globals/tinymce/core',
        'tinymce/ui': 'lib/ui/main/ts'
      }
    }),
    swag.remapImports()
  ],
  input: 'lib/plugins/textpattern/src/main/ts/Plugin.js',
  output: {
    file: 'dist/textpattern/plugin.js',
    format: 'cjs'
  }
};
```
