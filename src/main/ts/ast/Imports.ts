import * as estree from 'estree';

interface ImportInfo {
  kind: string,       // default, namespace, specified
  name: string,       // Output module name
  fromName: string,   // Input name in a specified import
  modulePath: string  // Relative filepath
}

let createImport = (kind: string, name: string, fromName: string, modulePath: string): ImportInfo => {
  return { kind, name, fromName, modulePath };
};

let readDefaultSpecifier = (modulePath: string, specifier: estree.ImportDefaultSpecifier): ImportInfo => {
  return createImport('default', specifier.local.name, specifier.local.name, modulePath);
};

let readNamespaceSpecifier = (modulePath: string, specifier: estree.ImportNamespaceSpecifier): ImportInfo => {
  return createImport('namespace', specifier.local.name, specifier.local.name, modulePath);
};

let readImportSpecifier = (modulePath: string, specifier: estree.ImportSpecifier): ImportInfo => {
  return createImport('specified', specifier.local.name, specifier.imported.name, modulePath);
};

let readImportDeclaration = (node: estree.ImportDeclaration) => {
  return node.specifiers.map((specifier) => {
    if (specifier.type === 'ImportDefaultSpecifier') {
      let name = node.source.value as string;
      return readDefaultSpecifier(name, specifier as estree.ImportDefaultSpecifier);
    } else if (specifier.type === 'ImportNamespaceSpecifier') {
      let name = node.source.value as string;
      return readNamespaceSpecifier(name, specifier as estree.ImportNamespaceSpecifier);
    } else if (specifier.type === 'ImportSpecifier') {
      let name = node.source.value as string;
      return readImportSpecifier(name, specifier as estree.ImportSpecifier);
    }
  });
};

let readImports = (program: estree.Program): ImportInfo[] => {
  return program.body.reduce((acc, node) => {
    if (node.type === 'ImportDeclaration') {
      let imports = readImportDeclaration(node as estree.ImportDeclaration);
      return acc.concat(imports);
    }

    return acc;
  }, []);
};

let toAst = (imports: ImportInfo[]): estree.ImportDeclaration[] => {
  return imports.map((imp) => {
    if (imp.kind === 'default') {
      return {
        type: 'ImportDeclaration',
        specifiers: [
          {
            type: 'ImportDefaultSpecifier',
            local: {
              type: 'Identifier',
              name: imp.name
            }
          }
        ],
        source: {
          type: 'Literal',
          value: imp.modulePath,
          raw: `'${imp.modulePath}'`
        }
      } as estree.ImportDeclaration;
    } else if (imp.kind === 'namespace') {
      return {
        type: 'ImportDeclaration',
        specifiers: [
          {
            type: 'ImportNamespaceSpecifier',
            local: {
              type: 'Identifier',
              name: imp.name
            }
          }
        ],
        source: {
          type: 'Literal',
          value: imp.modulePath,
          raw: `'${imp.modulePath}'`
        }
      } as estree.ImportDeclaration;
    } else if (imp.kind === 'specified') {
      return {
        type: 'ImportDeclaration',
        specifiers: [
          {
            type: 'ImportSpecifier',
            imported: {
              type: 'Identifier',
              name: imp.fromName
            },
            local: {
              type: 'Identifier',
              name: imp.name
            }
          }
        ],
        source: {
          type: 'Literal',
          value: imp.modulePath,
          raw: `'${imp.modulePath}'`
        }
      } as estree.ImportDeclaration;
    } 
  });
};

export {
  ImportInfo,
  readImports,
  createImport,
  toAst
}
