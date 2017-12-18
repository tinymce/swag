import * as acorn from 'acorn';
import * as estree from 'estree';

let parse = (code: string): estree.Program => {
  let program = acorn.parse(code, {
    ecmaVersion: 8,
    sourceType: 'module',
    preserveParens: false,
    ranges: false
  });

  return program;
};

export {
  parse
}