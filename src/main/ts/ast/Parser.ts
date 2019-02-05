import * as acorn from 'acorn';
import * as estree from 'estree';

const parse = (code: string): estree.Program => {
  const program = acorn.parse(code, {
    ecmaVersion: 8,
    sourceType: 'module',
    preserveParens: false,
    ranges: false
  });

  // This is causing "Type 'Node' is missing the following properties from type 'Program': sourceType, body"
  // however the type returned by acorn.parse is `Program` so it shouldn't be doing that. As such this seems like an issue with the types, so just ignore it for now
  // @ts-ignore
  return program
};

export {
  parse
};