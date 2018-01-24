import * as estree from 'estree';

interface ExportInfo {
  name: string;
  fromName: string;
}

const create = (name: string, fromName: string): ExportInfo => {
  return { name, fromName };
};

const readExportDeclaration = (node: estree.ExportNamedDeclaration): ExportInfo[] => {
  return node.specifiers.map((specifier) => {
    return create(specifier.exported.name, specifier.local.name);
  });
};

const readExports = (program: estree.Program): ExportInfo[] => {
  return program.body.reduce((acc, node) => {
    if (node.type === 'ExportNamedDeclaration') {
      const exports = readExportDeclaration(node as estree.ExportNamedDeclaration);
      return acc.concat(exports);
    }

    return acc;
  }, [] as ExportInfo[]);
};

export {
  ExportInfo,
  readExports
};
