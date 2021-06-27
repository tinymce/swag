import * as path from 'path';

type Mapper = (importee: string, importer: string) => string;

const isChildOf = (childPath: string, parentPath: string) => {
  return childPath.startsWith(parentPath + '/');
};

const replacePrefix = (importeePath: string, oldDirPath: string, newDirPath: string) => {
  return newDirPath + importeePath.substring(oldDirPath.length);
};

const replaceDir = (oldDir: string, newDir: string): Mapper => {
  const oldDirPath = path.resolve(oldDir);
  const newDirPath = path.resolve(newDir);

  return (importee, _importer) => {
    return isChildOf(importee, oldDirPath) ? replacePrefix(importee, oldDirPath, newDirPath) : importee;
  };
};

const invalidDir = (dir: string): Mapper => {
  const invalidDirPath = path.resolve(dir);

  return (importee, importer) => {
    if (isChildOf(importee, invalidDirPath)) {
      throw new Error(`Invalid import resolved to: ${importee} found in ${importer} blocked by ${invalidDirPath}`);
    } else {
      return importee;
    }
  };
};

export {
  replaceDir,
  invalidDir
};
