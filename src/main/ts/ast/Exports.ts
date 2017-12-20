import * as estree from 'estree';

interface ExportInfo {
  name: string
  fromName: string
}

let create = (name: string, fromName: string):ExportInfo => {
  return { name, fromName };
};

let readExportDeclaration = (node: estree.ExportNamedDeclaration): ExportInfo[] => {
  return node.specifiers.map((specifier) => {
    return create(specifier.exported.name, specifier.local.name);
  });
};

let readExports = (program: estree.Program): ExportInfo[] => {
  return program.body.reduce((acc, node) => {
    if (node.type === 'ExportNamedDeclaration') {
      var exports = readExportDeclaration(node as estree.ExportNamedDeclaration);
      return acc.concat(exports);
    }

    return acc;
  }, []);
};

export {
  ExportInfo,
  readExports
};
