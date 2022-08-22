# Swag

This project contains various rollup and webpack plugins that are useful when dealing with es6 modules, as well as a grunt rollup task.

### swag.nodeResolve

Resolves node module paths using memory caching. Other node resolver plugins will traverse the file system a lot and also load the package.json
file for each package multiple times. This only does disk I/O once it also has support for remapping module paths based on prefixes.

### swag.remapImports

Remaps module imports to the absolute module path by checking the import/exports on the main entry point module of a package.

So for example an local import of this: `import { Arr } from '@ephox/katamari'` would get remapped to `import Arr from '/some/absolute/file/path'`
this will reduce the amount of files included and also reduce output size since local variables created by function calls in the top level of a module
would otherwise be included even though it wasn't used since JS isn't pure those calls could cause side effects and can't be removed.

### Example of usage

```js
var swag = require('@ephox/swag');

export default {
  name: 'myModule',
  format: 'iife',
  banner: '(function () {',
  footer: '})()',
  plugins: [
    swag.nodeResolve({
      // Base dir to resolve paths from
      basedir: __dirname,

      // Replaces the prefixes with the specified replacement path
      prefixes: {
        'tinymce/core': 'src/core/dist/globals/tinymce/core',
        'tinymce/ui': 'lib/ui/main/ts'
      },

      // Maps resolved importees to new resolved importee paths
      mappers: [
        // Imports resolving to './lib/core/main/ts/api' gets replaced with './lib/globals/tinymce/core/api'
        swag.mappers.replaceDir('./lib/core/main/ts/api', './lib/globals/tinymce/core/api'),

        // Imports resolving to './lib/core/main/ts' throws an error
        swag.mappers.invalidDir('./lib/core/main/ts')
      ]
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

### Using the webpack remapper loader

Add the remapper loader first to the list of webpack loaders this will then change all the imports to go directly to the api modules. It handles both ts files and js files.

```
module: {
  rules: [
    {
      test: /\.js|\.ts$/,
      use: ['@ephox/swag/webpack/remapper']
    },
    ....
  ]
}
```