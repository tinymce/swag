import * as acorn from 'acorn';
import * as estree from 'estree';

const parse = (code: string): estree.Program => {
  const program = acorn.parse(code, {
    ecmaVersion: 8,
    sourceType: 'module',
    preserveParens: false,
    ranges: false
  });

  return program;
};

export {
  parse
};