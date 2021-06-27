import * as estree from 'estree';

export enum ExportInfoKind {
  Specified,
  Variable
}

interface ExportInfo {
  readonly name: string;
  readonly fromName: string;
  readonly kind: ExportInfoKind;
}

const isVariableDeclaration = (declaration: estree.Declaration): declaration is estree.VariableDeclaration => {
  return declaration && declaration.type === 'VariableDeclaration';
};

const create = (name: string, fromName: string, kind: ExportInfoKind): ExportInfo => {
  return { name, fromName, kind };
};

const readExportDeclaration = (node: estree.ExportNamedDeclaration): ExportInfo[] => {
  if (isVariableDeclaration(node.declaration)) {
    return node.declaration.declarations.map((declaration) => {
      const id = declaration.id as estree.Identifier;
      return create(id.name, id.name, ExportInfoKind.Variable);
    });
  } else {
    return node.specifiers.map((specifier) => {
      return create(specifier.exported.name, specifier.local.name, ExportInfoKind.Specified);
    });
  }
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
