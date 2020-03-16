# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

# [4.2.1] - 2020-03-18

### Fixed
- Fixed not working with the latest version of `resolve`.
- Fixed remapping throwing an exception if a main module contained an exported variable.

# [4.2.0] - 2020-01-28

### Added
- Added support for remapping modules in the `@tinymce` scope.

# [4.1.5] - 2019-10-03

### Security
- Upgraded dependencies to resolve security alerts on older dependencies.

# [4.1.4] - 2019-05-09

### Fixed
- Fixed the webpack remapper picking up function names that contained the word `import` as imports.

# [4.1.3] - 2019-05-07

### Fixed
- Added support for imports with missing semicolons.

# [4.1.2] - 2019-04-23

### Fixed
- Css files where being parsed as js files by acorn throwing errors.
